---
title: "Scale up in 2 Minutes"
tags: [efficient, reliable]
related: [elasticity, scalability, performance]
permalink: /requirements/scale-up-in-2-minutes
---

#### Requirement

The cloud-based web application must scale out automatically fast enough to absorb a sharp traffic increase without manual intervention and without disproportionate cost growth.

#### Acceptance Criteria

- Scale-out completion: when sustained incoming traffic rises to **150%** of the established baseline for **5 min**, the platform adds enough healthy serving capacity within **<= 2 min** after threshold breach; source: load-test report plus autoscaling and health-check events; horizon: each quarterly elasticity test.
- Post-scale stability: during the first **10 min** after scale-out, request latency stays at **p95 <= 3 s** and average CPU utilization of serving instances stays at **<= 70%** under a traffic level of **200%** of baseline; source: APM dashboard and infrastructure metrics; horizon: each quarterly elasticity test.
- Cost bound and gate: under the same **200%** traffic test, hourly compute cost rises by **<= 150%** over the baseline hour; if any threshold is missed, rollout of the changed autoscaling configuration is blocked within **<= 1 business day**; source: cost report and release gate log; horizon: each quarterly elasticity test.
