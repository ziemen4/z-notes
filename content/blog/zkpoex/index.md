---  
title: "Trustless Bug Bounties with zkpoex: Proving Exploits without Revealing Them"
date: "2025-04-18T09:27:45.934Z"  
description: "An open protocol for proving exploits using ZK proofs"
---

*Special thanks to [Abhi](https://www.thebookofzk.xyz/), [Galaxela](https://github.com/Alessandro-Cavaliere) and Julie for feedback*
## Introduction

Smart contract security is crucial for the future of decentralized systems. In 2024 alone, over $2 billion was lost to hacks and exploits, highlighting the severe consequences of security vulnerabilities. As the crypto ecosystem grows, the potential impact of these exploits becomes even more significant.

Hackers hold several advantages in the current landscape. They can silently monitor projects for extended periods, crafting precise exploits while remaining anonymous. Even contracts that have undergone thorough security audits and implemented bug bounty programs remain vulnerable, as attackers are always looking for novel exploit vectors, and auditors (even the best ones) won’t catch everything.

Bug bounty programs in the crypto ecosystem generally offer rewards to security researchers who find and report vulnerabilities. These frequently involve lengthy verification processes, delayed payments, and sometimes even non-payment. The introduction of third-party escrows attempts to address these issues but only adds another layer of complexity and trust requirements. Furthermore, projects must deal with an influx of false or irrelevant vulnerability reports, making it difficult to identify and address genuine security concerns.

## Why *trustless* vulnerability disclosure matters

Revealing detailed exploit information upfront is risky, as *whitehats* must coordinate with projects to receive their rewards.

**A *trustless* solution would level the playing field between attackers and ethical hackers.** Using zero-knowledge proofs (ZKPs), zkpoex enables *trustless* bug bounty submissions by proving an exploit exists without revealing its mechanics.

This solution elegantly addresses the previous problems. *Whitehats* can now submit cryptographic proof of a contract's vulnerability while keeping exploit details private. Once verified, bounty payments happen automatically. This approach benefits both parties:

- *Whitehats* receive guaranteed, immediate rewards after proof verification.
    
- Teams can fix vulnerabilities discreetly without additional coordination.
    

## Introducing zkpoex: Zero-Knowledge Proof of Exploit

zkpoex originally began as a proof-of-concept and won the [ETHDenver 2023 hackathon](https://risczero.com/blog/zkpoex). This project, done by [zkoranges](https://github.com/zkoranges) and [federava](https://github.com/federava)  though very innovative, was a PoC that was not yet generalizable as a tool to prove arbitrary exploits.

Together with [galaxela](https://github.com/Alessandro-Cavaliere) we enhanced this proof of concept into a richer project which can be used by both *whitehats* and project owners in order to participate in this protocol.

At its core, zkpoex allows a *whitehat* (the prover) to convincingly demonstrate the exploitability of a smart contract to a project (the verifier) without revealing any specific exploit details. To accomplish this, zkpoex uses ZKPs, cryptographic proofs that verify a statement's truth without revealing sensitive information. In this context, the proven statement is:

*"I know specific calldata that, when executed, violates the contract's intended security guarantees."*

This proof takes the form of a Zero-Knowledge Succinct Non-Interactive Argument of Knowledge (zkSNARK). The "zk" prefix indicates its zero-knowledge property, which keeps the calldata completely private.

zkpoex is also researching the notion of encrypting *calldata* with a public key within the proof, ensuring that only the affected project's security team can access the vulnerability details. This feature remains under active research.

## Key Concepts: How to Prove You've Found an Exploit

To prove an exploit, projects must first define a set of **conditions** called the **program specification**. zkpoex uses this specification to verify whether a **state transition** invalidates any conditions.

While creating these conditions requires significant effort, we believe this process leads to safer code. We're developing tools to streamline this specification process and reduce development time.

These conditions are straightforward statements that smart contract methods must satisfy, such as *"users can't withdraw more tokens than they deposited"* or *"the total token supply must equal the sum of all individual balances."*

When a prover discovers a state transition that breaks a condition, they simulate it and prove the violation. The prover demonstrates a violation exists without revealing the specific exploit.

Sometimes vulnerabilities stem from incomplete rules rather than broken ones. zkpoex handles this by letting provers suggest additional conditions. A whitehat can effectively say: *"If you had included this condition, my transaction would violate it."* This capability enables the user to improve security, although determining the validity or necessity of these additional conditions is a non-trivial task.

Some may notice these cases (additional or missing conditions in the specification) challenge the premise of avoiding unfounded claims, since provers can propose arbitrary conditions. This challenge is discussed further in the Challenges and Considerations section.

In summary, zkpoex addresses two main types of vulnerabilities:

- **Exploits**: Clear violations of existing conditions (program specification).
    
- **Missing Conditions**: Vulnerabilities resulting from incomplete specifications.
    

## How zkpoex Works: Simulating an Attack in Zero Knowledge

Behind the scenes, zkpoex employs a zero-knowledge virtual machine (zkVM) to simulate attacks and generate cryptographic proofs. Currently, zkpoex uses [RISC Zero’s zkVM](https://dev.risczero.com/api/zkvm/), a general-purpose zkVM based on the RISC-V architecture.

Here’s a simplified step-by-step overview:

1. **Setup**: The *whitehat* obtains contract bytecode, a valid state, and *calldata* that produces an invalid state transition (relative to the program specification).
    
2. **Simulating the Exploit**: The zkVM hosts an Ethereum-like environment, executing the exploit transaction exactly as if it should occur *onchain*. It checks the resulting state of this simulation against the program specification to detect the exploit.
    
3. **Detecting the Exploit**: When the simulation is run on the *whitehat's* inputs (the contract bytecode, initial state, and *calldata*), a real exploit will result in some condition being violated during the execution. Meanwhile, if no condition is violated, the *whitehat’s* finding does not qualify as a real exploit.
    
4. **Proof Generation**: After execution, zkpoex generates a ZKP stating, *"a private exploit exists causing the contract to violate its specification."*
    
5. **Proof Submission & Verification**: This proof is submitted onchain, verified by a verifier contract. If valid, the contract confirms the vulnerability without ever seeing exploit details.
    
6. **Automatic Actions**: Verified proofs immediately trigger automatic bounty payouts and defensive measures like pausing vulnerable contracts.
    

### Encryption for Confidential Submissions

For enhanced security, zkpoex can implement encrypted exploit details. *Whitehats* encrypt their exploit *calldata* using the project's public key and submit this encrypted data alongside the cryptographic proof. Only the project's security team can decrypt these details, and only after the bounty payment is complete. While this encryption significantly improves confidentiality, it creates substantial computational overhead in zkVM environments, an issue that remains the focus of ongoing research for more efficient solutions.

## Challenges and Considerations

While *trustless* bug bounties are a powerful concept, zkpoex faces several key challenges:

**Meaningful Specifications**: Writing solid program specifications demands deep understanding of smart contract outcomes. Teams must invest significant effort to define these specifications correctly. To reduce this burden, we're developing libraries and templates for common specifications.

**Performance and Scalability**: Generating ZK proofs is computationally demanding, especially for complex exploits. For this alpha version, we are allowing the use of [Risc0 Bonsai](https://risczero.com/bonsai), although in the future, proving must be done locally to prevent the exploit from leaking. We're working to optimize performance by exploring the zkVM landscape and any new technologies that may arise.

**Security of zkpoex itself**: Ironically, zkpoex could become a target, bugs in the prover or verifier logic might enable fake proofs of non-existent vulnerabilities. This makes using a highly secure zkVM and proper EVM environment crucial for proof generation.

**Handling Missing Conditions**: Handling missing conditions comes with several challenges:

1. **Avoiding unnecessary claims of conditions to projects**. Although this is largely mitigated today because malicious parties must create a ZKP (which is computationally expensive), we believe that future zkVM efficiency improvements could make this an issue again. For this case, we may require collateral to be locked until the dispute can be settled properly.  
      
    
2. **Effectively enforcing project payouts**. Since missing conditions were not defined in the program specification, they cannot be easily categorized, making automatic payouts impossible. To address this, ongoing research explores solutions such as implementing a VDF-like system or partially breakable encryption of the encrypted *calldata*. These mechanisms could enforce the team to act if the condition reveals an actual exploit, ensuring at least a minimum payout for such cases. 
 
   Determining appropriate payouts remains challenging, however, as assessing the scope of the exploit is difficult. Another possibility includes integrating a dispute resolution system such as [Kleros](https://kleros.io/), which could help categorize vulnerabilities, enabling a fair solution between the prover and the team regarding payout. In the worst case scenario, enforcing a minimum payout for missing conditions could ensure that the prover is never left empty-handed.  
      
## Current Status and Roadmap

zkpoex is under active development, with version 0.1.0 alpha launching soon. Our current focus is on enhancing usability, implementing advanced condition support, and creating libraries to simplify specification development. We're also working to integrate verifier contracts for a complete testnet demonstration.

Our vision is bold, we aim to establish zkpoex as the foundation for automated, *trustless* bug bounty platforms. By accepting "zk-proof-of-exploit submissions," projects can attract more researchers through guaranteed payments while handling vulnerabilities discreetly.

We welcome contributors with expertise in Rust, Ethereum, zero-knowledge cryptography, or security research. The upcoming version 0.1.0 will serve as our initial alpha release, helping us gather valuable community feedback as we refine the framework toward production readiness.

## Conclusion: Towards Enhanced Security

zkpoex is pushing crypto security forward by combining blockchain principles and zero-knowledge cryptography. By allowing ethical hackers to prove vulnerabilities exist without prematurely revealing exploits, zkpoex tackles existing trust issues, improving overall security.

Wide adoption of zkpoex could substantially reduce crypto exploits while promoting clearer specifications. As projects refine their program specifications, smart contracts become more deterministic and secure, creating a safer ecosystem for all participants.

The future vision, is similar to arbitrage in finance, if exploits in public smart contract exist and their specifications are available, it is rational for actors to find said exploits and obtain automatic rewards. This in turn allows projects to refine their code by fixing broken conditions or enhancing their program specification. 

In a world that will become increasingly [permeated by AI agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf) and where [research in smart contract vulnerabilities detection is on the rise](https://www.sciencedirect.com/science/article/pii/S1084804525000396), we think leveraging zero-knowledge technology to automate security improvements will be deeply important,

We invite smart contract developers, ethical hackers, cryptographers, and researchers to explore the [zkpoex GitHub repository](https://github.com/ziemen4/zkpoex), contribute ideas, and join our mission to build a safer crypto ecosystem. We are currently seeking grants, if you're interested in funding this project, please reach out to us.