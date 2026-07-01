---
layout: approach
title: "Increase Cohesion"
tags: [maintainable, flexible]
aka: [Split Module, Redistribute Responsibilities, Increase Semantic Coherence]
supported_qualities: [modularity, analysability, modifiability, testability]
supported_qualities_notes:
  modularity: "Grouping one responsibility per module is what gives a decomposition meaningful, self-contained parts."
  analysability: "A module that does one thing is understood by reading it alone — its behaviour isn't scattered across the codebase."
  modifiability: "When a responsibility lives in one place, a change to it touches one module instead of several."
  testability: "A single-purpose module has fewer reasons to change and a smaller interface to exercise, so tests stay focused."
tradeoffs: [loose-coupling, simplicity]
tradeoff_notes:
  loose-coupling: "Splitting one module into cohesive pieces multiplies the interfaces between them. Pushed past the point of genuine separation, it trades an internal tangle for a web of inter-module calls — cohesion bought with coupling."
  simplicity: "More, smaller modules mean more files, names, and boundaries to hold in mind. A reader chasing one feature now hops across several modules instead of scrolling through one."
intent: "Group each module around a single, related responsibility, so a change to that responsibility stays inside one module."
mechanism: "Two tactics raise cohesion. Split a module: when a module carries responsibilities that change for different reasons, break it into smaller modules that each serve one purpose. Redistribute responsibilities: when one responsibility is scattered across modules, gather its pieces into a single module."
applicability: "Apply when a module changes for several unrelated reasons, when one concern is smeared across many modules, or when a class has grown too large to hold in your head. Splitting cohesive, stable code that already changes as a unit only adds boundaries."
related_requirements: [adding-entity-type-within-5-days, monolith-loose-coupling-change-blast-radius, assess-impact-of-proposed-change]
related_requirements_notes:
  adding-entity-type-within-5-days: "Full-stack support for a new entity added in ≤ 3 modules depends on each concern living in one cohesive place rather than smeared system-wide."
  monolith-loose-coupling-change-blast-radius: "Keeping a business-rule change inside its owning functional module presumes that module is cohesive — that the rule isn't scattered elsewhere."
  assess-impact-of-proposed-change: "A cohesive module bounds where a change's effects can reach, shrinking the surface an impact analysis must cover."
permalink: /approaches/increase-cohesion
---

Cohesion is the degree to which the parts of a module belong together — how single-minded the module is about one responsibility. A cohesive module has one reason to change; a non-cohesive one is pulled in several directions at once, so every change risks the concerns it happens to sit beside.

Raising cohesion localises change. Splitting for cohesion often lowers coupling too, because the responsibilities you separate stop reaching into each other.

![Two before-and-after rows. Top: a tangled Orders module holding pricing and invoicing responsibilities splits into a single-purpose Pricing module and a single-purpose Invoicing module. Bottom: a logging concern scattered as a stray piece across three modules is gathered into one cohesive Logging module.](/assets/img/approaches/increase-cohesion.svg)

## How It Works

- **Split a module** — when a module holds responsibilities that change for different reasons, refactor it into smaller modules that each serve one purpose.
- **Redistribute responsibilities** — when a single responsibility is smeared across several modules, gather its scattered pieces into one place.
- Draw the seam along a fracture line — group what serves one business capability, split what changes for different reasons.

## Failure Modes

- Splitting by layer or type rather than by responsibility scatters one feature across the new modules — every change still touches them all.
- Over-splitting produces anaemic modules that do too little, so the coupling between them exceeds the cohesion gained.
- A module accretes helpers over time; its stated purpose and actual contents drift apart.

## Verification

- Structural cohesion metrics improve — LCOM (lack of cohesion of methods) falls. Read LCOM with care: it captures only method-and-field links inside a class, not whether a module maps to a single business capability.
- Change-coupling analysis of version history shows the split modules now change independently, not in lockstep.
- A one-sentence responsibility statement fits each module without an "and" — a fuzzy line signals a further split.

## Variants and Related Tactics

- Reduce Coupling is the complementary lever — see that page.
- Domain-Driven Design applies cohesion at subsystem scale: a bounded context groups one business capability, and the context map shows how those contexts relate.
- The Single Responsibility Principle restates cohesion at class scale: one reason to change.
- Hotspot and change-coupling analysis point to which non-cohesive modules to split first.

## References

- *Software Architecture in Practice*, 4th ed. — Bass, Clements & Kazman ([full citation](/references/#bass2021software))
- [On the Criteria To Be Used in Decomposing Systems into Modules](https://dl.acm.org/doi/10.1145/361598.361623) — David Parnas (CACM 15(12), 1972)
- *Domain-Driven Design: Tackling Complexity in the Heart of Software* — Eric Evans (Addison-Wesley, 2003) — origin of the bounded context and context map
- [*Learning Domain-Driven Design*](https://www.oreilly.com/library/view/learning-domain-driven-design/9781098100124/) — Vlad Khononov (O'Reilly, 2021)
- [*Domain-Driven Transformation*](https://domain-driven-transformation.com/) — Carola Lilienthal & Henning Schwentner (O'Reilly, 2026)
