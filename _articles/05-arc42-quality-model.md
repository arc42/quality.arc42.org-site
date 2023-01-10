---
layout: page
title: "arc42 Quality Model"
tags: arc42 quality-model
permalink: /articles/arc42-quality-model
---

<div class="arc42-help" markdown="1">
Instead of just complaining we decided to go forward with a simple, pragmatic yet effective approach to product and system quality.

The arc42 quality model Q42 (pronounced "Kju-Fortytwo" or "Kju-Four-Two") starts with stakeholders' expectations and requirements. 
From these, we derived 8 important system properties, which are sufficient to cover most, if not all, required, desireable or expected of the nearly 100 _traditional_ qualities.

![arc42 quality model](/images/arc42-system-qualities-overview.webp)
</div><br>

### Goals for Q42

* minimal, yet covering most of the traditional product and system quality properties
* simple and understandable explanations of our top-level properties
* supported by extensive and free (online) documentation
* free and open-source, maintained in a public repository
* technology- and vendor-neutral 
* agnostic to develoment methods

### Fresh Approach
Q42 which methodically breaks new ground. 
After more than 40 years of using nouns (like "Flexibility") to describe properties (like "flexible"), we have finally turned to adjectives.
It has been unclear to me for years that those responsible for ISO and other quality models write about "quality attributes", but fail to use that type of words in their respective models.
But that is a minor thing, despite being immediately visible.

A second and fundamental difference is the abandonment of a fixed hierarchy: 
Existing models (e.g. [ISO-25010](/_articles/03-iso-25010-shortcomings)), it is often difficult or impossible to determine to which of the top-level characteristics a particular and specific quality requirement belongs. 
Take, for example, the requirement "Product search must be constantly available during office hours from 9-17 o'clock".

Does this requirement belong to availability or usability in the fixed ISO-25010 hierarchy? 
My opinion: both. 
The traditional models propose that stakeholders decide for one, but in my opinion that leads to useless discussions.

Q42 takes a different approach here: 
Instead of focusing on a fixed hierarchy of terms, Q42 relies on just eight "tags" (labels). 
This makes it possible to label a concrete quality requirement with several of these tags.

### Stakeholder first

>Forgotten stakeholders are forgotten requirements.
>
>Peter Hruschka, private conversation

Based upon the importance of stakeholders for project success, we centered our approach around the needs of the following typical stakeholder groups:

| Stakeholder Type | Typical Expectations  |
| :--- | :--- |
| User| usable in terms of providing expected and desired functions, easy and pleasant to use, reliable, available when needed, safe |
| Management| efficient in terms of development and operational cost, reliable |
| Domain expert| reliable and efficient in terms of providing required functions, flexible in terms of providing new functions,   |
| Product owner| flexible in terms of new features, |
| Developer| flexible and reliable in terms of maintaining the code, testable |
| Tester| testable, flexible in terms of automation and instrumentation, reliable in terms of reproducible test results |
| Admin| operable and reliable in terms of easily operating and administering the system, secure and reliable when integrating with other sytems, flexible in terms of execution environments, safe and secure|
| Others|  |

### Just Eight, not 35
Q42 proposes 8 "tags", which suffice to cover most (hopefully all) of the traditional qualities.
These tags should be almost self-explanatory, but I'll try to clarify them with examples:

| Tag | Meaning(s)  |
| :--- | :--- |
| `#reliable`| available, robust, dependable, fail-safe, fault-tolerant, consistent, recoverable, safe, secure|
| `#flexible`| |
| `#efficient`| |
| `#usable`| |
| `#operable`| |
| `#testable`| |
| `#secure`| |
| `#safe`| |

### Code and Architecture Qualities
In several of the historical quality models, the development teams' interest was either completely ignored or had low priority.
In 1978, [Barry Boehm](/_articles/02-quality-models) proposed to care for for _structuredness, conciseness_ and _legibility_, but in later models, for example in the ISO-25010 standard, these properties are out of scope.

From my viewpoint, development teams play a crucial role in both initial development and long-term maintenance and evolution of systems.
Therefore we should consider their requirements on the internal structure and concepts as highly relevant, for example influencing the important _time-to-market_ that most managers constantly call for.

Q42 regards development teams as first-class citizens:

* `#reliable` in terms of "we can add now features or otherwise modify the systems, and can reliably predict the consequences of our changes. We can reliably fix bugs. We can reliably predict runtime behaviour.
* `#flexible` in several dimensions, e.g. flexible module or component structure, flexible code that is easy to modify, flexible software and hardware infrastructure.
* `#usable` in terms of understandable module structures, understandable code and data structures, understandable runtime behaviour.
* `#testable` in terms of test automation, e.g. the systems allows for easy creation and maintenance of unit and acceptance tests to reduce development risks.

### Summary
The arc42 quality model has yet to prove its practical applicability, as it hit the _market_ only in January 2023.
Alas - we are highly optimistic that Q42 will mirror the usefulness of it's elder sister, the [arc42-template](https://arc42.org).

Please let us know of any positive or negative experience you encounter with our approach.
