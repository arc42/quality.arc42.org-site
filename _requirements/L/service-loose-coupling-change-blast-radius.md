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

- CI architecture tests report **0** imports from another service's internal code/packages.
- Cross-service direct database access is **0**; communication is only via API/event contracts.
- Over a rolling 90-day window, at least **85%** of production changes affect **one service only**, and **0%** affect more than **2 services**.
- A planned API/schema change in one service requires code changes in at most **2 downstream consumers**.
- Any single service can be deployed or rolled back in **<= 15 minutes** without redeploying other services.

</div><br>
