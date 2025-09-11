---
title: Code Complexity
tags: [efficient]
related: understandability, legibility, clarity, conciseness, consistency, readability
permalink: /qualities/code-complexity
---


Code complexity refers to the level of intricacy, difficulty, or sophistication in a software program's source code. It is a measure of how challenging it is to understand, maintain, and modify the codebase. There are various metrics and methodologies used to assess code complexity, each aiming to provide insights into the code's quality and potential issues.

Commonly used metrics to evaluate code complexity include:

* Cyclomatic Complexity: It measures the number of linearly independent paths through a program's source code. Higher cyclomatic complexity indicates increased difficulty in understanding and maintaining the code. Tools like McCabe's Cyclomatic Complexity can calculate this metric.

* Halstead Complexity Measures: Developed by Maurice Halstead, these metrics are based on the number of operators, operands, and unique operators and operands in the code. They help in understanding the program's volume and difficulty.

* Lines of Code (LOC): The number of lines in the source code. Though not a comprehensive measure of complexity, it can give some indication of a program's size and potential complexity.

* Nesting Depth: It measures the depth of nested control structures within the code, which can impact code readability and maintainability.

* Number of Dependencies: The number of external dependencies a module or class has. High dependency count can increase code complexity and make the codebase harder to manage.

<hr>

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

<hr>

>The overall strategy will be to measure the complexity of a program by computing the number of linearly independent paths `v(G)`, control the "size" of programs by setting an upper limit to `v(G)` (instead of using just physical size), and use the
cyclomatic complexity as the basis for a testing methodology.
>
>[[Mccabe+1976, p. 309]](/references/#mccabe1976complexity)

