---
layout: approach
title: "Open Host Service"
tags: [flexible, operable]
aka: [Published Language]
supported_qualities: [interoperability, integrability, loose-coupling, evolvability]
supported_qualities_notes:
  interoperability: "Host and consumers exchange information through one documented shared model, so data means the same on both sides of every integration."
  integrability: "New consumers integrate against the published protocol and its documentation alone, with no bespoke contract negotiated with the host team."
  loose-coupling: "Consumers couple to the published language only; the host's internal domain model stays invisible behind the translation layer."
  evolvability: "The host refactors its internal model freely; only the translation layer absorbs the change."
tradeoffs: [changeability, maintainability, simplicity]
tradeoff_notes:
  changeability: "The published language ossifies: every revision must be versioned and coordinated across all consumers, known and unknown. The public contract evolves on the slowest consumer's schedule, and renamed or removed concepts linger for years as deprecated baggage."
  maintainability: "The team owns two models permanently — the internal one and the published one — plus the translation between them. Every internal refactoring adds mapping work, and drift between the two models surfaces as subtle translation bugs."
  simplicity: "A general-purpose language for unknown consumers costs more than a point-to-point integration: schema, documentation, versioning and deprecation policy must exist before the second consumer does. With only one or two known consumers, that machinery is pure overhead."
intent: "Expose one well-defined protocol in a documented shared language, so any number of consumers integrate without bespoke per-consumer translation."
mechanism: "The upstream context publishes one service interface expressed in a published language: a documented, versioned shared model such as an OpenAPI or event schema. A translation layer maps the internal domain model to this language, so internal types never appear on the wire."
applicability: "Use when one context serves many or unknown downstream consumers and bespoke per-consumer integration stops scaling. Skip with one or two known consumers — a direct contract, with an anti-corruption layer on the consumer side, is cheaper."
related: [api-gateway, event-sourcing]
related_notes:
  api-gateway: "A gateway is the infrastructure front door for all clients; Open Host Service defines the contract and shared language served behind it."
  event-sourcing: "An event-sourced context translates its internal events into the published language at the boundary instead of exposing the raw event log."
related_requirements: [service-loose-coupling-change-blast-radius]
related_requirements_notes:
  service-loose-coupling-change-blast-radius: "The explicit published contract is what confines internal model changes to the host service instead of rippling into consumers."
permalink: /approaches/open-host-service
---

Open Host Service is the strategic Domain-Driven Design answer to integration at scale: instead of negotiating one bespoke translation per consumer, the upstream context opens one well-defined protocol for any consumer. Its companion pattern, Published Language, supplies the vocabulary — a documented, versioned shared model for every request, response, and event. Evans introduces them as a pair, and practice applies them as one: an open protocol without a shared language degenerates into ad-hoc payloads.

The pattern is the upstream mirror of the Anti-Corruption Layer: the host shields consumers from its internal model, rather than each consumer shielding itself.

![Open Host Service: inside the upstream bounded context, a translation layer maps the internal domain model to the Open Host Service; all consumers — including future ones — integrate through one protocol expressed in the published language.](/assets/img/approaches/open-host-service.svg)

## How It Works

- The upstream context defines one service protocol, open to every consumer — current and future.
- Requests, responses, and events use the published language: a documented, versioned schema (e.g. OpenAPI, JSON Schema, Avro) or an industry standard (e.g. FHIR, iCalendar).
- A translation layer inside the host maps the internal domain model to the published language; internal types never cross the boundary.
- A versioning and deprecation policy governs evolution; consumers rely on the language and its documentation alone.

## Failure Modes

- The published language is generated from internal types, so every internal refactoring becomes a breaking contract change.
- Per-consumer special cases creep into the protocol, recreating N bespoke integrations under one name.
- Evolution without a versioning policy forces a lockstep upgrade of every consumer at the first breaking change.
- Translation mappings lag behind internal model changes; consumers receive structurally valid but semantically wrong data.

## Verification

- The integration log shows zero host-side code changes for the last N consumer onboardings.
- Contract tests pin the published schema; internal refactorings pass them unchanged.
- A schema diff in CI flags every breaking change and rejects unversioned ones.

## Variants and Related Tactics

- Anti-Corruption Layer is the downstream mirror: the consumer translates because the upstream offers no clean protocol.
- A standalone published language — an industry standard such as FHIR — can serve several hosts at once.
- Consumer-driven contract testing checks the published language against real consumer expectations.

## References

- *Domain-Driven Design: Tackling Complexity in the Heart of Software*, ch. 14 — Eric Evans (Addison-Wesley, 2003)
- *Implementing Domain-Driven Design* — Vaughn Vernon (Addison-Wesley, 2013)
- [Context Mapping](https://github.com/ddd-crew/context-mapping) — DDD Crew
