---
title: "Service Circuit Breakers and Graceful Degradation"
tags: [reliable, safe]
related: [failure-transparency, availability, resilience, fault-tolerance]
permalink: /requirements/circuit-breaker-failure-transparency
---

<div class="quality-requirement" markdown="1">
#### Context/Background

The system depends on multiple upstream services (payments, profiles, notifications). Transient upstream failures must not cascade or break core user flows.

#### Metric/Acceptance Criteria

* Implement circuit breakers with automatic open/half‑open/close states and exponential backoff.
  - Sliding window: 10–60s time window or 20–200 requests minimum sample size (use both where supported).
  - Failure‑rate threshold: 20–50% (default 50%); require min 20 requests before evaluation.
  - Cool‑down (open state): 10–60s; half‑open probes: 1–5 concurrent trial requests; close after 5–10 consecutive successes.
  - Timeouts per dependency: 200–1500ms typical; retries: 0–2 with jittered exponential backoff (cap 2–5s).
* Dependency classification and strategies:
  - Critical dependencies (payments, auth): prefer graceful degradation with cached/queued fallbacks; stricter thresholds (e.g., 20–30% failure trip), shorter timeouts, fewer retries.
  - Non‑critical (recommendations, analytics): fail‑silent with placeholders or skip; looser thresholds (e.g., 40–50%), longer cool‑downs.
  - Each dependency must declare timeout, retry policy, trip threshold, and fallback behavior in config.
* Recovery testing:
  - Exercise half‑open → closed transitions in tests by restoring upstream health; require ≥5 consecutive probe successes to close; ensure queued work drains without user‑visible errors.
  - Verify state resets do not cause thundering herds (limit probe concurrency; retain backoff until closed).
* When a breaker opens, the user experience degrades gracefully (e.g., hide recommendations, queue notifications) while core operations succeed; display a neutral placeholder, never a stack trace.
* All client calls are idempotent (PUT/DELETE with idempotency keys; POST with dedup keys) to allow safe retries.
* Latency and errors during failure injection:
  - Median end‑user latency increases by ≤20%; p95 ≤ 2× baseline, p99 ≤ 3× baseline.
  - Edge error rate (5xx/timeouts) ≤ 0.5% over any rolling 10‑minute window.
* Observability (must track and dashboard):
  - Per‑dependency p50/p95/p99 latency; success/error rates by error type (timeout, connect error, 5xx, 4xx policy).
  - Breaker state transitions, time in state, open/close counts, half‑open probe success rate.
  - Retry counts, backoff/cancel rates, queue depth, and client/thread‑pool saturation.
* Validate via chaos exercises at least quarterly (inject 5xx, timeouts, and 2× latency), demonstrating compliance with thresholds and successful recovery to closed state.

</div><br>
