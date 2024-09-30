---  
title: 2.2 Notes - Reed-Solomon Encoding and Fingerprinting    
date: "2024-07-06T06:26:45.934Z"    
description: "Reed-Solomon Encoding and Fingerprinting notes, randomness to improve efficiency"
---  
# Randomness Can Improve Efficiency
- Given two $n$-dimensional vectors $a$ and $b$, deterministic comparison of the vectors will always require communicating all $n$ characters and have perfect soundness.
    - That's $O(n)$ communication cost before factoring in the size of the character set.
- Probabilistic comparison can be done with constant communication at the expense of a soundness error that is proportional to the size of the field over which the low degree extensions of the vectors are defined.
- Probabilistic comparison of the vectors can be done by creating unique low degree extension polynomials of the vectors over the domain  $\mathbb{F}_p$ and comparing evaluations of the unique low degree extensions $p_a(r)$ and $p_b(r)$ for some random $r\in \mathbb{F}_p$
    - Pick $p >> n$ and $p>k$ where $k$ is the size of the character set for $a$ and $b$ .
    - The low degree extensions will have degree $\leq n-1$.
    - Two field elements are transmitted, $r$ and $p_a(r)$, resulting in constant communication.
    - The soundness error (probability that the evaluations will be the same for different vectors) is
      $$  
      \Pr_{r\in\mathbb{F}_p}[p_a(r) = p_b(r)] \leq \frac{n-1}{p}  
      $$
- The trivial comparison requires transmitting all $n$ characters, each with $k$ possible values. Each character requires $log_2(k)$ bits to represent, so the communication cost would be $O(n \cdot log_2(k))$.
- In the probabilistic approach two field elements are transmitted. The field has order $p$, so there are $p$ possible values requiring $log_2(p)$ bits each to represent. If the order of the field is a constant power of $n$, then $p = n^c$ and the communication cost is $2 \cdot log_2(n^c) = 2c \cdot log_2(n) = O(log_2(n))$.
- We pick $p$ such that  $p>k$ and $p >>n$. It is likely that $n$ is the term that decides how large $p$ should be, but if the messages were very short but each character had a high number of possible values, the field could be defined to the be the same size as $k$. Then we would have $2 \cdot log_2(k)$ bits being transmitted and a communication cost of $O(log_2(k))$.
# Low Degree Extensions and Fingerprints
- Pick a prime number $p$ such that $p > n^2$ where $n$ is the length of the message being encoded and $p>k$ where $k$ is the size of the character set for the message.
- Interpret each entry in the message $m = (m_1,\dots,m_n)$ as an element in $\mathbb{F}_p$.
- The unique low degree extension of an $n$-length message $m$ is a polynomial of degree $n-1$ or lower
  $$  
  p_m(x):= \sum_{i=1}^{n} m_{i} \cdot x^{i-1}  
  $$
- Each evaluation of the low degree extension at a field element can be thought of as a hash or fingerprint. For each element $r\in \mathbb{F}_p$, there is a hash function $h_r$ representing evaluation of the extension at the element $r$.  
  $$  
  h_r(m_1,\dots,m_n) := \sum_{i=1}^{n} m_i \cdot r^{i-1}
  $$
- The family of hash functions $H$ is the set of all hash functions for all elements in $\mathbb{F}_p$  
  $$  
  H = \{h_r :r\in \mathbb{F}_p\}  
  $$
- The hash function $h_r$ for $r\in \mathbb{F}_p$ applied to the message $m$ is the low degree extension $p_m$  evaluated at $r$
  $$
  h_r(m_1,\dots,m_n) = p_m(r)
  $$
- Rather than comparing $n$-length messages $a$ and $b$ directly, we can compare their hashes $h_r(a) = h_r(b)$, or equivalently, we can compare the evaluations of their low degree extensions $p_a(r) = p_b(r)$ for $r\in \mathbb{F}_p$  
  $$  
  \Pr_{r\in \mathbb{F}_p} [h_r(a) = h_r(b)] = \Pr_{r\in \mathbb{F}_p} [p_a(r) = p_b(r)] \leq \frac{n-1}{p}  
  $$
# Message Comparison
- Given two $n$-length messages $a$ and $b$, if the messages are identical, their hashes $h_r(a)$ and $h_r(b)$ will be the same for all $r \in \mathbb{F}_p$ because their low degree extension polynomials will be the same. If $a = b$ then $\forall i \in \{1,\dots,n\} (a_i = b_i)$.  
  $$  
  h_r(a) = p_a(r)= \sum_{i=1}^{n} a_{i} \cdot r^{i-1} =  \sum_{i=1}^{n} b_{i} \cdot r^{i-1} = p_b(r) = h_r(b)  
  $$
- If the messages differ, their hashes will differ with high probability over $r \leftarrow \mathbb{F}_p$.
    - The extension polynomials $p_a(x) = \sum_{i=1}^{n} a_{i} \cdot x^{i-1}$  and $p_b(x) = \sum_{i=1}^{n} b_{i} \cdot x^{i-1}$ will have degree $n-1$ by definition, so if they are different polynomials they will intersect at no more than $n-1$ points.
    - Two distinct polynomials $p_a$ and $p_b$ of degree $\leq n-1$ will intersect at $n-1$ or fewer points because $p_a - p_b$ is an $n-1$ or lower degree polynomial with roots at each point where $p_a$ and $p_b$ intersect. If $p_a$ and $p_b$ intersect at more than $n$ points, $p_a - p_b$ is an $n-1$ or lower degree polynomial with more than $n-1$ roots which would violate the fundamental theorem of algebra.
    - There are $p$ points in $\mathbb{F}_p$, so there is an $\frac{n-1}{p}$ chance of agreement at a random point  
      $$  
      \Pr_{r\in\mathbb{F}_p}[p_a(r) = p_b(r)] \leq \frac{n-1}{p}  
      $$
# Discussion
- The vector $(a_1,\dots,a_n)$ has an error corrected encoding ($p_a(1),\dots,p_a(p))$, and $p_a(r)$ for $r\in \mathbb{F}_p$ is a random entry in the encoding.
    - Alternatively, the set of all evaluations $(h_1(a),\dots,h_p(a))$ is the error corrected encoding of $a$
- There are other encoding protocols, all that is required is a family of hashes $H$ such that for $a\neq b$, $\Pr_{h\in H}[h(a)=h(b)]$ is low
- The algebraic structure of Reed-Solomon fingerprinting makes it useful for probabilistic proofs.

# Implementation
```ts
/**
 * Evaluates a low degree extension polynomial derived from the Reed Solomon encoding of an ASCII message at a given field element `r`.
 *
 * This function interprets the given ASCII message as coefficients of a polynomial over the finite field F.
 * It constructs the polynomial as a linear transformation over the standard monomial basis:
 *   P(x) = c₀ + c₁·x + c₂·x² + ... + cₙ₋₁·xⁿ⁻¹
 * where each coefficient cᵢ is the field representation of the ASCII code of the i-th character of message.
 *
 * @param message - The ASCII string message to encode.
 * @param r - The field element at which to evaluate the polynomial.
 * @returns The field element P(r), the evaluation of the polynomial at r.
 * @throws Error if the message is empty.
 */
function getReedSolomon(message: string, r: Field): Field {
  if (message.length === 0) {
    throw new Error("Message cannot be empty.");
  }

  // Accumulator for summation  
  let result = Field(0);

  // Current power of the field element `r` (r⁰=1 initially)  
  let currentPower = Field(1);

  // Sum over each character in the message to construct and evaluate the polynomial  
  for (let i = 0; i < message.length; i++) {
    // Convert the ASCII character to its numeric representation  
    const coefficient = Field(asciiToNumber(message[i]));

    // Add the current term (coefficient * r^i) to the result  
    result = result.add(coefficient.mul(currentPower));

    // Update the current power of `r` for the next term (r^(i+1))  
    currentPower = currentPower.mul(r);
  }

  return result;
}

/**
 * Converts an ASCII character to its numeric ASCII code. * * @param char - The ASCII character to convert.
 * @returns The numeric ASCII code of the character.
 * @throws Error if the character is not a valid ASCII character (code between 0 and 127).
 */
export function asciiToNumber(char: string): number {
  const num = char.charCodeAt(0);
  if (num < 0 || num > 127) {
    throw new Error("Input must be a valid ASCII character (0-127).");
  }
  return num;
}
```