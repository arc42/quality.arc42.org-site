# Tactics Update — Candidates from Harrer's *Qualitätstaktiken*

**Date:** 2026-05-20
**Source reviewed:** Markus Harrer, *Qualitätstaktiken — Lösungsstrategien für Softwarearchitekturen qualitätsgetrieben entwickeln* (Leanpub, 2026-03). Table of contents only (~280 pp, 400+ tactics).
**Cross-referenced against:** `todo/approaches/approaches-planning-and-status.md` (our 163-entry merged plan) and the 23 published `_approaches/`.

---

## How to read this

Harrer's book is **breadth-first**: 400+ short tactics grouped by ISO-25010 quality. Our collection is **depth-first**: a smaller set of editorial pages with intent / mechanism / tradeoffs / verification / variants. So we should *not* mirror his list. We should mine it for items that (a) clear our editorial bar, (b) are **not already in our plan**, and (c) are either genuinely off-beat, important-but-underused, or fill a quality area we cover thinly.

Every candidate below was checked against the merged plan. Items already present there (Graceful Degradation, Retry/Backoff, Idempotency, Event-Driven Architecture, Zero Trust, Canary, Blue-Green, IaC, Observability, DDD, Fitness Functions, Backpressure, Load Balancing, Connection Pooling, i18n, Dark Mode, Strangler Fig, Hexagonal, etc.) are **excluded** — they're already queued.

Each candidate is tagged:

- **🎯 Off-beat** — non-mainstream; the kind of "fresh idea" you asked for.
- **📐 Important standard** — mainstream but essential; worth a strong page even if not surprising.
- **🕳 Gap-filler** — covers a quality dimension our collection is currently thin on (esp. *suitable*, *maintainable*, *compatible/portable*, *operable*).

Quality-slug mappings use IDs that already exist in `_qualities/`.

---

## Tier 1 — Strongest candidates (write these first)

These combine "surprising or under-used" with "fits our depth format and has real substance." High signal-to-noise.

| # | Tactic (book) | Type | Maps to qualities | Why it earns a page |
|---|---------------|------|-------------------|---------------------|
| 1 | **Tolerant Reader** | 🎯 Gap-filler | backward-compatibility, interoperability, robustness, evolvability | Postel's-law parsing as an explicit design tactic. Rarely taught, hugely practical for API/event evolution. We have nothing on compatibility yet. Pairs with a Schema Registry page. |
| 2 | **Bubble Context** | 🎯 | maintainability, evolvability, modularity | DDD's quietest move: carve a clean model *inside* a legacy mess without boiling the ocean. Off-beat, advanced, and a genuine alternative to "rewrite". Strong intent/mechanism story. |
| 3 | **Anti-Corruption Layer** | 📐 Gap-filler | maintainability, interoperability, loose-coupling, integrability | The standard way to integrate with a model you don't control. Mainstream in DDD circles, under-applied everywhere else. Appears in our plan only as a sub-bullet of "Interface Tailoring" — deserves its own page. |
| 4 | **Consumer-Driven Contracts** | 🎯 Gap-filler | backward-compatibility, testability, interoperability | Inverts contract testing: consumers publish expectations, providers verify against them. Off-beat, prevents whole classes of integration breakage. Compatibility gap. |
| 5 | **Chaos Engineering** | 🎯 | resilience, fault-tolerance, availability, recoverability | Already a `★` in our reliable plan but unwritten. Worth elevating: it's the discipline that *validates* every other resilience tactic. Deep verification story fits our format perfectly. |
| 6 | **Fitness Functions** | 📐 Gap-filler | maintainability, evolvability, testability, standard-compliance | Executable architecture tests. In our plan under `#suitable` but really a *maintainability* keystone. Pair with Architecture Conformance Analysis. Our largest gaps are maintainable + suitable. |
| 7 | **Saga Pattern** | 📐 | transactionality, eventual-consistency, fault-tolerance, distributability | The standard answer to "distributed transactions without 2PC." Essential for microservice data integrity; we have nothing on distributed consistency. |
| 8 | **Dead-Letter Queue** | 🎯 | reliability, recoverability, observability, fault-isolation | Small, concrete, under-documented. The unglamorous tactic that makes async systems debuggable. Great short-but-deep page; pairs with Async Messaging (published). |
| 9 | **Write-Ahead Logging** | 🎯 | durability, recoverability, data-integrity, atomicity | Foundational durability mechanism most app devs never think about explicitly. Educational gold; explains *why* databases survive crashes. |
| 10 | **Strategic Code Deletion** | 🎯 Gap-filler | maintainability, code-complexity, simplicity | Deliberately deleting code/features as a quality tactic. Genuinely off-beat — counter to accretion instinct. Pairs with a Deprecation Strategy page. |
| 11 | **Design by Contract** | 🎯 | correctness, reliability, robustness, verifiability | Pre/postconditions + invariants as a lighter-weight cousin of formal methods. Bridges to our B-Method page. Under-used outside Eiffel/Ada circles. |
| 12 | **Property-Based Testing** | 🎯 Gap-filler | testability, correctness, robustness, test-coverage | Generate inputs to falsify invariants instead of hand-picking cases. Off-beat for most teams; powerful. Maintainability/testing gap. |

---

## Tier 2 — Strong, write after Tier 1

Solid additions; either slightly more mainstream, or narrower in scope, but still clear the bar and fill gaps.

| # | Tactic (book) | Type | Maps to qualities | Note |
|---|---------------|------|-------------------|------|
| 13 | **Mutation Testing** | 🎯 | test-coverage, testability, faultlessness | Tests your tests by injecting faults. Reveals coverage theater. Niche but high-insight. |
| 14 | **Bulkhead** (resource pools) | 📐 | fault-isolation, resilience | We have Bulkheads published — confirm the published page covers thread-pool/connection-pool isolation; if not, extend rather than duplicate. |
| 15 | **Materialized Views** | 📐 Gap-filler | performance, response-time, scalability | Standard read-optimization. Pairs naturally with our CQRS page. |
| 16 | **Read Replicas** | 📐 | scalability, availability, response-time | Mainstream-essential; complements Sharding (published) and CQRS. |
| 17 | **Backpressure / Flow Control** | 📐 | resilience, stability, throughput | In our plan; elevate — it's the missing half of most "we added a queue" stories. |
| 18 | **Bloom Filter / Probabilistic Data Structures** | 🎯 | performance, memory-usage, scalability | "Probabilistische Datenstrukturen." Off-beat efficiency tactic; accept bounded error for huge resource savings. Great teaching page. |
| 19 | **Content Negotiation** | 🎯 Gap-filler | interoperability, backward-compatibility, compatibility | HTTP's built-in versioning/format mechanism that teams reinvent badly. Compatibility gap. |
| 20 | **Canonical Data Model** | 📐 Gap-filler | interoperability, integrability, compatibility | Standard EAI tactic for N-system integration. Has real tradeoffs to discuss (central bottleneck). |
| 21 | **Feature Detection** (not version sniffing) | 🎯 Gap-filler | portability, compatibility, backward-compatibility | Capability-probing over assumptions. Off-beat framing of a portability discipline. |
| 22 | **WebAssembly Portability** | 🎯 Gap-filler | portability, interoperability, performance | Genuinely fresh portability tactic; portable compute target across runtimes. Portability gap. |
| 23 | **Architecture Conformance Analysis** | 📐 Gap-filler | maintainability, standard-compliance, evolvability | Detect drift between intended and actual architecture. Pairs with Fitness Functions. Maintainability gap. |
| 24 | **Living Documentation / Docs-as-Code** | 📐 Gap-filler | maintainability, analysability, understandability | Generate docs from the system itself so they can't rot. Important standard, under-practiced. |
| 25 | **Error Budgets** | 🎯 Gap-filler | reliability, operability, releasability | SRE's reframing of reliability as a *spendable* quantity. Off-beat governance tactic; ties reliability to release velocity. Operability gap. |
| 26 | **Blameless Postmortems** | 📐 Gap-filler | operability, supportability, recoverability | The cultural-process tactic that actually compounds reliability. In our plan; worth a real page. |
| 27 | **Graceful Degradation** | 📐 | graceful-degradation, availability, resilience | Already 📋 in plan. High value, write soon. |

---

## Tier 3 — Worth considering / opportunistic

Good ideas, but either narrower, more situational, or closer to things we already have. Pick up if a contributor is interested or a related page needs a companion.

| # | Tactic (book) | Type | Maps to qualities | Note |
|---|---------------|------|-------------------|------|
| 28 | **Tracer Bullets** | 🎯 | suitability, evolvability | Thin end-to-end slice to validate architecture early. Off-beat delivery tactic; suitability gap. |
| 29 | **Event Storming** | 🎯 Gap-filler | suitability, functional-appropriateness | Collaborative domain-discovery workshop. Process-tactic; suitability gap. |
| 30 | **Specification by Example** | 📐 Gap-filler | functional-correctness, functional-appropriateness, testability | Concrete examples as shared spec. Suitability gap; complements ATDD already in plan. |
| 31 | **Impact Mapping** | 🎯 Gap-filler | suitability, functional-appropriateness | Already a `★` under suitable. Links features to business goals. |
| 32 | **Idempotent Operations** | 📐 | reliability, recoverability, eventual-consistency | In plan; foundational for Saga/DLQ/Retry. Write alongside Saga. |
| 33 | **Load Shedding** | 🎯 | availability, resilience, stability | Deliberately drop low-priority load to protect the core. Off-beat; companion to Rate Limiting (published) and Backpressure. |
| 34 | **Adaptive / Concurrency Limits** | 🎯 | resilience, throughput, stability | Already noted as a variant in the Circuit Breaker page — consider promoting only if it can stand alone. |
| 35 | **Honeypots** | 🎯 | security, intrusion-detection | Deception as defense. Off-beat security tactic; narrow applicability. |
| 36 | **Cold Start Mitigation** | 🎯 Gap-filler | performance, startup-time, elasticity | Serverless-era efficiency tactic. Fresh, but situational. |

---

## Explicitly *not* recommending

- **The "Qualitätsillusionen" chapter** (Skeleton Screens-as-fakes, Fake Progress Bars, Placebo Security, Vanity Metrics, Confirmshaming, Wizard-of-Oz Backend, Compliance-Theater, etc.). These are anti-patterns / dark patterns. You de-prioritized this, and they don't fit a collection that recommends *approaches*. **Possible exception:** a single short editorial/article (not an approach) titled "Quality Illusions" that names these as things to avoid — could be a nice differentiator, but it's a different content type. Flagged, not recommended.
- **Long tail of near-synonyms** the book lists for completeness (e.g. Vertikale/Horizontale/Elastische Skalierung as three entries; dozens of "Plattformunabhängige X" entries under Übertragbarkeit). We'd cover these as *variants* inside one page, not as separate approaches.
- **Items already published or queued** in our merged plan — excluded throughout (see intro).

---

## Suggested sequencing

1. **Open the compatibility/portability front** (we have zero): Tolerant Reader (#1), Anti-Corruption Layer (#3), Consumer-Driven Contracts (#4). Three pages establish a whole new dimension.
2. **Open the maintainability front** (we have zero published): Fitness Functions (#6), Strategic Code Deletion (#10), Property-Based Testing (#12), Architecture Conformance Analysis (#23).
3. **Deepen reliability** with the concrete, under-documented mechanics: Saga (#7), Dead-Letter Queue (#8), Write-Ahead Logging (#9), Error Budgets (#25).
4. **Backfill suitability** (our largest stated gap): Event Storming (#29), Specification by Example (#30), Tracer Bullets (#28).

---

## Open questions for you

- For the compatibility tactics, do you want a new `#compatible`/`#portable` tag dimension surfaced in the graph, or fold them under existing tags?
- Is the single "Quality Illusions" article idea worth a spike, or skip entirely?
