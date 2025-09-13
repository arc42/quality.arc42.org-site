---
title: Budget constrained library update
tags: [efficient, suitable]
related: [affordability, cost, budget-constraint, time-to-market]
permalink: /requirements/budget-constraint-library-update
---

<div class="quality-requirement" markdown="1">


#### Context/Background

* The system uses a commercial library as a core component. 
* An automated build and test pipeline for the system is in place.
This is available for all developers within their development environment.

#### Source

* This commercial library gets regular security updates every month.
* In some cases (e.g. _zero day exploits_) additional updates are delivered from the vendor. 
The product owner requires that these updates are incorporated with  only limited manual effort.

#### Metric/Acceptance Criteria

* An update of this library must be possible with a maximum time budget of less than 2 developer-hours on average.
* The cost of automation (build and test) is not considered, as these are already available.
</div><br>





