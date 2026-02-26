---
title: Circuit Breaker
tags: [reliable, operable]
supported_qualities: [resilience, stability, fault-tolerance]
tradeoffs: [maintainability, latency]
intent: Prevent a failure in one part of the system from cascading to others by failing fast when a remote service is struggling.
mechanism: Monitor remote calls and, if failures exceed a threshold, "trip" the circuit to immediately return an error for subsequent calls, allowing the remote service time to recover.
applicability: Use when making remote calls (API, DB, etc.) that can fail or become slow. Avoid for local calls or when a failure must be immediately retried without delay.
permalink: /approaches/circuit-breaker
---

## How It Works

A circuit breaker wraps a protected function call in a state machine with three states:

- **Closed**: Requests are passed through to the remote service. Successes and failures are tracked.
- **Open**: The threshold was exceeded. Requests fail immediately with an error (fail-fast).
- **Half-Open**: After a timeout, a limited number of test requests are allowed through to see if the service has recovered.

<div class="mermaid">
stateDiagram-v2
    [*] --> Closed
    Closed --> Open : Failure threshold reached
    Open --> HalfOpen : Reset timeout passed
    HalfOpen --> Open : Call fails
    HalfOpen --> Closed : Call succeeds
</div>

## Failure Modes

- **Inappropriate thresholds**: Tripping too easily (noise) or too late (cascading failure already started).
- **Infinite Half-Open state**: If the recovery check itself is flawed or the service is "flaky".
- **Hidden failures**: If monitoring doesn't alert that the circuit is open, users might see errors without the operations team knowing why.

## Verification Ideas

- Chaos engineering: Inject latency or failures into the remote service and verify the circuit trips.
- Monitor state transitions and "Open" duration in production.
- Verify fallback behavior (e.g., does it return a cached value or a helpful error message?).

## Related Requirements

- [Link to /requirements/R/resilience-requirement]

## Variants

- **Retry with Circuit Breaker**: Combining retries (for transient errors) with a circuit breaker (for persistent errors).
- **Bulkhead with Circuit Breaker**: Isolating resources (e.g., separate thread pools) to prevent a single service from consuming all system resources.
