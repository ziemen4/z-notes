---
title: "Dependency TimeLock: Time-Gated Dependency Pinning for Supply Chain Security"
date: "2026-05-14T18:00:00.000Z"
description: "A proposal for enforcing dependency age using public artifact timestamp commitments"
---
*Special thanks to [PLACEHOLDER](https://example.com) for feedback and review*

## Introduction

Modern software relies on deep dependency graphs pulled from public registries. This is convenient, but it also creates a large supply-chain attack surface. A malicious package does not need to stay live for long. It only needs to be installed quickly by developers, CI pipelines, or bots.

A natural defense is to avoid very fresh dependencies. npm already supports `before` and `min-release-age` filters ([npm docs](https://docs.npmjs.com/cli/v11/commands/npm-install/)), and Renovate exposes `minimumReleaseAge` for delayed dependency updates ([Renovate docs](https://docs.renovatebot.com/key-concepts/minimum-release-age/)). The problem is that these policies still depend on the package ecosystem's notion of time.

If the registry, mirror, or package-manager metadata path is compromised, then the same system serving the package may also be serving the claimed publication time. In that setting, "this package is 10 days old" is not a neutral fact. It is part of the trust surface.

In this post I want to sketch a system I will call **Dependency TimeLock**. The idea is simple: a dependency should only be installable if its exact artifact hash has been publicly committed for at least some minimum delay.

## Why package age is not enough

Cooldown policies are useful because many supply-chain attacks depend on speed. If a malicious version is published and removed quickly, an age threshold can block the first installation wave.

But a naive policy still leaves an obvious question:

> Who told us how old this package is?

If the answer is "the same system that gave us the package," then the timestamp is not independent. We are trusting:

- the registry's clock
- the registry's metadata integrity
- the package manager's view of publication time
- the assumption that the artifact being downloaded is the one associated with that timestamp

This is not just a theoretical distinction. In npm, package metadata is served by the registry "packument," which includes the package `time` object ([npm registry API docs](https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md)). In PyPI, release and file timestamps are exposed through registry APIs as `upload_time`, `upload_time_iso_8601`, or `upload-time`, and PyPI's upload flow explicitly says the first uploaded file creates the release and populates its metadata ([PyPI JSON API](https://docs.pypi.org/api/json/), [PyPI Index API](https://docs.pypi.org/api/index-api/), [PyPI Upload API](https://docs.pypi.org/api/upload/)).

For many use cases that may be fine. But if the goal is a stronger and more neutral defense layer, then the time signal should be attached to the artifact itself, not just to mutable registry metadata.

## The idea

The core rule is:

> An artifact is installable only if its exact digest has been publicly visible for at least `X` time.

This changes the security claim. The system is not saying:

> "This package version is old."

It is saying:

> "This exact byte sequence was publicly observable at least `X` time ago."

That is a much better property. It does not prove safety, but it does make short-window attacks harder.

## What gets committed

The commitment should be built around the artifact itself. A simple canonical record could be:

```text
record = hash(
  ecosystem,
  registry_id,
  package_name,
  version,
  artifact_hash
)
```

You could also include `metadata_hash`, `source_commit`, or `provenance_hash`, but the important field is `artifact_hash`. The installer downloads the package, hashes it locally, reconstructs the record, and checks whether that record has an old enough public commitment.

If the bytes change, the hash changes, and the record no longer matches.

## The timestamp layer

The timestamp layer could be implemented in several ways:

- a transparency log
- a Merkle-based public log
- a blockchain-backed timestamp system
- a hybrid design periodically anchored on-chain

There is already strong prior art here. Go's checksum database is a transparent log of module hashes used to detect misbehavior by proxies or origin servers ([Go modules reference](https://go.dev/ref/mod)). Sigstore's Rekor provides an append-only transparency log for software supply-chain metadata ([Sigstore Rekor docs](https://docs.sigstore.dev/logging/overview/)). OpenTimestamps provides independently verifiable timestamp proofs anchored to Bitcoin ([OpenTimestamps](https://opentimestamps.org/)).

The simplest model is:

```text
record_hash -> first_seen_timestamp
```

An installer then checks:

1. the downloaded artifact matches the committed hash
2. the record is included in the public log
3. the first-seen timestamp is older than the required threshold

This is not proof of safety. It is proof of prior public availability.

## How installation would work

At a high level:

1. Resolve the dependency.
2. Download the exact artifact.
3. Compute its digest locally.
4. Build the canonical record hash.
5. Verify inclusion in the timestamp registry.
6. Check that the artifact age exceeds policy.
7. Install only if all checks pass.

This lets users express policies such as:

- reject dependencies newer than 7 days
- reject artifacts missing a public timestamp commitment
- allow direct dependency overrides but stay strict on transitives

## Where the timestamps come from

The system depends on public observation. Watchers monitor registries, fetch new artifacts, hash them, and publish commitments.

The architecture is roughly:

```text
Package Registry
      |
      v
Watcher Network
      |
      v
Public Timestamp Registry
      |
      v
Installer Policy Engine
```

This means the system does not prove the true real-world release time. It proves a public first-seen or notarization time. That distinction matters, but it is still enough to support a useful install policy.

## Why this is interesting

The novelty here is not dependency cooldowns by themselves. Those already exist ([npm docs](https://docs.npmjs.com/cli/v11/commands/npm-install/), [Renovate docs](https://docs.renovatebot.com/key-concepts/minimum-release-age/)).

The interesting part is the trust model:

> enforce dependency cooldowns using independently verifiable artifact timestamps rather than relying only on registry metadata

That makes the policy more portable across ecosystems and less dependent on trusting the same system for both the package and its age.

## Limits

This does not prove that a package is benign. A malicious package can sit quietly for weeks and still satisfy the threshold.

It also depends on timely observation. If the watcher layer is incomplete or delayed, the timestamp layer becomes less useful.

There are also open design questions:

- how large should the delay be?
- should direct and transitive dependencies be treated differently?
- should the registry be fully on-chain or just periodically anchored?
- how should revocations or incident-response feeds work?

## A practical MVP

The strongest version of this idea does not need zero-knowledge at all.

A first version could just be a CLI:

```text
dep-timelock verify package-lock.json
dep-timelock verify poetry.lock
dep-timelock verify uv.lock
```

The tool would resolve artifacts, compute digests, query a public timestamp registry, and enforce a simple policy in CI or during install.

Only later does it become interesting to add privacy-preserving proofs, for example proving that a private lockfile satisfies the age policy without revealing the full dependency graph.

## Future work

The more ambitious version of this idea is that the registry should not only track time. It should also track validity.

Suppose that before an artifact can be added to the registry, someone must run a checker over it. That checker could be a deterministic analysis program looking for known issues, suspicious patterns, or policy violations. It could also be an open-weight model used as a classifier for obviously risky packages. In both cases, the key idea is the same: the registry is only updated if the submitter also provides a valid proof that the checker accepted the artifact.

This is where zero-knowledge becomes more interesting. Instead of proving only:

> this artifact hash was publicly visible before time `T`

one could prove:

> this artifact hash was checked by program `P` and accepted, and this statement was verified before the registry was updated

If that proof is verified on-chain, then the system is no longer just a dependency timelock. It starts looking more like a valid dependency registry: a registry whose state can only advance when new entries satisfy a public verification rule.

That rule could be simple at first. For example, require a proof that:

- a static checker was run on the artifact
- the checker output no critical findings
- the committed artifact hash is the one that was actually checked

Later, the rule could become richer:

- combine multiple analysis passes
- prove provenance constraints alongside the check
- use open-weight models as part of the acceptance policy
- require different policies for different ecosystems or package classes

Of course, this pushes the problem into a harder domain. The checker itself becomes part of the trusted computing base, and model-based analysis is much harder to reason about than a deterministic ruleset. But it opens a very interesting direction: instead of only saying "this dependency is old enough," the registry could eventually say "this dependency is old enough and it passed a public validation rule."

## Conclusion

Dependency TimeLock is a narrow idea, but a useful one. If supply-chain attacks often depend on freshness, then dependency tooling should treat freshness as a risk factor. The key twist is to bind that policy to exact artifact hashes and a public timestamp layer rather than trusting only package-manager metadata.

This would not stop every attack, but it could make one important class of fast-moving attacks much harder. More importantly, it is concrete enough to build, and it may be a stepping stone toward stronger registries that verify not just age, but validity.
