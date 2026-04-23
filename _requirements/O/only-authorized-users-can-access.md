---
title: "Only authenticated users can access data"
tags: [secure]
related: [access-control, confidentiality, security, privacy]
permalink: /requirements/only-authenticated-users-can-access
---

#### Requirement

Access to protected data and business functions requires successful authentication and an authorization decision for the requested action and resource.

#### Acceptance Criteria

- Unauthenticated denial: in automated security tests covering **100%** of protected API routes and primary UI entry points, **100%** of requests without a valid session are denied or redirected to login within **<= 1 s**; source: security regression test report; horizon: every pull request.
- Unauthorized access denial: in release-candidate tests with **>= 20** representative cross-role and cross-tenant access attempts, **100%** of out-of-scope reads, writes, and admin actions are denied and written to the audit log within **<= 30 s**; source: authorization test report and audit-log review; horizon: every release candidate.
- Gate behavior: if either threshold is missed, release of the affected authentication or authorization change is blocked within **<= 10 min** after the test report is available; source: CI/CD gate log; horizon: every pull request and release candidate.
