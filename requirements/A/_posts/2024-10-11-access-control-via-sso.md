---
title: "Access Control via SSO"
tags: usable suitable secure
related: access control, auditability 
permalink: /requirements/access-control-via-sso
---

<div class="quality-requirement" markdown="1">

**Background**: Employees in companies often have a central username/password pair or certificate used to log in via a Single Sign On (SSO) solution, such that they do not have to maintain different credentials per system. If a new system is added to the company's portfolio, it should make use of the centralized authentication system.

**Source**: User

**Stimulus**: authenticates using their SSO credentials

**Artifact**: on the expert system.

**Reaction**: System performs transparently the login via SSO.

**Metric**: A successful login is confirmed in less than 3 seconds. The user has their correct role and rights after login.

</div><br>