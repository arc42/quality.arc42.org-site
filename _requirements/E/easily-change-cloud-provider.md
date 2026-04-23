---
title: "Easily change cloud provider"
tags: [flexible]
related: [flexibility, portability, maintainability, adaptability]
permalink: /requirements/change-cloud-provider
---

#### Requirement

The production system must be portable enough that it can be moved to another supported cloud provider without major redesign.

#### Acceptance Criteria

- Migration effort: in a portability exercise for the current production baseline, migration of deployment, configuration, data access, and observability to a second supported cloud provider is completed within **<= 15 person-days**; source: portability exercise report; horizon: annual review or each major platform change.
- Functional equivalence: after the migration, **100%** of critical smoke tests and **>= 95%** of the top **20** automated integration tests pass on the target provider without application code changes outside provider-adaptation points; source: CI and migration validation report; horizon: each portability exercise.
- Gate behavior: if either threshold is missed, new provider-specific dependencies are not approved without an explicit architectural exception; source: architecture review record; horizon: every major platform change.
