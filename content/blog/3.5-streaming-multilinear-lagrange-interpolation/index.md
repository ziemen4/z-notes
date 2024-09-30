---  
title: Streaming Based Evaluation of Multilinear Lagrange Interpolating Polynomials    
date: "2024-09-03T06:26:45.934Z"    
description: "Streaming Based Evaluation of Multilinear Lagrange Interpolating Polynomials"
---  
- Let $f: \{0,1\}^v \rightarrow \mathbb{F}$ and suppose a verifier has all evaluations $f(x)$ for $x \in \{0,1\}^v$.
  - The domain of $f$ has size $|\{0,1\}^v| = 2^v = n$.
- Given $f(w)$ for all $w \in \{0,1\}^v$ and a $v$-dimensional vector $r \in \mathbb{F}^v$, the verifier must efficiently evaluate $\tilde{f}(r)$.
# Streaming Interactive Proofs
- See the paper [Verifying Computations with Streaming Interactive Proofs](https://arxiv.org/pdf/1109.6882)
- The verifier can compute $\tilde{f}(r)$ in $O(n\cdot log(n))$ time and $O(log(n))$ space by streaming the inputs $f(w)$ for all $w \in \{0,1\}^v$.
- The order of the inputs does not matter
- $V$ can calculate the sum  
  $$  
  \tilde{f}(r) = \sum_{w\in \{0,1\}^v} f(w)\cdot L_w(r_1,\dots,r_v)  
  $$  
  with a recursive algorithm.
- Begin by initializing the accumulator to 0: $\tilde{f}(r) \leftarrow 0$. Then with each entry, add the next term to the accumulator  
  $$  
  \tilde{f}(r) \leftarrow \tilde{f}(r) + f(w) \cdot L_w(r)  
  $$
- With this approach, the verifier only needs to store the value $r$ and the current value of $\tilde{f}(r)$ as it iterates through values of $w \in \{0,1\}^v$. $r$ is a $v$-dimensional vector of elements of $\mathbb{F}$ and $\tilde{f}(r) \in \mathbb{F}$, so the algorithm's space usage is $v+1$ field elements or $O(v ) = O(log_2(n))$
- The verifier runs through each of the $2^v = n$ values in $w \in \{0,1\}^v$, each time evaluating the $v$-term Lagrange basis polynomial $L_w(r)$  
  $$  
  L_w(r_1,\dots,r_v) := \prod^{v}_{i=1} r_i\cdot w_i + (1-r_i)(i-w_i)  
  $$
  so $2^v$ operations in $O(v)$ are run to compute the full sum, resulting in a runtime of $O(v \cdot 2^v)$ or $O(n \cdot log(n))$ .
# Implementation
```ts
function getMultilinearLagrange(message: string, x: Field[]): Field {
  const n = message.length;
  if (n === 0) {
    throw Error("Dataset cannot be empty.");
  }
  // dimension of hypercube required to encode n entries  
  // 2^d must be at least as large as n  const d = Math.ceil(Math.log2(n));  

  // accumulator for result as terms in summation are evaluated  
  let accumulator = Field(0);
  // ordered list of n vertices being interpolated  
  const interpolatingSet = generateBinaryVertices(d);
  let lagrangeBasisAtInput;

  // sum over all vertices in the d dimensional hypercube to create the interpolating polynomial  
  // O(n)  // todo - can we sum over n entries of the message instead of 2^d vertices?  
  for (let i = 0; i < interpolatingSet.length; i++) {
    // obtain field representation of ascii character in message  
    // 2^d will likely be larger than n, right-pad the message with zeroes    const coefficient =  
    i >= message.length ? Field(0) : Field(asciiToNumber(message[i]));
    lagrangeBasisAtInput = getMultilinearLagrangeBasisAt(
            interpolatingSet[i],
            interpolatingSet,
            x,
    );

    // Add the current term (coefficient * current basis) to the result  
    accumulator = accumulator.add(coefficient.mul(lagrangeBasisAtInput));
  }

  return accumulator;
}

function getMultilinearLagrangeBasisAt(
        w: number[],
        interpolatingSet: number[][],
        x: Field[],
): Field {
  if (
          w.length !== interpolatingSet[0].length ||
          x.length !== interpolatingSet[0].length
  )
    throw Error(
            `Vectors w: ${w} and x: ${x} must be ${interpolatingSet.length}-dimensional`,
    );

  let accumulator = Field(1);
  // lagrange basis polynomial is a product over all entries in the vertex w  
  for (let i = 0; i < w.length; i++) {
    accumulator = accumulator.mul(
            x[i].mul(w[i]).add(
                    Field(1)
                            .sub(x[i])
                            .mul(1 - w[i]),
            ),
    );
  }

  return accumulator;
}
```
