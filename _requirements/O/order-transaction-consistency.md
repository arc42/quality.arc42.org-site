---
title: "Order transaction consistency: no partial outcomes"
tags: [reliable]
related: [transactionality, atomicity, consistency, data-integrity]
permalink: /requirements/order-transaction-consistency
---

<div class="quality-requirement" markdown="1">

#### Context

An order-processing system must handle reservation, payment, and order recording as one business transaction.

#### Trigger

A customer submits an order.

#### Acceptance Criteria

- For each submitted order, inventory reservation, payment capture, and order creation either all complete successfully or the order is completed in an explicit failed/canceled state with no remaining side effects.
- If any transaction step fails, all intermediate effects are undone within **≤ 2 seconds** — either via atomic rollback or via compensating transactions that complete within the same window; in either case the system reaches a consistent terminal state (succeeded or explicitly failed/cancelled) within that window.
- No partial order state is visible to users or downstream systems **outside the 2-second recovery window** (for example: charged but not recorded, or recorded without reserved inventory).
- In failure-injection tests (service crash, timeout, network interruption) across at least **1,000** order attempts, inconsistent end states occur in **0** cases.
- Daily reconciliation between orders, payments, and reservations reports **0** unexplained mismatches.

</div><br>
