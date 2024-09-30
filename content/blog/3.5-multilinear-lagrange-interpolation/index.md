---  
title: Multilinear Lagrange Interpolation
date: "2024-07-09T06:26:45.934Z"  
description: "Multilinear Lagrange interpolation and uniqueness of multilinear extensions of functions over the v-dimensional hypercube"
---  
- We can perform Lagrange interpolation of a multivariable function over a set of multilinear Lagrange basis polynomials to obtain the unique multilinear extension of $f: \{0,1\}^v \rightarrow \mathbb{F}$ .
  - Recall that univariate Lagrange interpolation extended a function $f: \{0,\dots,n-1\} \rightarrow \mathbb{F}$ with a linear combination of Lagrange basis polynomials defined over the nodes $x \in \{0,\dots,n-1\}$
  - Multilinear Lagrange interpolation will extend a function $f: \{0,1\}^v \rightarrow \mathbb{F}$  with a linear combination of Lagrange basis polynomials defined over the nodes, or interpolating set,  $w \in \{0,1\}^v$
- The unique multilinear extension $\tilde{f}: \mathbb{F}^v \rightarrow \mathbb{F}$ of a polynomial $f: \{0,1\}^v \rightarrow \mathbb{F}$ such that $\tilde{f}$ and $f$ agree at all $v$-bit binary inputs $x = (x_1,\dots,x_v)\in \{0,1\}^v$ is
  $$
  \tilde{f}(x_1,\dots,x_v) = \sum_{w\in \{0,1\}^v} f(w)\cdot L_w(x_1,\dots,x_v)
  $$
- $L_w$ is the Lagrange basis polynomial for the vector $w = (w_1,\dots,w_n)\in \{0,1\}^v$ such that for all $w \in \{0,1\}^v$  $L_w(w) = 1$ and $L_w(u)= 0$ if $u \in \{0,1\}^v \land u\neq w$
  $$
  L_w(x_1,\dots,x_v) := \prod^{v}_{i=1} w_i\cdot x_i + (1-w_i)(i-x_i)
  $$
-  The Lagrange basis polynomial $L_w$ will evaluate to 0 if $\exists i \in \{1,\dots,v\} (x_i \neq w_i)$
  - If $x_i,w_i \in \{0,1\} \land x_i\neq w_i$ then $w_i\cdot x_i + (1-w_i)(i-x_i) = 0$
  - If the $i$th term in the product is 0, the entire product is 0
- The set of all $\{L_w : w\in \{0,1\}^v\}$ is the set of multilinear Lagrange basis polynomials with interpolating set $\{0,1\}^v$.

# Unique Multilinear Extensions of Functions over $\{0,1\}^v$
- The polynomial extension $\tilde{f}$ is unique, multilinear, and agrees with $f$ at all $v$-length binary inputs
- The extension $\tilde{f}$ is multilinear because $\tilde{f}$ is a linear combination of multilinear Lagrange basis polynomials
  - $L_w$ will have degree 1 in each term $x_i$ for $i \in \{1,\dots,v\}$
    $$
    L_w(x_1,\dots,x_v) := \prod^{v}_{i=1} w_i\cdot x_i + (1-w_i)(i-x_i)
    $$
  - $\tilde{f}$ is a sum of multilinear basis polynomials scaled by field elements $f(w) \in \mathbb{F}$
    $$
    \tilde{f}(x_1,\dots,x_v) = \sum_{w\in \{0,1\}^v} f(w)\cdot L_w(x_1,\dots,x_v)
    $$
- The interpolating polynomial $\tilde{f}$ agrees with $f$ at at all $x \in \{0,1\}^v$.
  - For all $x \in \{0,1\}^v$ where $x \neq w$, the basis polynomial $L_w(x)$ evaluates to $0$.
  - For all $x \in \{0,1\}$ each basis polynomial $L_w$ is scaled by $f(x)$, so $\tilde{f}(x) = f(x)$
# Uniqueness of $\tilde{f}$
- $\tilde{f}$ is unique - there is no other multilinear function $\tilde{f}': \mathbb{F}^v \rightarrow \mathbb{F}$ that agrees with $f$ at all $x \in \{0,1\}^v$
- The function $f: \{0,1\}^v \rightarrow \mathbb{F}$ has many extensions, but only one of them is multilinear. This is a trait that is unique to functions over the $v$-dimensional hypercube.
- Proof:
  - Suppose $p$ is the multilinear extension of a function $f: \{0,1\}^v \rightarrow \mathbb{F}$, so  for all $x \in \{0,1\}^v$ $p(x) = f(x)$.
  - Now suppose $q$ is a multilinear polynomial such that $p(x) = q(x)$ for all $x \in \{0,1\}^v$.
  - Let $h := p-q$. Then $h$ is also multilinear and $h$ evaluates to 0 at all inputs $x \in \{0,1\}^v$.
  - If $h$ is the identically zero polynomial, then $p = q$.
  - Assume for proof by contradiction that $h$ is not the identically zero polynomial.
  - Then let $t$ be the term of lowest degree in $h$. Let $z \in \{0,1\}^v$ be the input to $h$ which causes all variables in $t$ to be 1 and all other variables to be 0.
  - Since $h$ is multilinear and $t$ is the lowest degree term, all of the other terms in $h$ will contain some variable that is not in $t$, so they will all be zero at $h(z)$.
  - Then $h(z)$ is the term $t$ with all variables set to 1 so $h(z) \neq 0$.
  - $z \in \{0,1\}^v$ and $h(z) \neq 0$ which contradicts the fact that $h$ evaluates to 0 at all inputs $x \in \{0,1\}^v$.
  - Therefore, $h$ is the identically zero polynomial and $q = p$
	  
		