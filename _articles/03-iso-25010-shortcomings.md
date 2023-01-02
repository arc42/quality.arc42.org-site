---
layout: page
title: "Shortcomings of ISO-25010"
tags: iso-25010 quality-model
permalink: /articles/iso-25010-shortcomings
---

Published in 2011, the ISO-25010 standard on software product quality, lacks pragmatism and practical applicability. 
This article explains these shortcomings, and shows that even the (draft) update from 2022 still needs polishing... <i class="fa-regular fa-face-frown"></i> 


### ISO 25010 - An Overview
Due to ISO-25010, Software product quality is composed of eight top-level characteristics, which in turn consist of several sub-characteristics. 
Such a hierarchy is structurally very simple, but brings some small problems with it, more on this in a moment. 
All in all, the standard tries to build a generally usable ("generic") taxonomy of almost 40 terms in total - surely all stakeholders should be able to find themselves there. 

During development of a specific system or product, we have to refine that generic model for our system anyway, i.e. describe or demand those characteristics that are relevant for our specific system. 

The diagram shows the top-level characteristics of ISO-25010 in the 2011 version.

![ISO-25010-v2011-top-level-structure](/images/articles/iso-25010/ISO-25010-top-level-2011.png)

Since quality is subjective, we have to ask people for their respective opinions about it - and what counts as the quality of a system for them in the first place. 
Let's get started.

### Nitpicking: Adjectives versus Nouns
The ISO-standard (and most of the historical quality models too) is writing about the "properties of a system or product".
Such properties are really important in every day life, therefore our (natural) language provides _adjectives_ as specific category of words: 
Normal people call things _reliable, flexible, fast, usable_ or _secure_.

Too bad computer scientists plus the ISO-25010 standard committee plus the inventors of the historical quality models preferred to use nouns to describe properties:
They use "flexibility" instead of flexible, "Time-behaviour" instead of _fast_... and many more "...ilities" instead of the beautiful, pragmatic and understandable adjectives our languages provide.

You might consider that nitpicking, but it's definitely a linguistic downside, and makes the practical day-to-day work with quality characteristics and quality-requirements more difficult than it should be.

But let's come back to the eight pillars of the ISO-25010 model.
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
Let's dive into deteils, and head over to the so-called subcharacteristics of ISO-25010. 
About 40
What does the standard have to offer?


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



### ISO Shortcomings
The current ISO-25010 standard lacks some practical features, such as scalability, deployability, energy efficiency, safety, or code quality.

A recent (Nov. 2022 _draft_) update proposes to add _safety_ and _scalability_, but that is still a draft, and no official standard.

