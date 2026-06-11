---
layout: approach
title: "Standby/Failover"
tags: [reliable, operable]
aka: [Redundancy, Hot Spare, Warm Spare, Cold Spare, Active Redundancy, Passive Redundancy]
supported_qualities: [availability, fault-tolerance, recoverability]
supported_qualities_notes:
  availability: "A standby takes over when the active component fails, keeping the service reachable through the outage."
  fault-tolerance: "Losing one component does not stop the system, because a redundant peer continues the work."
  recoverability: "Automated failover restores service in seconds to minutes, without waiting for the failed component to be repaired."
tradeoffs: [cost, consistency, maintainability]
tradeoff_notes:
  cost: "Redundant capacity is paid for before any failure occurs. A hot spare that mirrors the active component roughly doubles the resource bill; colder standbys cut that cost but lengthen recovery time."
  consistency: "Stateful failover relies on replicating state to the standby. A warm or cold spare can be promoted with stale or missing state, so in-flight work is dropped or replayed on takeover."
  maintainability: "Failure detection, promotion logic, and split-brain prevention are machinery the team builds, tunes, and must exercise regularly, or failover quietly rots until the outage that needs it."
intent: "Keep a redundant component ready to take over when the active one fails, so service continues through the failure."
mechanism: "Run one or more redundant components behind a failure detector. On failure it promotes a standby to active. Standbys range from hot (fully synchronized) to cold (started on demand), trading cost against recovery time."
applicability: "Use when downtime is costly and the component can be replicated. Skip when state cannot be replicated affordably, or the recovery-time budget is loose enough that a plain restart suffices."
related_requirements: [available-7-24-99, server-fails-operation-without-downtime, zone-failure-no-service-interruption, unavailability-max-2-minutes]
related_requirements_notes:
  available-7-24-99: "A ready standby keeps the system inside its uptime objective when the active component fails."
  server-fails-operation-without-downtime: "Promoting a standby on server failure is exactly the mechanism this requirement demands."
  zone-failure-no-service-interruption: "A standby in a second zone absorbs a whole-zone outage without interrupting service."
  unavailability-max-2-minutes: "The recovery-time budget sets the standby temperature: a two-minute ceiling rules out a cold spare that boots slower."
permalink: /approaches/standby-failover
---

Standby/Failover keeps a redundant copy of a component ready so that when the active instance fails, a standby is promoted and service continues. It is the workhorse availability tactic behind clustered databases, redundant controllers, and multi-zone deployments.

The variants differ only in how warm the standby runs. A hot spare processes the same inputs in parallel and fails over in milliseconds; a warm spare takes periodic state updates and recovers in seconds; a cold spare stays off until needed and recovers in minutes. Warmer means faster recovery at higher standing cost.

## How It Works
- A failure detector — heartbeat, health probe, or lease expiry — watches the active component.
- On a missed signal it declares failure and triggers failover.
- A standby is promoted to active; traffic, virtual IP, or leadership moves to it.
- State reaches the standby by continuous replication (hot), periodic checkpoint (warm), or fresh start (cold).
- The repaired component rejoins as the new standby.

## Failure Modes
- Split-brain: a partition leaves both nodes acting as active, accepting writes and diverging. A quorum or fencing token prevents it.
- Stale standby: replication lags, so the promoted node serves old or inconsistent state.
- Failover flapping: an unstable primary triggers repeated promotions, amplifying disruption.
- Untested path: failover runs for the first time during a real outage and silently fails.

## Verification
- Kill or partition the active component and measure time to full service on the standby against the recovery-time objective.
- After a partition, assert exactly one node accepts writes — no split-brain.
- Track replication lag and alert when it exceeds the data-loss budget (RPO).
- Run scheduled failover drills and record the success rate.

## Variants and Related Tactics
- Hot, warm, and cold spare — the standby-temperature spectrum above.
- State Resynchronization — reconcile active and standby state before a promoted node goes live.
- Voting / N-version redundancy — a different goal: mask wrong output for integrity, not survive a crash for availability.
