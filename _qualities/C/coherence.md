---
title: Coherence
aka: [Conceptual Integrity]
tags: [usable, maintainable]
related: [consistency, cohesion, simplicity, understandability, clarity]
standards: [iso42010, iso42030, iso12207]
permalink: /qualities/coherence
---

Coherence is the degree to which the parts of a system fit together under one set of ideas: the same concepts, conventions and mechanisms are used throughout, and nothing contradicts anything else. In software architecture the classic name for this property is *conceptual integrity*.

Definitions:

>I will contend that conceptual integrity is *the* most important consideration in system design. It is better to have a system omit certain anomalous features and improvements, but to reflect one set of design ideas, than to have one that contains many good but independent and uncoordinated ideas.
>
>[Brooks: The Mythical Man-Month, 1975](/references/#brooks1975mythical), chapter 4

<hr class="with-no-margin"/>

>The situation when the parts of something fit together in a natural or reasonable way:
>* There was no coherence between the first and the second half of the movie.
>
>[Cambridge Dictionary](https://dictionary.cambridge.org/dictionary/english/coherence)

<hr class="with-no-margin"/>

>Logically or aesthetically ordered or integrated
>
>[Merriam-Webster](https://www.merriam-webster.com/dictionary/coherent)

### What coherence looks like

A coherent system feels as if it had been designed by a single mind: one naming vocabulary, one way of reporting errors, one way of modelling time or money or identity, one interaction style. An incoherent system is a collection of locally sensible decisions that do not add up — three date formats, two authentication mechanisms, modules that mean different things by "customer".

Coherence is judged rather than measured. Typical signs of its absence are duplicated concepts under different names, exceptions to conventions that need explaining, and the phrase "it depends which part of the system you are in".

### Not the same as cohesion

[Cohesion](/qualities/cohesion) and coherence are often blurred, but they are independent properties:

* **Cohesion** is a property *within* one module — how strongly its internal elements belong together. It is structural and measurable (e.g. with LCOM metrics), and it comes from Yourdon & Constantine's structured design.
* **Coherence** is a property *across* the whole system or design — whether the parts fit together under one set of ideas. It is conceptual and judged, and it comes from Brooks.

The two can vary independently. A system built from perfectly cohesive modules that each use their own naming scheme, error-handling style and data model is cohesive but incoherent. A system with one clear design philosophy and a few sprawling, do-everything modules is coherent but low in cohesion.

Not to be confused with *cache coherence*, a hardware property of multiprocessor memory systems.
