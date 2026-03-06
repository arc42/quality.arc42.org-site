---
layout: approach
title: Asynchronous Messaging
tags: [efficient, flexible]
supported_qualities: [responsiveness, throughput, scalability, loose-coupling, lead-time-for-changes]
supported_qualities_notes:
  responsiveness: Returns quickly by accepting work without waiting for full processing.
  throughput: Buffers burst traffic and lets workers process jobs at stable rates.
  scalability: Consumers can scale independently from request-handling components.
  loose-coupling: Producers and consumers evolve independently via stable message contracts.
  lead-time-for-changes: Teams can release producer and consumer changes separately with backward-compatible schemas.
tradeoffs: [eventual-consistency, determinism, observability, code-complexity, latency]
tradeoff_notes:
  eventual-consistency: Downstream views are updated after processing, not immediately at request time.
  determinism: Maintaining strict event order across distributed consumers often requires partition-key constraints that reduce maximum parallelism.
  observability: Tracing a business transaction across broker hops and retries is harder than synchronous call chains.
  code-complexity: Durable messaging needs idempotency, retries, dead-letter handling, and schema governance.
  latency: Queueing delay can increase end-to-end completion time under load or consumer slowdown.
related_requirements: [handle-sudden-increase-in-traffic, service-loose-coupling-change-blast-radius, response-time-for-image-rendering]
related_requirements_notes:
  handle-sudden-increase-in-traffic: Queue buffering and independent consumer scaling help absorb burst load without collapsing request latency.
  service-loose-coupling-change-blast-radius: Asynchronous contracts reduce runtime coupling so a single service change affects fewer neighbors.
  response-time-for-image-rendering: Rendering can run in background workers while the user gets fast acknowledgement and progress state.
intent: Move long-running or failure-prone work off the synchronous request path so user-facing interactions stay fast and resilient under variable load.
mechanism: Accept work, persist a message to a durable queue or topic, acknowledge quickly, and process the message asynchronously with dedicated consumers using retry, backoff, and dead-letter handling; because durable brokers commonly provide at-least-once delivery, handlers must be idempotent to tolerate redelivery safely.
applicability: Use for tasks that can complete after the initial response, especially when workload is bursty or integrations are slow or unreliable. Avoid for operations that require immediate, strongly consistent confirmation in the same request.
permalink: /approaches/asynchronous-messaging
---

Asynchronous messaging decouples request handling from work execution in time and capacity. Instead of waiting for slow downstream steps, the system confirms receipt and processes work in background consumers.

This approach is especially useful when traffic is bursty, dependencies are variable, or teams need to evolve components independently without tight runtime coupling.

## How It Works

- The request path validates input, stores a command/event, and returns quickly (often `202 Accepted` with a correlation ID).
- A broker (queue/topic/stream) buffers work durably so short spikes do not immediately overload workers.
- Consumers pull messages, execute domain logic, and acknowledge only after successful completion.
- Retries with exponential backoff handle transient failures; poison messages are routed to a dead-letter queue for diagnosis.
- Durable brokers typically guarantee at-least-once delivery, so message redelivery is expected behavior rather than an edge case.
- Idempotency keys and deduplication prevent duplicate side effects when messages are retried or redelivered.
- Dead-letter queues require an operational lifecycle: monitor, diagnose root cause, fix data or code, and only then re-inject messages under controlled rate limits.
- Backward-compatible message schemas allow producers and consumers to be deployed independently.

## Failure Modes

- Queue growth is unbounded, causing rising message age and delayed completion.
- Retry storms saturate consumers because failures are retried too aggressively without jitter or limits.
- Non-idempotent handlers create duplicate side effects after redelivery.
- Schema changes break consumers due to incompatible payload evolution.
- Missing correlation IDs makes cross-service debugging and incident response slow.

## Verification

- Under representative load, p95 request latency on the synchronous endpoint stays below the agreed threshold (for example `< 250 ms`) while throughput increases versus the synchronous baseline.
- Queue health SLOs are met: p95 message age `< 30 s` in steady state and `< 120 s` during peak hour.
- Reliability guardrails hold: dead-letter ratio `< 0.5%` of processed messages and duplicate side-effect rate `< 0.1%`.
- Failure-injection test: pause consumers for 10 minutes, resume, and verify backlog drains within 15 minutes without message loss; this implies recovery capacity above producer rate (about 1.7x for this target) and should be validated explicitly.
- Traceability check: at least 99% of processed messages have end-to-end correlation IDs visible in logs/traces.

## Variants and Related Tactics

- Competing Consumers (Work Queue) for parallel job execution.
- Pub/sub fan-out when multiple downstream systems must react to the same event.
- Transactional outbox to avoid dual-write inconsistencies between database state and message publication.
- Saga orchestration/choreography for multi-step business flows with compensating actions.

## References
- [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) — Hohpe & Woolf ([full citation](/references/#hohpe2004enterprise))
- [RFC 9110: HTTP Semantics (`202 Accepted`)](https://www.rfc-editor.org/rfc/rfc9110#section-15.3.3)
- [AsyncAPI Specification](https://www.asyncapi.com/docs/reference/specification/latest)
