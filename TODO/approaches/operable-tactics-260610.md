# `#operable` — Constructive Tactics & Patterns Proposal

**Date:** 2026-06-10
**Scope:** New approach candidates for `#operable` (deploy, operate, monitor, control predictably). **Constructive, design-time architectural patterns only** — operability designed *into* the system, in the spirit of Blue-Green, API Gateway. No process/SRE-org practices (no runbooks, on-call, postmortems).
**Cross-referenced against:** `approaches-planning-and-status.md` (only 5 operable candidates exist — this is, after `#usable`, our thinnest dimension), the Harrer review, `bass-tactics.md`, and published `_approaches/`.

---

## Tier 1 — Write these first

| # | Approach | One-line mechanism | Why it earns a page | Source |
|---|----------|--------------------|---------------------|--------|
| 1 | **Health Check API** | Designed, contract-stable endpoints (live/ready/started) that the platform consumes to gate traffic admission, rollout progression, and restarts | The most universal app↔platform operability *contract*. Distinct from the queued #reliable "Health Checks + Auto-Healing" page: this one owns the contract/deployment-gating angle. Non-obvious design content: shallow vs. deep checks (deep checks pinging dependencies cause restart cascades), liveness ≠ readiness semantics | microservices.io; Kubernetes probe semantics; MicroProfile Health |
| 2 | **Distributed Tracing (Trace-Context Propagation)** | Assign a trace ID at the edge and structurally propagate context across every process boundary (headers, message metadata) so spans assemble into one causal trace | Genuinely architectural: propagation must be designed into every interface, async hop, and thread boundary — retrofitting is expensive. Mature standards story (W3C Trace Context Recommendation, OpenTelemetry as de-facto layer). Correlation IDs are the degenerate/manual form — same page, not separate. Tradeoff: head vs. tail sampling trades cost against trace availability | W3C Trace Context; OpenTelemetry; Dapper (ancestry); microservices.io |
| 3 | **Graceful Shutdown / Connection Draining** | A designed termination protocol: on SIGTERM flip readiness, wait out endpoint propagation, drain in-flight work, flush state, exit within a tuned grace period | Turns every deploy, scale-down, and node rotation from lossy event into non-event — the enabling mechanism *under* rolling/canary/blue-green that nobody documents. Experienced-team meat: the endpoint-removal/SIGTERM race, grace-period arithmetic, idempotent worker shutdown. Tradeoff: long grace slows rollouts; short grace drops requests | Kubernetes pod-lifecycle docs; Google Cloud "terminating with grace" |

---

## Tier 2 — Strong, write after Tier 1

| # | Approach | One-line mechanism | Why it earns a page | Source |
|---|----------|--------------------|---------------------|--------|
| 4 | **Management & Admin Interfaces** | Dedicated, access-controlled management surface (separate port/path) for runtime introspection and control: config dump, log-level change, cache flush, drain toggle, thread dump | Direct realization of Bass's "specialized interfaces" tactic — the ops twin of our queued "Specialized Test Interfaces" page (cross-link). Real design decisions: separate management port vs. shared listener; which mutations are runtime-safe. Tradeoff is the page's backbone: a serious attack surface (exposed Actuator endpoints are a recurring CVE vector) | Bass et al. (specialized interfaces); Nygard, *Release It!* 2nd ed.; Spring Actuator as exemplar |
| 5 | **Control Plane / Data Plane Separation** | Split into a request-serving data plane and a configuration/orchestration control plane with independent deployment, scaling, and failure domains; the data plane is *statically stable* — it keeps serving from last-known-good state when the control plane is down | An application-level structural decision (multitenant SaaS control planes, config distribution, fleet orchestration), not just k8s plumbing. "Static stability" is exactly the non-obvious principle the audience wants. Tradeoff: you now build two systems with different consistency/availability profiles | AWS Builders' Library (MacCárthaigh); Azure multitenant control-plane guidance |
| 6 | **Declarative Desired-State Reconciliation (GitOps)** | Desired state lives as versioned declarative data; autonomous agents continuously diff actual vs. desired and converge it (controller/reconciliation loop), pulling rather than being pushed | Framed as architecture (the reconciliation loop), not process: deploy becomes an idempotent convergence operation, with drift detection and audit-by-construction. Must be sharply differentiated from the queued IaC page: IaC = state described in code; this = the runtime convergence loop. Tradeoffs: no synchronous "deploy done"; secrets don't fit; break-glass must not fight the reconciler | OpenGitOps v1.0 principles (CNCF); Kubernetes controller pattern; Argo CD/Flux |
| 7 | **Service Mesh** | Push cross-cutting operational concerns (mTLS, retries, timeouts, traffic shifting, telemetry) out of application code into a uniform infrastructure layer — sidecar proxies, increasingly sidecar-less (ambient) | Uniform policy and telemetry across a polyglot fleet without N library upgrades; enables the traffic-split mechanics our deployment pages reference. Bass lists it as a performance pattern — the operability framing is the stronger one. The honest "when not to" section (mesh = complex critical infrastructure; overkill below a fleet-size threshold; ambient-vs-sidecar 2025/26 state) is the value | Burns & Oppenheimer (HotCloud '16); istio.io ambient docs |
| 8 | **Deployment Stamps (Cell-Based Architecture)** | Deploy the stack as N identical isolated copies, each serving a tenant/traffic partition, thin routing in front; scale by adding cells, roll out wave-by-wave | Operability payoffs are specific: bounded blast radius per rollout wave, per-tenant placement, capacity planning per known cell size. **Flag:** legitimately tri-dimensional — `#reliable` (blast radius) is arguably the primary tag, `#operable` secondary. Tradeoffs: cost multiplication; cross-cell queries; the cell router becomes new critical infrastructure | Azure "Deployment Stamps"; AWS cell-based architecture whitepaper |

---

## Tier 3 — Opportunistic

| # | Approach | One-line mechanism | Note | Source |
|---|----------|--------------------|------|--------|
| 9 | Immutable Infrastructure | Never modify running components in place; every change produces a new versioned artifact that replaces the old — rollback = redeploy previous artifact | The principle that makes blue-green/canary *safe*; structural consequence: all mutable state must be externalized. Partially absorbed by queued IaC + published Blue-Green — viable as a tight principle page or a section inside IaC | Chad Fowler (2013); Fowler bliki "ImmutableServer"; Morris, *IaC* |
| 10 | Governor (Automation Rate-Limiter) | A designed safety layer between automation (auto-scalers, reconcilers) and the fleet that rate-limits and bounds automated actions to a safe envelope ("never scale down more than X% in Y minutes") | Nygard's answer to "automation is a force multiplier for mistakes" (Reddit 2016 autoscaler outage). Narrow but highly distinctive — the natural companion to #5 and #6, and exactly the non-obvious tactic the catalog wants. Tradeoff: bounds legitimate automated response too | Nygard, *Release It!* 2nd ed. (stability patterns) |

---

## Researched and *not* recommended

| Candidate | Verdict |
|-----------|---------|
| **Synthetic Monitoring / Heartbeat Transactions** | Mechanism too thin for a page; canonical sources are vendor blogs. Fold as a section into the queued Observability page. |
| **Maintenance Mode / Read-Only Mode** | Real designed degradation states (GitHub/GitLab exemplars) but no canonical pattern literature; substantially overlaps published **Feature Degradation** — add a paragraph there. |
| **Log Aggregation, Application Metrics, Exception Tracking** (microservices.io) | Individually "add logging/metrics"-grade no-brainers for this audience; cite inside the Observability page. |
| **Backpressure / Flow Control** | A stability/load mechanism → `#reliable`/`#efficient`; the site already covers the territory with Rate Limiting, Manage Event Arrival, Limit Event Response. |
| **Audit Logging** | Already queued under `#secure`. |

---

## Interactions with existing content

- **Health Check API** (#1) ↔ queued **Health Checks + Auto-Healing** (#reliable): contract/gating angle here, recovery angle there — coordinate before writing either.
- **Distributed Tracing** (#2) must carve its slice out of the queued **Observability** umbrella: tracing owns cross-service causality.
- **GitOps** (#6) vs. queued **Infrastructure as Code**: declarative description vs. runtime convergence loop — write back-to-back to keep the boundary crisp.
- **Service Mesh** (#7) builds on **Sidecar** (flexible proposal #6) — explicit hierarchy, two pages.
- **Deployment Stamps** (#8): decide primary tag (`#reliable` vs `#operable`) before writing.
- `aka:` candidates: Correlation IDs (→ #2); Cell-Based Architecture (→ #8); Reconciliation Loop, Desired-State Management (→ #6); Runtime Control Endpoints, Actuator (→ #4).
