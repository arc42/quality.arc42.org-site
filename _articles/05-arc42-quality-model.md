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
| User| |
| Management| |
| Domain expert| |
| Product owner| |
| Developer| |
| Tester| |
| Admin| |
| Other| |

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

### Summary
The arc42 quality model has to prove its practical applicability, as it hit the _market_ only in January 2023.
Alas - we are highly optimistic that Q42 will mirror the usefulness of it's elder sister, the arc42-template.

Please let us know of any positive or negative experience you encounter with our approach.
