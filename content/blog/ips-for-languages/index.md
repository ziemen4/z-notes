---
title: Interactive Proofs for Languages Versus Functions
date: "2024-07-05T06:26:45.934Z"
description: "Formalization of interactive proofs for languages of decision problems"
---
# Formalization of Interactive Proofs for Languages
- _Decision problems_ are functions with a range of $\{0,1\}$ (a boolean output)
- The language $L$ of a decision problem $f:\{0,1\}^n \rightarrow \{0,1\}$ is the subset of the domain $L \subseteq \{0,1\}^n$ that causes $f$ to return 1
- Important findings in complexity theory describe the power of interactive proving systems in terms of languages
  - IP = PSPACE
  - MIP = NEXP
- Formalization of IPs for languages lets us describe the power of IPs in terms of complexity classes (IP=PSPACE, MIP=NEXP)
  - Completeness - for $x\in L_f$, there must be a proving strategy $P$ that the verifier accepts with high probability
  - Soundness - for $x \notin L$, for all proving strategies $P$, the verifier must reject with high probability
- In an interactive proof for the language $L = \{x : f(x) = 1\}$ of the function $f$, the verifier $V$ still interacts with $P$ and outputs $1$ or $0$ to denote acceptance or rejection of the proof
  - completeness - for any $x \in L$ there is a strategy $P$ that will cause the verifier to accept with high probability
  - Soundness - for any $x \notin L$, and every prover strategy $P'$, the verifier rejects with high probability
- Given a language $L$, let $f_L: \{0,1\}^n \rightarrow \{0,1\}$ be the corresponding decision problem. Then $x\in L \rightarrow f(x)=1$ and $x\notin L \rightarrow f(x)=0$ .
  - completeness only requires being able to prove statements where $f_L(x) = 1$, not  $f_L(x) = 0$
- Only elements of the language are provable. Each element of the language represents a true statement and we do not prove false statements - there's no proving $x \notin L$
  - Completeness and soundness properties only require proofs for true statements and nonexistence of proofs for false statements.
- An interactive proof for the function $f$ is the same as an interactive proof for the language
  $$
  L_f = \{(x,y):f(x) = y\}
  $$
- The interactive proof for the language $L_f$ still lets the prover prove $f(x) = y$, but in this case the element of the language is $(x,y)$. This way $y$ can be some value other than 1 where $f(x) = y$ is true.
# Classes of decision problems
- P - solvable by a (deterministic) turing machine in polynomial time
- NP - problems verifiable by a turing machine in polynomial time
- IP - problems probabilistically verifiable by an interactive proof system with a polynomial time verifier
  - IP can be viewed as an interactive randomized version of NP.  An NP problem is verifiable in polynomial time by a turing machine using a deterministic and non interactive verification process.
- PSPACE - solvable by a turing machine or a nondeterministic turing machine with polynomial memory. Runtime may be superpolynomial.
  - PSPACE = NPSPACE, if a nondeterministic turing machine can solve something in polynomial space, then a deterministic turing machine can also solve it with polynomial space.
  - If a nondeterministic turing machine takes $S(n)$ time, the turing machine will take $S(n)^2$ since it will run each path the NDT takes, but it will not need more space.
# Randomness and Interactivity
- IP is a larger complexity class than NP because IP uses randomness and interactivity. Any problem in PSPACE can be solved with an interactive proof system with a polynomial time verifier.
- Randomness prevents the interaction between the prover and the verifier from being predictable which would allow the prover to cheat with precomputed responses and defeat the purpose of interaction.
  - Rquiring perfect soundness ($\delta_s = 0$) is equivalent to disallowing randomness. Randomness introduces the possibility of accepting a false proof, so removing it ensures a perfectly sound system.
- Interactivity is required because the verifier must adapt its challenges based on the responses of the provers. Without interactivity, we have the Merlin-Arthur class (MA) which is thought to be equal to NP.
 