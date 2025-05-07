---  
title: "AI alignment through programmable cryptography"
date: "2025-05-05T09:27:45.934Z"  
description: "TBA"
---

### Introduction
Recent advances in both [programmable cryptography](https://0xparc.org/blog/programmable-cryptography-1) and [AI](https://ourworldindata.org/grapher/test-scores-ai-capabilities-relative-human-performance) may appear unrelated at first glance, but they have a clear overlap.

Programmable cryptography offers two key capabilities:

1. **Private computation**: Allows an external party to execute a computation on your data without learning anything about the data itself.
2. **Verifiable computation**: Allows one to efficiently check that the party carried out exactly a predefined computation.


![[Pasted image 20250426111800.png]]
*A simplified tree of cryptographic primitives. Source: [programmable-cryptography](https://0xparc.org/blog/programmable-cryptography-1)*

AI systems excel at narrowly scoped tasks and are gradually tackling [broader challenges](https://contextual.ai/blog/plotting-progress-in-ai/) such as prediction and reasoning. These systems do not follow a single, predetermined algorithm but rather learn from data, producing behavior that may be far from trivial to interpret. The _emergence_ of behavior is of increasing interest as AI takes over more and more important tasks, its [explainability](https://www.ibm.com/think/topics/explainable-ai) is an active area of research. 

As AI systems advance and surpass humans across an increasing range of tasks, a critical question arises: **How can we verify that an AI system is behaving as expected?**
There are two relevant parts to this question:
1) Understanding how an AI system is behaving in practice
2) Properly defining what its expected behavior should be

In other words, we are looking to see how _aligned_ the system is (how it should behave) with respect to some objective (its expected behavior).

### Programmable Cryptography
Here, I adopt the definition of the [article](https://0xparc.org/blog/programmable-cryptography-1) linked before.

>"*We use the term “programmable cryptography” to refer to a second generation of cryptographic primitives that are becoming practical today. The defining feature of these primitives is that they are far more flexible than first-generation cryptography: they allow us to perform general-purpose computation inside or on top of cryptographic protocols."

In this discussion, our focus is on Succinct Non-Interactive ARguments of Knowledge (SNARKs) and their role in **verifying** the actions of an AI system. Although SNARKs also support privacy (as zkSNARKs), the primary interest regarding AI alignment has to do with its verifiability property. 

This is because _alignment_ (something we’ll discuss later) depends on our ability to confirm that an AI system performed the computation we expected. This area of research, widely known as [zkML](https://medium.com/@vid.kersic/demystifying-zkml-0f3dff7194b9), is advancing rapidly by merging cryptography and AI.

### AI Alignment
AI alignment is [defined](https://www.amazon.com/Artificial-Intelligence-A-Modern-Approach/dp/0134610997) with respect to an _objective_. If the AI system advances towards it, we say that it is **aligned**, while if it deviates from it we say it is pursuing an unintended objective.

Different AI systems can have different goals. A system such as [AlphaZero](https://deepmind.google/discover/blog/alphazero-shedding-new-light-on-chess-shogi-and-go/) simply must win in the game of Go, while others like [AlphaProof](https://deepmind.google/discover/blog/ai-solves-imo-problems-at-silver-medal-level/) are trained on formal problems and their objective is to correctly derive a proof.

![[Pasted image 20250426105757.png]]
*A representation of the training process of AlphaProof: (Source: [blog](https://deepmind.google/discover/blog/ai-solves-imo-problems-at-silver-medal-level/))*

When objectives are well-defined, it is simpler to try to understand when an AI system is not aligned, because it’s easier to verify their behavior. Notably, these systems typically work in a much more constrained environment and there’s a very clear way to compare their outputs with the expected results.

On the other hand, modern large-scale models (such as today's LLMs) do not have such neatly defined objectives. Their _alignment_ emerges from the training process, (ie learning to be a helpful assistant), but this doesn't mean that their behaviour will be predictable for some [out of distribution input](https://www.holisticai.com/red-teaming/chatgpt-4-5-jailbreaking-red-teaming). As AI systems assume roles once performed by humans, the incentive to verify their behavior grows ever stronger.

### Using SNARKs for alignment verification
Recent [research](https://arxiv.org/pdf/2402.02675) (and the main catalyst for this post) has been looking for answers on the verifiability of AI systems. Specifically, on how to use SNARKs to verify the behavior of machine learning models, even when those models are closed-source.

In this paper, the authors propose the use of *benchmarks* and *proofs of inference* (proving a certain model performed the computation).

>*"The goal of this work is to remove the need for the public or an end user to trust the model provider. The zkSNARKs enable verification that computational work with a model with weights $H(W)$ occurred, that it produced a given benchmark, and that it was used for a specific inference that is challenged"*

Specifically, when a user questions an output, the provider must produce a succinct proof showing that the model with the same weights that generated the published benchmark indeed produced the claimed output for the challenged input.

To get into more detail, we are given a *benchmark* which aggregates $(x, y)$ pairs that are being ran on the model (ie proving accuracy for a certain task is >70%) giving us an indication of how the model "behaves" (if we can aggregate information in a certain way, we may indirectly understand how a model behaves in a general sense) though always subject to the dataset used to create the input-output pairs, which is of course a critical aspect.

![[Screenshot 2025-05-05 at 21.10.46.png]]
*A system diagram of verifiable ML evaluation: (Source: [paper](https://arxiv.org/pdf/2402.02675))

To challenge any response, whoever receives an output $y'$ can ask for a *proof of inference*, the provider must then create said proof, which must show that the model used weights $W$ (the same one that produced the benchmark) to produce said output and that it was based on the input $x'$ sent by the user.

Leveraging ZKPs, we have managed a way to **verify** that a closed-source AI system being used is the same as a system we know behaves in a certain way!

### A quick detour: Isaac Asimov's three laws of robotics
A long time ago, in 1942, Isaac Asimov published "Runaround" a short story around the infamous **three laws of robotics** :

>1. A robot may not injure a human being or, through inaction, allow a human being to come to harm.
>2. A robot must obey orders given it by human beings except where such orders would conflict with the First Law.
>3. A robot must protect its own existence as long as such protection does not conflict with the First or Second Law.

My unfounded belief is that this implied some sort of hardwired constraints in the robot's programming, but as is well known, AI is mostly based on Neural Networks (NN) which resemble something more akin to human cognition than traditional programming.

Were we to deploy robots governed by these laws today, how could we verify that any robot is actually complying with said rules? Though we still don't have independent intelligent robots running around in our daily lives (but steady [progress is being done](https://youtu.be/I44_zbEwz_w?si=dSXjHNys9-CBQoAZ)), thinking about AI alignment is something we must do to ensure that any artificial intelligence model that is used behaves as we expect it to.

### Rambling: AI alignment in the age of Robots and AGI
As a speculative exercise, imagine combining Asimov’s laws with SNARK-based verification. Theoretically (and in a very broad and ambiguous sense), how could we achieve something like that?

Well, based on what we discussed, perhaps we could create a dynamic benchmark managed by society which challenges the closed-source systems in order to indirectly understand what their expected behavior is. These benchmarks must be very elaborate, perhaps aggregating complex test cases into an alignment score (maybe the score could be also automated by an AI system, though we would need that to be compliant as well!)

Perhaps a safer approach would be having open-source models, which can potentially simplify the process of understanding behaviour by using tools in Explainable AI ([XAI](https://www.ibm.com/think/topics/explainable-ai)). Though mandatory open-source models may seem to hinder competition, we are still early to know [what the right approach may be](https://about.fb.com/news/2024/07/open-source-ai-is-the-path-forward/).

In an ideal future where proof generation becomes almost instantaneous, every robot action could be accompanied by a ZKP. Verifying each proof would ensure compliance with alignment constraints, reducing the risk of unsafe or unintended behavior. This process could be the core process that any robot should have, and all security aspects should be linked to protecting it.

If this actually works somewhat well, malicious attacks such as model impersonation or model hacking (which could lead to inappropriate or unsafe behavior), would be hard! Though there is always an attack surface for the core process itself.

Despite the highly speculative nature (and perhaps complete nonsense) of this last section, it illustrates how verifiable computation will play a pivotal role in the responsible deployment of AI systems in the future.