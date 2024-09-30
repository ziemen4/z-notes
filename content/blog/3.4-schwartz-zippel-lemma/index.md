---  
title: Schwartz-Zippel Lemma  
date: "2024-08-08T06:26:45.934Z"  
description: "The Schwartz-Zippel Lemma for multivariate polynomials and justification of distance amplification in univariate extension polynomials"
---  
# Terminology
- A polynomial is _identically zero_ if it evaluates to zero for all elements of its domain.
- The degree of a term of a multivariate polynomial is the sum of the degrees of each variable in the term.
- A polynomial is multilinear if it is linear in each of its terms when each of the other terms is held fixed, in other words, each variable has degree 1 or 0.
- The _total degree_ of the polynomial is the degree of the highest degree term.
  - For an $m$-variate multilinear polynomial, the total degree must be $\leq m$ because no variable can have degree $\gt 1$.
# Schwartz-Zippel Lemma
- Let $\mathbb{F}$ be any field and let $g: \mathbb{F}^m \rightarrow \mathbb{F}$ be a nonzero $m$-variate polynomial of total degree $\leq d$. Then on any finite set $S \subseteq \mathbb{F}$  
  $$  
  \Pr_{x \leftarrow S^m}[g(x) = 0]\leq \frac{d}{|S|}  
  $$
# For a subset $S \subseteq \mathbb{F}$
- The product set $S^m = S \times S \times S \dots$  from which $x$ is drawn contains $|S|^m$ values.
- The probability that a $g(x) = 0$ for a random vector $x \in S^m$ is $\leq \frac{d}{|S|}$, so there are at most $d \cdot |S|^{m-1}$ values of $x \in S^m$ where $g(x) = 0$.
- It follows that any two polynomials $p_a$ and $p_b$ of total degree $\leq d$ can agree on at most $\frac{d}{|S|}$ fraction of the points in $S^m$, or $d \cdot |S|^{m-1}$ values of $x \in S^m$
  - $p_a - p_b$ cannot be a polynomial with more than $d \cdot S^{m-1}$ roots
## For a Finite Field $\mathbb{F}_p$
- For an $m$-variate polynomial $g: \mathbb{F}_p^m \rightarrow \mathbb{F}_p$ of total degree $\leq d$, the probability that an $m$-dimensional vector $x \in \mathbb{F}_p$ will be a root of $g$ is $\leq d/p$.
  $$  
  \Pr_{x \in \mathbb{F}^m_p}[g(x) = 0]\leq \frac{d}{|\mathbb{F}_p|} \Rightarrow \Pr_{x \in \mathbb{F}^m_p}[g(x) = 0]\leq \frac{d}{p}  
  $$
- There are $p^m$ possible $m$-dimensional vectors in $\mathbb{F}^m_p$, so there are $\leq d\cdot p^{m-1}$ roots of $g$.
  $$  
  p^m \cdot \frac{d}{p} = d\cdot p^{m-1}  
  $$
# Univariate Case
- Reed-Solomon and univariate Lagrange interpolation for an $n$-dimensional vector both resulted in unique univariate polynomials of degree $\leq n-1$. Applying Schwartz-Zippel in the univariate case, we can verify their distance amplifying properties.
- Let $p_a$ be the unique univariate extension of degree $\leq n-1$ for a vector $a \in \mathbb{F}_p^n$ and $p_b$ be the the univariate extension of degree $\leq n-1$ for a different vector $b \in \mathbb{F}_p^n$. Then let $q = p_a=p_b$ be a degree $\leq n-1$ polynomial. By Schwartz-Zippel:
  $$  
  \Pr_{x \in \mathbb{F}^1_p}[q(x) = 0] \leq \frac{n-1}{p}  
  $$
- Thus, $p_a$ and $p_b$ have an $\frac{n-1}{p}$ probability of agreeing at any point $x \in \mathbb{F}_p$.