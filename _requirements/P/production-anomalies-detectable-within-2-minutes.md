---
title: "Production anomalies detectable within 2 minutes"
tags: [operable]
related: [observability, analysability, debuggability, mean-time-to-recovery]
permalink: /requirements/production-anomalies-detectable-within-2-minutes
---

<div class="quality-requirement" markdown="1">

#### Context

An e-commerce platform runs as a distributed system with multiple services.
Operations engineers must detect and assess production anomalies quickly — without accessing source code or redeploying instrumentation.

#### Trigger

A production anomaly occurs (e.g., elevated error rate, latency spike, resource exhaustion, or unexpected traffic pattern).

#### Acceptance Criteria

- The anomaly is visible on operational dashboards **within 2 minutes** of onset
- All services emit structured logs (JSON) with at minimum: timestamp, severity, service name, trace ID, and error category
- All inter-service calls are captured as distributed traces with end-to-end latency breakdown per hop
- Key runtime metrics (request rate, error rate, p95 latency, CPU, memory) are collected **at ≤ 30-second** granularity
- Dashboards allow drill-down from system-wide overview to individual service metrics without custom queries
- Alerting rules trigger automated notifications **within 90 seconds** of threshold breach

</div>
