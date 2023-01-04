---
layout: page
title: "Shortcomings of ISO-25010"
tags: iso-25010 quality-model
permalink: /articles/iso-25010-shortcomings
canonical_url: https://innoq.com/blog/iso-25010-shortcomings
---


<div class="arc42-help" markdown="1">
Published in 2011, the ISO-25010 standard on software product quality, lacks pragmatism and practical applicability. 
Terms like scalability, deployability, energy efficiency, safety, or code quality are missing.
This article explains these shortcomings, and shows that even the (draft) update from 2022 still needs polishing... <i class="fa-regular fa-face-frown"></i> 
</div><br>


Before we dive in, please allow some nitpicking.
### Adjectives versus Nouns
The ISO-standard (and most of the historical quality models too) is writing about the "properties of a system or product".
Such properties are really important in every day life, therefore our (natural) language provides _adjectives_ as specific category of words: 
In real life, people call things _delicious, fast, usable_ or _secure_.
Product owners want or require systems to be _responsive, reliable, testable_ or _easy to change_.

Too bad computer scientists plus the ISO-25010 standard committee plus the inventors of the historical quality models preferred to use nouns to describe properties:
They use "flexibility" instead of flexible, "Time-behaviour" instead of _fast_... and many more "...ilities" instead of the beautiful, pragmatic and understandable adjectives our languages provide.

You might consider that nitpicking, but it's definitely a linguistic downside, and makes the practical day-to-day work with quality characteristics and quality-requirements more difficult than it should be.



### ISO 25010 - An Overview
Due to ISO-25010, Software product quality is composed of eight top-level characteristics, which in turn consist of several sub-characteristics. 
Such a hierarchy is structurally very simple, but brings some small problems with it, more on this in a moment. 
All in all, the standard tries to build a generally usable ("generic") taxonomy of almost 40 terms in total - surely all stakeholders should be able to find themselves there. 

During development of a specific system or product, we have to refine that generic model for our system anyway, i.e. describe or demand those characteristics that are relevant for our specific system. 

The diagram shows the top-level characteristics of ISO-25010 in the 2011 version.

![ISO-25010-v2011-top-level-structure](/images/articles/iso-25010/ISO-25010-top-level-2011.png)


### Holes in the conceptual carpet
Developers of embedded or real-time systems in medicine, aerospace, the automotive industry, chemistry, mechanical engineering and others will immediately notice an omission: "Safety" (safety of life and limb, physical integrity, etc.) is missing from this overview. 
And no, it does not appear as a subfeature in the ISO standard either. 

Now for the teams that develop modern web or mobile applications: 
They will be surprised that operational or _DevOps_ topics like deployability are missing from the standard. 
Oh yes, scalability is also sometimes an issue in online applications - and also missing in the standard.

Well - if there are any product owners among you, they will sorely miss topics like "Time-to-Market", because you surely want to bring your product to the market or to your users in a timely manner. 
If you think that something like Time-2-Market is not a quality attribute at all: It is, however, an attribute that some stakeholders want from a system and/or its development and operation - and thus it counts as a quality attribute for these people.

My conclusion so far: A few topics relevant from a practical point of view are missing in the current version of the ISO-25010 standard. 
This is certainly not dramatic, because we can add them to our system-specific model. 
But in a stardard-document as detailed as the ISO-25010 is in many parts, there would have certainly been room for those missing pieces.


### Confusion Under the Hood
Let's dive into details, and head over to the so-called subcharacteristics of ISO-25010. 
About 40
What does the standard have to offer?

![ISO-25010-v2011-details](/images/articles/iso-25010/ISO-25010-details-v2011.png)

On the one hand, I am overwhelmed by the multitude of terms, but quality also has many facets. 
My bigger mental question mark relates to the subtree _functional suitability_. 
This term definitely exceeds my everyday vocabulary. 
For me, "suitability" refers to the entire system, not just its function. 
It goes further, because for the associated subfeatures, the standard beats _functional adequacy_. 
I, at least, have failed to understand the difference between "suitability" and "adequacy." 

Let's look further, to _maintainability_ and _transferability_: conceptually, I see no real difference between "changeability" (subcharacteristic of maintainability) and "adaptability" (subcharacteristic of transferability). 
I don't want to _adapt_ systems only for transfer to another operating system, but also to _adapt_ them to changed requirements. The ISO-guys make a distinction, which I fail to comprehend.

Next thing: testability falls under maintainability, not reliability... which is at least disputable. 
Testing definitely has something todo with reliability, at least in my world. 
But I am not a standardization body <i class="fa-regular fa-face-grin"></i> 


My conclusion so far: A lot of mass, but a few nutrients (e.g. conceptual consistency and clarity) are missing. 
These and other problems with ISO-25010 have been worked out in detail by e.g. Len Bass et. al. [^bass]

### Does the 2022-Draft Improve the Situation?
When ISO announced an update to the 2011-version in a mailing list in mid-November 2022, my expectations were high.
After all, ISO has had time since 2011 to come up with a better proposal. 
At first glance, it is noticeable that the top-level features have grown to 9, see the diagram below.


![ISO-25010-draft-2022-details](/images/articles/iso-25010/ISO-25010-details-draft-2022.png)

Still I see overlapping terms in the areas of "maintainability" and "flexibility". 
This remains dubious even when considering the [ISO definitions](https://www.iso.org/obp/ui/#iso:std:iso-iec:25010:dis:ed-2:v1:en):

* Flexibility: ability to meet different or extended requirements, the ease with which changes can be adapted to requirements or the system environment.
* Maintainability: ability to be changed effectively and efficiently.

In my understanding, these two sentences basically say the same things.
In practice, that will lead to useless discussion or confusion.

In _Usability_, _Aesthetics_ and _Accessibility_ are replaced by _Engagement_ and _Assistance_.  
Again, we could argue about this - but in my perception, the term "Accessibility" has become established in the UI/UX field, which is why this replacement rather bothers me.

In the new version I consider it positive that:

* finally _scalability_ has been added, as a subcharacteristic of _flexibility_, and
*-* _maturity_ has now become_faultlessness_.

### Practical Use?
You can obviously use the ISO-25010 standard as a checklist to be reminded of possible omissions regarding specific quality requirements. 
In my opinion, however, a well-designed top level would be sufficient for this (our arc42-quality-model defines just one level!).

The price of almost 140 Swiss francs for the ISO-25010 standard certainly prevents many from reading the complete document. 
In addition, ISO prescribes a meta-model with Quality-in-Use, Data-Quality, Service Quality and Product Quality - which in my opinion makes them too difficult to digest for real world projects.

### Summary

ISO-25010 is neither fast food nor gourmet dinner. 
In my opinion, even the 2022 draft update of ISO-25010 doesn't go beyound canteen food. 
Versatile, but difficult to access due to the multitude of terms (as well as the meta model). 
The often abstract definitions of terms build up superfluous hurdles for practioners to overcome. 
Concrete examples of practical applications are missing (again, arc42 to the rescue).

In my opinion, less would have been more. 
Instead of nearly 40 terms at various levels, I personally think a limitation to 10 or fewer top-level features is sufficient, coupled with suggestions for specific quality requirements ("concretization"). 

In this respect, Len Bass and Co. have done a great job with their fundamental work [^bass] - they had already invented the concept of "quality scenarios" many years ago, and followed up with a multitude of practical examples in the current fourth edition. 
We covered their work in [another article](/articles/sei-quality-model).

Hopefully, our arc42 quality model will be more useful to development projects. 

<hr class="with-no-margin"/>

[^bass]: Len Bass et. Al: Software Architecture in Practice, Fourth Edition, Addison-Wesley 2022.  

