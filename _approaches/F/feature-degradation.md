---
layout: approach
title: "Feature Degradation"
tags: [reliable, usable]
supported_qualities: [graceful-degradation, availability, resilience, recoverability]
supported_qualities_notes:
  graceful-degradation: "This is the concrete tactic behind the graceful-degradation quality: shed non-essential features so core function survives a partial failure."
  availability: "Keeping the core path serving a reduced feature set avoids a full outage when a dependency or capacity limit is hit."
  resilience: "Disabling the features bound to a failing dependency contains the fault instead of letting it spread to the core."
  recoverability: "Degraded mode holds the system up while failed dependencies recover, then features re-enable as health returns."
tradeoffs: [usability, consistency, code-complexity]
tradeoff_notes:
  usability: "Users see a thinner experience; without clear signalling they may read missing features as broken, raising support load and eroding trust."
  consistency: "Serving cached or default values during degradation lets different users see divergent data until the dependency recovers and caches refill."
  code-complexity: "Each degradable feature needs a fallback path, a health signal, and re-enable logic, multiplying the states the team must build and test."
intent: "Shed non-essential features when a dependency or resource fails, so the system preserves its core function instead of failing whole."
mechanism: "Rank features by criticality, watch per-dependency health signals, and disable or simplify non-essential features when a signal crosses its threshold, re-enabling them once health recovers."
applicability: "Use when a system has a clear critical core and optional features that can be dropped under stress, and partial service beats none. Skip when every feature is essential or a degraded result is unsafe."
related_requirements: [handle-sudden-increase-in-traffic, zone-failure-no-service-interruption, server-fails-operation-without-downtime]
related_requirements_notes:
  handle-sudden-increase-in-traffic: "Dropping optional features under a traffic spike frees capacity for the core path to stay within its response-time budget."
  zone-failure-no-service-interruption: "Shedding non-essential workloads lets core functions keep serving after a failure domain is lost."
  server-fails-operation-without-downtime: "Degrading optional features lets the system keep operating on surviving servers while a failed node recovers."
permalink: /approaches/feature-degradation
---

Feature degradation keeps a system useful under partial failure by shedding non-essential features instead of erroring on everything. The user keeps the critical path; optional extras pause until the system recovers. It is the concrete tactic behind the [graceful degradation](/qualities/graceful-degradation) quality.

It works only when features carry an explicit criticality ranking and the core path has no hard dependency on the parts being shed.

## How It Works
- Rank features by criticality: a core set that must stay up, and optional features that can pause.
- Watch health signals per dependency: error rate, latency, queue depth, or remaining capacity.
- When a signal crosses its threshold, disable or simplify the optional features bound to that dependency.
- Serve a defined fallback for each shed feature: a cached value, a sensible default, or a clear "temporarily unavailable" state.
- Re-enable features once the signal recovers and holds for a stabilization window.

## Failure Modes
- The core path itself depends on a shed component, so degradation takes down the function it meant to protect.
- Fallbacks return stale or wrong data silently, and users act on it.
- Thresholds sit too close to normal load, so features flap on and off and confuse users.
- No re-enable path exists, so the system stays degraded long after the dependency recovers.

## Verification
- Inject a dependency failure and assert the core path keeps a success rate above its target while optional features report unavailable.
- Measure that core-path response time stays within budget in degraded mode.
- Confirm features re-enable within the stabilization window after health is restored.

## Variants and Related Tactics
- [Rate Limiting](/approaches/rate-limiting) and load shedding drop requests by priority; feature degradation drops whole features.
- [Circuit Breaker](/approaches/circuit-breaker) cuts a single failing dependency; feature degradation decides what the user still sees once it is cut.
- [Bulkheads](/approaches/bulkheads) isolate resource pools so degradation stays contained to one feature's callers.
- [Fail-Safe Defaults](/approaches/fail-safe-defaults) define the safe values a degraded feature falls back to.

## References
- Degradation is catalogued as an availability tactic in [Bass et al., 2021](/references/#bass2021software).
