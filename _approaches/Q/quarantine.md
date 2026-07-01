---
layout: approach
title: Quarantine
tags: [reliable, operable]
aka: [Removal from Service]
supported_qualities: [availability, fault-isolation, recoverability, stability]
supported_qualities_notes:
  availability: "Pulling a degraded instance from the serving pool stops it returning errors or slow responses, so the healthy remainder keeps the service up."
  fault-isolation: "Detaching the unstable component contains its faults — a leak, corruption, or flapping — so they cannot spread to healthy request paths."
  recoverability: "Quarantine buys a safe window to diagnose, restart, or scrub the component and reintroduce it once healthy."
  stability: "Removing a resource-leaking or thrashing instance keeps its degradation from destabilising the rest of the pool."
tradeoffs: [capacity, maintainability]
tradeoff_notes:
  capacity: "Removing an instance shrinks the serving pool. If quarantine fires under load with no spare to absorb the shortfall, the remaining instances take on its traffic and can saturate — the correlated failure the tactic was meant to prevent."
  maintainability: "Health thresholds, drain-and-detach automation, diagnosis hooks, and safe reintroduction are machinery the team builds and tunes. Thresholds set too sensitively pull healthy instances needlessly, so the pool flaps in and out and capacity churns."
intent: "Detach an unstable or suspect component from live service so its degraded behaviour stops affecting the system while it is diagnosed and repaired."
mechanism: "A health signal — rising error rate, latency, resource leak, or flapping — marks an instance suspect. The orchestrator drains its in-flight work, removes it from the serving pool, and holds it out for diagnosis, restart, or repair, then reintroduces it once healthy."
applicability: "Use for pooled, replaceable instances behind a load balancer or scheduler, where one can be spared without dropping the service. Skip for a singleton with no replica to cover it, or when the instance holds in-flight state that cannot be drained or migrated first."
related: [circuit-breaker, standby-failover]
related_notes:
  circuit-breaker: "Two ways to stop using a failing element: the breaker fails fast on calls to a dependency and self-probes recovery, while quarantine pulls the unstable instance from the serving pool for diagnosis and repair."
  standby-failover: "Complementary — quarantine removes the unstable instance; failover promotes a standby to cover the gap, so capacity holds while the detached component is diagnosed."
related_requirements: [server-fails-operation-without-downtime, production-anomalies-detectable-within-2-minutes]
related_requirements_notes:
  server-fails-operation-without-downtime: "Detaching the failing server while the remaining pool or a spare carries on is exactly the continue-without-downtime behaviour this requires."
  production-anomalies-detectable-within-2-minutes: "The elevated error rate, latency, or resource exhaustion this makes visible is the signal that triggers an instance's quarantine."
permalink: /approaches/quarantine
---

Quarantine removes a component from live service the moment it looks unhealthy — a rising error rate, a leak, or persistent flapping. Rather than let it keep serving errors and slow responses, the system detaches it, lets the healthy remainder carry the load, and holds the suspect out until it is diagnosed, repaired, or restarted, then reintroduced.

Bass groups it under Prevent Faults. Removing a component on a schedule to scrub latent faults — memory leaks, fragmentation — is the proactive variant, software rejuvenation.

## How It Works

- Watch per-instance health signals: error rate, latency, resource growth, or health-check failures.
- When a signal crosses its threshold, stop routing new work to the instance and drain in-flight requests.
- Detach it from the pool and hold it out — no traffic — while diagnostics, a restart, or a repair run.
- Reintroduce once it passes health checks, ideally on shadow or canary traffic before taking full load.

## Failure Modes

- Quarantining under load with no spare shifts the removed traffic onto the rest, which saturate and fail in turn.
- Over-sensitive thresholds pull healthy instances, so the pool flaps in and out and capacity churns.
- Abrupt detachment without draining drops the instance's in-flight requests and any session state it held.

## Verification

- Fault injection: push an instance past its error threshold; assert it drains and detaches within the target window.
- Confirm reintroduction: a repaired instance rejoins only after passing health checks, and load rebalances without an error spike.
- Track pool size and quarantine in/out events; a steady decline or rapid flapping both signal mis-tuned thresholds.

## Variants and Related Tactics

- Software rejuvenation is the proactive form: recycle an instance on a schedule to clear latent faults before they surface.
- A circuit breaker is the client-side counterpart — it stops calls to a bad dependency; quarantine removes the bad instance from the pool.

## References

- [Software Architecture in Practice](https://www.informit.com/store/software-architecture-in-practice-9780136886099) — Bass, Clements & Kazman, 4th ed. ([full citation](/references/#bass2021software))
- [Release It!](https://pragprog.com/titles/mnee2/release-it-second-edition/) — Michael Nygard, 2nd ed. ([full citation](/references/#nygard2018release))
