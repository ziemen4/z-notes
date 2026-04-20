---  
title: "Verifiable Computation as a Protection System for Digital Wallets"
date: "2026-04-07T20:58:42.514Z"  
description: "How to use VC to protect digital wallets with ZKPs" 
---
*Special thanks to [Galexela](https://github.com/Alessandro-Cavaliere) for his feedback and review*

## Introduction

Digital wallets are the primary way of interacting with blockchains. They hold assets, govern treasuries, execute upgrades, and increasingly act as the operating layer through which users, companies and systems interact with smart contracts. Yet, most wallets still rely on signature verification for authorizing any action. In many cases, multi-sig wallets are the norm, where $m$-of-$n$ schemes exist, though they provide more security than a single key, they still allow any action as long as one can provide the required signatures.

Valid signatures can tell us that a key approved a payload. Yet they don't explain whether the payload should have been allowed in the first place. If a signer is socially engineered, a device is compromised or a human makes a mistake, the system has no way to distinguish between "*the owner signed"* and *"the owner signed **an allowed action***". For projects, operational wallets, agent-controlled accounts and high value users this is not enough. Attackers are getting more sophisticated with time, this issues lead to things like the [ByBit attack](https://www.csis.org/analysis/bybit-heist-and-future-us-crypto-regulation), the [Drift Protocol Hack](https://www.chainalysis.com/blog/lessons-from-the-drift-hack/) or even things like [Paxos 300T minting mistake](https://www.cnbc.com/2025/10/16/paypals-crypto-partner-mints-300-trillion-stablecoins-in-technical-error.html). All of these show that operational security and the reliance on simple digital signatures is not enough.

The deeper issue is that a private key is an identity primitive, not an authorization one. It can tell us who signed, but it can't tell us if the signed action should be allowed or not. This is where verifiable computation gives us an interesting solution: authorize the action with a private key and prove that the action satisfies a policy. To verify this succinctly and privately, create a zero-knowledge proof and verify it on-chain. Now when the action is performed you don't just know that it's authorized but you also know that it's compliant with your policy.

## From key custody to policy-constrained authorization

In the model implemented by [zkguard](https://github.com/ziemen4/zkguard), the wallet commits on-chain to a pre-defined policy set, for example, through a Merkle Root. The actual policy (what the wallet can or cannot do) remains off-chain, only a hiding commitment is stored on-chain. When a user wants to perform an action, the prover generates a zero-knowledge proof showing that a valid policy for the stored commitment exists in the policy set and that the proposed action is compliant with said policy. The verifier does not need to inspect every rule, and it does not need to learn which rule matched, it only needs to verify a succinct proof that validates this.

This has an important consequence: the private key is no longer the single source of authority, it is one part of a larger authorization relation. The wallet accepts an action only if two things are true at the same time: the signer is legitimate, and the action is policy-compliant.

But we can do better than that, once policy becomes first-class, hierarchical wallets appear naturally. They are also more powerful, because each policy itself can require more than one signature depending on the action the user wants, we can have a small transfer requiring a single signer, while a governance upgrade or recovery flow requiring many. 

This is much closer to how real institutions think about security, where different actors typically are assigned distinct roles and each role can execute different actions. Since these actions carry different risk, they should require different conditions. 

![zkguard-diagram.png](zkguard-diagram.png)

## Why privacy and succinctness matter

There may be cases where having a public policy is acceptable, mainly for transparency, but in many realistic settings it leaks operational structure that should not be given to an adversary. A public policy can reveal who the signers are, what destinations are trusted, how upgrades are approved or if there are any recovery paths, among other things. Even if the policy is sound, exposing it can make attacks easier and can allow attackers to reason through how the operational security of the wallet works.

Zero-knowledge allows the verifier to learn that the action is compliant with a policy, without knowing the internal structure of the policy or any other policy in the set. The system enforces rules without advertising them.

Succinctness is also important, if this wasn't the case, then whatever the prover did would have to be recomputed. In fact, there are proving systems which allow for a (constant cost no matter what work the prover did!)[https://eprint.iacr.org/2016/260.pdf]. Since execution on-chain is generally costly, this makes the scheme practical by making the proof small enough to verify efficiently.

The combination of these properties make this a private policy system with public verifiability which can enforce complex internal rules while exposing only a short cryptographic proof that allows the action to be executed. If the system is built properly, the main weak point moves away from raw secret custody and toward policy quality, proving system correctness and policy-update governance. This is still a hard problem, but much better than the status quo.

## Does this actually work in practice?

For institutions, I believe the answer is already yes.

Today, with good prover hardware and using mature proving systems, this model is already practical. Circuit-based systems such as Noir with UltraHonk and Gnark with Groth16 can yield an advantage for simple use cases like transfers, issuance and simple smart contracts. In contexts where there are operations with large volume and security is very important, more prover overhead may be worth it.

There is also a broader design space. If proving latency becomes the main bottleneck, one can spend more resources on proving infrastructure or optimize the circuits more aggressively. If local proving is inconvenient, [delegated or distributed proving can help](https://taceo.io/)

For more complex policies, zkVM-based systems may be slower today, but they offer a much more natural programming model. As zkVM performance keeps improving, they will become a very compelling option.

## Future directions

One of the most interesting open questions is what happens when we treat policy updates themselves as part of the attack surface. In [zkguard](https://github.com/ziemen4/zkguard), we treat policy updates **as part** of the policy, which is very helpful since the weakest link is kept private. Nevertheless, one could potentially research some avenues for improvement. For example, requiring zero-knowledge proofs for policy updates such that any new policy must satisfy some baseline safety relation. This would already prevent things like allowing the existence of a policy with no signers or requiring a maximum amount for any policy. It would not solve every problem, but it would make one important class of dangerous updates cryptographically impossible.

Another direction is to put machine learning into the authorization loop. In the current implementation, compliance is decided by a fixed rule system: amounts, destinations, selectors, etc. But one can imagine augmenting this with a committed anomaly detector or risk model. A transaction may be valid under the policy set, but still be anomalous in context. The model parameters could be committed and inference proved in zero-knowledge. This connects naturally with verifiable ML, I wrote previously about it in [AI alignment through programmable cryptography](https://ziemann.me/ai-crypto/), the broader idea is that you can commit to a model and later prove that a particular inference was produced by it without exposing its internal details. For wallet security, this could open the door to private anomaly detection as part of the authorization.

Beyond that, there is plenty of room for the system to grow. First, the circuits are completely unoptimized and surely the proving cost could be decreased, secondly there are more mitigations to put in place: timelocks, expirations, rolling quotas, among others. Transparent and plausibly post-quantum proof systems remain an important long-term direction, specially because Groth16 is the most efficient way to verify on-chain but would not be sound in a post-quantum world.

All of these directions point to the same conclusion: this is not just a better multisig. It is the beginning of a different way to think about wallet security.

## Conclusion

In this adversarial world, leaving all security to a single private key is no longer an option. For many use cases, one can know if a payload must be authorized or not by verifying it directly. Other solutions are either public, leaking the authorisation details, or too costly, since on-chain execution is not cheap. With Verifiable Computing this changes: now we can have a private succinct verification system that is cryptographically sound so that any action that a wallet attempts to do is always authorised by a pre-determined policy.

This new paradigm will change how we secure digital assets, in a world where state-level actors are active, organized cybercrime is industrialised and AI agents can scan and exploit systems at machine speed, trust and privacy are under pressure. Cryptography is offering us a solution and we should take it if we want this industry to succeed.