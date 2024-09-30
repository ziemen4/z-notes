---  
title: Frievalds' Algorithm for Probabilistic Proof of Matrix Products      
date: "2024-07-19T06:26:45.934Z"        
description: "Frievald's Algorithm for Probabilistic Proof of Matrix Products based on Reed-Solomon fingerprinting"
---
# Algorithm
- Let $A, B, C \in \mathbb{F}_p^{n\times n}$ be $n \times n$ matrices where $p > n^2$ and $p$ is prime. Frievalds' algorithm will enable us to probabilistically prove that $A\cdot B = C$ in $O(k\cdot n^2)$ time.
    - Reading a single $n \times n$ matrix is already an $O(n^2)$ operation
    - Multiplying an $n \times n$ matrix by a vector is an $O(n^2)$ operation since each entry in the output vector is a sum of $n$ terms, and there are $n$ total entries
- Pick a random element $r \in \mathbb{F}_p$ and let $x \in \mathbb{F}_p^n = (r^0,r^1,\dots,r^{n-1})$
- We can probabilistically compare the product matrix $A \cdot B$ with $C$ by multiplying both by $x$ and checking the resulting vectors for equality.
- Instead of having to calculate $A\cdot B$, which would take more than $O(n^2)$ time, we can calculate $w = Bx$ and then calculate $Aw$ which can be done in $O(n^2)$.
    - If $A \cdot B = C$ then they represent the same linear transformation so they will always map the same input vectors to the same output vector      
      $$      
      A\cdot B = C \Rightarrow \forall x \in \mathbb{F}_p^n (A\cdot Bx= Cx)      
      $$
    - If $A\cdot Bx= Cx$, it could be the case that $A \cdot B$ and $C$ are linear transformations which happen to behave in the same way for the input vector $x$. There is no guarantee that $A \cdot B = C$.
        - Division by a vector is not defined, so we can't cancel the $x$ on each side.
- Let $y = Cx$.
    - Each entry in $y$ is the Reed-Solomon fingerprint of the corresponding row of $C$, evaluated at $r$. The $i$th entry of $y$ is a linear combination of the standard monomial basis, where the coefficients are given by the entries of the $i$th row of $C$, evaluated at $r$:      
      $$      
      y = Cx =      
      \begin{bmatrix}      
      c_{1\cdot}\cdot x \\      
      c_{2\cdot}\cdot x \\      
      \vdots \\      
      c_{2\cdot}\cdot x \\      
      \end{bmatrix}      
      =      
      \begin{bmatrix}      
      \sum_{i=1}^{n} c_{1i}\cdot r^{i-1} \\      
      \sum_{i=1}^{n} c_{2i}\cdot r^{i-1} \\      
      \vdots \\      
      \sum_{i=1}^{n} c_{ni}\cdot r^{i-1} \\      
      \end{bmatrix}      
      $$
- Let $z = Dx$.
    - To compute $z$, first calculate $Bx$, which results in an $n$-dimensional vector, and then multiply it by $A$. Both steps take $O(n^2)$ time.
    - We'll represent the product of $A\cdot B$ as $D$ for convenience. Since  
      $$  
      A\cdot B = D \Rightarrow \forall x \in \mathbb{F}_p^n (A \cdot B x = Dx)  
      $$
    - The entries in $z$ are Reed-Solomon fingerprints of the corresponding rows of the product matrix $D$ evaluated at $r$      
      $$      
      z = A\cdot Bx = Dx = \begin{bmatrix}      
      d_{1\cdot}\cdot x \\      
      d_{2\cdot}\cdot x \\      
      \vdots \\      
      d_{2\cdot}\cdot x \\      
      \end{bmatrix}      
      =      
      \begin{bmatrix}      
      \sum_{i=1}^{n} d_{1i}\cdot r^{i-1} \\      
      \sum_{i=1}^{n} d_{2i}\cdot r^{i-1} \\      
      \vdots \\      
      \sum_{i=1}^{n} d_{ni}\cdot r^{i-1} \\      
      \end{bmatrix}      
      $$
- Now we have two $n$-dimensional vectors, $y$ and $z$, containing Reed-Solomon fingerprints of the rows of their corresponding matrices $A\cdot B$ and $C$ in each entry. We can probabilistically check equality of row $i$ of $A\cdot B$ and row $i$ of $C$ by checking that $y_i = z_i$.
    - If for all $i \in \{1,\dots,n\}$ $y_i=z_i$, it is likely that $D = C = A\cdot B$  
      $$  
      \exists i \in \{1,\dots,n\} y_i\neq z_i \rightarrow C \neq A\cdot B  
      $$

# Error Probability
- If $A\cdot B \neq C$, the error probability is the probability that $y= z$, causing the algorithm to output EQUAL.
- If $A\cdot B \neq C$, then there is at least one pair $(i,j) \in \{1,\dots,n\}$ such that $D_{ij} \neq C_{ij}$. Then row $D_{i\cdot} \neq C_{i\cdot}$. Since $y_i$ and $z_i$ are Reed-Solomon fingerprints of the $n$-dimensional vectors $D_{i\cdot}$ and $C_{i\cdot}$, the probability that they are the same for different vectors is bound by the vector length divided by the size of the field:  
  $$  
  \Pr_{r \in \mathbb{F}_p}[y_i = z_i] \leq (\frac{n-1}{p} \approx \frac{1}{n})  
  $$
    - Since we picked $p \gt n^2$ we can bound the error probability to $\frac{1}{n}$
- The probability that the full vectors $y$ and $z$ are equal is at least as low as the probability that they are equal at the $i$th entry, so the error probability is $\leq \frac{1}{n}$  
  $$      
  \Pr_{r\in \mathbb{F}_p}[A\cdot B \neq C \land A\cdot Bx = Cx] \leq \frac{1}{n}  
  $$
# Analysis With a Fully Random Vector
Instead of using $x \in \mathbb{F}_p^n = (r^0,r^1,\dots,r^{n-1})$, we can use a totally random vector of elements in $\mathbb{F}_p$,  $x \in \mathbb{F}_p^n = (x_1,\dots,x_n)$. In this algorithm we'll verify that $(A\cdot B)x = Cx$ by creating a new vector and checking that each of its entries is 0.  
$$  
q = (A\cdot B)x - Cx  
$$  
If  $q = (0, \dots, 0)^T$ then $(A\cdot B)x = Cx$ so the algorithm will output EQUAL. If $q \neq (0, \dots, 0)^T$, the algorithm outputs NOT-EQUAL.
# 1. If C = AB, the error probability is zero
If $C = AB$, the error probability is the probability that $q \neq (0, \dots, 0)^T$, causing the algorithm to return NOT-EQUAL. If $C = AB$, then $AB-C=0$. Then  
$q = (A\cdot B)x-Cx$  
$q= ((A\cdot B)-C) x$  
$q= 0\cdot x$  
$q = 0$, causing the algorithm to output EQUAL.  
Since $x$ was any vector in $\mathbb{F}_p^n$, we can conclude that if $C = AB$, for all $x \in  \mathbb{F}_p^n$, the algorithm outputs EQUAL, therefore the error probability is zero.
# 2. If $C \neq AB$, the error probability is $\frac{1}{|\mathbb{F}_p|}$
If $C \neq AB$, the error probability is the probability that $q = (0, \dots, 0) \in \mathbb{F}_p^n$, which causes the algorithm to output EQUAL. Let $E = AB-C$. Then $q= ((A\cdot B)-C) x = Ex$. Since $C \neq AB$, $E$ is not the zero matrix and thus $E$ has at least one nonzero entry. Let $(i,j) \in \{1,\dots,n\}^2$ be a pair such that $C_{ij}\neq (A\cdot B)_{ij}$. Then $e_{ij}\neq 0$. The $ith$ entry in $q$ is the inner product of row $i$ of $E$ and $x$:  
$$  
q_i = \sum_{k=1}^{n} e_{ik}\cdot x_k  
$$  
We can express this sum in terms of the nonzero entry of $E$, $e_{ij}$ times its corresponding entry in $x$, $x_j$ plus a constant $r$ representing the remaining terms in the sum.  
$$  
q_i = e_{ij}\cdot x_j + r  
$$  
Then $q_i = 0 \iff x_j = \frac{-r}{e_{ij}}$. Since $x_j$ is a random element of $\mathbb{F}_p$, and $\mathbb{F}_p$ contains $p$ elements  
$$  
\Pr_{x_j \in \mathbb{F}_p} [x_j = \frac{-r}{e_{ij}}] = \frac{1}{p}  
$$  
So the probability that the $i$th entry of $q$ is zero even though the $i$th row of $E$ contains a nonzero entry is  
$$  
\Pr_{x_j \in \mathbb{F}_p} [q_i = 0] = \frac{1}{p}  
$$  
and the probability that the entire vector $q$ is 0 is at least as low as the probability that the $i$th entry is 0.  
$$  
\Pr_{x_j \in \mathbb{F}_p} [q_1 = 0 \land \dots \land q_i = 0 \land \dots\land q_n = 0] \leq \Pr_{x_j \in \mathbb{F}_p} [q_i = 0] \leq \frac{1}{p}  
$$  
Therefore, if there is even one $(i,j) \in \{1,\dots,n\}^2$ such that $C_{ij} \neq (AB)_{ij}$ then the probability that the algorithm outputs NOT-EQUAL is $\gt 1 - \frac{1}{|\mathbb{F}_p|}$.