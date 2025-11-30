---
title: "Maintainable checking strategies"
tags: [efficient]
related: [efficiency, maintainability]
permalink: /requirements/maintainable-checking-strategy
---

<div class="quality-requirement" markdown="1">

#### Context

[HTMLSanityChecker](https://github.com/aim42/htmlSanityCheck) (short: HtmlSC) is an open-source checker for HTML files. It can check multiple types of problems, but sometimes users need specific additional checks (like grammar, use of certain vocabulary, use of certain stylesheets etc). Such changes are usually **not** integrated in the main branch, but will remain in user-specific forks.

#### Trigger

A user needs a specific kind of check currently not available in HtmlSC.

#### Acceptance Criteria

- New checking algorithm is implemented and integrated in (a fork of) HtmlSC
- Integration of new check into HtmlSC takes less than 15 minutes for a developer knowledgeable in HtmlSC
- Purely structural checks (like checking availability of referenced external URLs) are implemented in less than 1 person-day of effort
- Effort and duration for implementing complex checks (e.g., those needing AI algorithms) cannot be constrained in advance

</div><br>


