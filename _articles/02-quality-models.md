---
layout: page
title: "Quality Models"
tags: iso-25010 quality-model
permalink: /articles/02-quality-models
---

<div class="arc42-help" markdown="1">
Since about 1977, (scientific) minds have been arguing about a conceptual model around the topic of _software product quality_.
A number of authors proposed different approaches, until 1991 the ISO organization took over and began publishing its vendor- and product neutral standards ISO-9126.
In 2011, that was replaced by the ISO-25010, which is still in active use.

Too bad that _active use_ does **not** correspond to practical or usable...

This article presents a few quality models and comes to a (potentially) surprising conclusion...

</div><br>

(you find all the references at the end of this article).
### A Bit of History

In 1977, McCall suggested to model quality as a hierarchy of terms, whose first level consists of _Operation, Revision_ and _Transition_. To revision he counted e.g. Maintainbility, Flexibility and Testability.

Later, there were a number of alternative proposals, of which, the approaches FURPS and its extension FURPS+ by IBM found proper acceptance in practice. 

The ISO organization then took up the issue, publishing vendor- and product-neutral standards since 1991, starting with ISO-9126, which "lasted" for 20 years, and was superseded in 2011 by ISO-25010, which is still in effect today. Both were each considered the conceptual reference for software quality, and have gained considerable currency in practice. In my humble opinion, this is largely due to the fact that the ISO bodies define the terms used quite properly. Therefore, they can be forgiven for simply ignoring (or forgetting?) some really relevant quality characteristics.
I also liked quality features of the VOLERE Requirements Template, which, however, have found less acceptance in the German-speaking world than the ISO standards.

### Quick-Check of Software Quality Models

| Authors / Name| Year | Summary | Nr of Quality attributes |
|:--------|-----:|:--------|:-------------------------|
| McCall  | 1977 | Hierarchical model, 2 levels. Top-level qualities: _operation_, _revision_, _transition_. Overly academic | 11 |
| Boehm   | 1978 | Hierarchical model, 3 levels. Top-level qualities: _utility, maintainability, portability_. | 23 |
| ISO-9126 | 1991| Hierarchical model, 2 levels, 6 top-level qualities. No safety, security underrated, disputable terminology | 27 |
| R. Grady, FURPS | 1992 | Single level with _functionality, useability, reliability, performance, supportability_. Lacks operational qualities and safety | 6 |
| IBM FURPS+ | 1999 | Add lots of sub-characteristics to FURPS. Part of the (overly complex) Rational-Unified process | 30 |
| VOLERE | 1999 | Integrated in sophisticated template for requirements. Combines qualities and constraints | 8 |
| ISO-25010 | 2011 | Superseedes ISO-9126. Hierarchical model with 8 top-level qualities. Adds security as top-level. Widespread, afaik. Disputable definitions of terms. | 32 |
| Bass et. al | 2022 | One level, see [this article](/_articles/sei-quality-model). Practical, with a few rough edges. | 10 |
| ISO-25010, draft 2022 | 2022 | Proposal to add safety and change a number of terms and definitions. Still [disputable terminology](/articles/iso-25010-shortcomings), overly complex for day-to-day use.  | 39 |


### References for Quality Models

* Jamwal et. Al: Comparative Analysis of Different Software Quality Models. Proceedings of the 3rd National Conference; INDIACom-2009, online: https://enos.itcollege.ee/~nafurs/suvi2019/huvitavat/alternatiivid_FURPSile.pdf
* L R. B. Grady, Practical Software Metrics for Project Management and Process Improvement. Contains the FURPS-Model Prentice Hall, 1992.
* ISO-25010, https://www.iso.org/standard/35733.html
* Eeles, Peter: Non-functional Requirements, online: https://pdfs.semanticscholar.org/f3bb/91080c4573f6f78f30bc5b48bda3ef252bf2.pdf
* VOLERE Requirements Template. Online: https://www.volere.org/
