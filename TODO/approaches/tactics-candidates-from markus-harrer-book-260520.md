# Tactics Update — Candidates from Harrer's *Qualitätstaktiken*

**Date:** 2026-05-20
**Source reviewed:** Markus Harrer, *Qualitätstaktiken — Lösungsstrategien für Softwarearchitekturen qualitätsgetrieben entwickeln* (Leanpub, 2026-03). Table of contents only (~280 pp, 400+ tactics).

---

## Tier 1 — Strongest candidates (write these first)

These combine "surprising or under-used" with "fits our depth format and has real substance." High signal-to-noise.

| # | Tactic (book) | Type | Maps to qualities | Why it earns a page |
|---|---------------|------|-------------------|---------------------|


| 3 | **Anti-Corruption Layer** | 📐 Gap-filler | maintainability, interoperability, loose-coupling, integrability | The standard way to integrate with a model you don't control. Mainstream in DDD circles, under-applied everywhere else. Appears in our plan only as a sub-bullet of "Interface Tailoring" — deserves its own page. |


| 7 | **Saga Pattern** | 📐 | transactionality, eventual-consistency, fault-tolerance, distributability | The standard answer to "distributed transactions without 2PC." Essential for microservice data integrity; we have nothing on distributed consistency. |
| 8 | **Dead-Letter Queue** | 🎯 | reliability, recoverability, observability, fault-isolation | Small, concrete, under-documented. The unglamorous tactic that makes async systems debuggable. Great short-but-deep page; pairs with Async Messaging (published). |
| 9 | **Write-Ahead Logging** | 🎯 | durability, recoverability, data-integrity, atomicity | Foundational durability mechanism most app devs never think about explicitly. Educational gold; explains *why* databases survive crashes. |
| 10 | **Strategic Code Deletion** | 🎯 Gap-filler | maintainability, code-complexity, simplicity | Deliberately deleting code/features as a quality tactic. Genuinely off-beat — counter to accretion instinct. Pairs with a Deprecation Strategy page. |

---

## Tier 2 — Strong, write after Tier 1

Solid additions; either slightly more mainstream, or narrower in scope, but still clear the bar and fill gaps.

| # | Tactic (book) | Type | Maps to qualities | Note |
|---|---------------|------|-------------------|------|

| 14 | **Bulkhead** (resource pools) | 📐 | fault-isolation, resilience | We have Bulkheads published — confirm the published page covers thread-pool/connection-pool isolation; if not, extend rather than duplicate. |
| 15 | **Materialized Views** | 📐 Gap-filler | performance, response-time, scalability | Standard read-optimization. Pairs naturally with our CQRS page. |
| 16 | **Read Replicas** | 📐 | scalability, availability, response-time | Mainstream-essential; complements Sharding (published) and CQRS. |

| 18 | **Bloom Filter / Probabilistic Data Structures** | 🎯 | performance, memory-usage, scalability | "Probabilistische Datenstrukturen." Off-beat efficiency tactic; accept bounded error for huge resource savings. Great teaching page. |
| 19 | **Content Negotiation** | 🎯 Gap-filler | interoperability, backward-compatibility, compatibility | HTTP's built-in versioning/format mechanism that teams reinvent badly. Compatibility gap. |

| 20 | **Canonical Data Model** | 📐 Gap-filler | interoperability, integrability, compatibility | Standard EAI tactic for N-system integration. Has real tradeoffs to discuss (central bottleneck). |

| 21 | **Feature Detection** (not version sniffing) | 🎯 Gap-filler | portability, compatibility, backward-compatibility | Capability-probing over assumptions. Off-beat framing of a portability discipline. |


---

## Tier 3 — Worth considering / opportunistic

Good ideas, but either narrower, more situational, or closer to things we already have. Pick up if a contributor is interested or a related page needs a companion.

| # | Tactic (book) | Type | Maps to qualities | Note |
|---|---------------|------|-------------------|------|

| 32 | **Idempotent Operations** | 📐 | reliability, recoverability, eventual-consistency | In plan; foundational for Saga/DLQ/Retry. Write alongside Saga. |
| 33 | **Load Shedding** | 🎯 | availability, resilience, stability | Deliberately drop low-priority load to protect the core. Off-beat; companion to Rate Limiting (published) and Backpressure. |

| 34 | **Adaptive / Concurrency Limits** | 🎯 | resilience, throughput, stability | Already noted as a variant in the Circuit Breaker page — consider promoting only if it can stand alone. |
| 35 | **Honeypots** | 🎯 | security, intrusion-detection | Deception as defense. Off-beat security tactic; narrow applicability. |
| 36 | **Cold Start Mitigation** | 🎯 Gap-filler | performance, startup-time, elasticity | Serverless-era efficiency tactic. Fresh, but situational. |
