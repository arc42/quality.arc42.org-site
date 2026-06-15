---
layout: approach
title: "Blue-Green Deployment"
tags: [operable, reliable]
supported_qualities: [availability, deployability, releasability, recoverability]
supported_qualities_notes:
  availability: "Switching all traffic at the router gives zero-downtime releases — users see no maintenance window."
  deployability: "The new version deploys to an idle environment and is validated there before any user traffic arrives."
  releasability: "Release decouples from deploy: the version goes live the instant traffic is flipped, on the team's schedule."
  recoverability: "Traffic rollback is instant — flip back to the still-running previous environment, with no rebuild or redeploy."
tradeoffs: [cost, code-complexity]
tradeoff_notes:
  cost: "Running two production-grade environments doubles infrastructure spend for compute, and for stateful tiers also storage and licences, while the idle side sits unused between releases. Trimming the standby to save money erodes the zero-downtime and instant-rollback guarantees the tactic exists to provide."
  code-complexity: "Blue and green usually share one database, so every schema change must stay backward- and forward-compatible across both versions at once. The application carries expand/contract migration code and version-tolerant read and write paths, and that compatibility logic persists long after the release completes."
intent: "Release a new version with zero downtime by running it on an idle, identical environment, then switching all traffic to it at once."
mechanism: "Keep two identical application environments in production, blue and green. One serves live traffic while the other stays idle. Deploy and validate the new version on the idle one, then repoint the router or load balancer to it. The previous environment stays running as the rollback target."
applicability: "Use for stateless or compatibility-tolerant services behind a router where downtime windows are costly and fast rollback matters. Skip when environment duplication is unaffordable, or when stateful schema and data migrations cannot be made compatible across both versions — then a rolling or canary release fits better."
related: [canary-deployment]
related_notes:
  canary-deployment: "The two canonical safe-rollout tactics: blue-green flips all traffic at once for instant rollback; a canary widens exposure step by step under live metrics."
related_requirements: [available-7-24-99, low-change-failure-rate, unavailability-max-2-minutes]
related_requirements_notes:
  available-7-24-99: "Cutting over to a pre-warmed environment releases new versions without a downtime window, protecting the monthly uptime objective."
  low-change-failure-rate: "Validating the new version in the idle environment before cut-over, with instant rollback on trouble, holds deployment-caused incidents and rollback rate down."
  unavailability-max-2-minutes: "The cut-over itself causes no outage, and a rehearsed rollback flip restores the previous version well inside a two-minute downtime bound."
permalink: /approaches/blue-green-deployment
---

Blue-green deployment runs two identical application environments in production. At any moment one — blue — serves all live traffic while the other, green, sits idle. A new release goes onto the idle environment, where it is migrated, smoke-tested, and warmed up off the user's path. When it passes, a single routing change cuts all traffic over. The old environment stays running as the rollback target: flipping back restores traffic in seconds, and restores correctness as long as the new version's data changes stayed backward-compatible.

![Blue-green deployment: a load balancer routes live traffic to the Blue (v1) environment while the validated Green (v2) one stays idle; flipping the router cuts traffic over to Green. Both share one database.](/assets/img/approaches/blue-green-deploy.webp)

## How It Works
- Place blue and green behind one router or load balancer so traffic targets either on demand.
- Deploy the new version to the idle environment; run migrations, smoke tests, and warm-up there.
- Flip the router to send all production traffic to the validated environment in one atomic switch.
- Keep the previous environment running untouched, so a second flip rolls back in seconds.

## Failure Modes
- A shared database takes an incompatible schema change, and the migration breaks the version still serving live traffic.
- Sessions or connections pinned to the old environment drop at cut-over when the app skips connection draining.
- The idle environment drifts from production config, so a release passes validation yet fails under real traffic.

## Verification
- Synthetic probes against the newly live environment stay green through the switch window, with zero failed checks.
- Connection draining lets in-flight requests on the old environment complete at cut-over, with zero requests dropped during the switch.
- A rollback drill flips traffic back and confirms the previous version resumes within the recovery-time objective (e.g. under 60 s).
- Schema-compatibility tests pass against both old and new application versions before any migration runs.

## Variants and Related Tactics
- Canary release shifts a small traffic share first, trading the all-at-once switch for graded exposure.
- Rolling deployment replaces instances in place without a duplicate environment — lower cost, but no instant rollback.
- DNS-based switching repoints a DNS record instead of a router — no shared routing layer needed, but TTLs and resolver caches make the cut-over gradual and rollback slow rather than atomic.

## References
- [BlueGreenDeployment](https://martinfowler.com/bliki/BlueGreenDeployment.html) — Martin Fowler
- [Continuous Delivery](https://www.oreilly.com/library/view/continuous-delivery-reliable/9780321670250/) — Jez Humble & David Farley, Addison-Wesley, 2010
- [Accelerate](https://itrevolution.com/product/accelerate/) — Forsgren, Humble & Kim ([full citation](/references/#forsgren-accelerate))
