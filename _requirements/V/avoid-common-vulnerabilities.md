---
title: Avoid common vulnerabilities
tags: [reliable, secure]
related: [vulnerability]
stakeholder: management, product-owner
permalink: /requirements/avoid-common-vulnerabilities
---

<div class="quality-requirement" markdown="1">

#### Requirement

The system must avoid common security vulnerabilities in every release and deployment.

#### Acceptance Criteria

- Zero instances of missing data encryption in production
- No OS command injection vulnerabilities present
- No SQL injection vulnerabilities present
- No buffer overflow vulnerabilities present
- All critical functions require authentication
- All protected operations require proper authorization
- File upload restricted to safe file types only
- Security decisions never rely on untrusted inputs
- 100% of releases pass security vulnerability scanning for these common vulnerabilities

</div><br>



