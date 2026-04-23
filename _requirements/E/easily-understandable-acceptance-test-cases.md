---
title: "Understandable acceptance test cases"
tags: [usable, suitable]
related: [understandability, learnability, testability, maintainability]
permalink: /requirements/understandable-acceptance-tests
---

#### Requirement

Acceptance test cases written in the domain-specific test language must be understandable and independently extendable by testers without software-development background.

#### Acceptance Criteria

- Onboarding comprehension: in an onboarding exercise with **>= 5 new testers**, **>= 80%** correctly explain the intent and main structure of a representative acceptance test within **<= 60 min**; scope: current DSL, test template, and documentation set; source: moderated onboarding exercise log; horizon: each major DSL or template release.
- Independent authoring: in the same evaluation, **>= 80%** of participants create or modify one acceptance test for a new business rule within **<= 45 min** without developer assistance; scope: representative business scenarios from the current release; source: exercise review report; horizon: each major DSL or template release.
- Gate behavior: if either threshold is missed, release of DSL, template, or documentation changes is blocked within **<= 1 business day** after the evaluation report is available; scope: all major changes to the acceptance-test authoring experience; source: release gate log; horizon: every major DSL or template release.

#### Monitoring Artifact

Acceptance-test authoring evaluation report and release gate.
