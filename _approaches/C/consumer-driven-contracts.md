---
layout: approach
title: "Consumer-Driven Contracts"
tags: [flexible, reliable, maintainable]
aka: [Contract Testing]
supported_qualities: [backward-compatibility, testability, interoperability, evolvability]
supported_qualities_notes:
  backward-compatibility: "A provider change that would break any existing consumer fails the provider's build before release, not after deployment."
  testability: "Integration compatibility becomes a fast, deterministic CI test instead of a slow end-to-end run on a shared staging environment."
  interoperability: "Executable expectations document exactly how each consumer uses the interface, keeping both sides aligned on the wire format."
  evolvability: "Contracts reveal which parts of the interface consumers actually use; everything unmentioned can change or disappear safely."
tradeoffs: [maintainability, simplicity]
tradeoff_notes:
  maintainability: "Contract suites are code that every consumer team owns and updates. Contracts left behind by a decommissioned consumer keep blocking provider releases for expectations nobody holds anymore, until someone notices and prunes them."
  simplicity: "A contract broker, contract versioning, and cross-team CI wiring join the toolchain — each provider build now depends on artifacts published by consumer teams, coupling pipelines across team boundaries."
intent: "Each consumer publishes executable expectations of an interface, so provider changes that would break a consumer fail the provider's build."
mechanism: "Consumers record what they send and which response elements they read as executable contracts, published to a shared broker; the provider's CI replays every current contract against the real implementation and blocks release on failure."
applicability: "Use inside an organization or closed partner ecosystem where consumers are known and publish contracts: internal APIs, microservices, event streams. Skip for public APIs with anonymous consumers — versioning and tolerant readers carry the load there."
related: [tolerant-reader, open-host-service]
related_notes:
  tolerant-reader: "Contract tests pin the field set a tolerant reader extracts, turning consumer-side tolerance into an executable gate on the producer's build."
  open-host-service: "The host's published contract states what the provider offers; consumer-driven contracts feed back which parts consumers actually rely on."
related_requirements: [low-change-failure-rate, independent-enhancement-of-subsystem]
related_requirements_notes:
  low-change-failure-rate: "Integration breakage surfaces in the provider's CI instead of production, cutting deployment-caused incidents and rollbacks."
  independent-enhancement-of-subsystem: "Green contract verification proves a subsystem change leaves every consumer untouched — no other subsystem needs rebuilding or retesting."
permalink: /approaches/consumer-driven-contracts
---

Traditional contract testing points downstream: the provider publishes a schema; consumers check their compliance. Consumer-driven contracts invert the direction. Each consumer publishes an executable statement of what it sends and reads — endpoints, fields, formats — and the provider replays those expectations against its real implementation on every build. A change that breaks any consumer fails in the provider's pipeline, minutes after the commit.

The inversion yields a second dividend: together the contracts map the interface surface in actual use — a field no contract mentions is demonstrably dead.

![Consumer-driven contracts: two consumer teams publish executable expectations to a contract broker; the provider's CI fetches all current contracts, replays them against the real provider, and blocks the release when any expectation fails.](/assets/img/approaches/consumer-driven-contracts.svg)

## How It Works

- Each consumer writes its expectations as executable examples: the request it sends, the response elements it reads.
- Consumers publish these contracts to a shared broker, versioned per consumer and per environment.
- The provider's CI fetches all current contracts and replays them against the real provider implementation.
- A failed expectation blocks the provider's release and names the consumer it would break.
- A deployment gate asks the broker which versions are verified against each other before promoting either side.

## Failure Modes

- An over-specified contract encodes fields the consumer never reads: provider changes fail the gate for data nobody uses.
- Stale contracts from a retired consumer block provider releases until someone prunes them from the broker.
- Contracts verify structure, not semantics: a provider passes every contract yet returns wrong values, and the gate stays green.

## Verification

- Provider CI verifies 100% of current consumer contracts on every commit; a red verification blocks promotion.
- The broker's compatibility matrix answers "can this version deploy?" for both sides before every release.
- Integration defects that escape to staging or production trend toward zero; each escape gains a retroactive contract.

## Variants and Related Tactics

- **Provider-driven contracts (schema-first)** — the provider publishes, consumers comply; simpler, but breakage surfaces on the consumer side and later.
- **[Tolerant Reader](/approaches/tolerant-reader)** — consumer-side tolerance shrinks what contracts must pin down; the two combine well.
- **Schema registry with compatibility rules** — checks producer changes against evolution rules instead of real consumer expectations; cheaper, coarser.

## Example

The checkout team consumes the pricing service's quote endpoint and reads `net`, `tax`, and `total`. Its contract states: given a valid product id, the response contains those three numeric fields. When the pricing team renames `tax` to `taxes`, checkout's contract fails pricing's build within minutes — before anything deploys. The same week, pricing deletes the `rounding_mode` field without ceremony: no contract ever mentioned it.

## References

- [Consumer-Driven Contracts: A Service Evolution Pattern](https://martinfowler.com/articles/consumerDrivenContracts.html) — Ian Robinson, martinfowler.com, 2006
- [ContractTest](https://martinfowler.com/bliki/ContractTest.html) — Martin Fowler, bliki, 2011
- [Building Microservices, 2nd ed.](https://samnewman.io/books/building_microservices_2nd_edition/) — Sam Newman, O'Reilly, 2021 — chapter 9 treats contract tests and consumer-driven contracts in depth
