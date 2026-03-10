---
title: "Low effort deployment"
tags: [operable]
related: [compatibility, interoperability, portability]
permalink: /requirements/low-effort-deployment
---

<div class="quality-requirement" markdown="1">

Idea: [Bass et al., 2021](/references/#bass2021software)

#### Context

The product consumes an external authentication/authorization service from a component marketplace. Adopting new service releases must stay within predictable time and effort bounds.

#### Trigger

The product owner decides to incorporate a new marketplace release of the auth/authz service.

#### Acceptance Criteria

- Elapsed time from adoption decision to production deployment ≤ 40 h (release tracker, each service-version upgrade).
- Total human effort ≤ 120 person-hours across dev, test, ops, and release management (work-log summary, each service-version upgrade).
- Zero Sev-1/Sev-2 deployment-induced incidents and zero contractual availability breaches during the first 7 days after rollout (incident log + SLA dashboard).

</div><br>
