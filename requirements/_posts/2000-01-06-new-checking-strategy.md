---
title: "Maintainable checking strategies"
tags: efficient
related: efficiency, maintainability,
permalink: /scenarios/maintainable-checking-strategy
---

<div class="quality-requirement" markdown="1">

**Stimulus**: A user needs a specific kind of check currently not available in HtmlSC

**Reaction**: The new checking algorithm is implemented and integrated in (a fork of) HtmlSC.

**Metrics**: 

* The integration of the new check into HtmlSC takes less than 15min for a developer knowledgeable in HtmlSC
* Purely structural checks (like checking the availability of referenced external URLs) shall be implemented in less than 1person-day of effort
* The effort and duration for implementing suchs check in general cannot be constrained in advance. For example, checks needing artificial intelligence algorithms might need significant time to be implemented and tested.

**Background**: [HTMLSanityChecker](https://github.com/aim42/htmlSanityCheck) (short: HtmlSC) is an open-source checker for HTML files.
It can check multiple types of problems, but sometimes users need specific additional checks (like grammar, use of certain vocabulary, use of certain stylesheets etc)

Such changes are usually **not** integrated in the main branch, but will remain in user-specific forks.

</div><br>




