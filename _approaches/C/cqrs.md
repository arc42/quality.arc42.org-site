---
layout: approach
title: "CQRS"
tags: [efficient, flexible]
supported_qualities: [scalability, throughput, performance, extensibility, responsiveness]
supported_qualities_notes:
  scalability: Read and write workloads scale independently, allowing each side to match its actual demand profile.
  throughput: Read models use denormalized, query-optimized structures that serve high fan-out without burdening the write path.
  performance: Queries hit purpose-built projections instead of traversing a normalized write model, reducing join depth and index contention.
  extensibility: New read models can be projected from the same event or change stream without modifying command-side logic.
  responsiveness: Asynchronous projection keeps the write path fast by deferring view updates to background consumers.
tradeoffs: [eventual-consistency, code-complexity, operability, observability]
tradeoff_notes:
  eventual-consistency: Read models lag behind the write model by the projection delay, which can range from milliseconds to seconds under load.
  code-complexity: Teams maintain two distinct data models, projection logic, and synchronization plumbing instead of one shared schema.
  operability: Projection pipelines, consumer lag dashboards, and rebuild tooling add operational surface area.
  observability: Monitoring projection lag, data drift, and consumer health is critical for maintaining trust in the read models.
related_requirements: [handle-sudden-increase-in-traffic, crm-data-synchronization]
intent: "Separate the read and write sides of a system so each can be modeled, optimized, and scaled for its own workload characteristics."
mechanism: "Route commands through a write model that enforces invariants and emits state changes, then project those changes asynchronously into one or more read-optimized views tailored to specific query patterns."
applicability: "Use when read and write workloads differ significantly in volume, shape, or scaling needs, or when multiple query patterns require views that do not map naturally to the write schema. Avoid for simple CRUD domains where a single model serves both paths without contention."
permalink: /approaches/cqrs
---

CQRS (Command Query Responsibility Segregation) splits a system's data path into a command side that enforces business rules and a query side that serves reads from purpose-built projections. The separation lets each side evolve, scale, and be optimized independently.

The approach becomes especially valuable when the read-to-write ratio is heavily skewed, when different consumers need different views of the same data, or when the write model's normalized structure is a poor fit for the queries the UI or downstream systems require. Because the projection step is typically **asynchronous**, CQRS pairs naturally with event-driven and messaging patterns to absorb load spikes and keep the command path responsive.

## How It Works

- Commands arrive at the write model, which validates invariants, persists state changes, and publishes events or change-data records.
- One or more projectors consume the change stream and materialize read-optimized views (flat tables, search indexes, caches, or pre-aggregated summaries).
- Queries are served entirely from the read models, bypassing the write store. Each read model can use a different storage technology suited to its access pattern.
- The projection step typically runs asynchronously, decoupling write latency from view-update cost and allowing the write side to return quickly. While often asynchronous for scale, CQRS can also be implemented synchronously within a single transaction if consistency is prioritized over throughput.
- Schema changes on the read side are isolated: a new read model can be built from scratch by replaying the event or change stream without touching the command-side code.

## Failure Modes

- Projection lag is invisible to users, causing confusion when a write appears to be lost because the read view has not yet caught up.
- Projector failures create a growing backlog; without lag monitoring and alerting, stale views go undetected.
- Multiple read models drift apart when projectors process events at different speeds or skip messages due to deserialization errors.
- Storage overhead: maintaining multiple denormalized views significantly increases data storage costs and backup complexity compared to a single normalized model.
- Teams apply CQRS to a simple CRUD domain, paying the two-model cost without gaining measurable scaling or flexibility benefits.
- Missing idempotency in projectors causes duplicate or corrupted view state after event redelivery.

## Verification

- Projection lag SLO: p95 delay between write commit and read-model update stays below the agreed threshold (for example `< 2 s` in steady state, `< 10 s` during peak).
- Read throughput: query endpoints handle the target request rate (for example `5 000 req/s`) at p99 latency below `50 ms` from the read store, independent of write-side load.
- Freshness SLI: 99.9% of queries reflect state changes within the p95 projection lag threshold during automated verification runs.
- Rebuild test: a full projection rebuild from the event stream completes within the agreed time window (for example `< 4 h` for the largest view) and produces a byte-identical result.
- Failure injection: pause the projector for 10 minutes, resume, and verify the backlog drains within 15 minutes with zero lost or duplicated events.

## Variants and Related Tactics

- Event Sourcing stores the write side as an append-only event log, giving projectors a complete, replayable history instead of change-data capture from a mutable store.
- Asynchronous Messaging provides the durable transport between write and read sides and adds retry, dead-letter, and back-pressure semantics.
- Database-level read replicas offer a lighter alternative when the read and write schemas are identical and only throughput separation is needed.
