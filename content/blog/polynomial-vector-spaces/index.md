---  
title: Polynomial Vector Spaces
date: "2024-07-17T06:26:45.934Z"  
description: "Generalization of vector spaces to polynomials and applications in low degree extensions"
---

## Geometric Representations of Vector Spaces
From linear algebra, we have the concept of a vector space, which roughly describes a set of elements over which addition and scalar multiplication are defined. We often see these represented geometrically as arrows in space where each vector is defined by the coordinates of its endpoint.

Vector addition then refers to the addition of the coordinates of two vectors, and scalar multiplication refers to multiplying the coordinates by a scalar value. The addition and scalar multiplication operations are closed over the space, meaning that adding or scaling a vector in a vector space will always produce a vector in the same space. A linear combination of vectors means an expression constructed by adding and scaling vectors.

A vector space is spanned by a set of basis vectors, meaning that any vector in the space can be written as a linear combination of its basis vectors. The basis vectors must be linearly independent as well, meaning that they can't be expressed as linear combinations of each other. We can also have multiple sets of basis vectors which span the same space as long as each vector in the set is linearly independent of the other vectors in the set.

For example, the vector space $\mathbb{R}^2$ (the 2 dimensional cartesian plane) is spanned by the basis vectors $\hat{i}=(1,0)$ and $\hat{j}=(0,1)$, because any point $p \in \mathbb{R}^2$ can be written as a linear combination of those two vectors, and no amount of adding or scaling will transform $(1,0)$ into $(0,1)$ or vice-versa.  
$$  
p = (2,3) = 2\cdot \hat{i} + 3\cdot \hat{j} = (3,0)+(0,2)=(2,3)  
$$  
The space $\mathbb{R}^2$ is also spanned by the vectors $a=(2,0)$ and $b=(0,2)$.  
$$  
p = (2,3) = 1\cdot a + 1.5\cdot b = (2,0)+(0,3)=(2,3)  
$$

## Generalization to Polynomial Bases
Vectors are easy to understand geometrically as coordinates, but there are other mathematical objects that satisfy the properties of a vector space, such as polynomials.

The set of polynomials of degree $d$ or lower also form a vector space. Vector addition is closed because adding two polynomials of degree $\leq d$ will result in another polynomial with degree $\leq d$. Scalar multiplication is also closed because scaling a polynomial of degree $\leq d$ by a constant will result in another polynomial with degree $\leq d$.

There any many bases for the space of polynomials of degree $\leq d$, the most obvious being the standard monomial basis $\{x^0,\dots,x^{d}\}$. Each polynomial in the basis is linearly independent - there's no way to express $x^{i+1}$ in terms of additions of $x^i$ or by multiplying $x^i$ by a scalar. The entire space of polynomials of degree $\leq d$  is spanned by the standard monomial basis because any polynomial of degree $\leq d$ can be written by adding and scaling elements of $\{x^0,\dots,x^{d}\}$.

Another basis for the set of polynomials of degree $\leq d$ is the _Lagrange basis_. We use it often in the context of interactive proofs, and similar to the standard monomial basis for the space of polynomials of degree $\leq d$, the Lagrange basis consists of a set of $d$ linearly independent polynomials. The Lagrange basis is defined in terms of the $x$ values (called nodes) in a set of points, so there are many Lagrange bases for the same polynomial space. The formula to obtain the Lagrange basis for polynomials of degree $\leq d$ for a given set of $d$ nodes is described in detail [here](/2.4-univariate-lagrange).
## Low Degree Extensions as Linear Combinations of Basis Polynomials
Both the coefficient based approach and the point interpolation approach to [low degree extensions](/low-degree-extensions) result in a linear combination over some polynomial basis where the weights are the entries of the vector being extended. We work over the standard monomial basis $\{x^0,\dots,x^{n-1}\}$ in the coefficient based approach, and the Lagrange basis $\{L_0,\dots,L_{n-1}\}$ in the point interpolation approach.  
$$      
p_a(x) = \sum_{i=1}^{n} a_i \cdot x^{i-1}      
$$  
$$      
q_a(x) = \sum_{i=1}^{n} a_i \cdot L_{i-1}(x)      
$$  
In both cases, the basis spans the set of polynomials of degree $\leq n-1$. The spaces are $n$-dimensional, with each dimension corresponding to a basis vector, and for each dimension we can represent a datapoint in our encoded message.