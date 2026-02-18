---
title: "Any passing build deploys to production within 15 minutes"
tags: [operable, suitable]
related: [deployability, releasability, testability]
permalink: /requirements/deploy-to-production-within-15-minutes
---

<div class="quality-requirement" markdown="1">

#### Context

A multi-tenant SaaS platform delivers continuous updates to hundreds of enterprise customers.
The development team practices trunk-based development and aims to minimise the gap between code merge and live deployment to accelerate feedback and reduce integration risk.

#### Trigger

A developer merges a feature branch into the main branch and all CI pipeline checks pass (unit tests, integration tests, static analysis, security scan).

#### Acceptance Criteria

- The end-to-end pipeline — from merge to full production rollout — completes in **≤ 15 minutes** (p95 over 30 consecutive deployments)
- Deployments use a rolling or blue/green strategy; **zero requests return HTTP 5xx** attributable to the deployment process during rollout
- If the post-deployment error rate (5xx responses) exceeds **1% over any 60-second window**, automated rollback triggers **within 90 seconds** of threshold breach
- Rollback completes and the previous version serves 100% of traffic within **5 minutes** of rollback initiation
- The deployment pipeline enforces at least: compilation, unit tests (≥ 85% statement coverage), one integration test suite, and a lightweight DAST scan — none of these gates may be manually bypassed on the main branch
- Pipeline failure rate due to flakiness (excluding real defects) remains **below 2%** averaged over any rolling 7-day window

</div>
