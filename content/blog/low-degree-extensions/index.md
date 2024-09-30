---  
title: Low Degree Extension Polynomials  
date: "2024-07-16T06:26:45.934Z"    
description: "Purpose of low degree extensions, interpolation and coefficient based approaches to generating extensions, and linear algebraic perspective"
---
# Low Degree Extension Polynomials
In the context of interactive proofs, and consequently arguments and ZKPs, it is often useful to represent a dataset or a function as a polynomial called its _low degree extension_. Extending a dataset and extending a function work in the same way, since we can represent any dataset as a function mapping indices to values, and any function as a dataset containing all input-output pairs.  
$$  
\text{m = "hello world" = ("h", "e", "l", "l", "o", " ", "w", "o", "r", "l", "d")} \in \mathbb{F}_p^{11} \\  
f_m : \{0,\dots,10\} \rightarrow \mathbb{F}_p \\  
$$
Given a dataset of length $n$ where each symbol in the data can be mapped to an element of a finite field $\mathbb{F}_p$, we can represent the dataset as an $n$-dimensional vector of elements in $\mathbb{F}_p$.  
$$  
a = (a_1,\dots,a_n) \in \mathbb{F}_p^n  
$$  
We can also represent the dataset with a function that maps indices $x \in \{0,\dots, n-1\}$ to the corresponding entries in the vector $a \in \mathbb{F}_p^n$.  
$$  
f_a: \{0,\dots, n-1\} \rightarrow \mathbb{F}_p  
$$  
The entries  $a_i$ for all $i \in \{0,\dots,n-1\}$ of the vector $a$, and the evaluations of the function $f_a(x)$ for all $x \in \{0,\dots,n-1\}$ are the same. The low degree extensions polynomials we define can be thought of as extending a function with a domain of size $n$ or extending an $n$-dimensional vector.

Different approaches exist for defining polynomial extensions of data and functions, but with each scheme we will see, the resulting polynomial extension is  
1. Low degree - the degree is $\leq n-1$ where $n$ is the size of the domain of the function being extended or equivalently, the length of the vector being extended  
2. Unique - the extension is the only polynomial of degree $\leq n-1$ which extends the function or vector according to the rules of the scheme
# Distance Amplification and Probabilistic Comparison of Data
Low degree extensions enable efficient probabilistic comparison of data by allowing us to compare the evaluations of two low degree extension polynomials given the same input, rather than comparing the full underlying datasets. As long as the low degree extensions are defined over a sufficiently large field, they'll be _distance amplifying_, meaning that for two datasets that are identical except at one entry, or two functions which agree on all but one point, their extensions will be different at almost all points.

Specifically, given two $n$-dimensional vectors $a\in\mathbb{F}^n_p$ and $b\in\mathbb{F}^n_p$ with low degree extensions  $p_a: \mathbb{F}_p \rightarrow \mathbb{F}_p$ and $p_b: \mathbb{F}_p \rightarrow \mathbb{F}_p$, if the vectors are the same, the extensions will be the same.  
$$  
\forall x\in \mathbb{F}_p (a = b \rightarrow p_a(x) = p_b(x))  
$$
If the vectors differ, the probability that the extensions evaluated at a random $x \in \mathbb{F}_p$ will be the same is proportional to the length of the vector divided by the size of the field over which the extensions are defined.
$$  
\Pr_{x\in \mathbb{F}_p}[p_a(x) = p_b(x) \land a \neq b] \leq \frac{n-1}{p}  
$$

Since $a$ and $b$ differ in at least one place, their extensions must be different polynomials.
$$
\exists i\in\mathbb{F}_p (a_i \neq b_i )(p_a(i)\neq p_b(i))
$$

The extensions are defined as $n-1$ or lower degree polynomials which guarantees that they intersect at no more than $n-1$ points. This is because if $p_a - p_b$ is a non-zero polynomial, it would be an $n-1$ degree polynomial with more than $n-1$ roots, contradicting the fundamental theorem of algebra.

The extension polynomials are defined over the domain $\mathbb{F}_p$ containing $p$ elements, so they will agree at no more than a $\frac{n-1}{p}$ fraction of the points in their domains. By choosing a sufficiently large field over which to define the extensions, the probability of two distinct polynomial extensions agreeing at a random point in their domains can be made very low. We can thus check the equality of the vectors $a$ and $b$ probabilistically by evaluating both of their extensions at the same random input $r \in \mathbb{F}_p$ and checking $p_a(r) = p_b(r)$.
## Coefficient Based Approach
We can construct a unique polynomial $p_a$ by interpreting each entry of the vector $a \in \mathbb{F}_p^n$, or equivalently, each evaluation of $f_a(x)$ for all $x \in \{0,\dots,n-1\}$), as a coefficient for increasing powers of $x$. The $i$th entry in the vector or $f(i)$ will thus be the coefficient of the $i$th standard monomial basis vector $\{x^0, x^1,\dots,x^{n-1}\}$, and the polynomial will be a linear combination over the standard monomial basis. The polynomial will be of degree $\leq n-1$ and is a low-degree extension of $a$. The polynomial looks like this:  
$$    
p_a(x) = a_1\cdot x^{0} + a_2\cdot x^{1} + \dots + a_n\cdot x^{n-1}    
$$  
Or as a summation:  
$$    
p_a(x) = \sum_{i=1}^{n} a_i \cdot x^{i-1}    
$$  
The polynomial $p_a$ is clearly unique to the dataset under this extension scheme since each of $a$'s $n$ entries scales one of the $n$ terms in $p_a$. The degree of the polynomial is guaranteed to be lower than the length of the encoded vector because the polynomial is a sum of monomials up to $x^{n-1}$.

## Point Evaluation Approach
Another approach to creating a unique low-degree extension of a function or dataset is to interpolate a set of point evaluations. In terms of the vector $a \in \mathbb{F}_p^n$, our interpolating polynomial, $q_a$, will pass through the points $\{(0,a_1), \dots, (n-1, a_n)\}$. In terms of the function representation of $a$,
$$
f_a: \{0, \dots, n-1\} \rightarrow \mathbb{F}_p
$$
, the interpolating polynomial will agree with $f_a$ for all inputs in its domain $x \in \{0, \dots, n-1\}$. In both cases, a set of $n$ points are being interpolated by a polynomial defined over a much larger domain, $\mathbb{F}_p$.

$$
q_a: \mathbb{F}_p \rightarrow \mathbb{F}_p
$$

Lagrange interpolation gives us a straightforward technique to construct the unique interpolating polynomial with degree $\leq n-1$. We'll apply the entries of $a \in \mathbb{F}_p^n$, or equivalently, each evaluation of $f_a(x)$ for all $x \in \{0,\dots,n-1\}$), as weights in a linear combination of _Lagrange basis polynomials_.

We defined the set of Lagrange basis polynomials for a set of nodes $\{0,\dots,n-1\}$ as the polynomials $\{L_0,\dots,L_{n-1}\}$ mapping their corresponding node to 1 and all other nodes to 0. Thus, for all $i \in \{0,\dots,n-1\}$ $L_i(i) = 1$ and for all $i,j \in \{0,\dots,n-1\}$ $L_i(j) = 0$ if $j\neq i$ .

The formula is covered in more detail [here](/2.4-univariate-lagrange), but concisely, the $i$th Lagrange basis polynomial with interpolating set $\{0,\dots,n-1\}$ can be written as  
$$  
L_i(x)= \prod_{j=0, j\neq i}^{n-1} \frac{x-j}{i-j}    
$$  
. The numerator has the effect of creating a zero at all $j \in \{0,\dots,n-1\}$ where $j\neq i$ and the denominator scales the evaluation to 1 in the case where $x=i$.

We can construct the interpolating polynomial $q_a$ by as a weighted sum of the basis polynomials. In terms of the function $f_a$ we define a low degree extension via Lagrange interpolation as agreeing with $f_a$ for all inputs $x \in \{0, \dots, n-1\}$.  
$$  
q_a(x) = \sum_{i=0}^{n-1} f_a(x) \cdot L_i(x)  
$$  
In terms of the $n$-dimensional vector $a \in \mathbb{F}_p^n$, the low degree extension maps an index $i \in \{0, \dots, n-1\}$ to the corresponding entry $a_{i+1}$.  
$$  
q_a(x) = \sum_{i=0}^{n-1} a_{i+1} \cdot L_i(x)  
$$

The Lagrange basis polynomials are each of degree $n-1$, since they're each the product of $n-1$  terms each with degree 1. The interpolating polynomial is a sum of scaled basis polynomials, so its degree is also $n-1$ or lower. Since the Lagrange interpolating polynomial $q_a$ has degree $\leq n-1$, and interpolates $n$ points, it must be unique. If there were another polynomial $q_a'$ of degree $\leq n-1$ which interpolated the same $n$ points, then $q_a - q_a'$ would be a polynomial of degree $\leq n-1$ with $n$ zeroes. Then $q_a - q_a' = 0$ and  $q_a = q_a'$.