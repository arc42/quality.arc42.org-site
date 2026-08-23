---
layout: approach
title: "Preserve Facts, Derive Interpretations"
tags: [flexible, maintainable]
aka: [Facts over State, Semantic Deferral, Business Uncertainty Tolerance]
supported_qualities: [evolvability, auditability, traceability, analysability]
supported_qualities_notes:
  evolvability: "Preserved facts support later reinterpretation without rewriting history, keeping semantic change localized."
  auditability: "Derived states remain explainable because their source facts and policy versions stay available."
  traceability: "Each interpretation can retain lineage to the observations and policies from which it was derived."
  analysability: "Explicit facts, provenance, and policy versions make the impact of changing an interpretation easier to assess before modifying the system."
tradeoffs: [maintainability, performance, privacy]
tradeoff_notes:
  maintainability: "Fact schemas, provenance, policy versions, and projections add concepts that teams must evolve consistently over time."
  performance: "Recomputing or replaying interpretations can add read latency or require materialized projections and indexes for operational workloads."
  privacy: "Detailed historical facts increase retained personal data and can require explicit retention, erasure, redaction, or crypto-shredding mechanisms."
intent: "Preserve business facts independently of their current interpretation so later knowledge can derive new meaning without rewriting history."
mechanism: "Capture durable domain observations with provenance, derive statuses and decisions through explicit policies or projections, and retain the lineage needed to reproduce or replace those interpretations later."
applicability: "Use where business meaning may evolve or where historical reinterpretation matters. Skip when history has little value or privacy and lifecycle costs outweigh the benefit."
related: [event-sourcing, defer-binding]
related_notes:
  event-sourcing: "Preserve Facts, Derive Interpretations and Event Sourcing both retain information for later derivation; Event Sourcing additionally makes event history the persistence model."
  defer-binding: "Preserve Facts, Derive Interpretations and Defer Binding both postpone commitment; the former targets business meaning, the latter technical choices."
related_requirements: [reinterpret-domain-concept-from-historical-facts, capture-unresolved-business-semantics-without-structural-commitment]
related_requirements_notes:
  reinterpret-domain-concept-from-historical-facts: "Tests whether later business meaning can be applied retrospectively to facts captured before that interpretation existed."
  capture-unresolved-business-semantics-without-structural-commitment: "Tests whether implementation can proceed while business meaning remains unresolved without losing the information needed to decide later."
permalink: /approaches/preserve-facts-derive-interpretations
---

Business knowledge changes. If a system stores only today's derived state, the information needed for tomorrow's interpretation may already be lost. This approach addresses that concern:

> **Business Uncertainty Tolerance** is the ability of a system to operate under incomplete or evolving business knowledge without being forced into irreversible semantic commitments — facts stay durable, interpretations stay replaceable, and architectural commitments stay rare.

**Preserve Facts, Derive Interpretations** separates durable business observations from replaceable interpretations. Current states can still be materialized, while source facts and provenance remain available so later policies can derive different results.

![Facts remain stable while policies derive replaceable interpretations.](/assets/img/approaches/preserve-facts-derive-interpretations.svg)

## How It Works

- Capture domain facts whose meaning is stable independently of the current classification or rule.
- Record enough provenance to identify when a fact was known, where it came from, and what it concerns.
- Derive statuses, classifications, and decisions through explicit policies or projections.
- Retain policy versions and lineage so historical results remain reproducible.

## Failure Modes

- Facts encode today's interpretation rather than durable observations, so later reinterpretation still loses information.
- Teams retain everything "just in case", increasing privacy and lifecycle cost without adding semantic value.
- Derived state becomes authoritative while source facts or policy versions become incomplete, making historical results irreproducible.

## Verification

- For a representative sample of at least 100 historical cases, a revised interpretation produces results from unchanged pre-existing facts for 100% of the sample.
- Reinterpreting the sample modifies 0 source facts and requires changes to 0 original fact producers.
- For 100% of sampled derived results, the system identifies the source facts and, where applicable, the policy version used.

## Variants and Related Tactics

- **Event Sourcing** makes the event history the system of record; a durable business-event journal can preserve facts alongside conventional current-state storage.
- **Defer Binding** postpones technical choices; this approach applies the same pressure against premature commitment to business semantics.
