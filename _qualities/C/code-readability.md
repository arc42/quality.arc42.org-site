---
title: Code Readability
tags: [usable, efficient]
related: understandability, legibility, clarity, conciseness, consistency, readability
permalink: /qualities/code-readability
---

>Readability, to me, means that the code is easy to follow, logically.
>
>* Standards of indentation and formatting are followed, so that the code and its structure are clearly visible.
>* Variables are named meaningfully, so that they communicate intent.
>* Comments, which are present only where needed, are concise and adhere to standard formats.
>* Guard clauses are used instead of nested if statements.
>* Facilities of the language are used skillfully, leveraging iteration and recursion rather than copy and paste coding.
>* Functions are short and to the point, and do one thing.
>* Indirection is minimized as much as possible, while still maintaining flexibility.
>
>[Stackoverflow](https://softwareengineering.stackexchange.com/questions/162923/what-defines-code-readability)


Another answer, same question on Stackoverflow:

>Some things that increase readability:
>
>* Use whitespace to separate disparate areas of code. For example, indent code blocks like "if" statements. Leave blank lines between methods/functions or related lines of code within a method/function. This allows the brain to segregate the code even before the characters are read.
>* Use meaningful variable and method/function/class names. Follow the standard practice for the language and use terms from the problem domain if possible. The meaning and use of something should be evident from its name. Names should also be consistent.
>* Comment effectively. Avoid obvious comments ("The GetX() method returns the current value of x"). Comments should say what the code intends to do, how it relates to other parts of the code and any assumptions ("Argument "a" cannot be null. The code throws an exception if a is null").
>* Following established design patterns for the language, library or problem space. For example, avoid repeating code (called DRY or Don't Repeat Yourself. This wastes time as the reader tries to look for differences or find the correct piece of code to fix.
>* Keep it Simple (KISS principle). For example, avoid premature or unnecessary optimization. Optimization has its place but code can often be optimized without impacting readability.
>
>Arguably the single most important aspect is consistency. It is easier to understand code if the reader knows what to expect and where to look. If the project uses conflicting variable naming and commenting styles, for example, the reader has to waste mental effort learning new styles and context switching. 
>
>
<hr>
A book on the subject:

Dustin Boswell, Trevor Foucher: **The Art of Readable Code**: Simple and Practical Techniques for Writing Better Code. O'Reilly, 2011.