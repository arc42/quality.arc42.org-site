---
title: "Fleet OTA updates with safe rollback"
tags: [operable, maintainable]
related: [updateability, maintainability, recoverability, availability, security]
permalink: /requirements/fleet-ota-updates-with-safe-rollback
---

<div class="quality-requirement" markdown="1">

#### Context

A long-lived IoT product fleet is deployed across customer sites and updated remotely over heterogeneous networks.  
Timely and safe delivery of software fixes is required to reduce security exposure and operational support effort.  
This quality is critical for fleet operations and product security stakeholders.

#### Trigger

A signed software update is released for deployment to active devices in the production fleet.

#### Acceptance Criteria

- Deployment reach: at least **99%** of active online devices receive and activate the released update within **48 hours**; scope: devices that connected at least once during the 48-hour window; source: fleet management telemetry; horizon: each update release.
- Update success rate: successful update completion is **>= 98.5%** across targeted devices without manual intervention; scope: per release wave; source: device update status reports; horizon: each update release.
- Atomic failure handling: for failed updates, automatic rollback restores the previously running version within **<= 2 minutes** in **>= 99.9%** of failure cases; scope: controlled failure-injection tests with at least **500** devices per release; source: integration test rig and device heartbeat logs; horizon: each update release.
- Remote recoverability: incidents caused by update attempts are resolved without physical access for **>= 99.5%** of affected devices within **24 hours**; scope: update-related incidents in production; source: service-desk records and fleet operation logs; horizon: rolling quarter.
- Failure-path rollout control: if post-update critical-fault rate exceeds **0.5%** of updated devices over any **30-minute** window, rollout is automatically paused within **<= 10 minutes** and on-call alerting is issued within **<= 5 minutes**; scope: production rollout waves; source: rollout controller metrics and alerting system; horizon: continuous during rollout.

#### Monitoring Artifact

Fleet update compliance dashboard with per-wave reach, rollback, fault-rate, and remote-recovery metrics.

</div><br>
