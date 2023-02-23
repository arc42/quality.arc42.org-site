---
layout: page
title: "Shortcomings of ISO 25010"
tags: iso-25010 quality-model
permalink: /articles/iso-25010-shortcomings
canonical_url: https://innoq.com/blog/iso-25010-shortcomings
---



Abstract: Published in 2011, the [ISO 25010 standard on software product quality](https://www.iso.org/standard/35733.html) lacks pragmatism and practical applicability.
Terms like scalability, deployability, energy efficiency, safety, or code quality are missing.
This article explains these shortcomings and shows that even the (draft) update from 2022 still needs polishing…



Before we dive into the details, please allow me some nitpicking.


### Adjectives versus Nouns
The ISO standard (and most of the historical quality models too) is writing about the "properties of a system or product".
Such properties are crucial in everyday life, therefore our (natural) language provides _adjectives_ as a specific category of words:
In real life, people call things _delicious, fast, usable_ or _secure_.
Product owners want or require systems to be _responsive, reliable, suitable_, or _easy to change_.


Too bad, computer scientists plus the ISO 25010 standard committee, as well as the inventors of traditional quality models, preferred to use nouns to describe properties:
They use "flexibility" instead of _flexible_, "time-behaviour" instead of _fast_ and many more "...ilities" instead of the beautiful, pragmatic, and understandable adjectives our languages provide.


You might consider this nitpicking, but it's definitely a linguistic downside, which makes the practical day-to-day work with quality characteristics and quality-requirements more difficult than it needs to be.






### ISO 25010 - An Overview
Due to ISO 25010, software product quality is composed of eight top-level characteristics, which in turn consist of several sub-characteristics.
While such a hierarchy is structurally simple, it gives rise to serious disadvantages - but more on that in a moment.
Altogether, the standard attempts to establish a widely usable ("generic") taxonomy of almost 40 terms in total. Presumably, all stakeholders should be able to recognize their goals and requirements represented there. In reality, this is not the case, as you will see right away.


During development of a specific system or product, we have to refine that generic model for our system anyhow: We need to describe or demand those characteristics (aka qualities) that are relevant for our specific system.


The diagram shows the top-level characteristics of ISO 25010 from the  2011 version, which is still the official version. 


![ISO-25010-v2011-top-level-structure](/images/articles/iso-25010/ISO-25010-top-level-2011.png)



### Holes in the conceptual carpet
Developers of embedded or real-time systems in medicine, aerospace, the automotive industry, chemistry, mechanical engineering, and others will immediately notice an omission: "Safety" (safety of life and health, physical integrity, etc.) is missing from this overview.
And no, it does not appear as a subfeature in the ISO standard either.


Now for the teams that develop modern web or mobile applications:
They will be surprised that operational or _DevOps_ topics like deployability are missing from the standard.
Oh yes, scalability, which is usually a challenge in online applications, is missing too.


Well – if there are any product owners among you, they will likely miss "Time-to-Market" (TTM) because you surely want to bring your product to the market or to your users in a timely manner.
If you think that something like TTM is not a quality attribute at all: It is, however, an attribute that some stakeholders want from a system, and thus it counts as a quality attribute for them.


My conclusion so far: A few topics relevant from a practical standpoint are missing in the current version of the ISO 25010 standard.
This is certainly not dramatic because we can add them to our system-specific model.


However, in a standard document as detailed as ISO 25010 presents itself in many parts, there certainly would have been room for those missing pieces.




### Confusion under the Hood
Let's dive into the details, and head over to some of the about 40 so-called sub-characteristics of ISO-25010.


![ISO-25010-v2011-details](/images/articles/iso-25010/ISO-25010-details-v2011.png)

Figure 2: ISO 25010:2011 detailed view


Their sheer number might seem overwhelming at first, but let’s ignore this for now[^more-qualities].


[^more-qualities]: The 40 qualities from ISO 25010 might seem a large number, but one can easily identify way more potential _qualities_, when considering a broader range of stakeholders. [Wikipedia](https://en.wikipedia.org/wiki/List_of_system_quality_attributes) lists nearly 90 “system quality attributes”, the collection on [quality.arc42.org](https://quality.arc42.org) even more. 




#### Functionality, _no lo comprende_[^spanish]
Let’s start on the left of figure 2: The _functional suitability_ subtree causes some confusion, at least in my head:
At first, this term is quite uncommon, and definitely exceeds my everyday vocabulary.


[^spanish]:For readers who, like myself, lack Spanish language skills: “I don’t understand that.”


For me, "suitability" refers to the entire system, not just its function. A system needs _suitable_ performance, availability and so on, not just suitable functionality. 
It goes further: One of the subfeatures is _functional adequacy_.
I, at least, have failed to understand the difference between "suitability" and "adequacy".


#### Adapt, Maintain, Change?
Let's look further, to _maintainability_ and _transferability_: conceptually, I see no real difference between "changeability" (subcharacteristic of maintainability) and "adaptability" (subcharacteristic of transferability).
I want to _adapt_ systems to changed requirements, not only adapt them for transfer to another operating system. 
This distinction might lead to confusion in practice.


#### Limits of the Strict Hierarchy
From my perspective, a tree structure is not suitable to structure a multi-faceted term like “quality”, as a strict hierarchy has its limits. Consider some examples:


* “Testability”: ISO positions testability under maintainability, which is understandable: When maintaining or changing systems, testability is an important property, to reduce risks. But: From my experience, people also consider testability an indispensable part of reliability. Therefore, testability should occur in both subtrees, not only under maintainability.
* “Availability” is located below reliability. However, if a system is not available, it is not usable. Therefore, availability also belongs to usability.
* “Adaptability” belongs to both portability and maintainability, but ISO decided to put it below portability only. 


A strictly hierarchical placement of system qualities will always be disputable. 
Another approach would be to allow detailed qualities to be “taggable”, so a specific quality might be tagged (or labelled) with more than just one top-level quality property. 
The recently published arc42 quality model allows exactly that (see [2]).


My conclusion so far: A lot of mass, but important nutrients (e.g. conceptual consistency and clarity) are missing.
These and other problems with ISO 25010 have initially been pointed out by Len Bass et al.[^bass]


### Does the 2022-Draft Improve the Situation?
When ISO announced an update to the 2011-version in a mailing list in mid-November 2022, my expectations were high.
After all, ISO has had 11 *years* to come up with an improved proposal.
At first glance, it is noticeable that the top-level features have grown from 8 to 9, see the diagram below.


![ISO-25010-draft-2022-details](/images/articles/iso-25010/ISO-25010-details-draft-2022.png)



Safety has made it into this draft. Definitely a massive step forward.
Still, I see overlapping terms in the areas of "maintainability" and "flexibility".
This remains dubious even when considering the [ISO definitions](https://www.iso.org/obp/ui/#iso:std:iso-iec:25010:dis:ed-2:v1:en):


>* Flexibility: ability to meet different or extended requirements, the ease with which changes can be adapted to requirements or the system environment.
>* Maintainability: ability to be changed effectively and efficiently.


From my perspective, these two sentences are too similar, and leave way too much room for interpretation. 
That will lead to useless discussions in practice.


Below the _usability_ category, _aesthetics_ and _accessibility_ are replaced by _engagement_ and _assistance_. 
Again, we could argue about this — but in my perception, the term "accessibility" has become established in the UI/UX field, which is why this replacement rather bothers me.


In the new version, I consider it positive that:


* _scalability_ has been added, as a subcharacteristic of _flexibility_, and
* _maturity_ has now become_faultlessness_.


### Isn't Software made up from Code?
Although internal structure, legibility and conciseness have been part of previous quality models (Boehm[^boehm] mentioned these qualities in his model from 1978!), the ISO refused (or forgot?) to include such properties in their model.


In my opinion, development teams are important stakeholders, and structure and readability of code will often be essential goals for them.
Ignoring code quality and component structure as quality requirements is simply not acceptable from my experience, and I consider their absence a serious deficit in the ISO 25010 standard.


### Practical Use?
Although one can use the ISO 25010 standard as a checklist for specific quality requirements, a smaller but well-chosen selection of terms would be sufficient for this.
For example, the arc42 quality model (Q42) consists of just eight key properties, instead of the 35 terms from ISO 25010.


Maybe the most serious disadvantage of ISO 25010 is the complete lack of specific examples of how to apply the model to practical, real-world systems. That leaves development teams and other system stakeholders out in the cold. Len Bass et al.[^bass] have proven in their book that such examples can be systematic and useful. [arc42](https://quality.arc42.org) followed suit, providing numerous tagged and cross-referenced examples of quality requirements.


Another potential source of unwanted complexity is the ISO metamodel[^ISO25010], which distinguishes Quality-in-Use, Data Quality, Service Quality and Product Quality.
In my opinion, this makes the ISO 25010 model overly difficult to digest for real-world projects.




My final complaint is the paywall: The price of almost 140 Swiss Francs (approx. €140 and US-$140) might prevent people from reading the complete document. 




### Fast Food or Gourmet Dinner?


ISO 25010 is neither.
Even the 2022 draft update of ISO 25010 doesn't go beyond canteen food:
Versatile, but difficult to access due to the multitude of overlapping and sometimes confusing terms 
Formality-lovers will adore the metamodel, but practitioners will lack practical guidance.
The often abstract definitions of terms build up superfluous hurdles.
Specific, usable examples of practical applications are missing (again, arc42 to the rescue).


In my opinion, less would have been more:
Instead of nearly 40 terms at various levels, a few top-level features would be sufficient, coupled with suggestions or examples for each of thems.




In this respect, Len Bass and Co. have done an outstanding job with their fundamental work [^bass]. They had already invented the concept of "quality scenarios" many years ago.
In their fourth and latest edition of their book, they followed up with a multitude of practical examples.
You can find a brief overview of their work in [another article](/articles/sei-quality-model).


### Acknowledgements
Thanx to “m” , Anja Kammer, Daniel Lauxtermann, Joachim Praetorius and Ben Wolf for bug fixing and dramatically improving the quality of this post. Thanx to Eberhard Wolff for encouragements.



### References


[^bass]: Len Bass et. Al: Software Architecture in Practice, Fourth Edition, Addison-Wesley, 2022. 


[^boehm]: Boehm, B. W., Brown, H., Lipow,M. (1978) “Quantitative Evaluation of Software Quality,”, TRW Systems and Energy Group, 1978. This source is hard to come by. Their approach is covered in a comparative study of [Software Quality Models](https://enos.itcollege.ee/~nafurs/suvi2019/huvitavat/alternatiivid_FURPSile.pdf).


[^iso25010]: The meta-model is part of the official documentation in the “ISO/IEC 2501n Quality Model Division”, explained within the non-public parts of 25010. It refers to additional standards 25011 (IT service quality model), 25012 (Data quality model) and 25019 (Quality-in-use model). 


[^Q42]: arc42 Quality Model, online on https://quality.arc42.org








