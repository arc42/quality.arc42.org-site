---
title: "Handle sudden increase in traffic"
tags: [reliable]
related: [resilience, reliability, elasticity, scalability]
permalink: /requirements/handle-sudden-increase-in-traffic
---

<div class="quality-requirement" markdown="1">

#### Context

The web application runs in a cloud-based environment with multiple servers. It must remain serviceable during sudden traffic surges and tolerate single-node failure.

#### Trigger

A quarterly resilience drill simulates traffic at 300% of baseline within 5 min, sustained for 15 min.

#### Acceptance Criteria

- Successful response rate ≥ 99% and p95 end-user latency ≤ 4 s during the surge (load-test + APM report, quarterly).
- Loss of one serving node during the surge causes zero accepted-request loss; traffic redistributes to healthy nodes within 60 s (load-balancer metrics, quarterly).
- If either threshold is missed, rollout of the affected scaling/traffic-management change is blocked within 1 business day (release gate log).

</div><br>
