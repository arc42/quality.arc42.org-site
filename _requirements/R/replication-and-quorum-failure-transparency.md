---
title: "Replication and Quorum Reads/Writes"
tags: reliable safe
related: failure-transparency, availability, resilience, fault-tolerance
permalink: /requirements/replication-and-quorum-failure-transparency
---

<div class="quality-requirement" markdown="1">
#### Context/Background

An online transactional application (e.g., order processing and account ledger) uses a replicated primary datastore for user‑facing reads and writes. The service is deployed across multiple availability zones and must tolerate single‑node failures and brief network partitions without violating durability or the declared consistency guarantees. Session‑bound clients require read‑your‑writes for critical flows (checkout, balance update), while background analytics can tolerate slightly stale reads.

#### Metric/Acceptance Criteria

* Use 3‑node (or higher) replicated clusters; configure majority quorum for writes and reads (e.g., N=3, W=2, R=2), or Raft/Paxos‑based consensus with committed log replication.
* Under single‑node failure and during leader re‑election, external write availability ≥ 99.9% and median write latency ≤ 1.5× baseline.
* Client‑perceived error rate (5xx/timeouts at the edge) during single‑node failures and leader changes ≤ 0.5% over any 10‑minute window; p95 write latency ≤ 2× baseline.
* No acknowledged write is lost; reads are monotonic per key after write acknowledgment (define read‑your‑writes for session‑bound clients where required).
* Stale‑read exposure window during failover ≤ 5s; document the window and client cache invalidation strategy.
* Support idempotent write semantics for at‑least‑once retries; include deduplication tokens to prevent duplicate side‑effects.
* Validate via fault injection (node kill, network partition, disk pause) and demonstrate the SLOs above; include dashboards showing leader changes, commit index, quorum success rate.



#### Acceptable vs. Unacceptable Transparency Loss

- Acceptable: bounded and documented latency increase (≤ 2× p95) and stale‑read window (≤ 5s) during controlled failover; zero lost acknowledged writes; edge error rate ≤ 0.5% for ≤ 10 minutes.
- Unacceptable: any lost acknowledged write; violation of monotonic reads/read‑your‑writes guarantees; sustained (>10 minutes) edge error rate > 0.5%; stale‑read window exceeding the documented bound.

</div><br>
