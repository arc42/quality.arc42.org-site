---
layout: approach
title: "Transactional Outbox"
tags: [reliable]
supported_qualities: [atomicity, consistency, data-integrity, reliability]
supported_qualities_notes:
  atomicity: "One local ACID transaction covers the state change and the event record, so the intent to publish commits or rolls back with the data."
  consistency: "Every committed change produces exactly its event, so downstream read models and replicas converge on the source of truth."
  data-integrity: "No ghost events for rolled-back changes, no committed change without its event — source and derived data stay reconcilable."
  reliability: "Events wait in the durable outbox across crashes and broker outages; the relay retries until the broker acknowledges."
tradeoffs: [latency, performance, simplicity]
tradeoff_notes:
  latency: "Events reach the broker only after the relay reads them: polling interval plus publish time, typically tens of milliseconds to seconds. Workloads needing immediate fan-out feel this delay, and shortening the polling interval trades it directly against database load."
  performance: "Every business transaction carries an extra outbox insert, and a polling relay issues continuous queries against the primary database. Under high write volume the outbox table becomes a hot spot that needs regular purging to bound index growth and storage cost."
  simplicity: "The relay is a new stateful component with offset tracking, ordering keys, and cleanup jobs. Because delivery is at least once, every consumer must deduplicate by event ID — complexity the pattern pushes onto all subscribers."
intent: "Publish events reliably by writing them to an outbox table inside the same local transaction as the state change, eliminating the dual-write problem."
mechanism: "The business transaction inserts its state change and a serialized event record into an outbox table and commits as one ACID unit. A separate relay — a poller or change-data-capture reader — publishes new outbox rows to the message broker and marks them sent once acknowledged."
applicability: "Use when a service updates its database and must publish events about that change — event-driven integration, cache invalidation, saga steps — and lost or ghost events are unacceptable. Skip when consumers can query the database directly, or when the datastore offers no transactions."
related: [event-sourcing, saga-pattern, asynchronous-messaging]
related_notes:
  event-sourcing: "Event sourcing dissolves the dual write — the log is the system of record; the outbox keeps state primary and relays events."
  saga-pattern: "Each saga step publishes its event through an outbox, so a participant crash between commit and publish cannot stall the saga."
  asynchronous-messaging: "The outbox closes messaging's dual-write gap: the event commits with the state, then the relay hands it to the broker."
related_requirements: [crm-data-synchronization, financial-transactions-are-acid-compliant]
related_requirements_notes:
  crm-data-synchronization: "An outbox guarantees every customer-data change reaches the sync pipeline, meeting the requirement's no-loss and auditable-sync criteria."
  financial-transactions-are-acid-compliant: "Downstream systems observe exactly the committed transactions: no notification for a rolled-back debit, no committed transfer left unpublished."
permalink: /approaches/transactional-outbox
---

A service that updates its database and then publishes an event performs two writes with no transaction spanning them — the dual-write problem. A crash between the writes either loses the event or emits a ghost event for a change that rolled back. The transactional outbox removes the broker from the critical write path: the service stores the event in the same database and transaction; a relay forwards it afterwards.

![Transactional outbox: the order service writes its state change and an OrderPaid event record to its own database in one ACID transaction; a message relay polls the outbox or tails the commit log, publishes to the message broker, and marks rows sent after acknowledgement; consumers deduplicate by event ID.](/assets/img/approaches/transactional-outbox.svg)

## How It Works

- The business transaction writes its state change plus one outbox row (event ID, aggregate ID, type, payload) and commits as one ACID unit.
- A relay picks up unsent rows by polling the outbox table or tailing the database commit log via change data capture.
- The relay publishes each row, preserves per-aggregate order via a partition key, and marks rows sent only after the broker acknowledges.
- Delivery is at least once: a relay crash between publish and mark-sent republishes the row, so consumers deduplicate by event ID.

## Failure Modes

- A stalled relay lets unsent rows pile up: state changes commit, but downstream reaction waits until the relay catches up.
- Redelivered events double-trigger consumers that skip deduplication — a payment notification sent twice.
- Parallel relay instances without a partition key reorder events for the same aggregate.

## Verification

- Outbox lag (age of the oldest unsent row) stays below the delivery objective; alert past the threshold.
- Failure injection kills the service between commit and publish: recovery yields zero lost and zero ghost events across 1,000 runs.
- Replaying a day's events against consumers yields an identical end state, proving deduplication works.

## Variants and Related Tactics

- **Polling publisher vs. log tailing** — polling adds query load and latency; change data capture cuts both but couples the relay to the database's replication protocol.
- **[Event Sourcing](/approaches/event-sourcing)** — makes the event log the primary store, dissolving the dual write entirely at the cost of a new persistence model.
- **[Saga Pattern](/approaches/saga-pattern)** — each saga step publishes its event through an outbox, so a lost publish cannot stall the saga.

## Example

An order service marks order 4711 as paid and, in the same local transaction, writes an `OrderPaid` record to its outbox. The commit makes both durable at once. Moments later the relay picks up the row and publishes it; invoicing and shipping react. Had the service crashed right after the commit, the event would wait in the outbox and go out on restart — never lost, never a ghost.

## References

- [Pattern: Transactional Outbox](https://microservices.io/patterns/data/transactional-outbox.html) — Chris Richardson; expanded in chapter 3 of [Microservices Patterns](https://www.manning.com/books/microservices-patterns), Manning, 2018
- [Designing Data-Intensive Applications](https://dataintensive.net/) — Martin Kleppmann, O'Reilly, 2017 — chapter 11 analyses dual writes and log-based integration
- [Life beyond Distributed Transactions: An Apostate's Opinion](https://queue.acm.org/detail.cfm?id=3025012) — Pat Helland, CIDR 2007, republished ACM Queue 14(5)
- [Online Event Processing](https://dl.acm.org/doi/10.1145/3312527) — Martin Kleppmann, Alastair R. Beresford, Boerge Svingen, CACM 62(5), 2019
