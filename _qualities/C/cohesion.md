---
title: Cohesion
aka: [High Cohesion]
tags: [efficient, suitable, maintainable]
related: [coherence, modularity, loose-coupling]
permalink: /qualities/cohesion
---



>In computer programming, cohesion refers to the degree to which the elements inside a module belong together.
>
>Cohesion is an ordinal type of measurement and is usually described as “high cohesion” or “low cohesion”. 
>Modules with high cohesion tend to be preferable, because high cohesion is associated with several desirable traits of software including robustness, reliability, reusability, and understandability. 
>[Wikipedia](https://en.wikipedia.org/wiki/Cohesion_(computer_science))

<hr class="with-no-margin"/>

And, from a gem of software engineering literature ("Structured Design" by Ed Yourdon and Larry Constantine) from 1978:

>How tightly bound or related its internal elements are to one another. 
>
>[Yourdon & Constantine: Structured Design, 1978](http://vtda.org/books/Computing/Programming/StructuredDesign_EdwardYourdonLarryConstantine.pdf)

### Not the same as coherence

Cohesion is a property of a *single module*: do its elements belong together? For the *system-level* notion — do all the parts fit together under one set of design ideas — see [coherence](/qualities/coherence), which explains the difference.
