---
title: "Service loose coupling: change blast radius"
tags: [maintainable, suitable, efficient]
related: [loose-coupling, modularity, evolvability, deployability, independence]
permalink: /requirements/service-loose-coupling-change-blast-radius
---

<div class="quality-requirement" markdown="1">

#### Context

A microservice system with independently owned services (for example order, payment, inventory, notification).

#### Trigger

A team changes one service (internal model, API, or event schema) to implement a new feature.

#### Acceptance Criteria

- Over a rolling 90-day window, architecture/compliance checks report **0** direct dependencies on another service's internal implementation artifacts (for example internal packages, private libraries, or shared source).
- Cross-service direct database access is **0**; communication is only via explicit API/event contracts.
- Over a rolling 90-day window, at least **85%** of production changes affect **one service only**, and **0%** affect more than **2 services**.
- For contract changes introduced in a rolling 90-day window, required code changes are limited to at most **2 downstream consumers** at the **95th percentile**.
- In production, at the **95th percentile** over a rolling 90-day window, a single service can be deployed or rolled back in **<= 15 minutes** without coordinated redeployment of other services.

</div><br>
