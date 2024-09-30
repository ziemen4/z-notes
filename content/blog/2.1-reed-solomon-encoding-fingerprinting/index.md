---  
title: Reed-Solomon Encoding and Fingerprinting  
date: "2024-07-01T06:26:45.934Z"  
description: "Reed-Solomon Encoding and Fingerprinting for efficient probabilistic comparison of data, distance amplification via error correcting codes"
---  
# Motivation
## Error Correcting Codes
- Error correcting codes are a way of extending a message into a codeword so that if it is altered in transmission, errors introduced into the message can be easily detected and corrected. For the purposes of interactive proofs, we're only interested in using these codes to efficiently compare data, not for error correction, but we still often hear them referred to as error correcting codes.
- Error correcting codes are _distance amplifying_, making them valuable for proof systems. Distance amplification means that if a message is altered in even a small way, the resulting codeword for the message will be almost completely different. This allows us to efficiently compare long messages by comparing a few random symbols in the codewords. The full codeword for a message is much longer than the original message, but comparing a symbol is much faster than comparing the full message.
- Reed-Solomon encoding is done by treating each character in a message as a coefficient in a polynomial. The polynomial is evaluated for a set of many inputs to generate the code. We also call these codes extension codes, and we refer to the polynomial as a unique low degree extension of a message.
- There are different approaches to obtaining low degree extensions of data, but each will determine a unique polynomial which will have degree at most $n-1$. Reed-Solomon and Lagrange interpolation are two approaches to obtaining unique low degree extension polynomials which can be used to create distance amplifying extension codes for efficient probabilistic comparison of the underlying data.
## Random Sampling and Probabilistic Error
- Proof systems use randomness to improve efficiency at the expense of introducing a small probabilistic error. In the case of message comparison via error correcting codes, the tradeoff is the same. We can evaluate a few entries in the low degree extension encoding of two messages, and if they are the same it is extremely likely that the messages are the same.
- The probability of the unique low degree extension polynomials $P_a$ and $P_b$ for two different messages $a$ and $b$ producing the same output for a random value $r$ is very low, so messages can be probabilistically compared by selecting a random $r$ and checking whether $P_a(r)=P_b(r)$.
- The entries are much shorter than the messages, so comparing $P_a(r)$ and $P_b(r)$ is much more efficient than comparing the full messages.
# Reed-Solomon Encodings
To obtain the Reed-Solomon encoding of an $n$-length message $m$, we define a finite field with order $p >>n$ and $p>k$ where $k$ is the number of distinct symbols in the character set of $m$. Working over the field, we obtain the low degree extension of $m = (m_1, \dots,m_n)$ by using the entries of $(m_1, \dots,m_n)$ as the weights in a linear combination of polynomials in the standard monomial basis $\{x^0,x^1,\dots,x^{n-1}\}$.   
**Low Degree Extension of $m$:**
$$   
P_m(x) = \sum^{n}_{i=1}m_i*x^{i-1}  
$$  
By evaluating $P_m(x)$ at all $x \in \mathbb{F}_p$, we obtain a $p$-dimensional vector which is the low degree extension encoding of $m$.  
**Low Degree Extension Encoding of $m$:**
$$  
c = (P_m(0), \dots, P_m(p-1))  
$$
# Reed-Solomon Algorithm
- Given a message $m$ of length $n$ where each character $m_i$ has up to $k$ possible symbol values, chose a prime number $p$ such that $p\geq n^2$ and $p\geq k$.
- Selecting $p \geq n^2$ limits the probability that two different messages will have equal entries at a random index to $1/n$ (as we will see later).
- Selecting $p \geq k$, ensures that every possible symbol will have a unique representation in the field $\mathbb{F}_p$.
- We interpret the message $m$ as an $n$-dimensional vector such that  $m = (m_1, \ldots, m_{n}) \in \mathbb{F}_p^n$.
- Let $\mathbb{F}_p$ be the finite field of integers modulo $p$ and let $P_m(x)$ be the following polynomial of degree $\leq n-1$ over $\mathbb{F}_p$.   
  $$  
  P_m(x) = \sum_{i=1}^{n} m_i \cdot x^{i-1}  
  $$
- Expanded, this looks like:   
  $$  
  P_m(x) = m_1\cdot x^{0} + m_2\cdot x^{1} + \dots + m_n\cdot x^{n-1}  
  $$
- The full Reed-Solomon encoding is a $p$-dimensional vector of the evaluations $P(i)$ for all $i \in \mathbb{F}_p$ such that the $i$th entry in the encoding is $P(i)$.   
  $$   
  C = (P(0), P(1),\dots,P(p-1))  
  $$
## Example
- Consider the scenario where two long messages $a$ and $b$ on separate machines need to be checked for equality. Transmitting the full messages is prohibitively expensive, but fingerprinting and random sampling can be used to allow one message holder, Alice, to inexpensively verify that she has the same message as the other, Bob.
    1. Alice and Bob agree on a prime field $\mathbb{F}_p$ such that $p \geq n^2$ and $p \geq k$ where $n$ is the length of the messages (if their lengths are not equal the messages are clearly not equal) and $k$ is the number of possible values for each symbol in the messages.
    2. Alice interprets the message $a$ as an $n$-dimensional vector of elements of $\mathbb{F}_p$, so $a = (a_1, a_2, \dots,a_n) \in \mathbb{F}_p^n$.
    3. Alice uses the vector as the coefficients of a polynomial $P_a(x)$.   
       $$  
       P_a(x) = \sum_{i=1}^{n} a_i \cdot x^{i-1}  
       $$  
       $$  
       P_a(x) = a_1\cdot x^{0} + a_2\cdot x^{1} + \dots + a_n\cdot x^{n-1}  
       $$
    4. Bob performs the same procedure for his message $b$, resulting in a polynomial $P_b(x)$.  
       $$  
       P_b(x) = \sum_{i=1}^{n} b_i \cdot x^{i-1}  
       $$   
       $$  
       P_b(x) = b_1\cdot x^{0} + b_2\cdot x^{1} + \dots + b_n\cdot x^{n-1}  
       $$
    5. Alice selects a random element $r$ such that $r \in \mathbb{F}_p$.
    6. Alice generates the value $v := {P_a(r)}$ and sends $r,v$ to Bob.
    7. Bob checks if $P_b(r) = v$ .
    8. If they are not equal, Bob can conclude $a \neq b$. Otherwise, Bob can conclude that $a$ and $b$ are probably equal, or $Pr[a \neq b] \leq \frac{1}{n}$.
    9. They can repeat this random sampling procedure as many times as they'd like to increase the probability that the messages are equal. For $k$ repetitions, the probability that the messages differ becomes $\leq \frac{1}{n^k}$.
# Different Polynomials are Different Almost Everywhere
- Polynomials are especially useful as representations of data because two different polynomials are different at almost all points. In the case of Alice and Bob, that means that if $P_a$ and $P_b$ are non equal polynomials, then for almost all $r \in \mathbb{F}_p$,  $P_a(r) \neq P_b(r)$. As a result, we can easily compare polynomials probabilistically.
- Two distinct polynomials $P_a$ and $P_b$ of degree $\leq n$ will intersect at $n$ or fewer points because $P_a - P_b$ is an $n$ or lower degree polynomial with roots at each point where $P_a$ and $P_b$ intersect (where $P_a(x) = P_b(x)$). If $P_a$ and $P_b$ intersect at more than $n$ points, $P_a - P_b$ is an $n$ or lower degree polynomial with more than $n$ roots which would violate the fundamental theorem of algebra.
# Probabilistic Error
- The extension code discussed previously is far larger than the message vector. In this case, since $p \geq n^2$, the length of the code is at least the length of the message squared. While the codes are guaranteed to be different for two different messages, comparing them instead of the messages would certainly not save us any processing or communication. Random sampling allows us to gain confidence that two messages are the same with the transmission of just two group elements.
- We've seen that two distinct $n$ or lower degree polynomials can intersect at no more than $n$ points, and this fact allows us to bound the probability of a random element $r \in \mathbb{F}_p$ resulting in the same evaluation for distinct polynomials $P_a$ and $P_b$.
- Since $P_a$ and $P_b$ are $n-1$ or lower degree polynomials, there can be up to $n-1$ values for which $P_a(x) = P_b(x)$. There are $p$ total elements in the field, so the full encodings differ at at most $(n-1)$ out of $p$ coordinates.
- With the random fingerprinting, the probability of two differing messages producing the same evaluation is $(n-1)/p$ or lower.
- We've intentionally selected $p$ such that $p \geq n^2$  to further bound this probability, so we can conclude that the probability of an error is below $(n-1)/n^2 \approx 1/n$ for each fingerprinting exchange.
- The order of the field  $\mathbb{F}_p$ determines the probability that two distinct messages will have the same polynomial evaluations at a single element.
# Efficiency
- Recall that a string of $b$ bits can represent up to $2^b$ distinct values (0 to $2^b-1$). Since the character sets for our messages have $k$ possible values, we must find $b$ such that $2^b \geq k$. That means $log_2(k)$ bits are required for each character. Since the number of bits must be an integer, we'd really use the ceiling of this value,  $\lceil log_2(k)\rceil$.
- The cost to transmit a message of length $n$ with $k$ possible character values is $O(n\cdot log_2(k))$.
- In the fingerprinting protocol, we only need to transmit two values: the random field element $r$, and the polynomial evaluation $P_m(r)$. The cost is $O(log_2(p))$ since there are $p$ possible field elements. Assuming we choose $p$ to be polynomially related to $n$ ($p = n^c$ where $c$ is a constant rather than $p = n^n$ ), we can simplify the cost to $O(log_2(n^c)) = O(c\cdot log_2(n))$. Dropping the constant, we have reduced the communication cost of comparing message $m$ from $O(n\cdot log_2(k))$ to $O(log_2(n))$.