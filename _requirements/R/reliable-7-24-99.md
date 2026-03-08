---
title: "Available 7x24 with 99% uptime"
tags: [operable, usable, reliable]
related: [availability, high-availability, reliability, operability, user-error-protection, interaction-capability]
permalink: /requirements/available-7-24-99
---

<div class="quality-requirement" markdown="1">

#### Requirement

The user-facing service scope consisting of login, landing page, and the three most-used business transactions must remain continuously available with a monthly uptime objective of at least 99%.

#### Acceptance Criteria

- Availability objective: over each rolling **30-day** window, the defined service scope achieves **>= 99.0%** successful synthetic checks from at least **3** independent monitoring regions at **1 min** intervals; source: uptime dashboard and probe logs; horizon: continuous 24x7 operation.
- Incident detection: any outage of the defined scope lasting **> 5 min** triggers an on-call alert within **<= 2 min** after the fifth failed check; source: monitoring and alerting log; horizon: every production incident.
- Breach behavior: if the remaining monthly error budget drops below **20%**, non-urgent production releases are paused within **<= 30 min** until the service owner records a mitigation decision; source: incident log and release calendar; horizon: each 30-day window.

</div><br>
