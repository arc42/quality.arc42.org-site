---
layout: approach
title: Circuit Breaker
tags: [reliable, operable]
supported_qualities: [resilience, stability, fault-tolerance, availability]
supported_qualities_notes:
  resilience: Improves uptime by containing dependency failures and preventing cascading effects.
  stability: Prevents cascading errors across service boundaries by isolating unhealthy dependencies.
  fault-tolerance: Enables controlled degradation under partial failures by providing safe fallbacks.
  availability: Protects overall system availability by failing fast rather than hanging on slow dependencies.
tradeoffs: [maintainability, latency]
tradeoff_notes:
  maintainability: Adds threshold and fallback logic that must be configured and maintained.
  latency: Introduces a small overhead for state checks and timeout handling on every request.
related_requirements: [available-7-24-99, server-fails-operation-without-downtime]
intent: "Prevent a failure in one part of the system from cascading to others by failing fast when a remote service is struggling."
mechanism: "Wrap remote calls in a stateful guard that monitors success/failure rates; it trips to an 'Open' state to reject calls immediately when failures exceed a threshold, and probes for recovery via a 'Half-Open' state after a timeout."
applicability: "Use when making remote calls (API, DB, etc.) that can fail or become slow and where a fail-fast response is better than waiting. Avoid for local in-process calls where overhead exceeds benefit or when operations must be retried immediately without delay."
permalink: /approaches/circuit-breaker
---

Circuit breakers prevent distributed systems from collapsing when a dependency becomes slow or unstable. Instead of tying up resources waiting for a call that is likely to fail, the breaker "trips," allowing the system to fail fast and potentially provide a fallback response.

## How It Works

A circuit breaker wraps a protected function call in a state machine with three states:

- **Closed**: Requests are passed through to the remote service. Successes and failures are tracked.
- **Open**: The failure threshold was exceeded. Requests fail immediately with an error (fail-fast) without attempting the remote call.
- **Half-Open**: After a reset timeout, a limited number of test requests are allowed through. If these succeed, the circuit closes; if they fail, it reopens.

The circuit starts **Closed**. Once the failure rate or consecutive failure count exceeds the configured threshold, it trips to **Open**. This protects the calling system's resources (like thread pools) and gives the struggling remote service time to recover. After a cooling-off period, it moves to **Half-Open** to probe the dependency's health.

## Failure Modes

- **Inappropriate thresholds**: Setting thresholds too low causes "flapping" (unnecessary tripping), while setting them too high allows cascading failures to exhaust resources before the breaker trips.
- **Fallback failure**: The fallback logic (e.g., returning a default value) fails under the same load or depends on another failing service, leading to a complete outage.
- **Resource exhaustion**: If timeouts are set too long, the calling system can still exhaust its thread pool or memory while waiting for the "Closed" circuit's calls to fail.
- **Silent trips**: If monitoring and alerting are not configured for state transitions, the system stays in a degraded "Open" state without the operations team being aware.

## Verification

- **Chaos injection**: Use a tool (e.g., Chaos Monkey) to inject 100% latency or 500 errors into a dependency and verify the circuit trips to "Open" within the expected number of calls.
- **Recovery check**: Verify that the circuit transitions to "Half-Open" and then "Closed" automatically once the dependency's health is restored.
- **Fallback correctness**: Assert that the system returns the expected fallback response (e.g., cached data or a user-friendly message) while the circuit is "Open."
- **Metric validation**: Monitor state transitions and "Open" duration; the error rate for upstream callers should stay within the defined SLO even when the downstream service is down.

## Variants and Related Tactics

- **Bulkhead**: Isolating resources (e.g., separate thread pools per dependency) so one failing service cannot consume all system resources.
- **Retry with Circuit Breaker**: Applying retries for transient glitches but letting the circuit breaker handle persistent outages.
- **Adaptive Concurrency Limits**: Dynamically adjusting the number of allowed concurrent requests based on observed latency, providing a more fluid protection than binary state transitions.

## References
- [Release It!](https://pragprog.com/titles/mnee2/release-it-second-edition/) — Michael Nygard ([full citation](/references/#nygard2018release))
- [Martin Fowler on Circuit Breaker](https://martinfowler.com/bliki/CircuitBreaker.html)
