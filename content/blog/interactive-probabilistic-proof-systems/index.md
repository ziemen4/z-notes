---
title: Interactive Probabilistic Proof Systems and Argument Systems
date: "2024-07-04T06:26:45.934Z"
description: "Interactive probabilistic proof systems (not in zero knowledge) feat. deterministic provers and argument systems"
---
# Interactive Probabilistic Proof Systems
- Goal: a prover should be able to convince a verifier that they possess a value $y$ such that for a function $f$ and a known value $x$, $y = f(x)$
- $f$ is a function mapping the $n$-dimensional hypercube to a finite set of possible outputs $R$
  $$
  f: \{0,1\}^n \rightarrow R
  $$
  - The domain $\{0,1\}^n$ refers to the set of all possible $n$-bit binary strings.  $\{0,1\}^n$ is the product set $\{0,1\} \times \{0,1\} \times \dots \times \{0,1\}$ repeated $n$ times, resulting in a set of $2^n$ $n$-length tuples.
  - By denoting the domain of the function being proven as $\{0,1\}^n$, we can easily describe runtimes in terms of input size.
- $V$ is a probabilistic verifier algorithm running in polynomial time with respect to the input size $n$.
- $P$ is a deterministic, honest, prover algorithm subject to no computational bounds. Computationally bounded provers are considered in the context of arguments.
- $x \in \{0,1\}^n$ is a common input to both $P$ and $V$
- $y \in R$ is provided by $P$ at the start of the protocol. $P$ will prove that $y = f(x)$ and does not need to conceal $y$ since the proof is not done in zero knowledge
- a $k$-message interactive proof system consists of $P$ and $V$ exchanging $k$ messages, at the end of which $V$ returns $1$ or $0$ to signal acceptance or rejection
- $P$ and $V$ are _next-message-computing algorithms_. Given the messages $(x, m_1, \dots,m_{i-1})$, $P$ or $V$ can calculate $m_i$ on their turn.
  - $V$ is probabilistic so its outputs will also depend on $V$'s internal randomness
- the transcript is the sequence of $k$ messages $(m_1, \dots, m_k)$ along with the $y$ value being proven
- $V$ computes $out(V,x,r,P) \in \{0,1\}$ based on the transcript and its own internal randomness $r$ to signal acceptance or rejection of $P$'s claim that $y = f(x)$
  - for a fixed value of $r$, $V$ becomes deterministic and $out(V,x,r,P) \in \{0,1\}$ is a deterministic function of $x$
- Soundness and completeness error describe the probability of $V$ returning an incorrect result over the random variable $r$.
  - If a proving system has completeness, a prover can convince a verifier of any true statement $y=f(x)$
  - If a proving system has soundness, a prover cannot convince a verifier of a false statement
- Completeness error - probability that $V$ rejects a correct proof from $P$ for all $x \in \{0,1\}$
  $$
  \Pr_{r}[out(V,x,r,P)=0] = \delta_c
  $$
- Soundness error - probability that for all deterministic proving strategies $P'$, $V$ accepts a proof from $P'$ that $y=f(x)$ when $y\neq f(x)$
  $$
  \Pr_{r}[out(V,x,r,P)=1] = \delta_s
  $$
- Interactive proof systems are valid if they have soundness and completeness error $\delta_c, \delta_s \leq 1/3$.
  - $1/3$ is convention, most IPs have soundness error proportional to $\delta_s = 1/|\mathbb{F}|$ where $\mathbb{F}$ is the field over which the IP is defined. Fields are chosen to be large enough to keep the soundness error small. Soundness error can always be reduced to $\delta_s^k$ by repeating the IP protocol $k$ times.
- For a $k$ message interactive proof system, the _round complexity_ is $k/2$
- When designing interactive proof systems, we prioritize runtimes of $P$ and $V$ and also consider space usage, communication bits, and round complexity.
- Perfect completeness ($\delta_c=0$) - all interactive proofs in the book satisfy perfect completeness, for a true statement $y=f(x)$ an honest prover can always convince a verifier of its truth.
  - Any IP for a function $f$ with $\delta_c$ can be made perfectly complete with a polynomial increase in verifier costs.
- _Private randomness_ means the verifier's value for $r$ is not visible to the prover. Public randomness (_public-coin_ IPs) can be combined with cryptography to convert IPs to argument systems with important properties. The Fiat-Shamir transformation is a case of this.
  - Any private coin IP can be simulated with a public coin IP with a polynomial cost increase for the verifier and a small increase in the number of rounds.
- Soundness is defined to hold against deterministic provers for convenience. If there is a probabilistic prover that convinces the verifier with probability $p$, there is also a deterministic strategy (for some fixed randomness value for the prover) convincing the verifier with probability $p$.
- Zero Knowledge is often achieved by randomizing the prover. Randomization does not affect soundness or completeness but allows the prover to prevent leaking information to the verifier.
# Argument Systems
- An argument system for a function $f$ is an interactive proof where soundness is only required to hold against polynomial bounded provers
- We can employ cryptography in argument systems to add features like non interactivity, but then we introduce the assumption that a prover doesn't have the computational power to break the cryptographic primitive.
- _Computational soundness_ means soundness against a computationally bounded prover
- Proof systems are defined to have _statistical/information theoretical_ soundness
