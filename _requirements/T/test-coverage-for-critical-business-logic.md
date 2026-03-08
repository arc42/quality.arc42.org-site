---
title: "Test Coverage for Critical Business Logic"
tags: [maintainable]
related: [test-coverage, testability, maintainability]
permalink: /requirements/test-coverage-for-critical-business-logic
---

<div class="quality-requirement" markdown="1">

#### Context

A business application contains critical pricing, billing, and eligibility logic where unnoticed regressions would cause financial or contractual errors. The engineering lead needs lightweight but reliable evidence that this logic is exercised sufficiently by automated tests before changes are merged.

#### Trigger

A change affecting a critical business-logic module is proposed for merge to the main branch.

#### Acceptance Criteria

- Branch coverage: automated tests achieve **>= 85% branch coverage** for all modules classified as critical business logic; 
- Requirement coverage: **>= 95%** of high-risk business rules for the changed scope are linked to at least one automated test case; 
- Failure-path behavior: if either coverage threshold is missed, the merge is blocked within **<= 2 min** after the coverage report is produced; 


</div><br>
