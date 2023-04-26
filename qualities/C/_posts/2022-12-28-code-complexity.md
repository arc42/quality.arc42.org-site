---
title: Code Complexity
tags: efficient
related: understandability, legibility, clarity, conciseness, consistency, readability
permalink: /qualities/code-complexity
---

>A quantitative measure [whether there is not more than an adequate] number of linearly independent paths through a program’s source code.
>It was developed by Thomas J. McCabe, Sr. in 1976.
>
>[Wikipedia](https://en.wikipedia.org/wiki/Cyclomatic_complexity)


More precise:

>The complexity measure approach we will take is to measure and control the number of paths through a program. [...] Given a program we will associate with it a directed graph that has unique entry and exit nodes. Each node in the graph corresponds to a block of code in the program where the flow is sequential and the arcs correspond to branches taken in the program. This graph is classically known as the program control graph and it is assumed that each node can be reached by the entry node and each node can reach the exit node.
[...] The cyclomatic number `V(G)` of a [program control] graph `G` with `n` vertices, `e` edges, and `p` connected components is
>
>`v(G)=e-n+p.`
>
>[[Mccabe+1976, p. 308]](/references/#mccabe1976complexity)

>The overall strategy will be to measure the complexity of a program by computing the number of linearly independent paths `v(G)`, control the "size" of programs by setting an upper limit to `v(G)` (instead of using just physical size), and use the
cyclomatic complexity as the basis for a testing methodology.
>
>[[Mccabe+1976, p. 309]](/references/#mccabe1976complexity)

