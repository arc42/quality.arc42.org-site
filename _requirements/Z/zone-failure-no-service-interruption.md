---
title: "Zone failure: no service interruption"
tags: [reliable, operable]
related: [redundancy, availability, fault-tolerance, resilience]
permalink: /requirements/zone-failure-no-service-interruption
---

<div class="quality-requirement" markdown="1">

#### Context

A business-critical online service must remain available during infrastructure failures.

#### Trigger

One complete availability zone (or equivalent independent failure domain) becomes unavailable.

#### Acceptance Criteria

- The production deployment provides **N+1** capacity for stateless service workloads across at least **2** independent failure domains.
- Loss of one failure domain causes **0** user-visible outage for core functions.
- After failover stabilization, sustained throughput remains at least **95%** of pre-failure baseline.
- At the **95th percentile**, end-user response time degradation stays within **<= 20%** of pre-failure baseline.
- Automatic failover and recovery actions are completed within **<= 60 seconds** in quarterly resilience drills.

</div><br>
