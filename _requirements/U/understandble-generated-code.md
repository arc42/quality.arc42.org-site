---
title: "Understandable generated code"
tags: [maintainable]
related: [understandability, maintainability, readability, code-readability, legibility]
permalink: /requirements/understandable-generated-code
---

<div class="quality-requirement" markdown="1">

#### Requirement

Code generated from XML-based test specifications into Java, Kotlin, or Groovy must be understandable and safely modifiable by developers or testers without studying the generator internals.

#### Acceptance Criteria

- Static readability gate: generated files changed by a generator update contain **0 blocker or critical readability issues**; scope: all changed generated files in each pull request; source: static-analysis report; horizon: every pull request.
- Modification task success: in a release-candidate review with **>= 10 representative generated test files**, **>= 90%** of assigned change tasks are completed correctly within **<= 30 min per file** by the intended audience; scope: adding one assertion, test-data variant, or setup adjustment without generator changes; source: moderated review log; horizon: each release.
- Gate behavior: if either threshold is missed, release of the generator change is blocked within **<= 10 min** after the report is available; scope: all generator changes affecting emitted test code; source: CI gate logs; horizon: every pull request or release candidate.

#### Monitoring Artifact

Generator quality gate and release-readiness report for generated test code.

</div><br>
