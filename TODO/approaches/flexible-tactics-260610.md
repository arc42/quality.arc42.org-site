# `#flexible` — Constructive Tactics & Patterns Proposal

**Date:** 2026-06-10
**Scope:** New approach candidates for `#flexible` (adapt to changed requirements or environments). **Constructive, design-time architectural patterns only** — structural decisions in the spirit of Hexagonal, EDA, CQRS, Plugin Architecture. No process/maintenance practices.
**Cross-referenced against:** `approaches-planning-and-status.md` (16 flexible candidates queued, 4 published), the Harrer review, `bass-tactics.md`, and published `_approaches/`.

---

## Tier 1 — Write these first

| # | Approach | One-line mechanism | Why it earns a page | Source |
|---|----------|--------------------|---------------------|--------|
| 1 | ✅ **Event Sourcing** — published 2026-06-10 (`_approaches/E/event-sourcing.md`, related to EDA) | Persist every state change as an immutable, append-only event log; current state and any view are derived by replaying/folding events | The system becomes *retroactively* flexible: new read models, retroactive corrections, and temporal queries can be added after the fact, with no migration of "current state". Completes the published CQRS + EDA cluster. Tradeoff worth a full section: event-schema versioning is hard and permanent (Greg Young wrote a book just on that) | Fowler (2005); Greg Young; Azure Architecture Center |
| 2 | ✅ **Externalized Business Rules (Decision Tables / DMN)** — published 2026-06-10 (`_approaches/E/externalized-business-rules.md`, aka Rule Engine / Decision Tables) | Extract volatile decision logic (pricing, eligibility, routing, compliance) into a declaratively specified decision model evaluated by an engine at runtime, deployable on its own cadence | The textbook defer-binding tactic for the *most* volatile part of a system — changed by different people, on a different cadence, without redeployment. Real standard (OMG DMN), mature engines (Drools/Kogito, Camunda, OPA for policy-as-code). Tradeoff: rules engines become shadow programming environments; Fowler's skepticism is the perfect counterweight | OMG DMN; Fowler "RulesEngine" bliki; OPA |
| 3 | ✅ **Self-Contained Systems (SCS)** — published 2026-06-10 (`_approaches/S/self-contained-systems.md`, aka SCS) | Decompose along business domains into autonomous web applications, each owning UI + logic + data; integration preferably via links/UI composition, async only, no shared runtime | A complete macro-architecture style for independent evolvability — coarser and more pragmatic than microservices, each SCS changes stack, data model, and release cadence independently. Strongly arc42-adjacent (INNOQ/Tilkov, German community). Hard part: UI integration and getting the domain cuts right | scs-architecture.org; INNOQ/Tilkov |

---

## Tier 2 — Strong, write after Tier 1

| # | Approach | One-line mechanism | Why it earns a page | Source |
|---|----------|--------------------|---------------------|--------|
| 4 | **Durable Execution (Workflow Engine)** | Externalize long-running, stateful process logic into an engine (Temporal, Camunda, Restate) that persists execution state per step and resumes/replays after failure; the process definition becomes an explicit, changeable artifact | Separates slow-changing services from fast-changing process flows — re-sequence, version, and migrate orchestration logic without touching participants. "Durable execution" is a recognized category by 2025/26. Scope it to *externalizing durable process state* so it complements (not duplicates) the queued Orchestration page. Tradeoffs: versioning in-flight long-running instances; deterministic-replay constraints leak into code | Temporal docs; Ruecker, *Practical Process Automation* (O'Reilly 2021) |
| 5 | ✅ **Backends for Frontends (BFF)** — written 2026-06-10 (`_approaches/B/backends-for-frontends.md`, aka BFF, related to API Gateway + Microservice Architecture) | One purpose-built backend edge service per frontend/experience, owned by the frontend team, aggregating and tailoring downstream APIs | Decouples frontend evolution from general-purpose API evolution — each experience changes its contract at its own pace without cross-client negotiation. Proven at scale (SoundCloud: dozens of BFFs). Tradeoff: deliberate duplication that drifts — Newman's own caveat | Newman, samnewman.io/patterns; SoundCloud Backstage blog |
| 6 | ✅ **Sidecar (Ambassador as variant/`aka`)** — written 2026-06-10 (`_approaches/S/sidecar.md`, aka Ambassador, related to Plugin Architecture + Microservice Architecture) | Co-deploy an auxiliary process alongside the application in the same scheduling unit to add or adapt capabilities (TLS, retries, protocol translation) without modifying the application | The dominant mechanism for evolving cross-cutting behavior independently of polyglot or legacy code you can't/won't modify; foundation of service mesh. The 2025-era sidecar-less counter-trend (eBPF, ambient mesh) is exactly the mature tradeoff discussion experienced readers want. Cross-tag `#operable`; cross-link the Service Mesh candidate (operable proposal) | Burns & Beda, *Designing Distributed Systems* 2nd ed. (2025); HotCloud '16 |
| 7 | **Open Host Service + Published Language** | An upstream context exposes one well-defined protocol expressed in a documented shared model, so N downstream consumers integrate against the stable language instead of N bespoke translations | The strategic-DDD answer to "how do many unknown future consumers integrate without coupling to our domain model" — the upstream mirror of the queued Anti-Corruption Layer; one page covering the pair. Tradeoff: the published language ossifies and permanently decouples from the internal model | Evans, *DDD* ch. 14; Vernon; ddd-crew context-mapping |
| 8 | **Vertical Slice Architecture** | Organize the codebase by feature/use case rather than technical layer; each slice owns its full stack, and may choose its internal style per complexity | Localizes change: a requirement change touches one slice, not four layers. Genuinely contested (consistency erosion, MediatR cargo-cult) — which makes for an honest tradeoffs section. The constructive counterpart to the queued Layered Architecture page | Bogard (2018); Dudycz, architecture-weekly |
| 8b | ✅ **Microservice Architecture** — added and published 2026-06-10 (`_approaches/M/microservice-architecture.md`, aka Microservices, related to SCS) | Structure the system as independently deployable, message-communicating services around business capabilities, each owned by one team with its own data store | Mainstream by 2026 — earns its page through catalog completeness, not novelty: Bass lists it (deployability patterns, `bass-tactics.md`), and readers will look for it. The value is the honest boundary story: tradeoffs (operational complexity, distributed-system tax), "skip when", and the explicit relation to SCS (coarser, UI inside) and Modular Monolith (the default starting point). Write *after* SCS so the pair can cross-reference via `related:` | Newman, *Building Microservices* 2nd ed.; Richardson, microservices.io; Fowler/Lewis (2014) |

---

## Tier 3 — Opportunistic

| # | Approach | One-line mechanism | Note | Source |
|---|----------|--------------------|------|--------|
| 9 | Pipes and Filters | Independent filter stages connected by uniform pipes; recompose, reorder, replace, or parallelize stages without touching the others | Canonical classic; worth a page only with a modern (data/ML-pipeline, stream-processing) framing. Tradeoffs: per-stage serialization overhead, awkward end-to-end transactionality | POSA 1; Hohpe & Woolf, EIP |
| 10 | Interceptor / Middleware Pipeline | The framework exposes interception points in its request/dispatch path where independently developed capabilities register and trigger transparently | *The* in-process extension tactic of the last decade (ASP.NET middleware, gRPC interceptors, Envoy filters) yet rarely named as an architectural decision. Needs careful delineation from the published Plugin Architecture page: extends the *processing path of every request*, not the feature set. Tradeoff: implicit, fragile ordering dependencies | POSA 2 (Interceptor) |

---

## Researched and *not* recommended

| Candidate | Verdict |
|-----------|---------|
| **Cell-Based Architecture** | Its entire value proposition is blast-radius reduction and fault isolation → belongs to `#reliable`/`#operable` (it appears in the operable proposal as Deployment Stamps). |
| **Choreography (vs. orchestration)** | The structural mechanism is already substantially covered by published EDA + Saga plus queued Orchestration; a standalone page would restate the EDA coupling argument. |
| **Domain-Specific Languages** | Passes the structural bar, but the architectural slice is largely covered by #2 (DMN/FEEL *is* a DSL). Fold into the Business Rules page as the general case. |
| **Database-per-Service, Routing Slip, Content-Based Router** | Subsumed by SCS/bounded contexts or too fine-grained for the catalog's altitude. |
| **SEI Defer-Binding tactic instances** | Config, DI, discovery, plugins, toggles — all already published or queued; use the SEI report as citation material inside those pages. |

---

## Interactions with existing content

- **Event Sourcing** (#1) cross-links published **CQRS** (projections need it) and **Saga** (compensation over event logs); also serves a future `#auditable`/traceability story.
- **Open Host Service** (#7) is the upstream mirror of the queued **Anti-Corruption Layer** — write as a coordinated pair.
- **Durable Execution** (#4) must be scoped against queued **Orchestration**; suggested split: Orchestration = coordination *style*, Durable Execution = externalized, persistent *process state*.
- **Sidecar** (#6) is the building block of **Service Mesh** (operable proposal) — one page each, explicit hierarchy.
- `aka:` candidates: Ambassador (→ Sidecar); Decision Model and Notation, Business Rules Engine (→ #2); Durable Execution ↔ Workflow Engine (#4).
