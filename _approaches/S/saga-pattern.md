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
  availability: "Short local transactions replace long-held locks and blocking distributed commits (like 2PC), ensuring services stay responsive during multi-step flows."
  loose-coupling: "Each service commits only its own local transaction and coordinates through asynchronous events or commands, keeping its internal datastore private."
tradeoffs: [consistency, code-complexity, debuggability]
tradeoff_notes:
  consistency: "Sagas give up isolation: while a saga runs, other transactions see intermediate states that compensation may later revert. Concurrency anomalies like dirty reads or lost updates require application-level countermeasures like semantic locks, commutative updates, or pessimistic re-reads."
  code-complexity: "Every step needs a hand-written compensating action plus idempotent, retry-safe message handling, and saga progress must be persisted. Compensation code runs rarely yet must work flawlessly during failures — precisely when the system is already degraded."
  debuggability: "One business transaction spans several services and message hops over seconds to hours. Reconstructing why a saga stalled or compensated requires correlated logs or distributed traces across every participant."
intent: "Maintain eventual data consistency across distributed services by splitting a long-running business transaction into a sequence of local transactions, compensating already completed steps if a failure occurs."
mechanism: "Partition a distributed flow into local transactions categorized into compensatable steps (undone via compensating actions), a pivot transaction (point of no return), and retriable steps (guaranteed to succeed). Coordinate execution using choreography (event-driven) or orchestration (central controller), persisting progress durably — an orchestrator log, or participant state and events — and ensuring all operations are idempotent."
applicability: "Apply to business processes spanning multiple microservices with isolated datastores, where synchronous distributed lock-based commits (like two-phase commit) impair availability and scalability. Avoid when the entire operation can run inside a single database transaction, or when business requirements strictly forbid the exposure of intermediate states (lack of isolation)."
related_requirements: [order-transaction-consistency]
related_requirements_notes:
  order-transaction-consistency: "The order flow's completed-or-compensated terminal state across reservation, payment, and recording is what a saga with compensating transactions delivers."
permalink: /approaches/saga-pattern
---

The saga pattern coordinates a business transaction spanning several services, each owning its private datastore. Instead of one distributed ACID transaction, the saga runs a sequence of local transactions. When a step fails, compensating actions semantically undo the completed steps — the saga eventually reaches a defined business outcome, completed or compensated, not an ACID rollback to the prior state.

![Saga flow: four local transactions run in sequence; the last one fails, so compensating transactions undo the three completed steps in reverse order, ending fully undone.](/assets/img/approaches/flow-of-saga.png)

The diagram shows the worst case: the final step fails, so every completed transaction is compensated in reverse order. Both exits are business-level outcomes — "fully undone" means each completed step was counteracted (cancel, refund, release), not rolled back as under ACID; audit records and already-observed intermediate states remain. The failed step itself needs no compensation: its own local transaction aborted atomically.

## How It Works

A Saga splits a distributed transaction into a sequence of local transactions. To model failures and recovery correctly, transactions are classified into three types:

1. **Compensatable Transactions**: Steps that can be semantically rolled back. If a subsequent step fails, they are undone using compensating actions.
2. **Pivot Transaction**: The go/no-go point of the Saga. Once the pivot transaction commits, the Saga cannot be rolled back and must run to completion.
3. **Retriable Transactions**: Steps following the pivot transaction that are guaranteed to eventually succeed through retries.

### Coordination Styles

- **Choreography**: Participants publish and subscribe to events. Each service executes its local transaction and publishes events that trigger other services. There is no central point of control, which reduces coupling but increases complexity as the flow grows (harder to trace).
- **Orchestration**: A central coordinator (orchestrator) directs the participants by sending commands and receiving replies. The orchestrator tracks the state of the Saga and invokes compensating actions on failure. It simplifies flow control but introduces a coordinator component.

### Reliability Guarantees

- **Saga Log / State Store**: The orchestrator must persist its state in a durable, transactional log before sending commands. If the coordinator crashes, it recovers its state from the log and resumes or compensates the Saga.
- **Idempotency**: All local transactions and compensating actions must be idempotent. Because of at-least-once message delivery, messages and commands will be redelivered. Duplicate execution must result in the same final state.
- **Outbox Pattern**: Participants should use a transactional outbox (or change data capture) to publish events and update their local database atomically, preventing dual-write inconsistencies.

## Failure Modes

- **Unrecoverable Compensation Failure**: A compensating action itself fails (e.g., due to an external service outage or database bug). The Saga remains in a partially-compensated state. Compensations must be continuously retried and, if they fail permanently, flagged for manual operator intervention.
- **Lack of Isolation (Concurrency Anomalies)**: Since local transactions commit immediately, intermediate states are visible to other concurrent transactions. This can lead to:
  - _Lost Updates_: A concurrent transaction overwrites data written by a Saga step without checking.
  - _Dirty Reads_: A concurrent transaction reads data modified by a Saga step that is later compensated.
  - _Non-repeatable Reads_: A Saga step reads data that is modified by another transaction before the Saga completes.
    _Countermeasures_ include application-level **semantic locks** (e.g., setting a status to `PENDING`), **commutative updates** (designing operations that can run in any order), and **pessimistic re-reads**.
- **Sequencing Design Errors**: Placing a non-compensatable, irreversible action (such as sending an email notification or making a bank payout) _before_ the pivot transaction. If the Saga later fails and rolls back, the external action cannot be undone, resulting in damage control. Irreversible steps must always be designed as retriable transactions placed _after_ the pivot.
- **Lost Publish (Dual Write)**: A participant commits its local transaction but crashes before publishing the triggering event, so the Saga silently stops mid-flow. The transactional outbox closes this gap; without it, only reconciliation sweeps detect the orphaned step.
- **Timeout Race (Late Success)**: A step times out, the Saga compensates, and the original request then succeeds late at the provider — producing exactly the side effect compensation assumed absent, such as a charge landing after its refund.
- **Stalled Sagas**: A participant outage or a lost reply leaves the Saga in an intermediate state indefinitely. Per-step timeouts plus an alert on the oldest incomplete Saga's age keep limbo states bounded and visible.

## Verification

- **Chaos and Recovery Testing**: Inject failures (kill services, drop network connections, restart orchestrators) at every step of the Saga. Verify that the Saga eventually converges to a consistent terminal state (completed or compensated) within the SLA defined per flow — seconds for internal steps, minutes or longer where external providers or manual recovery are involved.
- **Idempotency and Redelivery Testing**: Replay the same message or event multiple times to every participant and verify that side effects (such as double-charging or double-reserving) occur exactly once, and database state remains consistent.
- **Out-of-Order Execution**: Verify that if a compensating event is received _before_ the corresponding forward transaction event (due to network reordering), the system handles it correctly (e.g., by ignoring the subsequent forward transaction or recording a pre-emptive compensation).
- **Reconciliation Loops**: Run daily or hourly out-of-band reconciliation scripts comparing database records across services. The reconciliation must report 0 unexplained discrepancies, proving eventual consistency.

## Variants and Related Tactics

- **Transactional Outbox**: Decouples local state changes from message publishing, ensuring that the next step of the Saga is triggered if and only if the current step commits.
- **Asynchronous Messaging**: Provides the delivery, retry, and queueing infrastructure necessary for both choreography and orchestration.
- **Two-Phase Commit (2PC)**: Coordinates atomic commit across multiple resources; isolation comes from the participants' own locking, which 2PC prolongs by holding locks until the coordinated commit. Blocks in-doubt participants on coordinator failure and scales poorly.

## References

- [Sagas](https://dl.acm.org/doi/10.1145/38713.38742) — Garcia-Molina & Salem, SIGMOD 1987 ([free PDF](https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf))
- [Microservices Patterns: With examples in Java](https://www.manning.com/books/microservices-patterns) — Chris Richardson, Manning, 2018
