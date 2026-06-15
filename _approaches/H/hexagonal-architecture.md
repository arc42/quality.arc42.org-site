---
layout: approach
title: "Hexagonal Architecture"
tags: [maintainable, flexible]
aka: [Ports and Adapters, Clean Architecture]
supported_qualities: [testability, evolvability, loose-coupling, modularity]
supported_qualities_notes:
  testability: "The core runs in plain unit tests — no database, broker, or framework; fakes implement the ports."
  evolvability: "Frameworks, databases, and delivery mechanisms change at the adapter rim; the domain core outlives them."
  loose-coupling: "Core and infrastructure share only the port interfaces the core owns; neither knows the other's internals."
  modularity: "Ports draw an explicit, compiler-enforced boundary between domain and technology modules."
tradeoffs: [simplicity, understandability]
tradeoff_notes:
  simplicity: "Every infrastructure touchpoint costs an interface, an adapter, and often a mapping between domain and persistence models. In CRUD-heavy services this machinery outweighs the logic it protects — three artifacts changing in lockstep for every added field."
  understandability: "Indirection hides the concrete path: finding where a request actually hits the database means traversing port, adapter, and wiring code. Newcomers and IDE navigation pay for the inversion on every traced call."
intent: "Keep domain logic at the center, free of technology; all infrastructure connects through ports the core owns."
mechanism: "The domain core defines ports — interfaces for everything that drives it or that it drives. Adapters implement them for concrete technology: UIs and tests call in, databases and brokers are called through. Source-code dependencies point only inward."
applicability: "Use when domain logic is rich enough to outlive its frameworks, when infrastructure must stay swappable, or the core must test without I/O. Skip for thin CRUD services and short-lived tools — the indirection and mapping tax exceeds the logic it protects."
related: [plugin-architecture]
related_notes:
  plugin-architecture: "Plugin Architecture opens the feature set through extension points; Hexagonal Architecture swaps infrastructure behind ports the core owns."
related_requirements: [independent-replacement-of-subsystem, change-cloud-provider, quick-unit-tests]
related_requirements_notes:
  independent-replacement-of-subsystem: "Swapping a provider means writing one new adapter behind the existing port; every other subsystem stays untouched."
  change-cloud-provider: "Ports concentrate provider specifics in adapters — the requirement's provider-adaptation points — keeping migration effort bounded."
  quick-unit-tests: "A framework-free core runs its unit tests without I/O, keeping the suite far inside the time budget."
permalink: /approaches/hexagonal-architecture
---

Hexagonal Architecture — Ports and Adapters, Cockburn's preferred name — puts domain logic at the center and pushes technology to the rim. The core owns its ports: interfaces for everything that drives it (UI, API, tests) and everything it drives (database, broker, external services). Adapters implement the ports, and source-code dependencies point only inward.

Clean Architecture (Martin) and Onion Architecture (Palermo) restate the same dependency rule as concentric rings; this page covers the family. The hexagon carries no meaning — the rule that the core never names a technology does.

![Hexagonal Architecture: the domain core sits inside a hexagon and owns its ports; driving adapters such as web UI and test harness call inbound ports on the left, driven adapters such as database and message broker sit behind outbound ports on the right; all source-code dependencies point inward.](/assets/img/approaches/hexagonal-architecture.svg)

## How It Works

- The domain core holds entities and use cases, free of framework, persistence, and transport imports.
- Ports take their shape from domain needs, never from adapter APIs.
- Driving adapters (web controller, test harness) call inbound ports; driven adapters (database gateway, broker client) implement outbound ports.
- A composition root wires adapters to ports at startup; the core never references an adapter.

## Failure Modes

- Framework or persistence annotations creep into domain types; the boundary survives on the diagram only, and core tests drag infrastructure along.
- Ports mirror a vendor's API instead of a domain need, so swapping the technology rewrites the core anyway.
- An anemic core reduces use cases to pass-throughs: every call pays the indirection while no logic is protected.
- Domain, persistence, and transport models drift across the mapping layers; a field added in one copy goes missing in another.

## Verification

- An architecture test in CI reports zero imports from the core into frameworks, adapters, or drivers.
- The core's unit-test suite runs without database, network, or container — seconds, not minutes.
- Every driven port has two implementations — production adapter and in-memory fake — passing one shared contract-test suite.

## Variants and Related Tactics

- Clean Architecture (Martin, 2012) merges Hexagonal, Onion, and BCE into concentric rings under one Dependency Rule.
- Onion Architecture (Palermo, 2008) centers the rings on the domain model; the inward rule is identical.
- Layered architecture stacks top-down dependencies; Hexagonal inverts the data layer so the domain owns the interfaces.

## References

- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/) — Alistair Cockburn (2005)
- [Hexagonal Architecture Explained](https://alistaircockburn.com) — Alistair Cockburn, Juan Manuel Garrido de Paz (2023)
- [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) — Robert C. Martin (2012)
- *Clean Architecture: A Craftsman's Guide to Software Structure and Design* — Robert C. Martin (Prentice Hall, 2017)
- [Get Your Hands Dirty on Clean Architecture](https://leanpub.com/get-your-hands-dirty-on-clean-architecture) — Tom Hombergs (Leanpub, 2nd ed.)
- [The Onion Architecture](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/) — Jeffrey Palermo (2008)
