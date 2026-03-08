---
title: "Efficient change of business rules"
tags: [flexible, efficient, maintainable]
related: [flexibility, changeability, adaptability, configurability]
permalink: /requirements/luggage-routing
---

<div class="quality-requirement" markdown="1">

#### Context

Luggage routing at an airport depends on origin, destination, stopovers, and current government travel warnings. When an official warning changes, the affected routing rules must be updated quickly enough that inspections and routing decisions stay compliant.

#### Trigger

An official government travel warning relevant to an origin, destination, or stopover location is published or changed.

#### Acceptance Criteria

- Rule rollout latency: the updated routing rules are active in production within **<= 4 h** after publication of the warning; source: publication timestamp and deployment/change log; horizon: every warning change.
- Impact correctness: in the regression suite for affected routes, **100%** of impacted luggage-routing cases follow the new warning-based rule after rollout; source: rule-validation test report; horizon: every warning change.
- Failure-path behavior: if the updated rule cannot be rolled out within **4 h**, all newly affected routes switch to the predefined restrictive inspection path within **<= 15 min** and operations are alerted; source: rule-engine events and alert log; horizon: every missed rollout target.

</div><br>
