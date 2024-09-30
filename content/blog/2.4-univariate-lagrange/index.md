---  
title: Univariate Lagrange Interpolation  
date: "2024-08-08T06:26:45.934Z"  
description: "Univariate Lagrange interpolation as a technique for obtaining a unique low-degree extension polynomial for a dataset"
---  
# Background
# Unique Low Degree Extensions
- Lagrange interpolation and Reed-Solomon both give us techniques to create unique low-degree extension polynomials for a message. The unique low degree extensions will always have degree $n-1$ or lower where $n$ is the length of the message. The extension polynomials are then evaluated at $p$ points where $p>>n$ to create a low degree extension encoding which is much longer than the original message. The algorithms only differ in how the message is represented as a polynomial.
- Low degree extension encodings are valuable because of their _distance amplifying_ properties - if two messages differ even at one entry, almost every entry in their extension encodings will be different, allowing for fast comparison of messages via random sampling of entries in the encoding.
- In both Lagrange interpolation and Reed-Solomon, the symbols of the message $m$ are mapped to elements of a finite field $\mathbb{F}_p$ and the entries of the message $(m_1,\dots m_n) \in \mathbb{F}_p^n$ are applied as the weights in a linear combination over a polynomial basis.
  - With Reed-Solomon, we use the standard monomial basis $\{x^0, x^1,...x^{n-1}\}$ resulting in the polynomial  
    $$  
    P_m(x)=\sum^{n}_{i=0} m_i \cdot x^{i-1}  
    $$
  - In univariate Lagrange interpolation, the Lagrange basis is used  $\{L_0(x), L_1(x),...L_{n-1}(x)\}$, resulting in a polynomial with the form  
    $$  
    P_q(x)=\sum^{n-1}_{i=0} m_{i+1} \cdot L_{i}(x)  
    $$
- With Reed-Solomon, the symbols of the message uniquely determine a polynomial by specifying the coefficients. The degree is clearly $n−1$ because the sum spans $n$ standard monomial basis polynomials $\{x^0, x^1,...x^{n-1}\}$.
- Univariate Lagrange interpolation obtains an $n-1$ or lower degree polynomial for the message by interpreting its entries as a set of $n$ points $\{(0,m_1),\dots,(n-1,m_n)\}$ and defining the polynomial that passes through them. Because two distinct polynomials of degree $n-1$ or lower can intersect at no more than $n-1$ points, we know that there is no other polynomial of degree $n-1$ or lower that interpolates the $n$ points. Thus, the Lagrange interpolating polynomial is unique.
# Univariate Lagrange Interpolation
# High Level
Specifying the low degree extension for a message with Lagrange interpolation is less intuitive than with Reed-Solomon, so we'll begin with a high level summary of steps.
- Our goal is to uniquely represent an $n$-length message $m$ with a univariate polynomial $q_m$ of degree $\leq n-1$ such that evaluating $q_m(i)$ for $i\in\{0,\dots,n-1\}$ produces the $i+1th$ character of the message. We define $q_m$ over a finite field $\mathbb{F}_p$ where $p>n$.
- We'll create the interpolating polynomial by pairing the $n$ characters of the message $m = (m_1, \dots, m_n)$ with their corresponding zero-based indices  $i\in\{0,\dots,n-1\}$ to obtain a set of $n$ coordinate pairs $\{(0, m_1), (1, m_2)\dots (n-1, m_n)\}$.
- The x-values in the set of coordinates being interpolated are the nodes over which we can define a set of _Lagrange basis polynomials_.
- Lagrange basis polynomials are polynomials that evaluate to 1 for their corresponding node, and 0 for all other nodes in the set.
  - For example, the second Lagrange basis polynomial will return 0 for all nodes other than the node at index two:
    - $L_2(0) = 0$
    - $L_2(1) = 0$
    - $L_2(2) = 1$
    - $L_2(3) = 0$
    - $L_2(4) = 0$
- We create the interpolating polynomial $q_m$ by multiplying the entries in the message by Lagrange basis polynomials.  
  $$  
  q_m(i) = m_1 \cdot L_0(i) + m_2 \cdot L_1(i) + \dots + m_n \cdot L_{n-1}(i)  
  $$
- For an input $i$ to $q_m$, each Lagrange basis polynomial $L_j$ will evaluate to 0, except $L_i(i)$ which will evaluate to 1.
- As a result, the evaluation of of $q_m(i)$ will be  
  $$  
  q_a(i) = m_1 \cdot 0 + \dots + m_{i+1} \cdot 1 + \dots + m_n \cdot 0 = m_{i+1}  
  $$
  - For example, we can see that $q_m(2)$ evaluates to the third character in the message $q_m(2) = m_1 \cdot L_0(2) + m_2 \cdot L_1(2) + m_3 \cdot L_2(2) + \dots + m_n \cdot L_{n-1}(2)$  
    $= m_1 \cdot 0 + m_2 \cdot 0 + m_3 \cdot 1 + \dots + m_n \cdot 0$  
    $= m_3$
- We define $q_a$, the Lagrange interpolating polynomial, as mapping $q_a: i \mapsto m_{i+1}$.
- The x-values in the coordinate pairs $\{0,\dots,n-1\}$ are the nodes over which we define our Lagrange basis polynomials, or the interpolating set.
- We create the interpolating polynomial by using entries in the message as the weights in a linear combination of the Lagrange basis polynomials
  $$  
  q_a(i) = m_1 \cdot L_0(i) + m_2 \cdot L_1(i) + \dots + m_n \cdot L_{n-1}(i)  
  $$
# The Details
## Lagrange Basis Polynomials
- Let $m$ be an $n$-dimensional vector $m = (m_1, m_2, \dots,m_n) \in \mathbb{F}_p^n$ where $p$ is a prime number larger than $n$. There exists a unique univariate Lagrange interpolating polynomial $q_m$ over $\mathbb{F}_p$ with degree $\leq n-1$ such that  
  $$  
  \forall i\in\{0,\dots,n-1\}(q_m(i) = m_{i+1})  
  $$
- We'll interpolate the set of points $\{(0, m_1), \dots (n-1, m_n)\}$, so our nodes are $\{0\dots n-1\}$.
- Given a set of $n$ distinct nodes, we define the Lagrange basis for polynomials of degree $\leq n-1$ to be the set of $n-1$ degree polynomials $\{L_0, L_1,\dots L_{n-1}\}$ over $\mathbb{F}_p$ where $L_i(x_i) = 1$ and $L_i(x_j) = 0$ if $j \in \{0\dots n-1\}$ and $j \neq i$.    
  $$  
  L_i(x)= \prod_{j=0, j\neq i}^{n-1} \frac{x-x_j}{x_i-x_j}  
  $$
- In other words, the $i$th Lagrange basis polynomial evaluates to $1$ for the $i$th node and 0 for all other nodes in the set.
  - Note that this is only true for inputs in the domain $\{0,\dots,n-1\}$ over which the set of Lagrange basis polynomials was defined. Evaluating a Lagrange basis polynomial at a value outside of that domain will not return $0$ even if the value does not equal $i$.
  - Another way you may see this written written is $L_i(x_j) = \delta_{ij}$. The $\delta_{ij}$ refers to the Kronecker delta function which returns 1 if $i=j$ and 0 if $i \neq j$, for example $\delta_{22}=1$ and $\delta_{21}=0$.
- We're intentionally creating a polynomial for every node index $i$ such that there will be a zero at every element in the domain $\{0,\dots n-1\}$ that isn't $i$, and that the evaluation of the polynomial at the node $x_i$ is 1.
  - We set the numerator so that for every $j\in \{0,\dots n-1\}$ except $j=i$, there will be a zero at $x=x_j$.
  - We set the denominator so that in the one case where $j=i$, terms in the numerator and denominator will all cancel, leaving us with 1.
- The set $\{L_0, L_1,\dots L_{n-1}\}$ is a Lagrange basis for polynomials of degree $\leq n-1$ because
  - The Lagrange basis polynomials are linearly independent so no polynomial in the set can be written as a linear combination of the others.
  - Any other polynomial of degree $\leq n-1$ can be expressed as a linear combination of the Lagrange basis polynomials.
# Lagrange Interpolating Polynomial
- Using the Lagrange basis polynomials that we defined for the set of coordinates being interpolated, we can create the Lagrange interpolating polynomial, $q_m$. Our goal is that for the vector $m = (m_1,\dots,m_n) \in \mathbb{F}_p^n$  
  $$  
  \forall i \in \{0,\dots,n-1\}(q_m(i) = m_{i+1})  
  $$
- We must create a sum where all terms evaluate to 0 except the one multiplied by the $m_{x+1}$th entry of the message.   $$  
  q_m(x) = \sum_{i=0}^{n-1}m_{i+1}\cdot L_i(x)  
  $$
- Expanded, we have  
  $$  
  q_a(x) = m_{1}\cdot L_0(x) + m_{2}\cdot L_1(x) + \dots + m_n\cdot L_{n-1}(x)  
  $$
- When evaluating $q_a(i)$ for $i \in \{0,n-1\}$ only the basis polynomial $L_i$ evaluates to 1 and that all other basis polynomials in $\{L_0,\dots,L_{n-1}\}$  evaluate to zero. Since we use the entries $(m_1,\dots,m_n)$ as coefficients of the Lagrange basis polynomials, this has the effect of causing the interpolating polynomial to return $m_{i+1} \cdot L_i(i) = m_{i+1} \cdot 1$.
# Lagrange Interpolating Polynomials are Unique Low Degree Extensions
- The Lagrange interpolating polynomial is unique - it's the only polynomial of degree $\leq n-1$ that represents the $n$-length message $m$.
- Each Lagrange basis polynomial has degree $n-1$.
  $$  
  L_i(x)= \prod_{j=0, j\neq i}^{n-1} \frac{x-x_j}{x_i-x_j}  
  $$
  In the $i$th Lagrange basis polynomial, $x$ has degree 1 and $x_j$ and $x_i$ are constant values such that $x_j, x_i \in \{0,\dots,n-1\}$. Thus, the Lagrange basis polynomial $L_i(x)$ is a product of $n-1$ linear terms and the interpolating polynomial is a linear combination of Lagrange basis polynomials, so its degree is  $\leq n-1$.
- Since the Lagrange interpolating polynomial $q_m$ has degree $\leq n-1$, and interpolates $n$ points, it must be unique.
- Proof: Suppose there were another polynomial $q_m'$ of degree $\leq n-1$ which interpolated the same $n$ points. Then $q_m - q_m'$ is a polynomial of degree $\leq n-1$ with roots at all $n$ nodes, which would mean that $q_m - q_m'$ is the constant zero function, so $q_m = q_m'$.
- We call the Lagrange interpolating polynomial the unique low degree extension of $m$, and the set of all evaluations of $q_m(x)$ for $x\in \mathbb{F}_p$ a low degree extension encoding of $m$.
# Low Degree Extensions and Distance Amplification
- For an $n$-dimensional vector $m=(m_1,\dots,m_n) \in \mathbb{F}_p^n$, the low degree extension encoding is a $p$-dimensional vector of the evaluations $c = (q_m(0),\dots,q_m(n-1))$.
- A message $m'$ that differs from $m$ at even one entry will have a Lagrange polynomial that interpolates a different set of values for the same set of nodes $x\in \{0,\dots,n-1\}$, so $m'$ will have a different low degree extension, $q_m'$ still of degree $\leq n-1$.
- Since $q_m$ and $q_m'$  are distinct polynomials of degree $\leq n-1$, they agree at  $\leq n-1$ points. The low degree extension encodings of $m$ and $m'$ are of length $p$, so an entry at a random $r \in \mathbb{F}_p$ has    
  $$  
  \Pr_{r\in\mathbb{F}_p}[q_m(r) = q_m'(r)] \leq \frac{n-1}{p}  
  $$
- As long as $p>n$, the extension is _distance amplifying_. If an encoding is distance amplifying, the distance between the codewords (number of entries at which they are different) is greater than the distance between the original messages.
- As long as the order of the field is sufficiently large, the probability of two random entries in an extension code being the same for different messages is near zero.
- Both Reed-Solomon and Lagrange interpolation result in a unique $n-1$ or lower degree extension polynomial with distance amplification properties.
- In the case of Lagrange interpolation, the extension encoding contains the original vector. For an $n$-dimensional vector $m=(m_1,\dots,m_n) \in \mathbb{F}_p^n$, the first $n$ evaluations of the Lagrange interpolating polynomial on elements of $\mathbb{F}_p$ will result in the entries $(m_1,\dots,m_n)$. We say that this encoding is _systemic_.
# Lagrange Interpolation Worked Example
- Given a message $m = (m_1, m_2, m_3, m_4, m_5) \in \mathbb{F}_p^5$, the length of the message is 5 so the Lagrange polynomial will be of degree $\leq 4$
- The points being interpolated are $((0,m_1),(1,m_2),(2,m_3),(3,m_4),(4,m_5))$ and our nodes are $\{0,1,2,3,4\}$.
- As an example, we'll evaluate the fourth Lagrange basis polynomial, $L_3$, so $i=3$, $x_3 = 3$ and for
  - $L_3(x_3) = L_3(3) = 1$
  - $L_3(x_j) = 0$ if $j \in{0,\dots n-1}$ and $j \neq 3$
- The expanded Lagrange basis polynomial looks like this:  
  $$  
  L_3(x) =  
  \frac{x-x_0}{x_3-x_0} *  
  \frac{x-x_1}{x_3-x_1} *  
  \frac{x-x_2}{x_3-x_2} *  
  \frac{x-x_4}{x_3-x_4} = \frac{(x-x_0)(x-x_1)(x-x_2)(x-x_4)}{(x_3-x_0)(x_3-x_1)(x_3-x_2)(x_3-x_4)}  
  $$
- Plugging in node values we have  
  $$  
  L_3(x) = \frac{(x-0)(x-1)(x-2)(x-4)}{(3-0)(3-1)(3-2)(3-4)} =\frac{(x-5)(x-1)(x-2)(x-4)}{-6}  
  $$
- Evaluated at $x_3$, the terms in the numerator and the terms in the denominator all cancel out, leaving us with 1  
  $$  
  L_3(x_3) = \frac{(x_3-x_0)(x_3-x_1)(x_3-x_2)(x_3-x_4)}{(x_3-x_0)(x_3-x_1)(x_3-x_2)(x_3-x_4)} = 1  
  $$
  $$  
  L_3(3) = \frac{(3-0)(3-1)(3-2)(3-4)}{(3-0)(3-1)(3-2)(3-4)} = \frac{(3)(2)(1)(-1)}{(3)(2)(1)(-1)} = 1  
  $$
- Evaluated at any other node, one of the numerator terms evaluates to zero, leaving us with 0  
  $$  
  L_3(x_2) = \frac{(x_2-x_0)(x_2-x_1)\textcolor{red}{(x_2-x_2)}(x_2-x_4)}{(x_3-x_0)(x_3-x_1)(x_3-x_2)(x_3-x_4)} = \frac{(x_2-x_0)(x_2-x_1)\textcolor{red}{(0)}(x_2-x_4)}{(x_3-x_0)(x_3-x_1)(x_3-x_2)(x_3-x_4)} = 0  
  $$  
  $$  
  L_3(2) = \frac{(2-1)\textcolor{red}{(2-2)}(2-4)(2-5)}{(3-1)(3-2)(3-4)(3-5)}= \frac{(2-1)\textcolor{red}{(0)}(2-4)(2-5)}{(3-1)(3-2)(3-4)(3-5)} = 0  
  $$
- The full Lagrange interpolating polynomial for $m = (m_0,m_1,m_2,m_3,m_4)$ can be calculated as follows  
  $$  
  L_0(x) = \prod_{j=1,j\neq 0}^{n-1} \frac{x-x_j}{x_0-x_j} = \frac{(x-x_1)(x-x_2)(x-x_3)(x-x_4)}{(x_0-x_1)(x_0-x_2)(x_0-x_3)(x_0-x_4)} = \frac{(x-1)(x-2)(x-3)(x-4)}{(0-1)(0-2)(0-3)(0-4)} = \frac{(x-1)(x-2)(x-3)(x-4)}{-24}  
  $$
  $$  
  L_1(x) = \prod_{j=0,j\neq 1}^{n-1} \frac{x-x_j}{x_1-x_j} = \frac{(x-x_0)(x-x_2)(x-x_3)(x-x_4)}{(x_1-x_0)(x_1-x_2)(x_1-x_3)(x_1-x_4)} = \frac{(x-0)(x-2)(x-3)(x-4)}{(1-0)(1-2)(1-3)(1-4)} = \frac{(x-0)(x-2)(x-3)(x-4)}{-6}  
  $$
  $$  
  L_2(x) = \prod_{j=0,j\neq 2}^{n-1} \frac{x-x_j}{x_2-x_j} = \frac{(x-x_0)(x-x_1)(x-x_3)(x-x_4)}{(x_2-x_0)(x_2-x_1)(x_2-x_3)(x_2-x_4)} = \frac{(x-0)(x-1)(x-3)(x-4)}{(2-0)(2-1)(2-3)(2-4)} = \frac{(x-0)(x-1)(x-3)(x-4)}{4}  
  $$  
  $$  
  L_3(x) = \prod_{j=0,j\neq 3}^{n-1} \frac{x-x_j}{x_3-x_j} = \frac{(x-x_0)(x-x_1)(x-x_2)(x-x_4)}{(x_3-x_0)(x_3-x_1)(x_3-x_2)(x_3-x_4)} = \frac{(x-0)(x-1)(x-2)(x-4)}{(3-0)(3-1)(3-2)(3-4)} = \frac{(x-0)(x-1)(x-2)(x-4)}{-6}  
  $$
  $$  
  L_4(x) = \prod_{j=0,j\neq 4}^{n-1} \frac{x-x_j}{x_4-x_j} = \frac{(x-x_0)(x-x_1)(x-x_2)(x-x_3)}{(x_4-x_0)(x_4-x_1)(x_4-x_2)(x_4-x_3)} = \frac{(x-0)(x-1)(x-2)(x-3)}{(4-0)(4-1)(4-2)(4-3)} = \frac{(x-0)(x-1)(x-2)(x-3)}{24}  
  $$
  $$  
  q_a(x) = \sum^{n-1}_{i=0} m_{i+1} \cdot L_i(x) = m_{1}\cdot L_0(x) + m_{2}\cdot L_1(x) + m_{3}\cdot L_2(x) + m_{4}\cdot L_3(x) + m_{5}\cdot L_4(x)  
  $$
# Implementation
```ts
 function getUnivariateLagrange(message: string, r: Field): Field {
  const n = message.length;
  if (n === 0) {
    throw Error("Message cannot be empty.");
  }
  // r value is an element in the interpolating set, return the corresponding message entry  
  if (r.lessThan(n).toBoolean()) {
    const index = Number(r.toBigInt());
    return Field(asciiToNumber(message[index]));
  }

  // accumulator for summation over interpolation points  
  let result = Field(0);
  // interpolation points ({0...n-1})  
  const interpolatingSet = Array.from({ length: n }, (_, index) =>
          Field(index),
  );

  // sum over interpolation points  
  for (let i = 0; i < interpolatingSet.length; i++) {
    // coefficient  
    const coeff = Field(asciiToNumber(message[i]));
    // lagrange basis evaluated at r  
    const lagrangeBasis = getLagrangeBasis(i, interpolatingSet, r);
    result = result.add(coeff.mul(lagrangeBasis));
  }

  return result;
}

// returns the index-th lagrange basis polynomial for the interpolating set evaluated at x  
function getLagrangeBasis(
        index: number,
        interpolatingSet: Field[],
        x: Field,
): Field {
  // accumulator for product over interpolating set indices  
  let accumulator = Field(1);
  for (let j = 0; j < interpolatingSet.length; j++) {
    // skip term where j = index  
    if (j === index) continue;
    // jth term = (x-interpolatingSet[j]) / (interpolatingSet[index] - interpolatingSet[j])  
    const term = (x.sub(interpolatingSet[j]))
            .div(
                    (interpolatingSet[index].sub(interpolatingSet[j]))
            );
    accumulator = accumulator.mul(term);
  }

  return accumulator;
}
```