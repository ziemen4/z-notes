---  
title: Zero Knowledge Proof of Exploit
date: "2025-03-30T09:27:45.934Z"  
description: "A framework of how to prove exploits using ZK"
---  
# Trustless Bug Bounties with zkpoex: Proving Exploits without Revealing Them

## Introduction

The current state of security in smart contracts is a pressing issue against crypto adoption. In 2024 alone, the total value lost in hacks and smart contract exploits reached at least $2 billion, a figure expected to rise as adoption increases.

Although many exploited contracts previously passed security audits and offered bug bounty programs, massive exploits still occur because attackers identify exploit vectors auditors never considered. There is a clear asymmetry: hackers can continuously monitor smart contract projects and produce a single transaction to exploit them, while whitehats and ethical hackers must navigate bug bounty programs that sometimes feel bureaucratic.

Bug bounty programs intend to reward ethical hackers, but sometimes these hackers face payment delays or even non-payment. This introduces third-party escrows, complicating the process and adding another source of trust.

Additionally, malicious parties might spam projects with irrelevant vulnerability claims, overwhelming project teams and making their job harder.

## Why trustless vulnerability disclosure matters

Revealing detailed exploit information upfront comes with risks since coordination between parties must occur for whitehats to obtain rewards. Also, reported vulnerabilities might be completely false, adding unnecessary work for project teams.

A trustless solution would level the playing field between attackers and ethical hackers. The goal of zkpoex is to prove the existence of an exploit without revealing how it actually works by using zero-knowledge proofs (ZKPs) to enable trustless bug bounty submissions.

This addresses the described problems, as now a whitehat can submit a cryptographic proof showing a contract is exploitable without revealing exploit details. Once verified, the bounty can be automatically paid. This approach benefits both parties:

- Whitehats have assurance they will receive immediate rewards upon proof verification.
    
- Teams can directly fix the identified exploit without needing further coordination. Details remain confidential, ensuring discreet resolution.
    

  
  

## Introducing zkpoex: Zero-Knowledge Proof of Exploit

zkpoex began as a proof-of-concept and won the ETHDenver 2023 hackathon. At its core, zkpoex allows a whitehat (the prover) to convincingly demonstrate the exploitability of a smart contract to a project (the verifier) without revealing any specific exploit details.

To achieve this, zkpoex leverages the power of ZKPs, cryptographic proofs allowing anyone to prove a statement is true without revealing sensitive information. In our context, the prover proves the statement:

 “I know specific calldata that, when executed, violates the contract’s intended security guarantees.”

To prove this statement, the prover generates a cryptographic proof called a Succinct Non-Interactive Argument of Knowledge (zkSNARK). The “zk” prefix indicates the SNARK uses the “zero-knowledge” property, disclosing no information about the calldata.

Additionally, zkpoex allows encrypting this calldata with a public key inside the proof, ensuring that the same calldata used in the exploit is revealed only in encrypted form. This feature, still under research, ensures only the exploited project's security team can learn about the vulnerability.

## Key Concepts: How to Prove You’ve Found an Exploit

To properly prove an exploit, a set of conditions called a program specification must be defined for each method in the smart contract. zkpoex requires project teams to provide formal specifications, later used by the protocol to verify whether the specification is invalidated by a state transition.

Adopting zkpoex will encourage projects to create clearer specifications and thus safer code. These rules or conditions are simple statements that methods in a smart contract must fulfill, such as "users can’t withdraw more tokens than they deposited" or "the total token supply must equal all individual balances summed."

If the prover finds a state transition breaking any condition, the prover simulates it and proves the violation. For instance, consider a reentrancy attack scenario: the rule might be "balances can’t drop below what's being withdrawn.". The prover would prove a violating transaction exists without revealing the exact exploit details.

However, vulnerabilities sometimes arise from incomplete rules rather than broken ones. zkpoex addresses these by allowing provers to propose additional conditions. Essentially, a whitehat can state: "If you included this additional condition, my transaction would violate it.", while this improves overall security, determining the validity or necessity of these additional conditions isn't trivial.

Some may notice these cases challenge the premise of avoiding unfounded claims, since provers can propose arbitrary conditions. This challenge is discussed further in the Challenges and Considerations section.

In summary, zkpoex handles two main vulnerability types:

- **Exploits**: Clear violations of existing conditions (program specification).  
      
    
- **Missing Conditions**: Vulnerabilities resulting from incomplete specifications.  
      
    

## How zkpoex Works: Simulating an Attack in Zero Knowledge

Behind the scenes, zkpoex employs a zero-knowledge virtual machine (zkVM) to simulate attacks and generate cryptographic proofs. Currently, zkpoex uses RISC Zero’s zkVM, a general-purpose environment based on RISC-V architecture.

A simplified step-by-step overview:

1. Setup: Whitehat obtains contract bytecode, a valid state, and calldata that produces an invalid transition (relative to the program specification).  
      
    
2. Simulating the Exploit: The zkVM hosts an Ethereum-like environment, executing the exploit transaction exactly as if it should occur on-chain. It checks the resulting state of this simulation against the program specification to detect the exploit.  
      
    
3. Detecting the Exploit: If no exploit is found, no conditions are violated, and the simulation fails. If successful, it means an exploit was identified.  
      
    
4. Proof Generation: After execution, zkpoex generates a ZKP stating, "a private exploit exists causing the contract to violate its specification."  
      
    
5. Proof Submission & Verification: This proof is submitted on-chain, verified by a verifier contract. If valid, the contract confirms the vulnerability without ever seeing exploit details.  
      
    
6. Automatic Actions: Verified proofs immediately trigger automatic bounty payouts and defensive measures like pausing vulnerable contracts.  
      
    

### Encryption for Confidential Submissions

To increase security, zkpoex supports encrypted exploit details. The whitehat encrypts exploit calldata with the project's public key, submitting this ciphertext alongside the cryptographic proof. Only the project’s security team can decrypt details after the bounty is securely paid out. While encryption greatly enhances confidentiality, it adds significant overhead in zkVM environments, and thus remains an active research area.d in zkVM environments. This area is currently under active research to find efficient solutions.

## Challenges and Considerations

While the idea of trustless bug bounties is powerful, zkpoex faces several practical challenges:

**Meaningful Specifications**: Writing solid program specifications is not an easy task, as it requires a deep understanding of the expected outcomes of a smart contract. Thus, significant effort from the team is still required to properly define specifications. We are actively working on creating libraries or templates for common specifications to lower this burden.

**Performance and Scalability**: ZK proof generation can be computationally intensive, particularly for complex exploits. Optimizing performance and exploring hardware acceleration is ongoing work, alongside considering alternative zkVMs when necessary.

**Security of zkpoex itself**: Ironically, zkpoex itself could become an attack target. Bugs in the prover or verifier logic could potentially allow fake proofs of non-existent vulnerabilities. Therefore, using a highly secure zkVM is critical, as is employing a proper EVM interpreter for generating proofs.

**Handling Missing Conditions**: Handling missing conditions comes with several challenges:

- The first challenge is avoiding unnecessary claims of conditions to projects. Although this is largely mitigated today because malicious parties must create a ZKP (which is computationally expensive), we believe that future zkVM efficiency improvements could make this an issue again.  
      
    
- The second challenge is effectively enforcing project payouts. Since missing conditions were not defined in the program specification, they cannot be easily categorized, making automatic payouts impossible.  
      
    To address this, ongoing research explores solutions such as implementing a VDF-like system or partially breakable encryption of the encrypted calldata. These mechanisms could enforce the team to act if the condition reveals an actual exploit, ensuring at least a minimum payout for such cases. Determining appropriate payouts remains challenging, however, as assessing the scope of the exploit is difficult.  
      
    Another possibility includes integrating a dispute resolution system such as [Kleros](https://kleros.io/), which could help categorize vulnerabilities, enabling a fair solution between the prover and the team regarding payout.  
      
    In the worst case, enforcing a minimum payout for missing conditions could ensure that the prover is never left empty-handed.
    

## Current Status and Roadmap

zkpoex is under active development, targeting a v0.1.0 alpha release soon. Current efforts include improving usability, supporting sophisticated conditions, and simplifying specification creation through libraries. Immediate goals include integrating verifier contracts for a complete testnet demo.

The broader vision is ambitious: zkpoex as the backbone of automated, trustless bug bounty platforms. Projects could openly accept "zk-proof-of-exploit submissions," attracting more researchers due to cryptographic guarantees of payment, and discreetly addressing vulnerabilities with minimal public exposure.

Contributors skilled in Rust, Ethereum, zero-knowledge cryptography, or security research are invited to join. Version 0.1.0 will serve as an alpha release to gather community feedback, refine the framework, and move towards production readiness.

## Conclusion: Towards Enhanced Security Through ZK Collaboration

zkpoex is pushing crypto security forward by combining blockchain principles and zero-knowledge cryptography. By allowing ethical hackers to prove vulnerabilities exist without prematurely revealing exploits, zkpoex tackles existing trust issues, improving overall security.

Widespread adoption could significantly reduce crypto exploits and encourage clearer specifications, ultimately fostering a safer ecosystem. Ideally, it would also mean that projects improve their program specifications over time, which also improves the certainty of what smart contracts should do, and thus, make the ecosystem safer.

We invite smart contract developers, ethical hackers, cryptographers, and researchers to explore the [zkpoex GitHub repository](https://github.com/ziemen4/zkpoex), contribute ideas, and join the effort. Together, our goal is to build a safer crypto ecosystem. We are also actively looking for grants, if you’d like to fund this project, please feel free to reach out to us.