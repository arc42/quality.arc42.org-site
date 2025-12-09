---
title: Budget constrained library update
tags: [efficient, suitable]
related: [affordability, cost, budget-constraint, time-to-market]
permalink: /requirements/budget-constraint-library-update
---

<div class="quality-requirement" markdown="1">

#### Context

The system uses a commercial library as a core component. An automated build and test pipeline is available for all developers within their development environment. The commercial library receives regular monthly security updates, and in some cases (e.g., zero day exploits) additional updates are delivered from the vendor.

#### Trigger

Product owner requires incorporation of library security updates with limited manual effort.

#### Acceptance Criteria

- Library update completes within maximum time budget of 2 developer-hours on average
- Automation costs (build and test) not included as infrastructure already exists

</div><br>





