---
title: Failure Transparency
tags: reliable safe
related: availability, fault-tolerance, resilience, reliability
permalink: /qualities/failure-transparency
---

### Definitions

> Failure transparency hides faults and recovery from users and applications so that a distributed system continues to operate correctly despite component failures.
>
>[Distributed systems transparency (summary based on Tanenbaum & Van Steen, "Distributed Systems")](https://en.wikipedia.org/wiki/Distributed_computing#Transparency)

<hr class="with-no-margin"/>

> A system is failure‑tolerant when faults are masked or recovered without violating specified behavior; failure transparency is the degree to which such masking keeps clients unaware of failures.
>
>[Fault tolerance and failure semantics](https://en.wikipedia.org/wiki/Fault_tolerance)

### Scope and Intent
- Aim: ensure users and client services perceive continuous, correct behavior during component or network faults.
- Techniques: redundancy, replication, retries with idempotency, quorum reads/writes, leader election, graceful degradation, circuit breakers.
- Evidence: SLOs maintained under failure injection; no data loss or duplicated effects beyond documented consistency model.

