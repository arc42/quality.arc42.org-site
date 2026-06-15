---
layout: approach
title: "Event-Driven Architecture"
tags: [flexible, operable]
supported_qualities: [loose-coupling, extensibility, evolvability, autonomy, integrability]
supported_qualities_notes:
  loose-coupling: "The dependency points one way: consumers depend on the event schema, while producers hold no reference to any consumer."
  extensibility: "New capabilities attach as additional subscribers to existing events; the producing service and its current consumers stay untouched."
  evolvability: "Event contracts outlive individual services: implementations change or get replaced behind a stable stream without coordinated rewrites."
  autonomy: "Each consumer reacts with its own logic and data, and keeps working from already-received events while peers are down."
  integrability: "A new system integrates by subscribing to the existing event stream; producers need no adapter code and no release."
tradeoffs: [eventual-consistency, understandability, debuggability]
tradeoff_notes:
  eventual-consistency: "Consumers learn about a state change only when its event reaches them, so parts of the system disagree for the propagation interval. Reads issued mid-propagation return stale data — acceptable for a search index, hazardous for a balance check."
  understandability: "End-to-end behavior is written down nowhere: it emerges from which consumers subscribe to which events. Answering 'what happens when an order is placed?' takes an inventory of subscriptions across services, and the answer silently changes whenever any team adds one."
  debuggability: "One business flow becomes a chain of events across broker hops, retries, and consumers. Reconstructing why something happened — or failed to happen — needs correlation IDs propagated through every event and traces collected from every participant."
intent: "Connect components through asynchronous events so producers publish facts without knowing their consumers, and new behavior attaches by subscription instead of modification."
mechanism: "Components publish events — immutable records of completed state changes — to a broker. Subscribed consumers react independently with their own logic and may emit further events. The producer's responsibility ends at publication; routing, fan-out, and delivery belong to the broker, so the consumer set changes freely."
applicability: "Use when several consumers react to the same business facts, integrations change often, and bounded staleness is acceptable. Skip when the caller needs an immediate, strongly consistent answer in the request path, or when so few components interact that a broker adds more moving parts than it removes."
related: [asynchronous-messaging]
related_notes:
  asynchronous-messaging: "Asynchronous messaging moves work off the request path between known parties; event-driven architecture layers an architectural style on the same broker mechanism — topology defined by subscriptions."
related_requirements: [service-loose-coupling-change-blast-radius, add-new-product]
related_requirements_notes:
  service-loose-coupling-change-blast-radius: "Events as the only coupling surface keep most changes inside one service and bound how many consumers a contract change touches."
  add-new-product: "A product-created event fans out to search, cache, and storefront consumers, propagating the new product well inside the 60-minute window."
permalink: /approaches/event-driven-architecture
---

Event-driven architecture connects components through events: immutable records that something happened — an order placed, a payment captured. Producers publish to a broker and move on; consumers subscribe and react independently. Where asynchronous messaging moves work off the request path, this style defines the system's topology by subscriptions: the tenth consumer attaches exactly like the first.

![Event-driven architecture: the Order Service publishes an OrderPlaced event to an event broker; three subscribed services react independently, and a Fraud Check Service added later attaches by subscription without changing the producer.](/assets/img/approaches/event-driven-architecture.webp)

The diagram shows the fan-out of one event type; in a running system, consumers often publish further events of their own, forming chains.

## How It Works

- A component completes a local state change, then publishes an event naming the fact in past tense (`OrderPlaced`) to a broker topic.
- The broker delivers the event to every subscriber; each consumer runs its own logic — update a projection, notify a user, start a follow-on process — and may publish further events.
- Event notification carries only a reference, and consumers call back for details; event-carried state transfer embeds the data.
- The event schema is the public contract. Producers evolve it backward-compatibly, because they cannot enumerate their consumers.

## Failure Modes

- A "minor" schema change breaks consumers the producing team never knew existed — the schema is the coupling surface.
- A consumer emits an event that re-triggers the original producer; the feedback loop floods the broker (event storm).
- At-least-once delivery duplicates events; consumers without idempotent handlers double-charge or double-notify.
- A silently failing subscriber falls behind; growing lag turns bounded staleness into unbounded drift.

## Verification

- Consumer-driven contract tests run every subscriber's expectations against the producer's schema in CI; a breaking change fails the producer's build.
- Replaying redelivered events against each consumer produces side effects exactly once.
- Consumer lag per subscription stays under its threshold; an alert fires on the age of the oldest unprocessed event.
- CI diffs a generated subscription map (who consumes which event) against live broker configuration.

## Variants and Related Tactics

- Asynchronous messaging provides the transport beneath the style — queues, retries, dead-letter handling.
- CQRS projects events into read-optimized views.
- Choreography-style sagas coordinate distributed transactions purely through events, adding compensation on failure.
- Event sourcing is the persistence-side counterpart: within one component, the event log is the system of record and current state derives from replay — a decision independent of how components communicate.

## References

- [What do you mean by "Event-Driven"?](https://martinfowler.com/articles/201701-event-driven.html) — Martin Fowler
- [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/) — Gregor Hohpe & Bobby Woolf ([full citation](/references/#hohpe2004enterprise))
- [Building Event-Driven Microservices](https://www.oreilly.com/library/view/building-event-driven-microservices/9781492057888/) — Adam Bellemare, O'Reilly, 2020
