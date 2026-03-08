---
title: "Portable Business Data Checker"
tags: [flexible, operable]
related: [portability, adaptability, flexibility]
permalink: /requirements/portable-business-data-checker
---

<div class="quality-requirement" markdown="1">

#### Requirement

The business-data checker must remain portable across the supported relational database engines so that vendor version changes do not require major redesign or long support gaps.

#### Acceptance Criteria

- Version support readiness: for each supported engine family, the latest generally available major version of MySQL, PostgreSQL, Oracle Database, and Db2 passes **100%** of connector smoke tests and **>= 95%** of the top **20** integrity-check scenarios within **<= 10 business days** after vendor release; source: compatibility matrix and CI test report; horizon: each relevant major database release.
- Adaptation effort: enabling support for one new major database version requires **<= 2 person-days** of development and regression-test effort for the existing checker scope; source: engineering work log and release ticket; horizon: each relevant major database release.
- Gate behavior: if either threshold is missed, that database version is marked unsupported in product documentation and blocked from production rollout within **<= 1 business day** after the failed validation; source: release note and support-status log; horizon: each compatibility validation.

</div><br>
