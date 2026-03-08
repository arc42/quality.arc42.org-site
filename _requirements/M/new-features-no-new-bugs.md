---
title: "New Features Introduce No Bugs"
tags: [reliable]
related: [predictability, reliability, changeability]
stakeholder: management, product-owner, developer
permalink: /requirements/new-features-introduct-no-bugs
---

<div class="quality-requirement" markdown="1">

#### Requirement

Each newly released feature must have a bounded escaped-defect rate in the days immediately after release.

#### Acceptance Criteria

- Escaped defect count: each new feature introduces **<= 1** customer-visible defect within the first **10 days** after release; source: defect tracker with release linkage; horizon: every feature release.
- Severity guard: each new feature introduces **0** high-severity production defects within the first **10 days** after release; source: incident log and release report; horizon: every feature release.
- Gate behavior: if either threshold is missed, the next feature release requires explicit corrective-action approval before promotion; source: release governance record; horizon: every missed feature-quality target.

</div><br>
