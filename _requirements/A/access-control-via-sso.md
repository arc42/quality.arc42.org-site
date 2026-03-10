---
title: "Access Control via SSO"
tags: [usable, suitable, secure]
related: [access-control, auditability]
permalink: /requirements/access-control-via-sso
---

<div class="quality-requirement" markdown="1">

#### Context

Employees authenticate through the corporate SSO system and must receive correct application roles immediately after login.

#### Trigger

An employee initiates SSO login.

#### Acceptance Criteria

- SSO login completes at p95 ≤ 3 s with ≥ 99.5% success rate across the top 5 user roles, excluding declared IdP outage windows (authentication telemetry, rolling 30-day window).
- In release-candidate tests with ≥ 20 representative identities, 100% receive correct roles and rights immediately after login (SSO integration test report, every release candidate).
- If the IdP is unavailable or the assertion is invalid, access is denied in 100% of tested attempts and an audit-log entry is written within 30 s (failure-injection report, quarterly).

</div><br>
