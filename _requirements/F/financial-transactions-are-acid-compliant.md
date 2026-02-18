---
title: "Financial transactions are ACID-compliant and fully reconcilable"
tags: [reliable, secure]
related: [data-integrity, transactionality, consistency, correctness]
permalink: /requirements/financial-transactions-are-acid-compliant
---

<div class="quality-requirement" markdown="1">

#### Context

A core banking system processes payment transactions, account transfers, and balance updates across multiple services and databases.
Regulatory requirements and customer trust demand that no financial data is ever lost, duplicated, or left in a partial state — even during concurrent load, infrastructure failures, or network partitions.

#### Trigger

A payment or account-transfer operation is initiated by a user, an automated process, or an external payment network (e.g., SWIFT, SEPA).

#### Acceptance Criteria

- Every financial transaction is **fully ACID-compliant**: either all steps (debit, credit, audit log entry) commit atomically, or all are rolled back within **2 seconds** of failure detection — no partial transaction is ever visible to users or downstream systems
- Under concurrent load of **500 simultaneous transactions per second**, zero data anomalies (phantom reads, dirty reads, lost updates) are detected in automated concurrency tests using ≥ 10,000-iteration stress runs
- Simulated node failure (killing the primary DB node mid-transaction) results in **zero confirmed data loss or duplication**; recovery completes within **30 seconds** of failover
- The end-of-day reconciliation job detects **100% of inconsistencies** between ledger entries and account balances in a synthetic dataset of ≥ 1 million transactions seeded with a known 0.1% error rate
- Every committed transaction is immutably logged with: timestamp (UTC, µs precision), transaction ID, initiating user/system, before-image, after-image, and outcome — the audit log is append-only and hash-chained (tamper-evident)
- The system rejects duplicate submissions (same idempotency key) with **HTTP 409 in ≤ 200 ms**, even under concurrent retry storms of 50 simultaneous identical requests

</div>
