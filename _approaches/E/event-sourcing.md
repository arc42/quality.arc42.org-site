---
layout: approach
title: "Event Sourcing"
tags: [flexible]
supported_qualities: [auditability, traceability, evolvability, recoverability, debuggability]
supported_qualities_notes:
  auditability: "The append-only log is a complete, ordered record of every state change — the audit trail is the system of record, not a copy."
  traceability: "Every current value traces back to the exact sequence of domain events that produced it."
  evolvability: "New read models derive retroactively from the full history, long after the original events were recorded."
  recoverability: "Replaying the log rebuilds corrupted or lost derived state; a fixed handler replays history to repair the damage it caused."
  debuggability: "Replaying events up to a chosen point reproduces the exact state in which a defect occurred."
tradeoffs: [maintainability, eventual-consistency, privacy, performance]
tradeoff_notes:
  maintainability: "Event schemas last forever: every version ever written must stay replayable, so the team maintains upcasters or versioned handlers for years. A simple field rename becomes a migration of the readers, not of the data."
  eventual-consistency: "Queries run against projections that lag the log. A client that writes and immediately reads sees the old value unless the team builds read-your-own-writes mechanics on top."
  privacy: "Erasure obligations (GDPR Art. 17) clash with an immutable log. Crypto-shredding — deleting a per-subject encryption key — restores erasability, at the cost of key management and encrypted payloads that plain CRUD storage never needs."
  performance: "State is computed, not read: loading an aggregate replays its events. Long-lived aggregates need snapshots, and the log grows without bound unless archiving is designed in from the start."
intent: "Persist every state change as an immutable event; the log is the system of record, and any state derives from replaying it."
mechanism: "Commands rehydrate an aggregate from its past events, validate invariants, and append new events instead of overwriting state. Projections subscribe to the log and maintain read-optimized views; replaying from the start rebuilds any view."
applicability: "Use when history is a first-class requirement: audit trails, temporal queries, retroactive corrections, many evolving read models. Skip for simple CRUD domains, teams new to the pattern under deadline pressure, or data with strict erasure duties and no key-shredding plan."
related: [event-driven-architecture]
related_notes:
  event-driven-architecture: "Event-driven architecture moves events between components; event sourcing persists them within one. Independent decisions that combine well."
related_requirements: [every-data-modification-is-logged, detailed-audit-log]
related_requirements_notes:
  every-data-modification-is-logged: "The event log satisfies the immutable audit trail directly: appending is the only write path, so every modification is captured by construction."
  detailed-audit-log: "Events carry actor, timestamp, and change detail, giving the tamper-evident, searchable action record the scenario demands."
permalink: /approaches/event-sourcing
---

Event sourcing stores what happened instead of what is. Every state change appends to an immutable log as a domain event — `OrderPlaced`, `PaymentCaptured` — and current state is computed by replay. Tables holding latest values become derived, disposable views.

It is a persistence decision, local to one component. A monolith can event-source a single aggregate without any broker; event-driven architecture answers a different question — how components talk — and varies independently.

![Event sourcing: commands append immutable events to a log; the aggregate rehydrates by replay, and projections fold the same log into read-optimized views.](/assets/img/approaches/event-sourcing.svg)

## How It Works

- A command rehydrates its aggregate by replay (or snapshot plus tail), validates invariants, and appends new events under an expected-version concurrency check.
- Projections subscribe to the log and maintain read-optimized views, each rebuildable from event zero.
- Events never change. Schemas evolve through versioned event types and upcasters that translate old events during replay.
- Corrections append compensating events, ledger-style.

## Failure Modes

- Internal events published as integration contracts couple external consumers to the domain model; refactoring an aggregate then breaks unknown downstream systems.
- Projections lag the log: a user who saves and reloads sees stale data without read-your-own-writes handling.
- Neglected versioning surfaces late — a replay halts on events no current code can deserialize.
- Storage and replay time grow without bound; the first projection rebuild attempted during an incident takes days.

## Verification

- A projection rebuild from event zero runs regularly and completes inside its time budget, matching the live view; the replay deserializes every historical event version.
- Projection lag stays below its threshold; an alert fires on the oldest unprocessed event's age.
- A crypto-shredding drill confirms personal data is unrecoverable from log, snapshots, and projections.

## Variants and Related Tactics

- Event-driven architecture moves events *between* components; event sourcing persists them *within* one. Translate internal events into a published language at the boundary instead of exposing the log.
- CQRS is the natural companion: writes append, reads project.
- A plain audit log is cheaper when history serves compliance only and never derives state.
- Change data capture retrofits an event stream onto a CRUD store — row deltas without domain intent.

## References

- [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html) — Martin Fowler (2005)
- *Versioning in an Event Sourced System* — Greg Young (Leanpub, 2017)
- *Implementing Domain-Driven Design*, Appendix A — Vaughn Vernon (Addison-Wesley, 2013)
- *Designing Data-Intensive Applications*, ch. 11 — Martin Kleppmann (O'Reilly, 2017)
