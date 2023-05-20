---
layout: page
title: "Quality Models"
permalink: /articles/quality-models
---

<div class="arc42-help" markdown="1">
Since 1976, (scientific) minds have been arguing about a conceptual model around the topic of _software product quality_.
A number of authors proposed different approaches [[astrotech.io+2022](https://dev.astrotech.io/sonarqube/quality-models.html)], until 1991 the ISO organization took over and began publishing its vendor- and product neutral standards ISO-9126.
In 2011, that was replaced by the ISO-25010, which is still in active use.

Too bad that _active use_ does **not** correspond to practical or usable...

This article presents a few quality models and comes to a (potentially) surprising conclusion...

</div><br>

### Why do we need a Quality Model
Quality consists of many characteristics. 
Therefore, quality is usually captured in a model or terminology that contains these
characteristics and their relationships. 
Such quality models show what people consider important when talking about quality [[Jamwal+2009]](/references/#jamwal).

Quality models define a _common language_ for terms related to product, system and software quality.

### A Bit of History

In 1976, [[Boehm+1976]](/references/#boehm1976quantitative) published their quality model, including inner qualities like _structuredness_ and _legibility_. Take a look at the original paper, it is a nice example of _historical typesetting_, some graphs look like drawn with a ball pen :-).

<a name="mccall"></a>[[McCall+1977]](/references/#mccall1977factors) suggested to model quality as a hierarchy of terms, whose first level consists of _Operation, Revision_ and _Transition_. To revision, he counted e.g. Maintainability, Flexibility and Testability.


Next [[Grady+1992]](/references/#grady1992practical) at Hewlett-Packard published FURPS and its extension FURPS+, the latter found proper acceptance in practice due to its integration into the (once popular) IBM Rational Unified Process [[Eeles+2005]](/references/#eeles2005capturing). 

The ISO organization then took up the issue, publishing vendor- and product-neutral standards since 1991, starting with ISO-9126, which "lasted" for 20 years, and was superseded in 2011 by ISO-25010, which is still in effect today. 
Both were considered the conceptual reference for software quality, and have gained considerable currency in practice. 
In my humble opinion, this is largely due to the fact that the ISO bodies define the terms used quite properly. 
Therefore, they can be forgiven for simply ignoring (or forgetting?) some really relevant quality characteristics.
I also liked quality features of the [VOLERE Requirements Template](/references/#volere), which, however, have found less acceptance than the (omnipresent?) ISO model.

### Quick-Check of Software Quality Models

| Authors / Name| Year | Summary | Nr of Quality attributes |
|:--------|-----:|:--------|:-------------------------|
| [Boehm](#boehm)   | 1976 | Hierarchical model, 3 levels. Top-level qualities: _utility, maintainability, portability_. See below for more info. | 23 |
| [McCall](#mccall)  | 1977 | Hierarchical model, 2 levels. Top-level areas: _operation_, _revision_, _transition_. Predecessor of current quality models. | 11 |
| [ISO-9126](#iso) | 1991| Hierarchical model, 2 levels, 6 top-level qualities. No safety, security underrated, disputable terminology | 27 |
| [R. Grady, FURPS](#eeles) | 1992 | Single level with _functionality, usability, reliability, performance, supportability_. Lacks operational qualities and safety | 6 |
| [IBM FURPS+](#eeles) | 1999 | Add lots of sub-characteristics to FURPS, addressing _requirements_ in general. Part of the (overly complex) Rational-Unified process | 30 |
| [VOLERE](/references/#volere) | 1999 | Integrated in sophisticated template for requirements. Combines qualities and constraints | 8 |
| [ISO-25010](#iso) | 2011 | Supersedes ISO-9126. Hierarchical model with 8 top-level qualities. Adds security as top-level. Widespread, AFAIK. Disputable definitions of terms. | 32 |
| [Bass et al.](#sei) | 2022 | One level, see [this article](/articles/sei-quality-model). Practical, with a few rough edges. | 10 |
| [ISO-25010, draft 2022](/references/#iso-25010-2022) | 2022 | Proposal to add safety and change a number of terms and definitions. Still [disputable terminology](/articles/iso-25010-shortcomings), overly complex for day-to-day use.  | 39 |

### Boehm Software Quality Model ([[Boehm+1976]](/references/#boehm1976quantitative), [[Boehm+1978]](/references/#boehm1978characteristics))
<a name="boehm"></a>
Barry Boehm supposedly was the first to propose a hierarchical model of software quality, with three top-level qualities, that are refined on two further levels. 
When looking into the details of his model, one will notice that several attributes from level-2 and level-3 are referenced multiple times, making this model more of a graph than a tree.
In my opinion, this is perfectly realistic, but the later ISO-standards got rid of this pragmatic feature.

![Boehm Quality Model](/images/articles/quality-models/Boehm-Quality-Model.svg)

Please consider this model within the historical perspective: No private person owned a computer, as the personal computer hadn't been invented.
Only very few companies used them, and programming computers was a black art that only a few _magicians_ could apply.

With this perspective, the Boehm model was incredibly farsighted, as it included inner quality attributes like _legibility_ and _structuredness_ (which got lost in modern models like ISO)

### FURPS+ for Classifying Requirements ([[Grady+1992]](/references/#grady1992practical), [[Eeles+2005]](/references/#eeles2005capturing))
<a name="eeles"></a>
Robert Grady and Peter Eeles (from Hewlett-Packard) proposed the following schema for classifying requirements:

>* _Functionality_
>* _Usability_ is concerned with characteristics such as aesthetics and consistency in the user interface.
>* _Reliability_ is concerned with characteristics such as availability (the amount of system "uptime"), accuracy of system calculations, and the system's ability to recover from failure.
>* _Performance_ is concerned with characteristics such as throughput, response time, recovery time, start-up time, and shutdown time.
>* _Supportability_ is concerned with characteristics such as testability, adaptability, maintainability, compatibility, configurability, installability, scalability, and localizability.
>
>The "+" represented several additional categories, such as design-, implementation-, interface- and physical- requirements.
>
>[[Eeles+2005]](/references/#eeles2005capturing)

Despite the lack of security, safety, resource-consumption and operational qualities, this model was (and likely still is) intensively used in practice.

### The ISO Standards 9126 and 25010 ([[ISO+25010]](/references/#iso-25010-2011))
<a name="iso"></a>
_Design-by-Committee_ is regarded as a _suboptimal approach to development_ - and in my opinion that happened to the ISO-standards for software quality.
Instead of just unifying definitions from Boehm and FURPS, the invented a kind of metamodel, distinguishing between five different areas of quality (see figure below).
Divisions? Model and Management? Measurement and Evaluation? 
These distinctions seem overly complicated from my practitioners' viewpoint.

![Areas of quality as defined by ISO](/images/articles/quality-models/ISO-25-Meta-Structure.svg)

I really wonder if anybody working in development projects (except me) ever took the time to read through all those standards. (Ok, I exaggerated, I read only 25010, but that was hard-enough work).

Apart from being in wide use, these models really lack practical applicability, although the (still unofficial draft) update from November 2022 somewhat improves the situation).
I covered a few downsides in my [article on ISO-25010 shortcomings](/articles/iso-25010-shortcomings).
To summarize:

* Overly many terms, with a lot of overlap.
* Critical qualities (e.g. safety, scalability, operational properties) missing from the official version
* Despite proposing 30+ attributes, code- and architectural qualities are missing
* No examples of how the ISO-model might be applied to real-world problems 


But the standards would not have survived as long if they didn't contain some goodies:
The ISO defines all terms contained within the standard, and _these_ definitions are available free-of-charge.
Although some of these definitions are quite academic, they provide a nice starting point, and help to avoid conflict when discussing with different stakeholders.


### SEI Quality Model
<a name="sei"></a>
>A quality attribute (QA) is a measurable or testable property of a system that is used to indicate how well the system satisfies the needs of its stakeholders beyond the basic function of the system. 
>You can think of a quality attribute as measuring the “utility” of a product along some dimension of interest to a stakeholder.
>
>[[Bass+2021, p. 39]](/references/#bass2021software)


For Bass and his colleagues, quality consists of 10 major properties, depicted in the following overview.

![10-top level quality attributes from SEI](/images/articles/sei-2022/sei-quality-model-v2022.png)

Wow, what a difference - only 10 _areas_ instead of 40 terms in the ISO 25010 standard.
They differentiate these qualities into two categories:

>We will focus on two categories of quality attributes. The first category includes those attributes that describe some property of the system at runtime, such as availability, performance, or usability. 
>The second category includes those that describe some property of the development of the system, such as modifiability, testability, or deployability.
>
>[[Bass+2021, p. 42]](/references/#bass2021software)


For their work, a huge "thank you" goes to Len Bass and his colleagues, for providing an alternative to the ISO-25010 approach. 
They did a great job, and their book is definitely recommended to read in full (please use the fourth edition, as it was heavily updated and modernized!)

Now comes my "but": Their approach can IMHO be further improved. 
Let me consider the SEI-Model step-by-step:


* _Availability_ is surely an important goal for many systems, but I know of many systems (or services) that need to work only on certain occasions, and can be turned off the rest of the time. Therefore, I suggest making "reliable" the top-level goal, and availability is part of that.
* _Deployability_ is great for online- and mobile systems, that are built in highly automated continuous integration workflows. Real-time and embedded systems are (even in 2023) deployed less often, and with less automation. Next thing is, that once the system is deployed, we definitely need to administer, configure and monitor it. Therefore, I suggest making "operable" a top-level quality, and consider "deployable" a sub-goal of that.
* _Energy-efficiency_ is in many people's mind, partially due to the incredible increase in energy-consumption by IT infrastructure worldwide. But energy is just one critical resource: What about water, and carbon-dioxide? Again, I prefer a slightly more general term, "resource-efficient". That even makes "Performance" redundant.
* _Modifiability_ sounds important, but here again I consider additional aspects: Sometimes I don't want to modify a system, just install it on another operating system. Or configure a new database for it. In my opinion, the general term is "flexible". That even allows for removing "Integrability" from the SEI wishlist.
  
### arc42 Quality Model
Trying to learn from its predecessors (or, as others have called it "it's easy to stand high on the shoulders of giants"), arc42 proposes a simple, efficient and practical model.
