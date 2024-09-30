---  
title: Unique Multilinear Extensions of Polynomials over the V-Dimensional Hypercube
date: "2024-07-07T06:26:45.934Z"  
description: "Distance amplifying extensions of multivariate polynomials, comparison of v-dimensional hypercube and univariate domains"
---  
# Univariate vs Multivariate Extensions
### Univariate Low-Degree Extension
- Given a vector $m = (m_1,\dots,m_n) \in \mathbb{F}_p^n$, define a set of coordinate pairs $((0,m_1)),\dots,(n-1,m_n))$ specifying the function $f: \{0,\dots,n-1\} \rightarrow \mathbb{F}_p$.
- Interpolate the coordinate pairs with a polynomial $q_m: \mathbb{F}_p \rightarrow \mathbb{F}_p$ such that $q_m(i) = m_{i+1}$ for all $i \in \{0,\dots,n-1\}$ by applying each value as a weight in a linear combination of Lagrange basis polynomials $\{L_0,\dots,L_{n-1}\}$ for the nodes $\{0,\dots,n-1\}$
  $$
  P_q(x)=\sum^{n-1}_{i=0} m_{i+1} \cdot L_{i}(x)
  $$
  $$  
  L_i(x)= \prod_{j=0, j\neq i}^{n-1} \frac{x-x_j}{x_i-x_j}  
  $$
- The univariate low degree extension of $f$ is $q_m$. It is the unique degree $\leq n-1$ polynomial that agrees with $f$ at all $x \in \{0,\dots,n-1\}$ - there can be no other degree $\leq n-1$ polynomial passing through the interpolated points.
- The $p$-dimensional vector
$$
c = (q_m(0), \dots, q_m(p))
$$ 
is the low degree extension encoding of $m$.
- $f: \{0,\dots,n-1\} \rightarrow \mathbb{F}_p$ and $q_m: \mathbb{F}_p \rightarrow \mathbb{F}_p$ are both univariate functions.
# Multivariate Functions Over the $v$-Dimensional Hypercube
- We can extend the concept of extensions to multivariate functions. Let
  $$
  f: \{0,1\}^v \rightarrow \mathbb{F}
  $$
  - The domain of $f$ is the $v$-dimensional hypercube, or the set of all $v$-bit binary strings - $f$ accepts $v$ variables $(x_1,\dots,x_v)$ such that $x_i\in \{0,1\}$.
- There are $2^v$ possible values that can be represented by the domain of a $v$-variate polynomial where each variable $x_i\in\{0,1\}$.
  - The domain of the $v$-dimensional hypercube is $\{0,1\}^v = \{0,\dots,2^v-1\}$.
  - For a univariate polynomial with domain size $n$, a polynomial over the $v$-dimensional hypercube will have the same domain size if  $v = log_2(n)$.
    - $|\{0,1\}^{log_2(n)}| = |\{0,\dots,n-1\}|$
- We have observed that there is a unique extension of degree $\leq n-1$ for univariate functions defined over the domain $\{0,\dots,n-1\}$. Similarly, there is a unique extension of total degree $\leq 1$ for multivariate functions defined over the domain  $\{0,1\}^v$.
  - A polynomial is multilinear if it is linear in each of its variables when all other variables are held fixed. In other words, each variable in the polynomial has a degree of at most 1.
- A multivariate function $f: \{0,1\}^v \rightarrow \mathbb{F}_p$ over the domain $\{0,1\}^v$ has a unique multilinear extension $\tilde{f}: \mathbb{F}^v \rightarrow \mathbb{F}$, such that
  $$
  \forall x\in\{0,1\}^v (\tilde{f}(x) = f(x))
  $$
- $\tilde{f}$ is $v$-variate and multilinear, so the total degree of $\tilde{f}$ is $\leq v$
  - The univariate extension of a polynomial with domain size $n$ has degree $\leq n-1$, so the degree is linear in terms of the domain size $(O(n))$
  - The multilinear extension of a polynomial with domain size $n = 2^v$ has total degree $\leq v$, so the total degree is logarithmic in terms of the domain size $O(v) = O(log_2(2^v)) = O(log_2(n))$
- Multilinear and ultra low total degree multivariate polynomials are especially useful for fast verification of interactive proofs
# Distance Amplifying Encodings
- Given two functions $f: \{0,1\}^v \rightarrow \mathbb{F_p}$ and $f': \{0,1\}^v \rightarrow \mathbb{F_p}$ with unique multilinear extensions $\tilde{f}: \mathbb{F}_p^v \rightarrow \mathbb{F}_p$ and $\tilde{f}': \mathbb{F}_p^v \rightarrow \mathbb{F}_p$, if $f$ and $f'$ disagree at even one point, their extensions $\tilde{f}$ and $\tilde{f}'$ are distinct polynomials and will agree at $\leq \frac{v}{p}$ of the $p^v$ points in $\mathbb{F}_p^v$, or $\leq p^{v-1}$ points.
  $$
  \frac{v}{p} \cdot p^v = v \cdot p^{v-1}
  $$
- $P = \tilde{f} - \tilde{f}'$ is a $v$-variate polynomial with total degree $\leq v$ with zeroes at each point where $\tilde{f}$ and  $\tilde{f}'$ agree. By Schwartz-Zippel, a $v$-variate polynomial of total degree $\leq v$ has roots at $\leq v/p$ out of the $p^v$ possible values $x \in \mathbb{F}^v_p$
  $$  
  \Pr_{x \in \mathbb{F}^v_p}[P(x) = 0]\leq \frac{v}{|\mathbb{F}_p|}  
  $$
- So $P$ has less than $\frac{v}{p} \cdot p^v = v \cdot p^{v-1}$ roots and $\tilde{f} - \tilde{f}'$ agree at $\leq v \cdot p^{v-1}$ values of  $x \in \mathbb{F}^v_p$
- Evaluating the multilinear extension $\tilde{f}(x)$ for all $x\in \mathbb{F}_p$ gives us a distance amplifying encoding of $f$. Since $\tilde{f}$ and a different polynomial $\tilde{f}'$ can agree on at most a $v/p$ fraction of points, they are distance amplifying as long as the field is chosen such that $p>v$.