---  
title: Memoized Evaluation of Multilinear Lagrange Interpolating Polynomials   
date: "2024-09-03T06:26:45.934Z"    
description: "Memoized Evaluation of Multilinear Lagrange Interpolating Polynomials"
---  
# Input
Given all $2^d = n$ evaluations of a function $f: \{0,1\}^d \rightarrow \mathbb{F}$, let
$$
\tilde{f}(x_1,\dots,x_d) := \sum_{w\in\{0,1\}^d} f(w)\cdot \delta_w(x_1,\dots,x_d)
$$
Where $\delta_w(x_1,\dots,x_d)$ is a Lagrange basis polynomial for interpolating set $\{0,1\}^d$, and $w \in \{0,1\}^d$
$$
\delta_w(x_1,\dots,x_d) := \prod_{i=1}^{d}w_i \cdot x_i + (1-w_i)(1-x_i)
$$
This algorithm will evaluate $\tilde{f}(r)$ for any $r \in \mathbb{F}^d$ in $O(n)$ time and $O(n)$ space. The streaming based approach requires computing $\delta_w​(r)$ (which contains $log_2(n)$ terms) for each of the $n$ terms in the sum, for a runtime of $O(n \cdot log_2(n))$. This memoized algorithm computes the full set of $n$ Lagrange basis polynomials evaluated at $r$ recursively in linear time, resulting in a runtime of $O(n)$. The evaluating $\tilde{f}(r)$ for $r \in \mathbb{F}^d$ is then a summation of $n$ already defined terms, $f(w)\cdot \delta_w(r)$ for all $w \in \{0,1\}^d$, so the total runtime is $O(n)$.
# Algorithm
Our goal is to obtain a list of the evaluations of $\delta_w(r)$ for all $n$ values of $w \in \{0,1\}^d$. We use a $d$ step algorithm where each step $s$ evaluates the set of $2^s$ Lagrange basis polynomials for interpolating set $\{0,1\}^s$ at $(r_1,\dots,r_s)$. At step $d$, we have a list of all $2^d$ Lagrange basis polynomials for interpolating set $\{0,1\}^d$ evaluated at the full vector $r$ as required.

For each step $1 \leq s \leq d$, we compute a list of $2^s$ evaluations of the Lagrange basis polynomials for interpolating set  $\{0,1\}^s$:
$$
\delta_{(w_1,\dots,w_s)}(r_1,\dots,r_s)
$$

Each step takes $2^s$ time since we're constructing a list of $2^s$ evaluations, and since $s \leq d$, the runtime to compute the full set of steps is $O(2^d) = O(2^{log_2(n)})  =  O(n)$

## Step 1
We initialize the process with the basis polynomials for dimension 1: $[\delta_{(0)}(r_1), \delta_{(2)}(r_1)]$.
$$
\delta_{(0)}(r_1) = \prod_{i=1}^{1} w_i\cdot r_i + (1-w_i)(1-r_i)= 0\cdot r_1 + (1-0)(1-r_1) = 1-r_1
$$
$$
\delta_{(1)}(r_1) = \prod_{i=1}^{1} w_i\cdot r_i + (1-w_i)(1-r_i)= 1\cdot r_1 + (1-1)(1-r_1) = r_1
$$
The list of evaluations is $2^s$ elements long and the interpolating set is  $\{0,1\}^s$.
## Step 2
Step 2 computes the basis polynomials for dimension 2 $[\delta_{(0,0)}(r_1,r_2), \delta_{(0,1)}(r_1,r_2), \delta_{(1,0)}(r_1,r_2), \delta_{(1,1)}(r_1,r_2)]$ using the dimension 1 results
$$
\delta_{(w_1,w_2)}(x) = \delta_{w_1}(r_1) \cdot (w_2\cdot r_2 + (1-w_2)(1-r_2))
$$
- Entry 1: $w = (0,0)$
  $$
  \delta_{0}(r_1) \cdot \delta_{0}(r_2) = (0\cdot r_1 + (1-0)(1-r_1)) (0\cdot r_2 + (1-0)(1-r_2)) = (1-r_1)(1-r_2)
  $$
- Entry 2: $w = (0,1)$
  $$
  \delta_{0}(r_1) \cdot \delta_{1}(r_2) = (0\cdot r_1 + (1-0)(1-r_1)) (1\cdot r_2 + (1-1)(1-r_2)) = (1-r_1)\cdot r_2
  $$
- Entry 3: $w = (1,0)$
  $$
  \delta_{1}(r_1) \cdot \delta_{0}(r_2) = (1\cdot r_1 + (1-1)(1-r_1)) (0\cdot r_2 + (1-0)(1-r_2)) = r_1(1-r_2)
  $$
- Entry 4: $w = (1,1)$
  $$
  \delta_{1}(r_1) \cdot \delta_{1}(r_2) = (1\cdot r_1 + (1-1)(1-r_1)) (1\cdot r_2 + (1-1)(1-r_2)) = r_1\cdot r_2
  $$
## Recursive Step
For each subsequent dimension $s$, we're given the basis evaluations for step $s-1$: $\delta_{w'}(r_1,\dots,r_{s-1})$ for all $w' \in \{0,1\}^{s-1}$ as input. For each existing basis evaluation $\delta_{w'}(r_1,\dots,r_{s-1})$, compute two new evaluations:
- Append $0$ to $w'$ to get $w'0$ and compute
  $$
  \delta_{w'0}(r_1,\dots,r_{s}) =  \delta_{w'}(r_1,\dots,r_{s-1}) \cdot (1-r_s)
  $$
- Append $1$ to $w'$ to get $w'1$ and compute
  $$
  \delta_{w'1}(r_1,\dots,r_{s}) =  \delta_{w'}(r_1,\dots,r_{s-1}) \cdot (r_s)
  $$
  The resulting list is the basis evaluations for step $s$: $\delta_{w}(r_1,\dots,r_{s})$ for all $w' \in \{0,1\}^{s}$.

# Completion
Once the list of all evaluations $\delta_w(r)$ for $w \in \{0,1\}^d$ is computed, we take the dot product of
$(f(0, \dots, 0 ), \dots f(w)) \cdot (\delta_{(0, \dots, 0 )}(r),\dots, \delta_w(r))$ to obtain the sum $\tilde{f}(x_1,\dots,x_d)$.
# Implementation
```ts
/**
 * Evaluates the multilinear extension of an ASCII message at a specified point in the vector space F^d
 *
 * This function treats the ASCII message as a function f defined on the vertices of a d-dimensional hypercube,
 * where d = ceil(log_2(n)) and n is the length of the message.
 *
 * - **Hypercube Representation**: Each message character corresponds to a function value at a hypercube vertex.
 *   The vertices are indexed by the binary representations of their indices (from 0 to n - 1).
 * - **Function Definition**:
 *      f: \{0,1\}^d -> F  such that f(i-the vertex) = i-th character in the message
 *
 * - **Multilinear Extension**: f is extended to f': F^d -> F,
 *   allowing evaluation at any point in the vector space F^d, not just at the hypercube vertices
 *
 * This function computes f'(r), the value of the multilinear extension at the point r in F^d.
 *
 * **Note**: If the message length n is less than 2^d, the function assigns zero to the function values at the remaining vertices.
 *
 * @param message - The ASCII string message to encode and interpolate.
 * @param r - A vector of `Field` elements representing a point in F^d at which to evaluate the multilinear extension.
 *            The length of `r` must be equal to d = ceil(log_2(n))
 * @returns The `Field` element representing f'(r)
 * @throws Error if the message is empty or if the dimension of `r` does not match d
 */
function getMemoizedMultilinearLagrange(
        message: string,
        r: Field[],
): Field {
  if (!message || message.length === 0) {
    throw Error("Message cannot be empty.");
  }

  // dimension of hypercube required to encode all indices of message  
  const d = getBitLength(message.length);

  if (r.length != d) {
    throw Error(`Input vector 'r' must have length ${d}, corresponding to the hypercube dimension.`);
  }

  // accumulator for summation over binary encoded message indices  
  let accumulator = Field(0);
  // ordered list of n vertices (binary encoded message indices) being interpolated  
  const interpolatingSet = generateBinaryVertices(d);

  // v1 is the vector of all evaluations of f over the d dimensional hypercube, subbing in 0 for any vertices for which  
  // there is no message entry  const v1 = interpolatingSet.map((v, index) =>  
  index >= message.length ? Field(0) : Field(asciiToNumber(message[index])),
);
  // v2 is the vector of all Lagrange basis polynomials for interpolating set w in {0,1}^d evaluated at r  
  const v2 = memoizedLagrangeBasis(r);

  // dot product of v1 and v2 gives the evaluation of the MLE at r  
  for (let i = 0; i < interpolatingSet.length; i++) {
    accumulator = accumulator.add(v1[i].mul(v2[i]));
  }

  return accumulator;
}

/**
 * Computes the evaluations of the multilinear Lagrange basis polynomials at a given point in F^d.
 *
 * The multilinear Lagrange basis polynomials L_w are defined over the vertices w in \{0,1\}^d of the hypercube.
 * This function computes L_w for all w in \{0,1\}^d, evaluated at the point x in F^d.
 *
 * The basis polynomials are constructed recursively using memoization to improve efficiency.
 * For each dimension i, the basis polynomials are updated based on the previous dimension.
 *
 * @param x - A vector of `Field` elements representing a point in F^d
 * @returns An array of `Field` elements containing the evaluations L_w(r) for all  w in \{0,1\}^d
 */
function memoizedLagrangeBasis(x: Field[]): Field[] {
  // Initialize the basis evaluations for the first dimension [(0),(1)]  
  // For w_0 = 0: (1 - r[0]), for w_0 = 1: r[0]  let prevRound = [Field(1).sub(x[0]), x[0]];  
  let tmp = [];
  // iterate through each dimension of x  
  for (let i = 1; i < x.length; i += 1) {
    for (let j = 0; j < prevRound.length; j += 1) {
      // For w_i = 0, multiply by (1 - r[i])  
      tmp.push(prevRound[j].mul(Field(1).sub(x[i])));
      // For w_i = 1, multiply by r[i]  
      tmp.push(prevRound[j].mul(x[i]));
    }

    prevRound = tmp;
    tmp = [];
  }

  return prevRound;
}
```