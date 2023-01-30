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

Quality consists of many characteristics. 
Therefore, quality is usually captured in a model or terminology that contains these
characteristics and their relationships. 
Such quality models show what people consider important when talking about quality.

### A Bit of History

In 1977, McCall suggested to model quality as a hierarchy of terms, whose first level consists of _Operation, Revision_ and _Transition_. To revision he counted e.g. Maintainbility, Flexibility and Testability.

Just a year later, Barry Boehm published his slightly enhanced model, including inner qualities like _structuredness_ and _legibilit_.

Next were authors at Hewlett-Packard and IBM who published FURPS and its extension FURPS+, the latter found proper acceptance in practice due to its integration into the (once popular) IBM Rational Unified Process. 

The ISO organization then took up the issue, publishing vendor- and product-neutral standards since 1991, starting with ISO-9126, which "lasted" for 20 years, and was superseded in 2011 by ISO-25010, which is still in effect today. 
Both were considered the conceptual reference for software quality, and have gained considerable currency in practice. 
In my humble opinion, this is largely due to the fact that the ISO bodies define the terms used quite properly. 
Therefore, they can be forgiven for simply ignoring (or forgetting?) some really relevant quality characteristics.
I also liked quality features of the VOLERE Requirements Template, which, however, have found less acceptance in the German-speaking world than the ISO standards.

### Quick-Check of Software Quality Models

| Authors / Name| Year | Summary | Nr of Quality attributes |
|:--------|-----:|:--------|:-------------------------|
| McCall  | 1977 | Hierarchical model, 2 levels. Top-level areas: _operation_, _revision_, _transition_. Predecessor of current quality models. | 11 |
| Boehm   | 1978 | Hierarchical model, 3 levels. Top-level qualities: _utility, maintainability, portability_. See below for more info. | 23 |
| ISO-9126 | 1991| Hierarchical model, 2 levels, 6 top-level qualities. No safety, security underrated, disputable terminology | 27 |
| R. Grady, FURPS | 1992 | Single level with _functionality, useability, reliability, performance, supportability_. Lacks operational qualities and safety | 6 |
| IBM FURPS+ | 1999 | Add lots of sub-characteristics to FURPS, adressing _requirements_ in general. Part of the (overly complex) Rational-Unified process | 30 |
| VOLERE | 1999 | Integrated in sophisticated template for requirements. Combines qualities and constraints | 8 |
| ISO-25010 | 2011 | Superseedes ISO-9126. Hierarchical model with 8 top-level qualities. Adds security as top-level. Widespread, afaik. Disputable definitions of terms. | 32 |
| Bass et. al | 2022 | One level, see [this article](/_articles/sei-quality-model). Practical, with a few rough edges. | 10 |
| ISO-25010, draft 2022 | 2022 | Proposal to add safety and change a number of terms and definitions. Still [disputable terminology](/articles/iso-25010-shortcomings), overly complex for day-to-day use.  | 39 |

### Boehm Software Quality Model
Barry Boehm supposedly was the first to propose a hierarchical model of software quality, with three top-level qualities, that are refined on two further levels. 
When looking into details of his model, one will notice that several attributes from level-2 and level-3 are referenced multiple times, making this model more of a graph than a tree.
In my opinion, this is perfectly realistic, but the later ISO-standards got rid of this pragmatic feature.

![Boehm Quality Model](/images/articles/quality-models/Boehm-Quality-Model.svg)

Please consider this model within the historical perspective: No private person owned a computer, as the personal computer hadn't been invented.
Only very few companies used them, and programming computers was a black art that only a few _magicians_ could apply.

With this perspective, the Boehm model was incredible farsighted, as it included inner quality attributes like _legibility_ and _structuredness_ (which became for)
### FURPS+ for Classifying Requirements ([[Eeles-2005]](#Eeles-2005))
Robert Grady (from Hewlett-Packard) proposed the following schema for classifying requirements:

>* _Functionality_
>* _Usability_ is concerned with characteristics such as aesthetics and consistency in the user interface.
>* _Reliability_ is concerned with characteristics such as availability (the amount of system "up time"), accuracy of system calculations, and the system's ability to recover from failure.
>* _Performance_ is concerned with characteristics such as throughput, response time, recovery time, start-up time, and shutdown time.
>* _Supportability_ is concerned with characteristics such as testability, adaptability, maintainability, compatibility, configurability, installability, scalability, and localizability.
>
>The "+" represented several additional categories, such as design-, implementation-, interface- and physical- requirements.
>
>From [[Eeles-2005]](#Eeles-2005)

Despite the lack of security, safety, resource-consumption and operational qualities, this model was (and likely still is) intensively used in practice.

### The ISO Standards 9126 and 25010
_Design-by-Committee_ is regarded as a _suboptimal approach to development_ - and in my opinion that happened to the ISO-standards for software quality.
Instead of just unifying definitions from Boehm and FURPS, the invented a kind of meta-model, distinguishing between five different areas of quality (see figure below).
Divisions? Model and Management? Measurement and Evaluation? 
These distinctions seem overly complicated from my practitioners' viewpoint.

![Areas of quality as defined by ISO](/images/articles/quality-models/ISO-25-Meta-Structure.svg)

I really wonder if anybody working in development projects (except me) ever took the time to read through all those standards. (Ok, I exaggerated, I read only 25010, but that was hard-enough work).

Apart from being in wide use, these models really lack practical applicability, although the (still inofficial draft) update from November 2022 somewhat improves the situation).
I covered a few downsides in my [article on ISO-25010 shortcomings](/_articles/03-iso-25010-shortcomings.md).
To summarize:

* Overly many terms, with a lot of overlap.
* Critical qualities (e.g. safety, scalability, operational properties) missing from the official version
* Despite proposing 30+ attributes, code- and architectural qualities are missing
* No examples how the ISO-model might be applied to real-world problems 


But the standards would not have survived as long if they didn't contain some goodies:
The ISO defines all terms contained within the standard, and _these_ definitions are available free-of-charge.
Although some of these definitions are quite academic, they provide a nice starting point, and help to avoid conflict when discussing with different stakeholders.


### SEI Quality Model

>A quality attribute (QA) is a measurable or testable property of a system that is used to indicate how well the system satisfies the needs of its stakeholders beyond the basic function of the system. 
>You can think of a quality attribute as measuring the “utility” of a product along some dimension of interest to a stakeholder.
>
>[Len Bass et. al, 2022, p. 39](/references/#bass-swa-practice)


For Bass and his colleagues, quality consists of 10 major properties, depicted in the following overview.

![10-top level quality attributes from SEI](/images/articles/sei-2022/sei-quality-model-v2022.png)

Whow, what a difference - only 10 _areas_ instead of 40 terms in the ISO 25010 standard.
They differentiate these qualities into two categories:

>We will focus on two categories of quality attributes. The first category includes those attributes that describe some property of the system at runtime, such as availability, performance, or usability. 
>The second category includes those that describe some property of the development of the system, such as modifiability, testability, or deployability.
>
>[Len Bass et. al, 2022, p. 42](/references/#bass-swa-practice)


For their work, a huge "thank you" goes to Len Bass and his colleagues, for providing an alternative to the ISO-25010 approach. 
They did a great job, and their book is definitely recommended to read in full (please use the fourth edition, as it was heavily updated and modernized!)

Now comes my "but": Their approach can imho be further improved. 
Let me consider the SEI-Model step-by-step:


* _Availability_ is surely an important goal for many systems, but I know of many systems (or services) that need to work only on certain occasions, and can be turned off the rest of the time. Therefore, I suggest to make "reliable" the top-level goal, and availability is part of that.
* _Deployability_ is great for online- and mobile systems, that are built in highly automated continous-integration workflows. Real-time and embedded systems are (even in 2023) deployed less often, and with less automation. Next thing is, that once the system is deployed, we definitely need to administer, configure and monitor it. Therefore, I suggest to make "operable" a top-level quality, and consider "deployable" a sub-goal of that.
* _Energy-efficiency_ is in many people's mind, partially due to the incredible increase in energy-consumption by IT infrastructure worldwide. But energy is just one critical resource: What about water, and carbon-dioxide? Again, I prefer a slightly more general term, "resource-efficient". That even makes "Performance" redundant.
* _Modifiability_ sounds important, but here again I consider additional aspects: Sometimes I don't want to modify a system, just install it on another operating system. Or configure a new database for it. In my opinion, the general term is "flexible". That even allows for removing "Integrability" from the SEI wishlist.
  
### arc42 Quality Model
Trying to learn from its predecessors (or, as others have called it "it's easy to stand high on the shoulders of giants"), arc42 proposes a simple, efficient and practical model.

### References 

* L R. B. Grady, Practical Software Metrics for Project Management and Process Improvement. Contains the FURPS-Model Prentice Hall, 1992.
* ISO-25010, https://www.iso.org/standard/35733.html
* Eeles, Peter: Non-functional Requirements, online: https://pdfs.semanticscholar.org/f3bb/91080c4573f6f78f30bc5b48bda3ef252bf2.pdf

<a id="boehm-1978">[Boehm-1978]</a> Barry W. Boehm, Characteristics of Software Quality, North-Holland Publishing Company, 1978

<a id="astrotech">[Astrotech]</a> Matt Harasymczuk on Astrotech, explanation of quality models, [online](https://dev.astrotech.io/sonarqube/quality-models.html)

<a id="jamwal">[Jamwal-2009]</a> Jamwal et. Al: Comparative Analysis of Different Software Quality Models. Proceedings of the 3rd National Conference; INDIACom-2009, online: https://enos.itcollege.ee/~nafurs/suvi2019/huvitavat/alternatiivid_FURPSile.pdf

<a id="McCall-1977">[McCall-1977]</a> McCall, J. A., Richards, P. K., and Walters, G. F., "Factors in Software Quality", National Technical Information Service, no. Vol. 1, 2 and 3, 1977.

<a id="Eeles-2005">[Eeles-2005]</a> Eeles, Peter: Capturing Architectural Requirements, IBM Developerworks 2005, available via [archive.org](https://web.archive.org/web/20201112020231/http://www.ibm.com/developerworks/rational/library/4706.html#N100A7)

<a id="volere">[volere]</a> VOLERE Requirements Template. Online: https://www.volere.org/
