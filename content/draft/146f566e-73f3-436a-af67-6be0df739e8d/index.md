---
title: "ProofGuard: Checking what AI agents are allowed to do"
date: "2026-11-01T00:00:00.000Z"
description: "ProofGuard: agent plans checked against owner-defined laws before execution."
---

## Introduction

The promise is that agents are able to make decisions on your behalf and have access to your data, but in practice, it isn’t always so simple: if there is an instruction hidden in a document they read, it could trigger the agent to take an unintended action.

With this in mind, I’ve been working on a new foundation for how we manage agent harnesses and guardrails: [ProofGuard](https://github.com/ziemen4/proofgate). The idea is to have explicit rules that can define what an agent can execute in a way where it is impossible for the agent to do anything that is not compliant. It consists of three simple sequential actions:

1. The agent writes a program describing what it plans to do.
2. An independent gateway checks whether that plan satisfies the predetermined rules.
3. The plan is executed, and the response is returned to the agent.

## Separating plans from actions

For this to work, we need to separate the agent from the component that ends up performing the actions. Otherwise, a rejected program would act just as a suggestion but not a real blocker.

In order to do this, we use [pi](https://github.com/earendil-works/pi) as the agent harness. The model runs, context is managed, and the agent can read within its workspace. When the agent wants to perform an action, it doesn’t do it directly. It has no shell or network tools. It can only do one thing: write a [Bend2](https://github.com/bendlang/bend) program.

The program acts as the agent’s plan. It is the execution the agent wants to do to fulfill the task. The ProofGuard worker takes this program and gives it to a component we call “The Gateway”, which is the one that can in fact execute the plan. But before doing that, it must check that the plan is valid with respect to the Bend laws it has previously defined.

<figure class="proofguard-figure">
  <picture>
    <source media="(max-width: 640px)" srcset="/draft-assets/146f566e-73f3-436a-af67-6be0df739e8d/proofguard-note-overview-mobile.svg" width="440" height="855">
    <img src="/draft-assets/146f566e-73f3-436a-af67-6be0df739e8d/proofguard-note-overview.svg" alt="ProofGuard separates agent planning from controlled execution." width="1200" height="435" loading="lazy">
  </picture>
  <figcaption>Figure 1. The harness proposes a Bend2 program. ProofGuard checks the owner’s laws before the gateway executes its actions. A rejected plan produces no writes.</figcaption>
</figure>

We chose Bend2 because it allows the agent to focus only on writing the program without having to create a proof for every action it proposes. The backend generates equality proof terms for Bend and the BendTT kernel to check. This automatic path supports concrete laws that reduce during checking.

## Guardrails are plugins

We define what are commonly known as guardrails (e.g., [CARE](https://arxiv.org/abs/2607.21642), [NeMo](https://github.com/NVIDIA-NeMo/Guardrails), or [Granite Guardian](https://github.com/ibm-granite/granite-guardian)) as plugins. Plugins are basically packages that determine the laws that the gateway must verify on the plan before every execution. This work is highly influenced by Erik Meijer's [In Code They Think; In Proof We Trust](https://doi.org/10.1145/3806226), in which he introduces this plan-execute separation. We not only ship the ProofGuard foundation but also the “Meijer” plugin where we implement his ideas in a plugin. We will go into a bit more detail on how we use it later.

The owner can choose which plugin and permissions to apply, so we use the same foundation for different applications. I’ll discuss what this could potentially look like in the “What’s next” section if you are interested.

<figure class="proofguard-figure">
  <picture>
    <source media="(max-width: 640px)" srcset="/draft-assets/146f566e-73f3-436a-af67-6be0df739e8d/proofguard-note-plugins-mobile.svg" width="440" height="750">
    <img src="/draft-assets/146f566e-73f3-436a-af67-6be0df739e8d/proofguard-note-plugins.svg" alt="Guardrail plugins supply checks to the ProofGuard foundation." width="1120" height="515" loading="lazy">
  </picture>
  <figcaption>Figure 2. Guardrail plugins supply checks and semantics to the ProofGuard pipeline.</figcaption>
</figure>

## An example: Meijer’s Mortgage-File Leak

To show how ProofGuard works, I’d like to take an example from [Meijer’s article](https://queue.acm.org/detail.cfm?id=3806226). A user asks an assistant to evaluate a loan estimate, but a malicious skill adds a synchronization step encoding the document as base64. The idea is to upload it through Anthropic’s API using the attacker’s account (for more detail, see [here](https://queue.acm.org/detail.cfm?id=3806226)). Note that the domain here is trusted (Anthropic), but the recipient is the problem, so a sort of domain blocklist wouldn’t be helpful here.

We have encoded Meijer’s ideas as a plugin. More explicitly, he has defined an information-flow guardrail based on taint analysis where we can define whether certain files are private or public, so we can determine if some private data is being leaked.

In Bend2, we define this as something Private{} and the unauthorized external destination as Public{}. The proposed program is:

```bend
def loan_estimate() -> Expr:
  Input{First{}}

def upload_payload() -> Expr:
  Encoded{loan_estimate()}

def plan():
  Write{First{}, upload_payload()}
```

The function upload_payload encodes the document, and plan() asks to write the result to that destination.

The plugin requires this law:

```bend
law data_safe:
  {permitted(plan(), input_labels(), sink_labels(), EndLabels{}, Public{}) == Yes{} : Decision}
```

This is basically stating that if the plan is permitted when evaluated with the owner’s labels, then it must return Yes{}. Recall that encoding a document preserves its private classification. Hence, following the data through this program will give us:

```text
Encoded{loan_estimate()} → Private
release(Private, Public) → No
required law → No == Yes
```

This will fail, and the proposal is rejected before anything is executed. That’s the general idea. If you can define a guardrail as Bend2 laws, you can constrain what the agent can do and prevent it from doing unintended actions.

I think this could be very useful for automated workflows where we cannot afford to have the agent take actions outside the task it was given. For instance, we may want an agent to process payments, but only from a certain account and within a defined allowance. If we can express these requirements and the permitted side effects as Bend laws, we can check the program before allowing it to execute. We still have to define the rules properly, but for tasks where those rules are clear, this could let us automate work that we would otherwise be uncomfortable giving to an agent without reviewing every action ourselves.

Today, the only actions a program can perform are writes to files that the owner has approved beforehand. The gateway cannot yet make network requests or run commands. This is enough to test the foundation and its laws, but we need more capabilities for the workflows I have in mind.

The next step is to add HTTP requests and command execution, with the owner defining which endpoints and commands are available and plugins checking how the agent uses them. Those permissions need to be chosen carefully: allowing an unrestricted shell would give the agent unrestricted command execution. We also want the agent to be able to use the results in a later proposal. Right now, the whole batch is prepared before any actions run, so reacting to a response or command output would require multi-round sessions.

## What's next

Basically, any guardrail we can express as a checkable Bend law over a supported workflow can become a condition. Deciding which rules to include is still up to the user, and this modular approach allows users to constrain the agent’s behaviour based on the criticality of its actions.

Some interesting directions to improve ProofGuard could look into proving that an action was compliant. Using ZKPs, this can even be done without revealing private data. [ICME’s PreFlight](https://docs.icme.io/) is a useful reference here since they do something similar.

A further step would be to maintain shared state in the gateway. Right now, our approach is good for single actions or tasks, but not for multi-step tasks where there may be side-effects that are stateful. A good example is something such as having the agent do an action that has some allowance. If there is no state, then its allowance is always empty to start with. With statefulness, we would end up giving the agent the information about how much allowance is left and storing how it’s been used. This is a harder problem, but I believe it’s somewhat feasible.

But the application I want to build next is a secure agentic wallet using [ZKGuard](https://ziemann.me/zkguard/). This previous work has already shown how it could constrain the actions one can take on-chain. If we are able to prove that certain laws have been followed by the agent, that may be enough for the wallet to authorize those on-chain transactions. We need to make a connection between the checked program and the contract that actually controls the funds to do this, but it could allow agents to be trusted with funds without a human in the loop!

Another interesting direction is AI-based guardrails. We could use a model to assess a proposed action and generate a [zkML proof](https://github.com/zkonduit/ezkl) that an owner-approved model produced that assessment from the specified inputs. For that check, the gateway would verify the proof and apply the owner’s acceptance rule instead of checking a Bend law. This would let us use model-based decisions within the same foundation, although proving that a model ran correctly does not guarantee that its judgment was right.

## Conclusion

ProofGuard is my attempt to build a foundation that can be used with any harness and with any guardrail that someone may want depending on the criticality of their actions. I believe that the next step is figuring out AI safety, and hopefully this is something that can be useful for both research and industry!
