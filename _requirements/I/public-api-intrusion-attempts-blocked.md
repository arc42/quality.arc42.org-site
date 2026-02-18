---
title: "Public API intrusion attempts blocked and alerted"
tags: [secure]
related: [intrusion-prevention, intrusion-detection, security, availability]
permalink: /requirements/public-api-intrusion-attempts-blocked
---

<div class="quality-requirement" markdown="1">

#### Context

A public-facing API handles authentication and business operations for internet users and partner systems.  
The platform must prevent common attack traffic without degrading normal access for legitimate clients.  
This quality is critical for security operations and service continuity.

#### Trigger

An inbound request reaches an internet-exposed authentication or API endpoint.

#### Acceptance Criteria

- Brute-force protection: after **5 failed authentication attempts per account within 10 minutes**, further authentication attempts for that account are blocked for **15 minutes**; scope: all public auth endpoints; source: API gateway and identity logs; horizon: rolling 10-minute windows.
- Injection prevention effectiveness: in per-release security tests with at least **2,000 crafted requests** covering SQL injection, XSS, and path traversal, the blocked malicious-request rate is **>= 99.5%** and false-positive rate on benign traffic is **<= 0.1%**; source: security test harness and staging gateway logs; horizon: each release.
- Runtime blocking latency: malicious requests are blocked within **<= 500 ms at p95** under a representative load of **1,000 requests/second** on top 20 public endpoints; source: gateway telemetry and security event stream; horizon: 5-minute rolling windows.
- Failure-path behavior: if intrusion-classification services are unavailable for **> 30 seconds**, high-risk endpoints (authentication and account administration) switch to protective deny mode for **100%** of requests until recovery, and on-call alerting is emitted within **<= 60 seconds**; source: health checks and alert manager logs; horizon: continuous monitoring.
- Auditability of blocked events: **100%** of blocked requests are logged with timestamp (UTC), endpoint, attack category, request identifier, and pseudonymized source identifier, and are searchable within **<= 30 seconds**; source: SIEM ingestion metrics; horizon: rolling 30 days.

#### Monitoring Artifact

Security operations dashboard combining gateway metrics, intrusion-test reports, and SIEM event-ingestion SLIs.

</div><br>
