---
layout: approach
title: "Self-Contained Systems"
tags: [flexible, maintainable]
aka: [SCS]
supported_qualities: [autonomy, loose-coupling, evolvability, deployability, replaceability]
supported_qualities_notes:
  autonomy: "Each system owns UI, logic, and data, runs on its own, and keeps serving users while neighboring systems are down."
  loose-coupling: "Integration via links, UI composition, and async events — no shared database, no shared runtime, no synchronous call chains."
  evolvability: "Each system changes its stack, data model, and release cadence without coordinating with the others."
  deployability: "Every system deploys independently; coordinated big-bang releases disappear by construction."
  replaceability: "Systems stay small enough that a team can rewrite one entirely without touching the others."
tradeoffs: [consistency, user-experience, resource-efficiency, reusability]
tradeoff_notes:
  consistency: "Each system keeps its own copy of the data it needs, replicated asynchronously. Cross-system views are eventually consistent — 'one customer, three systems' means three records that drift unless reconciliation is designed in."
  user-experience: "One business process now crosses several web applications. Navigation, look-and-feel, and session handling stay coherent only through deliberate effort — shared style assets, composition techniques, and discipline that a single application gets for free."
  resource-efficiency: "Every system brings its own full stack — runtime, database, pipeline, monitoring. Infrastructure and operational footprint multiply with the number of systems, regardless of load."
  reusability: "SCS favors replication over shared business code: common logic is duplicated per system. Each copy evolves separately, and a fix in one place reaches the others only by repetition."
intent: "Split a system along business domains into autonomous web applications — each owning its UI, logic, and data — that integrate loosely and evolve independently."
mechanism: "Each self-contained system is a complete web application for one business domain, with its own database and optional service API. Integration happens preferably in the browser via links and UI composition, otherwise asynchronously; no shared runtime, no shared database, shared business code avoided."
applicability: "Use for larger systems with several teams, where domains separate cleanly and independent delivery matters more than a uniform UI. Skip for small systems one team handles, products demanding a deeply integrated single-page experience, or domains whose boundaries are still unknown."
related_requirements: [independent-enhancement-of-subsystem, service-loose-coupling-change-blast-radius]
related_requirements_notes:
  independent-enhancement-of-subsystem: "A change stays inside one SCS: all other systems keep their source, build, and deployment untouched — the scenario's acceptance criteria verbatim."
  service-loose-coupling-change-blast-radius: "Domain-aligned system boundaries with async-only integration bound how far any change or failure can propagate."
permalink: /approaches/self-contained-systems
---

Self-contained systems cut a large system along business domains into autonomous web applications. Each owns everything it needs — UI, business logic, persistence — and belongs to one team. The style trades a uniform application for independently evolvable, independently deployable, independently failing units.

The cut is the hard part: boundaries follow business domains (bounded contexts), not technical layers.

![Self-contained systems: three autonomous web applications, each owning its UI, logic, and data, integrated through links and UI composition in the browser and asynchronous events below — no shared database.](/assets/img/approaches/self-contained-systems.svg)

## How It Works

- Each SCS is one deployable web application with its own database; one team owns it end to end.
- Integration sits as high in the stack as possible: links first, then UI composition, async events last. Synchronous calls between systems are the rare exception.
- Data a system needs from a neighbor arrives by async replication, so it keeps working while the source is down.
- Teams share infrastructure — style guide, deployment platform — and avoid shared business code.

## Failure Modes

- A wrong domain cut surfaces as features that always touch two systems; the coordination the style was meant to remove returns.
- Synchronous call chains creep in, coupling availability and stacking latency — the landscape degrades into a distributed monolith.
- Neglected UI integration shows users the seams: inconsistent navigation, repeated logins, jarring style changes.
- A shared "commons" library accumulates business logic, re-coupling systems through the back door.

## Verification

- Chaos check: stop one SCS in staging; the others keep serving their core functions.
- A change-coupling report over the commit history shows features landing in one system; recurring cross-system features flag a wrong cut.
- Traces confirm user-critical paths cross no synchronous system-to-system call.
- Each system reaches production alone — release calendars contain no coordinated multi-system entries.

## Variants and Related Tactics

- Microservices split finer: an SCS landscape counts a handful to a few dozen systems, each possibly containing services internally. SCS keeps the UI inside the unit; microservices usually externalize it.
- Micro frontends supply the UI-composition techniques SCS integration relies on.
- A modular monolith achieves similar change isolation inside one deployable — stronger consistency, weaker autonomy.
- Event-driven architecture supplies the asynchronous backbone between systems.

## References

- [scs-architecture.org](https://scs-architecture.org/) — the canonical community description, with characteristics and FAQ
- *Building Microservices*, 2nd ed. — Sam Newman (O'Reilly, 2021), on finding and owning boundaries
- *Micro Frontends in Action* — Michael Geers (Manning, 2020)
