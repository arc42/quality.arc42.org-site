---
title: "Governance policies are enforced and auditable"
tags: [operable, secure]
related: [governability, compliance, accountability, auditability, security]
permalink: /requirements/governance-policy-enforcement
---

<div class="quality-requirement" markdown="1">

#### Context

Multiple services process sensitive and regulated data under centrally defined organizational policies (for access control, data handling, retention, and model usage).

#### Trigger

A policy is created, changed, or violated.

#### Acceptance Criteria

- New/updated policies are distributed to all in-scope enforcement points within **15 minutes**.
- At least **99.5%** of in-scope requests are evaluated against active policies.
- Policy violations are detected and logged within **60 seconds**.
- Corrective action (automatic block/quarantine or incident ticket) starts within **5 minutes** of violation detection.

</div><br>
