---
layout: approach
title: "Saga Pattern"
tags: [reliable, flexible]
supported_qualities:
  [transactionality, data-integrity, recoverability, availability, loose-coupling]
supported_qualities_notes:
  transactionality: "Delivers eventual all-or-nothing business outcomes across services where a single distributed ACID transaction is impractical or impossible."
  data-integrity: "Compensating actions and out-of-band reconciliation loops counteract orphaned side effects, so cross-service data converges to a consistent state after partial failure."
  recoverability: "Every compensatable step has a defined undo path and every post-pivot step is retriable; operators step in only when compensation itself fails permanently."
  availability: "Short local transactions replace long-held locks and blocking distributed commits (like 2PC), so services keep serving requests during multi-step flows."
  loose-coupling: "Each service commits only its own local transaction and coordinates through asynchronous events or commands, keeping its internal datastore private."
tradeoffs: [consistency, code-complexity, debuggability]
tradeoff_notes:
  consistency: "Sagas give up isolation: while a saga runs, other transactions observe intermediate states that compensation may later revert, causing anomalies such as dirty reads or lost updates that the application must counter itself."
  code-complexity: "Every step needs a hand-written compensating action plus idempotent, retry-safe message handling, and saga progress must be persisted. Compensation code runs rarely yet must work flawlessly during failures — precisely when the system is already degraded."
  debuggability: "One business transaction spans several services and message hops over seconds to hours. Reconstructing why a saga stalled or compensated requires correlated logs or distributed traces across every participant."
intent: "Reach a consistent business outcome across services where a single distributed ACID transaction is impractical, even when individual steps fail."
mechanism: "Partition a distributed flow into local transactions: compensatable steps (undone via compensating actions), a pivot transaction (point of no return), and retriable steps designed so retries eventually succeed. Coordinate execution using choreography (event-driven) or orchestration (central controller), persisting progress durably and making all operations idempotent."
applicability: "Apply to business processes spanning multiple microservices with isolated datastores, where synchronous distributed lock-based commits (like two-phase commit) impair availability and scalability. Avoid when the entire operation can run inside a single database transaction, or when business requirements strictly forbid the exposure of intermediate states (lack of isolation)."
related_requirements: [order-transaction-consistency]
related_requirements_notes:
  order-transaction-consistency: "The order flow's completed-or-compensated terminal state across reservation, payment, and recording is what a saga with compensating transactions delivers."
permalink: /approaches/saga-pattern
---

A saga coordinates a business transaction spanning several services, each owning its private datastore. Instead of one distributed ACID transaction, it runs a sequence of local transactions; when a step fails, compensating actions undo the completed steps in reverse order — cancel, refund, release. The saga ends completed or compensated, never ACID-rolled-back: audit records and already-observed intermediate states remain.

![Saga flow: four local transactions run in sequence; the last one fails, so compensating transactions undo the three completed steps in reverse order, ending fully undone.](/assets/img/approaches/flow-of-saga.png)

## How It Works

- Classify each step: **compensatable** (has a compensating action), the **pivot** (once it commits, the saga must run forward), and **retriable** (post-pivot steps designed so retries eventually succeed).
- Coordinate by **choreography** (services react to each other's events; flows get hard to trace) or **orchestration** (a coordinator sends commands, tracks state, triggers compensation).
- Persist progress durably before acting; a crashed coordinator then resumes or compensates.
- Make all steps and compensations idempotent (brokers redeliver), and publish events atomically with the local commit via an outbox or change data capture.

## Failure Modes

- **Compensation failure** — a compensating action itself fails; the coordinator retries, permanent failures page an operator.
- **Lack of isolation** — concurrent transactions see intermediate state that compensation later reverts; counter with semantic locks, commutative updates, or pessimistic re-reads.
- **Sequencing errors** — an irreversible action (a payout, an email) placed before the pivot cannot be retracted; make it the pivot or a retriable step.
- **Lost publish** — a participant commits but crashes before publishing; without the outbox the saga stalls silently.
- **Timeout race** — a timed-out step succeeds late after compensation: a charge landing after its refund.
- **Stalled sagas** — per-step timeouts and an age alert on the oldest incomplete saga bound limbo states.

## Verification

- Inject failures at every step; the saga reaches completed or compensated within the per-flow SLA.
- Replay every message; side effects occur exactly once.
- Deliver a compensating event before its forward event; state stays correct.
- Cross-service reconciliation reports zero unexplained discrepancies.

## Variants and Related Tactics

- **Asynchronous Messaging** — supplies delivery, retry, and queueing for both coordination styles.
- **Two-Phase Commit** — holds locks until the coordinated commit, blocks in-doubt participants, scales poorly.

## References

- [Sagas](https://dl.acm.org/doi/10.1145/38713.38742) — Garcia-Molina & Salem, SIGMOD 1987 ([free PDF](https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf))
- [Microservices Patterns: With examples in Java](https://www.manning.com/books/microservices-patterns) — Chris Richardson, Manning, 2018
