---
layout: approach
title: "Microservice Architecture"
tags: [flexible, operable]
aka: [Microservices]
supported_qualities: [deployability, scalability, evolvability, autonomy, fault-isolation]
supported_qualities_notes:
  deployability: "Each service ships alone behind stable contracts; a release touches one pipeline, not a coordinated train."
  scalability: "Hot services scale out independently — the catalog scales to read traffic without touching checkout."
  evolvability: "A service changes its stack, data model, or internals freely while its contract holds."
  autonomy: "One team owns each service end to end — build, run, and decide — limiting cross-team coordination."
  fault-isolation: "A crashing service takes only its capability down — provided callers guard themselves with timeouts, circuit breakers, and fallbacks."
tradeoffs: [simplicity, consistency, latency, debuggability]
tradeoff_notes:
  simplicity: "Every call between capabilities becomes a network call with discovery, retries, and versioned contracts. The moving-parts count — pipelines, brokers, dashboards per service — grows with the service count: the 'microservices premium' that small systems never recoup."
  consistency: "Data lives in many stores; transactions across services give way to sagas and eventual consistency. Invariants one database used to enforce now need compensation logic and reconciliation."
  latency: "In-process calls become network hops; a request fanning out across five services stacks their latencies and tail effects."
  debuggability: "One business flow spans many services, brokers, and retries. Without distributed tracing and correlated logs, reconstructing a failure is archaeology across team boundaries."
intent: "Structure the system as independently deployable services around business capabilities, each owned by one team and free to scale, fail, and evolve alone."
mechanism: "Each service implements one business capability, owns its data store, and talks to peers over the network — synchronous APIs or asynchronous events. A gateway fronts the landscape; services deploy, scale, and fail independently, coordinated by contracts instead of shared code or databases."
applicability: "Use when several teams need independent delivery cadence, parts of the system scale very differently, or domains demand different stacks. Skip for single-team products, unclear domain boundaries, or organizations without automated deployment and observability — there the premium exceeds the benefit."
related: [self-contained-systems]
related_notes:
  self-contained-systems: "Self-contained systems decompose coarser, into a few web applications that keep their UI; microservices split into many headless services behind a gateway."
related_requirements: [deploy-to-production-within-15-minutes, scale-up-in-2-minutes]
related_requirements_notes:
  deploy-to-production-within-15-minutes: "Small, independent pipelines keep the merge-to-production path short enough for the 15-minute window."
  scale-up-in-2-minutes: "Scaling adds instances of the saturated service only, so capacity arrives fast and without disproportionate cost."
permalink: /approaches/microservice-architecture
---

Microservice architecture splits a system into small, independently deployable services, each built around one business capability and owned by one team. Services hide their data behind contracts; nothing shares a database or a release train.

The style buys organizational and operational independence — and pays for it in distributed-system complexity. Its value depends less on service size than on getting the boundaries right.

![Microservice architecture: clients reach independently deployable services through an API gateway; each service owns its data store, communicates via APIs and asynchronous events, and is owned by one team.](/assets/img/approaches/microservice-architecture.svg)

## How It Works

- Boundaries follow business capabilities (bounded contexts); each service encapsulates one and owns its data store exclusively.
- Services communicate through versioned APIs or asynchronous events; an API gateway handles routing, authentication, and rate limiting at the edge.
- Each service has its own pipeline: build, test, deploy, and scale without coordinating with other teams.
- Resilience is explicit: timeouts, circuit breakers, and bulkheads guard every cross-service call.

## Failure Modes

- A distributed monolith emerges: services share a database or deploy in lockstep, keeping the coupling while adding the network.
- Boundaries cut wrong, so one feature routinely changes three services — coordination returns as the dominant cost.
- Synchronous call chains stack latencies and couple availability; one slow service degrades every caller upstream.
- The platform bill arrives early: teams drown in pipelines, brokers, and dashboards before any independence pays off.

## Verification

- Each service deploys to production alone; deployment logs show no coordinated multi-service releases.
- Chaos check: killing one non-critical service leaves every other capability serving, with fallbacks engaged.
- Traces show user-critical paths crossing at most a defined number of synchronous hops.
- A change-coupling report over commits shows features landing in one service; recurring cross-service features flag wrong boundaries.

## Variants and Related Tactics

- Self-contained systems decompose coarser and keep the UI inside each unit — often the calmer first step.
- A modular monolith delivers boundary discipline without the network; "monolith first" remains sound advice.
- API gateway, saga, event-driven architecture, and circuit breaker are this style's standard companions.

## References

- [Microservices](https://martinfowler.com/articles/microservices.html) — James Lewis, Martin Fowler (2014)
- *Building Microservices*, 2nd ed. — Sam Newman (O'Reilly, 2021)
- *Microservices Patterns* — Chris Richardson (Manning, 2018)
- [MonolithFirst](https://martinfowler.com/bliki/MonolithFirst.html) — Martin Fowler (2015)
