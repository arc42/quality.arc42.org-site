---
layout: page
title: "SEI Quality Model"
permalink: /articles/sei-quality-model
---

<div class="arc42-help" markdown="1">
Len Bass, Paul Clements and Rick Kazman from the _Software Engineering Institute_ (SEI) have authored the "Software Architecture in Practice" book, which saw its fourth edition in 2022.

A core message within their 400+ page book is the following:

>Software architecture enables system's quality

Within their fourth edition, the authors present a modernized approach to software quality, including concepts like "_deployability_" or "_energy efficiency_".

</div><br>


### What is "Quality"?

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

### Shortcomings of the SEI Quality Model

Please let me start with a huge "thank you" to Len Bass and his colleagues, for providing an alternative model to the (old-school) ISO-25010 approach. 
They did a great job, and their book is definitely recommended to read in full (please use the fourth edition, as it was heavily updated and modernized!)

Now comes my "but": Their approach can imho be further improved and streamlined, that's why we came up with the arc42 quality model...

But let's consider the SEI-Model step-by-step:


* Availability is surely an important goal for many systems, but I know of many systems (or services) that need to work only on certain occasions, and can be turned off the rest of the time. Therefore, I suggest to make "reliable" the top-level goal, and availability is part of that.
* Deployability is great for online- and mobile systems, that are built in highly automated continous-integration workflows. Real-time and embedded systems are (even in 2023) deployed less often, and with less automation. Next thing is, that once the system is deployed, we definitely need to administer, configure and monitor it. Therefore, I suggest to make "operable" a top-level quality, and consider "deployable" a sub-goal of that.
* Energy-efficiency is in many people's mind, partially due to the incredible increase in energy-consumption by IT infrastructure worldwide. But energy is just one critical resource: What about water, and carbon-dioxide? Again, I prefer a slightly more general term, "resource-efficient". That even makes "Performance" redundant.
* Modifiability sounds important, but here again I consider additional aspects: Sometimes I don't want to modify a system, just install it on another operating system. Or configure a new database for it. In my opinion, the general term is "flexible". That even allows for removing "Integrability" from the SEI wishlist.
  
### From SEI to arc42...

The following diagram shows how the (compact) arc42 quality model relates to the (slightly heavier) SEI model.

![from SEI-model to arc42-quality-model](/images/articles/sei-2022/sei-to-arc42qm.png){:width="50%"}



### Summary
The SEI quality model proposes only 10 major quality attributes, which is a great simplification when compared to the (somewhat bloated) ISO-25010 model (described in detail in [another article](/articles/iso-25010-shortcomings))