---
layout: page
title: "Challenges with Quality"
tags: quality introduction
permalink: /articles/01-challenge-with-quality
---

<div class="arc42-help" markdown="1">
Quality is one of the central topics of development teams. 
Approaches such as _Domain-Driven Design_, help us to get our systems well structured, but performance, robustness, flexibility, security and other important properties are left out. 
Therefore, I propose _Quality-Driven Software Architecture_ as a complement:
A practical approach to achieve essential quality properties.

</div><br>


### The (incredibly un-useful) Definition

Let's ask the [System-Engineering Body of Knowledge (SEBok)](https://www.sebokwiki.org/wiki/Quality_(glossary)):

>Quality: Ability of a product, service, system, component, or process to meet customer or user needs, expectations, or requirements. 
>
>(ISO/IEC/IEEE 2010)

Sounds true, but does not help in practice.

The (in my _humble opinion_) worst definition comes from the [German Wikipedia](https://de.wikipedia.org/wiki/Qualit%C3%A4t) <i class="fa-solid fa-person-circle-question"></i>

>Quality is the set of all properties of an object or system. (...) 
>Quality is the designation of a perceptible state form of systems and its characteristics, which is defined in a certain period of time on the basis of certain properties of the system in this state.
>
>[German Wikipedia/Quality](https://de.wikipedia.org/wiki/Qualit%C3%A4t)

However, this strange definitions don't in daily life.
Unfortunately, the "set of all properties" can mean just about anything. 
For real work on specific (software) products, we need this to be more concrete.

Let's start in daily life.
### What is "Quality"?

We use "quality" colloquially to express something good or positive about products or services. 
For example, we label a piece of clothing, a special meal or even a technical "gadget" as "high quality. 
Unfortunately, we usually remain unspecific as to what exactly we mean by the term "quality" in these cases.

Some time ago, I was allowed to listen to the (rather expensive) over-ear headphones of a British noble manufacturer at a valued colleague's house. 
This led to a lively discussion about what exactly constitutes the "quality" of headphones: 

Is it the
* frequency spectrum achievable by the speakers, 
* maximum achievable volume, 
* comfort while wearing the headphones, 
* weight, 
* type and number of possible connections, 
* faithful reproduction or 
* reproduction optimized for specific music genres, 
* attenuation of external noise (noise cancelling), 
* clean channel separation or 
* operability via gestures or buttons? 
* sustainable and environmentally optimized manufacturing process? 
* a production process free of child labor? 
* ear pads be replaceable? 

And what about durability, longevity or the price?

As you can see, when discussing quality, personal preferences and interests almost inevitably come into play. 
This brings up an interesting feature of quality: it is _highly subjective_.

Try to put this into concrete terms with people you know, talk about the _quality_ of everyday things: 
Tea, coffee, cheese, shoes, pants or even a smartphone: 
The exact characteristics that make up the quality of these things can (sorry, _will surely!_) lead to debates.


>_Quality is conformance to requirements._
>
>[Crosby, p.17](/references/#crosby-quality)

### Two Dimensions...

Now it's getting complicated, because the term "quality" gets two different dimensions. 

1. **Which features or attributes** count as quality (in the example: volume, frequency range, comfort, weight, connections, noise cancelling, channel separation, sustainability, interchangeability of parts)
2. **What is the desired level, value or amount** of these features (e.g. frequency response from 15 to 25000Hz, weight less than 400g, soft leather ear cups, wireless connection, jack and USB, etc.).

In order to work on "quality" in practice, we need to get a handle on both of these dimensions. 
Let's try the transition to software development at this point. 

Even for dimension-1 ("which properties belong to quality") you can surely think of a multitude of such properties, which you or other involved parties (aka stakeholders) count to quality: Performance, security, robustness and a few dozen more (see figure below). 
Scientists and practioners developed so called [quality models](/_articles/quality-models), which collect more or less of such quality attributes.


![quality terminology word cloud](/images/articles/quality-challenges/quality-terms-wordcloud.svg){:width="70%"}

###  ... and Some Problems

This is where the subjectivity of quality hits us: 
Our IT security officer or the data protection officers are guaranteed to prioritize the issue of IT security much higher than ease of use, responsiveness ("snappiness"), or robustness, which end users eagerly desire. 
Oh yes - the development team would like to see comprehensibility of the source code and traceability of the architectural decisions, as well as the use of interesting and modern technologies (which, in turn, the security people don't like at all, because security risks may still be lurking in modern technologies that have long been eliminated in "boring" old-school frameworks). 
Last but not least, the management demands the lowest possible costs for development and operation.

But these different priorities and wishes are not enough: 
Some say maintainability, others changeability or modifiability. 
Then adaptability comes into play, and extensibility. 
And last but not least, someone adds "flexibility". 
Do you all mean the same thing now, even though you used different terms? 
You see - even a discussion about proper terminology might turn out difficult. 

Once we have agreed with stakeholders on a set of relevant attributes (i.e., dimension 1 of quality), we must now define the necessary or desired characteristics (dimension 2) - i.e., formulate these quality requirements explicitly and concretely. 

Another article in this series will dive deep into this topic of specific quality requirements.

 Unfortunately, concrete quality requirements are rarely available in everyday project work.
That's when development teams start making implicit assumptions.
Such assumptions can, however, contain considerable risks.
We propose to involve stakeholders, and help them formulate their specific quality requirements.

### Compromises and miracles
A vehicle optimized for low energy consumption (about 5 kWh per 100 km, or 3l of fuel per 100 km ) cannot simultaneously be designed for high seating capacity (about 8 people) or high payload (8 tons payload). 
Tea is either flavored or not. 
One cannot accommodate long audio sequences with high sampling rates in the strictly limited memory of an embedded onboard controller with only 64kByte of available memory. 
Generally speaking, some combinations of quality characteristics make each other difficult, or even mutually exclusive. 
In software development and architecture, we often have to compromise because we can't achieve all the features to suit all stakeholders (unless you can work miracles).


### Summary
You have to clarify two dimensions when you want to have specific information on required, desired or expected levels of product quality:

1. What properties are important (e.g. performance, flexibility, security, safety...)
2. What level of these properties is required, desired or expected from the system, its development or operation?




