---
layout: approach
title: "Data Replication"
tags: [reliable, efficient]
aka: [Read Replicas]
supported_qualities: [availability, durability, scalability]
supported_qualities_notes:
  availability: "Reads and writes continue against a surviving replica when a node fails."
  durability: "Copies on independent nodes survive the loss of any single node or disk."
  scalability: "Read replicas spread read load across copies, raising read throughput beyond one node."
tradeoffs: [consistency, latency, cost]
tradeoff_notes:
  consistency: "Replicas diverge between updates. Strong consistency coordinates every write across replicas — slower, and unavailable under partition; relaxing to eventual consistency returns fast but can serve stale reads. This is the CAP/PACELC tradeoff."
  latency: "Synchronous replication holds each write until enough replicas acknowledge, so write latency tracks the slowest quorum member, and a geographically distant replica adds round-trip time to every committed write."
  cost: "Every replica multiplies storage, and cross-region replication adds continuous network transfer; N copies cost roughly N times the storage plus the bandwidth to keep them current."
intent: "Keep copies of data on independent nodes so reads and writes survive node loss and can be served close to the user."
mechanism: "A write to one replica propagates to the others, synchronously (the write waits for acknowledgement) or asynchronously (it returns first, replicas catch up). A consistency protocol such as quorum or consensus decides when a read sees a write."
applicability: "Use when data must survive node or zone failure, or reads must scale or sit near users. Skip when a single node's durability suffices, or the staleness and write-latency costs of staying in sync outweigh the benefit."
related_requirements: [replication-and-quorum-failure-transparency, available-7-24-99, zone-failure-no-service-interruption]
related_requirements_notes:
  replication-and-quorum-failure-transparency: "Quorum reads and writes across replicas are exactly the protocol this requirement specifies for tolerating node loss and partitions."
  available-7-24-99: "Surviving replicas keep the datastore reachable when a node fails, holding the uptime target."
  zone-failure-no-service-interruption: "A replica in another zone keeps serving when a whole zone goes down."
permalink: /approaches/data-replication
---

Data Replication keeps copies of the same data on independent nodes. Copies let the system survive node loss, serve reads from the nearest or least-loaded replica, and scale read throughput. The hard part is not making copies — it is deciding what a reader sees while copies are briefly out of step.

Strategies sit on two axes: where writes are accepted (single-leader, multi-leader, leaderless) and when copies converge (synchronous or asynchronous). Those choices set the consistency–availability–latency tradeoff.

## How It Works
- A write lands on a replica and propagates to the others.
- Synchronous replication holds the write until a quorum acknowledges; asynchronous returns immediately and propagates in the background.
- A consistency model — strong, read-your-writes, or eventual — defines which writes a later read must reflect.
- A quorum or consensus protocol (e.g. Raft, Paxos) coordinates write ordering and leader election.
- On node loss, surviving replicas keep serving and a new leader is elected if needed.

## Failure Modes
- Stale reads: an async replica lags, so a reader sees data older than the last committed write.
- Split-brain: a partition lets two sides accept conflicting writes, producing divergent histories to reconcile.
- Lost write: an async leader acknowledges, then crashes before propagating, dropping a committed write.
- Lag cascade: a slow replica falls progressively behind under write load, widening the data-loss window.

## Verification
- Measure replication lag (p99) and alert when it exceeds the recovery-point objective (RPO).
- Kill the leader under load; assert reads and writes resume within the failover budget with no committed-write loss.
- Run a consistency checker (e.g. a linearizability test) against the declared model.
- Partition the cluster and confirm the configured behavior — reject writes, or accept and reconcile.

## Variants and Related Tactics
- Single-leader, multi-leader, or leaderless — where writes are accepted.
- Synchronous versus asynchronous — the durability-against-latency dial.
- Standby/Failover — replication is how a hot or warm standby stays current.
- Database Sharding — partitions data for scale; replication copies each partition for availability.
