---
title: "Service Circuit Breakers and Graceful Degradation"
tags: reliable safe
related: failure-transparency, availability, resilience, fault-tolerance
permalink: /requirements/circuit-breaker-failure-transparency
---

<div class="quality-requirement" markdown="1">
#### Context/Background

The system depends on multiple upstream services (payments, profiles, notifications). Transient upstream failures must not cascade or break core user flows.

#### Metric/Acceptance Criteria

* Implement circuit breakers with automatic open/half‑open/close states and exponential backoff. Default trip on ≥50% failures over 20 requests or 10s window; configurable per dependency.
* When a breaker opens, the user experience degrades gracefully (e.g., hide recommendations, queue notifications) while core operations succeed; display a neutral placeholder, never a stack trace.
* All client calls are idempotent (PUT/DELETE with idempotency keys; POST with dedup keys) to allow safe retries.
* Median end‑user latency increases by ≤20% during injected upstream failures (5xx/timeout), and error rate at the edge remains ≤0.5%.
* Provide runbooks and alerts for breaker state changes; record metrics (success/failure rates, time open) and expose them to SRE dashboards.
* Validate via chaos exercises at least quarterly (failure injection of 5xx and 2x latency), demonstrating compliance with the above thresholds.

</div><br>

