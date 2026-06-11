---
layout: approach
title: "Backends for Frontends"
tags: [flexible, efficient]
aka: [BFF]
supported_qualities: [evolvability, autonomy, loose-coupling, response-time]
supported_qualities_notes:
  evolvability: "Each frontend changes its API contract at its own pace; no cross-client negotiation over one general-purpose API."
  autonomy: "The frontend team owns the backend it consumes — shaping, building, and releasing it without waiting on a central API team."
  loose-coupling: "Clients couple to one tailored contract instead of to the granularity and churn of many downstream services."
  response-time: "Server-side aggregation replaces several client round trips with one call — felt most over high-latency mobile networks."
tradeoffs: [simplicity, consistency, maintainability]
tradeoff_notes:
  simplicity: "Every experience adds another deployable with its own pipeline, monitoring, and on-call duty, plus one more hop in every request path. The service count grows with the number of frontends, not with business capability."
  consistency: "Aggregation and presentation rules reimplemented per BFF drift apart: web and mobile quietly diverge in totals, filtering, or wording until users comparing both surfaces notice."
  maintainability: "A downstream API change must be repeated in every BFF that consumes it. Logic shared across BFFs is either duplicated — Newman's own caveat — or extracted into libraries the client teams must version and govern."
intent: "Give each frontend its own purpose-built backend, so every experience shapes and evolves its API without negotiating with other clients."
mechanism: "One thin edge service per frontend — web, mobile, partner — aggregates downstream APIs and tailors the payload to that single experience. The team building the frontend owns its BFF and changes the contract on the frontend's release cadence; downstream services stay general-purpose."
applicability: "Use when several distinct frontends pull differently shaped data from the same services and a general-purpose API has become the negotiation bottleneck between client teams. Skip with a single frontend, or when light response shaping in an API gateway covers the differences."
related: [api-gateway, microservice-architecture]
related_notes:
  api-gateway: "A gateway is one general-purpose front door for all clients; a BFF is one door per experience, owned by that experience's team."
  microservice-architecture: "BFFs are the standard edge over a microservice landscape, shielding each frontend from service granularity and fan-out."
related_requirements: [independent-enhancement-of-subsystem, service-loose-coupling-change-blast-radius]
related_requirements_notes:
  independent-enhancement-of-subsystem: "A frontend and its BFF change as one unit while every other client's stack stays untouched."
  service-loose-coupling-change-blast-radius: "Client-specific contract changes land in one BFF, keeping downstream contracts stable and the change confined to one deployable."
permalink: /approaches/backends-for-frontends
---

Backends for Frontends gives each user experience — web, mobile, partner integration — its own dedicated backend instead of routing every client through one general-purpose API. Each BFF aggregates downstream services and shapes responses for exactly one frontend, and the team building that frontend owns it.

The pattern trades deliberate duplication for independent evolution: each experience changes its contract at its own pace; the general-purpose API stops being where every client's needs collide. SoundCloud, where the pattern was named, ran dozens of BFFs.

![Backends for Frontends: each frontend calls its own BFF, owned by the same team; every BFF aggregates the shared, general-purpose downstream services and tailors the payload to its one experience.](/assets/img/approaches/backends-for-frontends.svg)

## How It Works

- One BFF per user experience, not per platform vendor; experiences with near-identical needs share one.
- The frontend team owns its BFF end to end: contract, aggregation logic, payload shape, release cadence.
- The BFF fans out to downstream services and combines their responses into one payload — typically one call per screen.
- Business rules stay downstream; the BFF holds only experience-specific aggregation, mapping, and edge concerns.

## Failure Modes

- The BFF accretes business logic and becomes a thin monolith per client; domain rules now live in several client-specific copies that disagree.
- BFFs multiply unchecked — one per device model or sub-team — leaving dozens of near-identical services nobody consolidates.
- Edge concerns reimplemented per BFF drift: one client receives a security fix while the others keep the hole.
- A BFF fans out synchronously to many slow services; the aggregation hop becomes the dominant latency and availability bottleneck.

## Verification

- Network traces show one BFF round trip per screen or view at the 95th percentile.
- Deployment logs show BFF releases riding the frontend's cadence, with no coordinated downstream releases.
- A change-coupling report shows business-rule changes landing in downstream services only; recurring BFF edits for policy changes flag logic leakage.

## Variants and Related Tactics

- An API gateway is the single-front-door alternative; thin per-client gateway configurations blur into BFFs.
- GraphQL on one shared endpoint lets clients shape responses themselves — an alternative when payload flexibility, not team ownership, is the goal.
- Micro frontends extend the same per-experience ownership into the UI.

## References

- [Backends For Frontends](https://samnewman.io/patterns/architectural/bff/) — Sam Newman (2015)
- [The Back-end for Front-end Pattern (BFF)](https://philcalcado.com/2015/09/18/the_back_end_for_front_end_pattern_bff.html) — Phil Calçado (2015)
- *Building Microservices*, 2nd ed. — Sam Newman (O'Reilly, 2021)
