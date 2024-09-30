---  
title: Multilinear Communication Protocol for Message Comparison
date: "2024-08-21T06:26:45.934Z"    
description: "Low communication protocol for comparing messages using multilinear extensions instead of Reed-Solomon"
---  
See [ Reed-Solomon Encoding and Fingerprinting](/2.1-reed-solomon-encoding-fingerprinting/) for a univariate protocol based on Reed-Solomon encodings.
# Protocol
Alice and Bob have messages of length $n$. Bob wants to check if Alice's message is equal to his but transmitting the full messages is too expensive. This protocol uses multilinear extensions to enable message comparison in $O(log_2(n)^2)$ bits of communication.
1. Fix a prime $p$ such that $p>n^c$ where $c$ is a constant greater than 1 and $p>s$ where $s$ is the number of symbols in the character set used to write the messages.
2. Map each symbol in the messages to its corresponding element of $\mathbb{F}_p$ and represent the messages as $n$-dimensional vectors $a = (a_1,\dots,a_n) \in \mathbb{F}_p^n$ and $b = (b_1,\dots,b_n) \in \mathbb{F}_p^n$.
3. Let $g_a$ be a function mapping the binary representations of the indices $\{0,\dots,n-1\}$ to their corresponding entries in $a$. For $i \in \{0,\dots,n-1\}$ represented as binary vectors  
   $$  
   g_a(i) = a_{i+1}  
   $$
4. There are $n$ entries in $a$, so $k = \lceil log_2(n) \rceil$ bits of binary are required to encode them. Since $2^k$ may be greater than $n$, excess indices in the domain $\{0,1\}^k$ will be mapped to $0$.  
   $$  
   g_a:\{0,1\}^k\rightarrow \mathbb{F}_p  
   $$
5. To specify $g_a$, we use multivariate Lagrange interpolation. For interpolating set $\{0,1\}^k$, the Lagrange basis is the set of polynomials $\{\delta_v : v \in\{0,1\}^k\}$.
    - For $v \in \{0,1\}^k$, the $v$th Lagrange basis polynomial $\delta_v: \{0,1\}^k \rightarrow \{0,1\}$ maps all $x \in \{0,1\}^k \setminus \{v\}$ to 0 and $x = v$ to 1.  
      $$  
      \delta_v(x_1,\dots,x_k)= \prod_{i=1}^{k}x_i \cdot v_i + (1 - x_i)(1-v_i)  
      $$
6. The interpolating polynomial is  
   $$  
   g_a(x_1,\dots,x_k) = \sum_{i \in \{0,1\}^k} a_{i+1}\cdot \delta_i(x_1,\dots,x_k)  
   $$
    - $a_{i+1}$ represents the entry in vector $a$ corresponding to index $i+1$.
7. Let $\tilde{g}_a: \mathbb{F}_p^n \rightarrow \mathbb{F}_p$ be the extension of $g_a$ from the domain $\{0,1\}^k$ to the larger domain $\mathbb{F}_p^n$.
    - $\{0,1\}$ map to the additive and multiplicative identities in $\mathbb{F}_p^n$.
8. Use the same method to define a function $\tilde{g}_b: \mathbb{F}_p^n \rightarrow \mathbb{F}_p$ where $\tilde{g}_b(i) = b_{i+1}$ for  $i \in \{0,\dots,n-1\}$ represented as $k$-dimensional binary vectors.  
   $$  
   g_b(x_1,\dots,x_k) = \sum_{i \in \{0,1\}^k} b_{i+1}\cdot \delta_i(x_1,\dots,x_k)  
   $$
9. Alice evaluates $y = \tilde{g}_a(x)$ at a random vector $x \in \mathbb{F}_p^n$.
10. Alice sends $y$ and $x$ to Bob.
11. Bob evaluates $z = \tilde{g}_b(x)$ and checks that $z = y$. If they are not equal, he concludes that $a \neq b$. If they are equal, he concludes it is likely that the $a = b$.  
    $$  
    \Pr_{x \in \mathbb{F}_p^n}[\tilde{g}_a(x) = \tilde{g}_b(x)] \leq \frac{k}{p}  
    $$
# Analysis
## Error Probability
If Alice and Bob's messages are equal, $a = b$ and $\forall x\in \mathbb{F}_p^k  ( \tilde{g}_a(x) = \tilde{g}_b(x))$. Then for any vector $x\in \mathbb{F}_p^k$ picked by Alice, Bob will find that $\tilde{g}_a(x) = \tilde{g}_b(x)$ and output EQUAL, so the error probability is 0.

If Alice and Bob's messages are not equal, $a \neq b$ and the error probability is the probability that for the vector $x\in \mathbb{F}_p^k$ picked by Alice, $\tilde{g}_a(x) = \tilde{g}_b(x)$, causing Bob to output EQUAL for two non equal messages.
- See [Multilinear Lagrange Interpolation](/3.5-multilinear-lagrange-interpolation) for proof that if $a \neq b$ then $\tilde{g}_a(x) \neq \tilde{g}_b(x)$.
- Since $\tilde{g}_a(x)$ and $\tilde{g}_b(x)$ are both multilinear and $k$ variate, they both have total degree $\leq k$.
- Let $q = \tilde{g}_a - \tilde{g}_b$. Since $\tilde{g}_a(x) \neq \tilde{g}_b(x)$, $q$ is nonzero. It is also multilinear and $k$ variate since it is the difference of two multilinear $k$ variate polynomials. The [Schwartz-Zippel](/3.4-schwartz-zippel-lemma) gives us the probability that a random vector $x\in \mathbb{F}_p^k$ is a zero of $q$  
  $$    
  \Pr_{x \in \mathbb{F}^k_p}[q(x) = 0]\leq  \frac{k}{p}  
  $$
- This is the same as the probability that $\tilde{g}_a(x)$ and $\tilde{g}_b(x)$ agree at $x\in \mathbb{F}_p^k$
  $$  
  \Pr_{x \in \mathbb{F}^k_p}[\tilde{g}_a(x) = \tilde{g}_b(x)]\leq  \frac{k}{p}    
  $$
- To bound the probability of Bob determining that $a = b$ to $\frac{1}{n}$, we need it to be the case that $k/p \leq 1/n$. Since $k = log_2(n)$, picking $p >  log_2(n)\cdot n$ will achieve this goal.  
  $$  
  \frac{k}{p} = \frac{log_2(n)}{n \cdot log_2(n)} = \frac{1}{n}  
  $$
## Communication Bits
- Alice must send bob $x\in \mathbb{F}_p^k$ and $\tilde{g}_a(x)$ which is an element of $\mathbb{F}_p$, so she sends $k+1$ field elements.
- There's $p$ elements in the field, so we need $\lceil log_2(p) \rceil$ bits to represent a field element.
    - Suppose we've selected $p = n^c$ where $c$ is a constant and $c \gt1$.
    - Then it is still the case that $p > log_2(n)\cdot n$, bounding the error probability below $\frac{1}{n}$
    - The number of bits required to transmit a field element is then $\lceil c \cdot log_2(n) \rceil$.
-  Since $k = \lceil log_2(n) \rceil$, we can compute the number of bits to transmit $k+1$ field elements:  
   $(k + 1)(\lceil c \cdot log_2(n) \rceil)$  
   $= (\lceil log_2(n) \rceil + 1)(\lceil c \cdot log_2(n) \rceil)$  
   $=\lceil log_2(n) \rceil \cdot \lceil c \cdot log_2(n) \rceil + \lceil c \cdot log_2(n) \rceil$
- Dropping the insignificant terms, we have $log_2(n)\cdot log_2(n)$. Thus, the communication cost in big O is $O(log_2(n)^2)$.