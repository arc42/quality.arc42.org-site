---
title: "Fast shutdown time (less than 10 sec)"
tags: [efficient]
related: [time-behaviour, speed, shutdown-time]
permalink: /requirements/fast-shutdown-time
---

<div class="quality-requirement" markdown="1">

#### Context

The central employee database contains highly sensitive personal data. If credentials are suspected to be compromised, the system must isolate that database quickly enough to reduce the window for data exfiltration.

#### Trigger

An authorized emergency shutdown command for the employee database is issued during a suspected credential-compromise incident.

#### Acceptance Criteria

- Isolation latency: the database rejects all new application read and write connections within **<= 10 s** after the shutdown command is issued; source: database connection log and incident timeline; horizon: every shutdown drill and incident.
- Session cutoff: **100%** of active privileged application sessions against the database are terminated or blocked within **<= 20 s** after the shutdown command; source: session-management log and drill report; horizon: every shutdown drill and incident.
- Failure-path behavior: if either threshold is missed, network-level isolation is activated within **<= 60 s** and the incident is escalated automatically; source: network-control log and alert record; horizon: every missed shutdown target.

</div><br>
