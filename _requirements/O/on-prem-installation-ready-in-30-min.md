---
title: "On-prem installation ready in 30 minutes"
tags: [operable, flexible]
related: [installability, deployability, operability, maintainability]
permalink: /requirements/on-prem-installation-ready-in-30-min
---

<div class="quality-requirement" markdown="1">

#### Context

An enterprise product is deployed on customer-managed infrastructure.

#### Trigger

A fresh installation is performed on a supported operating system and platform baseline.

#### Acceptance Criteria

- A first-time installation completes within **<= 30 minutes** from start to operational verification.
- Installation requires **0** manual dependency resolution steps outside the documented installer workflow.
- In a test matrix of supported target environments, first-time installation succeeds in at least **95%** of runs.
- At completion, an automated verification check confirms all mandatory components are running and reachable.
- If installation fails, the system provides actionable diagnostics and rollback/cleanup, leaving no partially active runtime components.

</div><br>
