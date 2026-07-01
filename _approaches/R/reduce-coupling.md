---
layout: approach
title: "Reduce Coupling"
tags: [maintainable, flexible]
aka: [Decoupling, Dependency Reduction]
supported_qualities: [modifiability, evolvability, testability, modularity]
supported_qualities_notes:
  modifiability: "A change confined to one module can't ripple through dependents, so modification effort stays local and predictable."
  evolvability: "Modules with few external dependencies can be replaced or restructured without renegotiating contracts across the system."
  testability: "A module with fewer collaborators needs fewer test doubles and can run in isolation."
  modularity: "Narrow, explicit interfaces are what make a decomposition into modules real rather than nominal."
tradeoffs: [simplicity, latency]
tradeoff_notes:
  simplicity: "Each interface, broker, or visibility rule is a moving part. Added where no real variability exists, they raise the part count and the indirection a reader must traverse while removing no actual dependency — abstraction for its own sake."
  latency: "Routing a call through an intermediary — broker, message bus, mediator — adds a hop or a dispatch step. Decoupling a hot path this way can raise p99 latency measurably."
intent: "Weaken the dependencies between modules so a change to one module stops at its boundary instead of rippling across the system."
mechanism: "Four complementary tactics lower coupling: encapsulate a module behind an explicit interface, insert an intermediary between modules that must interact, restrict which modules a module may depend on, and abstract several similar dependencies behind one shared contract. Each converts a direct, wide dependency into a narrow, indirect one."
applicability: "Apply where modules change independently, must be tested or replaced in isolation, or where change ripple already hurts. Reach for it selectively: decoupling stable, cohesive collaborators that always change together adds indirection while removing no real dependency."
related: [increase-cohesion]
related_notes:
  increase-cohesion: "Cohesion and coupling are the two levers of modifiability — raise cohesion inside a module, lower coupling between modules. Applied together they localise change, and a split made to raise cohesion often cuts coupling as a side effect."
related_requirements: [monolith-loose-coupling-change-blast-radius, service-loose-coupling-change-blast-radius, independent-enhancement-of-subsystem]
related_requirements_notes:
  monolith-loose-coupling-change-blast-radius: "The blast-radius limits — CBO ≤ 10, no more than two modules touched per change — are exactly what reducing coupling drives down."
  service-loose-coupling-change-blast-radius: "Confining a service to explicit API and event contracts, with no shared internals or cross-service database access, is the reduce-coupling tactic applied between services."
  independent-enhancement-of-subsystem: "A subsystem that changes with no edits to any other is the direct goal of weakening cross-subsystem dependencies."
permalink: /approaches/reduce-coupling
---

Coupling is the degree to which one module depends on another — how many connections cross the boundary, how wide they are, and how much each side must know about the other's internals. High coupling makes change contagious: touch one module and its dependents break.

Reducing coupling is not eliminating dependencies — a system with none does nothing. It makes the remaining dependencies fewer, narrower, and explicit, so change stays local.

![Four tactics that reduce coupling, shown as a two-by-two grid: encapsulate a module behind an explicit interface; place a broker as an intermediary between two modules so neither names the other; restrict dependencies so each layer calls only the one below, with skips forbidden; and abstract several providers behind one shared contract.](/assets/img/approaches/reduce-coupling.svg)

## How It Works

- **Encapsulate** — put an explicit interface in front of a module; dependents bind to the interface, leaving the internals free to change.
- **Use an intermediary** — place a broker, mediator, or message bus between two modules so neither names the other directly.
- **Restrict dependencies** — limit which modules a module may reference, through visibility rules or a layered, acyclic dependency policy.
- **Abstract common services** — hide several similar dependencies behind one shared contract, so a dependent binds once instead of per provider.

## Failure Modes

- Speculative interfaces wrap code that has one implementation and always will — indirection that decouples nothing.
- The intermediary becomes a hub every path crosses, turning into a new coupling point and a bottleneck.
- Dependency rules so strict that teams route around them with skip-layer calls or duplicated logic.

## Verification

- Coupling metrics stay inside a threshold: efferent and afferent coupling (Ce/Ca), instability, CBO per class.
- An architecture-conformance test fails the build on any disallowed or cyclic module dependency.
- Change-coupling analysis: files that keep changing together despite no static link expose residual coupling.

## Variants and Related Tactics

- Increase Cohesion is the complementary lever — see that page.
- Defer Binding reduces coupling across time: postponing a choice to configuration or runtime removes a caller's compile-time dependence on a specific implementation.
- Connascence grades coupling by strength and locality, a finer vocabulary than "loose versus tight".
- Hexagonal, Layered, and Publish-Subscribe are pattern-scale realisations.

## References

- *Software Architecture in Practice*, 4th ed. — Bass, Clements & Kazman ([full citation](/references/#bass2021software))
- [*Balancing Coupling in Software Design*](https://www.oreilly.com/library/view/balancing-coupling-in/9780137353514/) — Vlad Khononov (Addison-Wesley, 2024)
- [On the Criteria To Be Used in Decomposing Systems into Modules](https://dl.acm.org/doi/10.1145/361598.361623) — David Parnas (CACM 15(12), 1972)
