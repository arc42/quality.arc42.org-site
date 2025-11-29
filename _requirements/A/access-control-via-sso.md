---
title: "Access Control via SSO"
tags: [usable, suitable, secure]
related: [access-control, auditability]
permalink: /requirements/access-control-via-sso
---

<div class="quality-requirement" markdown="1">

#### Context

Employees in companies often have a central username/password pair or certificate used to log in via a Single Sign On (SSO) solution, such that they do not have to maintain different credentials per system. If a new system is added to the company's portfolio, it should make use of the centralized authentication system.

#### Trigger

User authenticates using their SSO credentials on the expert system.

#### Acceptance Criteria

- SSO login completes transparently in less than 3 seconds
- User receives correct role and rights assignments after successful authentication

</div><br>
