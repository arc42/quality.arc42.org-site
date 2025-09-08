---
title: "Replication and Quorum Reads/Writes"
tags: reliable safe
related: failure-transparency, availability, resilience, fault-tolerance
permalink: /requirements/replication-and-quorum-failure-transparency
---

<div class="quality-requirement" markdown="1">
#### Context/Background

The primary datastore must remain available and correct under node failures and network partitions within the defined consistency model.

#### Metric/Acceptance Criteria

* Use 3‑node (or higher) replicated clusters; configure majority quorum for writes and reads (e.g., N=3, W=2, R=2), or Raft/Paxos‑based consensus with committed log replication.
* Under single‑node failure and during leader re‑election, external write availability ≥ 99.9% and median write latency ≤ 1.5× baseline.
* No acknowledged write is lost; reads are monotonic per key after write acknowledgment (define read‑your‑writes for session‑bound clients where required).
* Stale‑read exposure window during failover ≤ 5s; document the window and client cache invalidation strategy.
* Support idempotent write semantics for at‑least‑once retries; include deduplication tokens to prevent duplicate side‑effects.
* Validate via fault injection (node kill, network partition, disk pause) and demonstrate the SLOs above; include dashboards showing leader changes, commit index, quorum success rate.

</div><br>

