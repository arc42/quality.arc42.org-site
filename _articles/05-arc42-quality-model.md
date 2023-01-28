---
layout: page
title: "arc42 Quality Model"
tags: arc42 quality-model
permalink: /articles/arc42-quality-model
---


The arc42 quality model Q42 (pronounced "Kju-Fortytwo" or "Kju-Four-Two") is simple, pragmatic yet effective approach to product and system quality.
It starts with **stakeholders' expectations and requirements**.

Based upon typical stakeholder needs, Q42 consists of just 8 key system properties, which are sufficient to cover most, if not all, required, desireable or expected of the more than 100 [_traditional_ qualities](/qualities).

![arc42 quality model](/images/arc42-system-qualities-overview.svg)

But let's start at the beginning:
### Goals for Q42

* minimal, yet covering most of the traditional product and system quality properties
* simple and understandable explanations of our top-level properties
* supported by extensive and free (online) documentation
* free and open-source, maintained in a public repository
* technology- and vendor-neutral 
* agnostic to develoment methods

### Fresh Approach
Existing models like ISO-25010 propagated a fixed hierarchy (like a tree) of system qualities.
Within this _tree_, it is often difficult or impossible to determine to which of the top-level characteristics a particular and specific quality requirement belongs. 
Therefore, Q42 breaks new ground by proposing only 8 adjectives (like _flexible_) as core quality properties.

It uses adjectives instead of nouns (like _flexibility_), which better reflects stakeholder expectations like _"I need XYZ to be flexible"_.
These core properties (like reliable, flexible, usable, efficient etc) are used like labels or tags:
Specific quality requirements might have several of such labels or tags.

It has been unclear to me for years that those responsible for ISO and other quality models write about "quality attributes", but fail to use that type of words in their respective models.
But that is a minor thing, despite being immediately visible.

To facilitate stakeholder communication and understanding, Q42 contains definitions and explanations for more than 100 different _traditional_ system or product qualities, all labelled or tagged with one or several of the 8 key properties.

#### Example Quality Requirements

#### Hyperlinks as Best-Friends
All terms and example-requirements are cross-referenced (_hyperlinked_).



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
| `#flexible`| flexible during development (easy to change and enhance), flexible concerning infrastucture and environments, flexible at runtime (configurable, adjustable, integratable)|
| `#efficient`| fast, responsive, efficient in terms of memory, cpu, threads, network and other resources, efficiently maintainable and operable|
| `#usable`| easy and pleasurable to use, attractive, aesthetic|
| `#operable`| easy to install, operate, monitor and administer, adequate operational costs|
| `#testable`| easy to test with reliable and consistent results, also in the sense of "easy to analyze or evaluate"|
| `#secure`| consistent, accountable, confidential, integrous |
| `#safe`| fail safe, isolating faults, warns of hazards early, identifies risks early |

### Code and Architecture Qualities
In several of the historical quality models, the development teams' interest was either completely ignored or had low priority.
In 1978, [Barry Boehm](/articles/02-quality-models) proposed to care for _structuredness, conciseness_ and _legibility_, but in later models, for example in the ISO-25010 standard, these properties are out of scope.

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
