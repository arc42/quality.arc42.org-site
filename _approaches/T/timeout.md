---
layout: approach
title: Timeout
tags: [reliable, safe]
aka: [Deadline]
supported_qualities: [availability, fault-tolerance, fault-isolation, response-time]
supported_qualities_notes:
  availability: "Bounding the wait frees the caller from an indefinite hang, so it stays responsive when a dependency stalls."
  fault-tolerance: "A call that exceeds its deadline is the detection signal that triggers fallback, retry, or failover."
  fault-isolation: "Releasing threads and connections held by a stalled call keeps resource exhaustion from spreading to healthy request paths."
  response-time: "A deadline caps the caller's worst-case wait, giving a predictable latency ceiling instead of an unbounded tail."
tradeoffs: [data-integrity, maintainability]
tradeoff_notes:
  data-integrity: "A caller that times out cannot distinguish 'the request never arrived' from 'it succeeded but the reply was slow.' Retrying a non-idempotent write after a timeout can duplicate the effect or leave state inconsistent unless the operation carries an idempotency key."
  maintainability: "Every remote call needs a deadline chosen against the dependency's real p99 and kept in sync as latency budgets shift. Set it too short and healthy-but-slow calls fail spuriously; too long and the wait defeats the tactic — an ongoing tuning burden."
intent: "Bound the wait on every remote or long-running call so a stalled component fails fast at a deadline instead of hanging indefinitely."
mechanism: "Attach a deadline to each call. Start a timer when the call begins; if the response is still outstanding when the timer expires, abandon the wait, release the held resources, and raise a timeout error the caller handles as a detected fault."
applicability: "Use for every call that crosses a process, network, or hardware boundary, and for any operation with a timing constraint. Skip for fast local in-process work where no wait can stall, and pair with retries or a circuit breaker rather than replacing them."
related_requirements: [unavailability-max-2-minutes, server-fails-operation-without-downtime, available-7-24-99]
related_requirements_notes:
  unavailability-max-2-minutes: "A deadline caps how long a caller blocks on a stuck operation, keeping user-facing waits inside the two-minute bound."
  server-fails-operation-without-downtime: "A call that overruns its timing constraint signals the server has failed, triggering the failover the requirement demands."
  available-7-24-99: "Bounding every remote wait stops one stalled dependency from draining the monthly error budget."
related: [circuit-breaker]
related_notes:
  circuit-breaker: "Timeout is the primitive the breaker builds on — a call must first be bounded by a deadline before repeated deadline breaches can trip the breaker open."
permalink: /approaches/timeout
---

A timeout puts an upper bound on how long a caller waits for a response. When a dependency slows, deadlocks, or dies mid-request, the caller would otherwise wait forever, holding a thread and connection while its queue grows. The timeout converts that unbounded hang into a bounded, detectable failure.

Bounding the wait is also a detection tactic: a call that overruns its timing constraint reveals a late or omitted operation, which higher layers treat as a fault to retry, fail over, or escalate.

## How It Works

- Set a deadline per call from the dependency's observed latency — commonly a multiple of its [p99](https://en.wikipedia.org/wiki/Percentile), not a round guess.
- Start a timer as the call is dispatched, and cancel it when the response arrives.
- On expiry, abandon the wait, release the thread and connection, and return a timeout error.
- Propagate the remaining budget to downstream calls so a chain shares one deadline instead of stacking several.

## Failure Modes

- A deadline shorter than the dependency's real p99 aborts healthy-but-slow calls, turning latency into spurious errors and retry storms.
- A deadline longer than the caller's own budget lets its threads and connections exhaust before the timeout fires, so the hang still cascades.
- A timed-out write whose server-side effect actually committed leaves client and server disagreeing on state.

## Verification

- Fault injection: delay a dependency past its deadline and assert the caller returns a timeout error within the bound and releases its thread.
- Measure the caller's p99 and maximum wait; the maximum should track the timeout, not the dependency's tail.
- Monitor timeout-error rate in production; a rising rate flags a degrading dependency before it hard-fails.

## Variants and Related Tactics

- Deadline propagation carries one budget across a call chain, so per-hop timeouts cannot sum past the caller's own limit.
- Cooperative cancellation frees server-side work once the client has given up, reclaiming that capacity.

## References

- [Software Architecture in Practice](https://www.informit.com/store/software-architecture-in-practice-9780136886099) — Bass, Clements & Kazman, 4th ed. ([full citation](/references/#bass2021software))
- [Release It!](https://pragprog.com/titles/mnee2/release-it-second-edition/) — Michael Nygard, 2nd ed. ([full citation](/references/#nygard2018release))
