# Solution Approaches per Dimension (Plan v1, Claude Opus 4.6)

Proposed 3–5 approaches for each of the 9 quality dimensions.
Approaches already **published** are marked `[x]`, items already in the **backlog** (`approaches-todo.md`) are marked `[~]`, and genuinely **new** proposals are marked `[ ]`.

Selection criteria:
1. **Architectural leverage** — the approach has a measurable impact on multiple qualities within the dimension.
2. **Practitioner recognition** — well-established in the literature (Bass/SEI tactics, OWASP, SRE, etc.), not bleeding-edge.
3. **Cross-link richness** — maps cleanly to existing qualities *and* produces interesting tradeoffs against other dimensions.
4. **Gap coverage** — fills dimensions where the site currently has zero or one published approach.

---

## 1. `#reliable`
*Perform specified functions without interruption or failure.*

Published: Circuit Breaker · Caching (secondary). Backlog: Bulkheads, Graceful Degradation, Rate Limiting, Asynchronous Messaging, Blue-Green Deployment, Database Sharding.

This dimension is already well-stocked. Add only high-value gaps:

- [x] **Circuit Breaker** *(published)*
- [~] **Bulkheads** *(backlog)*
- [~] **Graceful Degradation** *(backlog)*
- [ ] **Retry with Exponential Backoff and Jitter**: Retries transient failures with increasing, randomised delays plus jitter to prevent thundering-herd effects. *Reasoning:* The natural complement to Circuit Breaker — every distributed system needs a retry policy, and getting it wrong (fixed intervals, no jitter) causes coordinated retry storms that amplify outages. Maps to `resilience`, `fault-tolerance`, `recoverability`; trades off against `latency`, `resource-utilization`.
- [ ] **Idempotent Operations**: Designs write operations so that applying them more than once produces the same outcome. *Reasoning:* Prerequisite for safe retries, message replay, and at-least-once delivery. Without idempotency, retry and messaging approaches create data corruption instead of reliability. Maps to `correctness`, `data-integrity`, `fault-tolerance`; trades off against `code-complexity`.

## 2. `#flexible`
*Adapt to changes in requirements, contexts, or system environment.*

Published: Feature Toggles, Plugin Architecture. Backlog: Asynchronous Messaging, CQRS.

- [x] **Feature Toggles** *(published)*
- [x] **Plugin Architecture** *(published)*
- [ ] **Event-Driven Architecture**: Decouples producers from consumers through asynchronous events, allowing new capabilities to be added by subscribing to existing event streams without modifying producers. *Reasoning:* The strongest architectural tactic for structural flexibility in distributed systems. Every major integration pattern book (Hohpe/Woolf, Kleppmann) puts this at the centre. Maps to `extensibility`, `loose-coupling`, `scalability`; trades off against `consistency`, `debuggability`, `observability`.
- [ ] **Backward-Compatible API Versioning**: Evolves public API contracts (REST, gRPC, event schemas) without breaking existing consumers, using strategies like additive-only changes, content negotiation, or header-based versioning. *Reasoning:* The single most important tactic for systems with external consumers or multi-team ownership. A breaking API change undoes all other flexibility investments. Maps to `backward-compatibility`, `interoperability`, `co-existence`; trades off against `code-complexity`, `maintainability`.
- [ ] **Externalized Configuration**: Moves behavioural switches, thresholds, and policy rules out of compiled code into external configuration stores (files, environment variables, config services). *Reasoning:* Enables runtime adaptation without redeployment — especially valuable when combined with Feature Toggles. Maps to `configurability`, `adaptability`, `flexibility`; trades off against `security`, `consistency`.

## 3. `#maintainable`
*Analyse, modify, test, and evolve with predictable effort.*

Published: none. Backlog: CQRS (secondary).

**This is the dimension with the largest gap — zero published approaches.** Highest priority for new content.

- [ ] **Hexagonal Architecture (Ports and Adapters)**: Isolates domain logic from infrastructure (databases, APIs, frameworks) behind abstract port interfaces, with concrete adapters that can be swapped independently. *Reasoning:* The most effective structural tactic for testability and modifiability — the two qualities practitioners care about most when they say "maintainable". Directly enables unit testing without infrastructure, and allows replacing technology (e.g. switching databases) without touching business logic. Maps to `modularity`, `testability`, `modifiability`, `reusability`; trades off against `code-complexity`, `performance`.
- [ ] **Strangler Fig Pattern**: Incrementally replaces a legacy system by routing requests through a facade that directs traffic to either old or new implementation, migrating one capability at a time. *Reasoning:* The only proven approach for modernising large legacy systems without a risky big-bang rewrite. Directly addresses the dominant real-world maintainability problem: "how do we evolve a system we can't rewrite?" Maps to `evolvability`, `changeability`, `longevity`; trades off against `code-complexity`, `latency`.
- [ ] **Static Analysis and Quality Gates**: Runs automated checks (linters, complexity metrics, dependency analysis, type checking) in CI and blocks merges when thresholds are violated. *Reasoning:* The only approach that prevents maintainability debt from accumulating silently. Without automated enforcement, code reviews alone cannot hold the line at scale. Maps to `analysability`, `code-readability`, `code-complexity`; trades off against `cycle-time`.
- [ ] **Architecture Decision Records (ADRs)**: Documents significant architectural decisions as numbered, immutable records with context, decision, and consequences, stored alongside the code. *Reasoning:* Addresses the "why was this built this way?" problem that makes unfamiliar codebases expensive to maintain. Low effort, high leverage for teams with turnover. Maps to `understandability`, `analysability`; trades off minimally (low implementation cost).

## 4. `#efficient`
*Perform within time, capacity, and resource parameters.*

Published: Caching. Backlog: Asynchronous Messaging, CQRS, Database Sharding.

- [x] **Caching** *(published)*
- [~] **Asynchronous Messaging** *(backlog)*
- [ ] **Connection Pooling**: Maintains a pool of pre-established connections (database, HTTP, gRPC) that are reused across requests instead of being created and destroyed per operation. *Reasoning:* One of the highest-leverage, lowest-risk efficiency tactics — connection setup (TCP handshake, TLS negotiation, authentication) often dominates per-request latency. Maps to `resource-utilization`, `throughput`, `latency`; trades off against `resource-utilization` (idle connections consume memory).
- [ ] **Lazy Loading**: Defers initialisation or data fetching until the moment it is actually needed, avoiding the cost of loading data that may never be used. *Reasoning:* Especially effective for UI rendering (images, components) and ORM data access patterns. Directly addresses startup time and memory usage. Maps to `responsiveness`, `startup-time`, `memory-usage`; trades off against `latency` (first access is slower), `code-complexity`.
- [ ] **Content Delivery Network (CDN)**: Serves static and semi-static content from edge locations geographically close to users, reducing round-trip time and offloading origin servers. *Reasoning:* For any user-facing system with geographic distribution, a CDN is the single most effective latency reduction tactic for static assets. Maps to `responsiveness`, `latency`, `scalability`; trades off against `consistency` (cache invalidation), `cost`.

## 5. `#usable`
*Enable users to work effectively, efficiently, and with satisfaction.*

Published: Progressive Disclosure, Responsive Design. Backlog: Graceful Degradation (secondary), API Gateway (secondary).

- [x] **Progressive Disclosure** *(published)*
- [x] **Responsive Design** *(published)*
- [ ] **Accessibility-First Design (WCAG)**: Builds user interfaces from the start to meet WCAG 2.2 Level AA criteria — semantic HTML, keyboard navigation, sufficient contrast, screen reader support, focus management. *Reasoning:* Accessibility is not a retrofit; it is an architectural decision about how UI components are structured. The site already models `accessibility` as a quality attribute, but has no approach for achieving it. Affects ~15% of users directly, and improves usability for everyone (curb-cut effect). Maps to `accessibility`, `inclusivity`, `interaction-capability`; trades off against `cycle-time`, `user-interface-aesthetics` (when done poorly).
- [ ] **Skeleton Screens and Optimistic UI**: Shows placeholder layouts immediately while data loads, and applies user actions optimistically before server confirmation. *Reasoning:* Perceived performance matters more than actual performance for user satisfaction. This approach targets `responsiveness` and `user-experience` at the UI layer rather than the backend. Maps to `responsiveness`, `user-experience`, `ease-of-use`; trades off against `consistency` (optimistic actions may need rollback), `code-complexity`.
- [ ] **Inline Validation and Error Recovery**: Validates user input in real time as it is entered, provides immediate, contextual feedback, and offers clear recovery paths (undo, correct, retry). *Reasoning:* Directly addresses `user-error-protection` and `learnability` — two ISO 25010 sub-characteristics that are hard to achieve retroactively. Maps to `user-error-protection`, `learnability`, `ease-of-use`; trades off against `performance` (validation round-trips), `code-complexity`.

## 6. `#safe`
*Avoid states endangering life, health, or environment.*

Published: none. Backlog: Least Privilege (secondary).

**Second-largest dimension gap — zero published approaches.** High priority.

- [ ] **Fail-Safe Defaults**: Ensures the system transitions to a predefined safe state when it encounters an unexpected condition, rather than continuing in an uncertain mode. *Reasoning:* The foundational safety principle: when in doubt, stop or constrain. Every safety standard (IEC 61508, DO-178C) requires this. Maps to `fail-safe`, `safety`, `fault-tolerance`; trades off against `availability` (a safe state may mean reduced service).
- [ ] **Safety Interlocks**: Enforces preconditions and invariants before allowing potentially hazardous operations, using software guards that cannot be bypassed without explicit override with audit trail. *Reasoning:* Prevents the "wrong sequence of button presses" class of accidents. Critical in medical devices, industrial control, and financial systems. Maps to `safety`, `integrity`, `operational-constraint`; trades off against `usability`, `throughput`.
- [ ] **Watchdog Supervision**: An independent monitor (hardware timer or supervisor process) detects when a component has stopped responding and triggers a controlled restart or safe-state transition. *Reasoning:* Addresses the "silent hang" failure mode that is invisible to regular health checks. Standard in IEC 61508 and automotive (ISO 26262) safety architectures. Maps to `fault-tolerance`, `recoverability`, `resilience`; trades off against `code-complexity`, `latency`.
- [ ] **N-Modular Redundancy with Voting**: Runs N independent implementations of a critical function and uses a voter (e.g., 2-out-of-3 majority) to mask single failures. *Reasoning:* The strongest available tactic when a single wrong output is unacceptable (flight control, radiation therapy). Expensive but irreplaceable in its domain. Maps to `fault-tolerance`, `safety`, `correctness`; trades off against `cost`, `code-complexity`, `performance`.

## 7. `#secure`
*Protect data and defend against attack patterns.*

Published: none. Backlog: Rate Limiting, API Gateway, Least Privilege.

**Third dimension gap — zero published approaches.** High priority.

- [~] **Least Privilege** *(backlog)*
- [ ] **Defense in Depth**: Layers multiple independent security controls (network segmentation, application-level auth, encryption, monitoring) so that no single control failure results in a breach. *Reasoning:* The meta-approach that structures all other security tactics. Without it, security investments are point solutions that fail in isolation. Maps to `security`, `resistance`, `resilience`; trades off against `cost`, `code-complexity`, `usability`.
- [ ] **Encryption at Rest and in Transit**: Applies cryptographic protection to data in storage (AES-256, envelope encryption) and in transmission (TLS 1.3, mTLS), with managed key rotation. *Reasoning:* Mandatory baseline for any system handling personal, financial, or health data. Without encryption, all other security measures can be bypassed by physical or network access. Maps to `confidentiality`, `data-protection`, `integrity`; trades off against `performance`, `operability`.
- [ ] **Audit Logging**: Records security-relevant events (authentication, authorization decisions, data access, configuration changes) in tamper-evident logs with sufficient context for forensic investigation. *Reasoning:* Required by GDPR, HIPAA, SOC 2, and PCI-DSS. Without audit trails, breaches cannot be detected, investigated, or proven to have been contained. Maps to `accountability`, `auditability`, `non-repudiation`; trades off against `performance`, `privacy` (logs can themselves be sensitive).
- [ ] **Secret Management**: Stores credentials, API keys, and certificates in a dedicated vault (HashiCorp Vault, AWS Secrets Manager, etc.) with access policies, rotation, and short-lived token issuance — eliminating secrets from source code, environment variables, and container images. *Reasoning:* Hard-coded secrets are the #1 cause of credential leaks. This approach directly addresses the `confidentiality` and `integrity` qualities while also improving `operability` (automated rotation). Maps to `confidentiality`, `integrity`, `securability`; trades off against `code-complexity`, `availability` (vault as dependency).

## 8. `#suitable`
*Meet stated and implied needs of stakeholders.*

Published: none. Backlog: none.

**Largest content gap — zero published approaches, zero in backlog.**

- [ ] **Domain-Driven Design (DDD)**: Aligns the software's internal model, terminology, and module boundaries with the business domain through ubiquitous language, bounded contexts, and strategic/tactical patterns. *Reasoning:* The most direct approach for ensuring software does what stakeholders actually need. When the code speaks the domain language, misunderstandings between developers and domain experts surface early. Maps to `functional-appropriateness`, `correctness`, `suitability`; trades off against `code-complexity`, `cycle-time`.
- [ ] **Fitness Functions**: Automated architectural tests that continuously verify that the system still meets its key quality constraints — e.g., "no package cycle longer than 3", "p99 latency < 200ms", "test coverage > 80% in domain layer". *Reasoning:* Bridges the gap between quality requirements and daily development. Without automated checks, quality goals erode silently. Directly inspired by the "Building Evolutionary Architectures" approach. Maps to `testability`, `verifiability`, `compliance`; trades off against `cycle-time`.
- [ ] **Acceptance Test-Driven Development (ATDD)**: Specifies quality and functional requirements as executable acceptance tests before implementation, making "done" objectively verifiable. *Reasoning:* Ensures suitability by construction rather than inspection. Every requirement on this site uses acceptance criteria — ATDD makes those criteria executable. Maps to `functional-completeness`, `correctness`, `testability`; trades off against `cycle-time`, `flexibility` (tests constrain change).
- [ ] **Compliance as Code**: Encodes regulatory and organisational compliance rules (GDPR consent flows, access-logging requirements, data-residency constraints) as automated policy checks that run in CI/CD or at runtime. *Reasoning:* For regulated domains, "suitable" includes "legally compliant". Manual compliance audits don't scale and drift between audits. Maps to `compliance`, `legal-requirements`, `auditability`; trades off against `code-complexity`, `cycle-time`.

## 9. `#operable`
*Deploy, operate, monitor, and control with predictable effort.*

Published: Circuit Breaker (secondary), Feature Toggles (secondary). Backlog: Bulkheads, API Gateway, Blue-Green Deployment.

- [~] **Blue-Green Deployment** *(backlog)*
- [ ] **Structured Observability (Logs, Metrics, Traces)**: Emits correlated telemetry signals — structured logs, dimensional metrics, and distributed traces — through a unified pipeline, enabling operators to answer "why is this request slow?" without guessing. *Reasoning:* Observability is the prerequisite for all other operational approaches. Without it, operators navigate blind. The three-pillar model (logs/metrics/traces) is now industry-standard via OpenTelemetry. Maps to `observability`, `diagnosability`, `traceability`; trades off against `performance`, `cost`.
- [ ] **Infrastructure as Code (IaC)**: Defines all infrastructure (servers, networks, databases, permissions) as version-controlled, declarative code (Terraform, Pulumi, CloudFormation) that is applied idempotently. *Reasoning:* Eliminates configuration drift, enables reproducible environments, and makes infrastructure changes reviewable and auditable. Maps to `deployability`, `operability`, `reproducibility`; trades off against `code-complexity`, `cycle-time` (initial setup).
- [ ] **Canary Deployment**: Routes a small percentage of production traffic to a new version while monitoring key metrics, automatically promoting or rolling back based on observed quality. *Reasoning:* Combines the safety of Blue-Green with real-world validation. The most mature progressive delivery tactic, used at scale by Google, Netflix, and Amazon. Maps to `deployability`, `releasability`, `recoverability`; trades off against `code-complexity`, `observability` (requires solid metrics to make promotion decisions).
- [ ] **Runbooks and Automated Remediation**: Documents standard operating procedures for known failure modes as executable or semi-executable runbooks, progressing toward fully automated incident response. *Reasoning:* Reduces MTTR by removing human decision time from the critical path. Particularly important for teams with on-call rotation where responders may not be the system's authors. Maps to `operability`, `recoverability`, `mean-time-to-recovery`; trades off against `code-complexity`, `safety` (automated remediation can cause harm if conditions are misdiagnosed).

---

## Priority Ranking for Implementation

### Phase 1 — Close the zero-approach dimensions (highest impact)
These dimensions have no published approaches at all, meaning the site's approach section is empty for them:

1. **maintainable**: Hexagonal Architecture, Strangler Fig
2. **safe**: Fail-Safe Defaults, Safety Interlocks
3. **secure**: Defense in Depth, Encryption at Rest/Transit
4. **suitable**: Domain-Driven Design, Fitness Functions

### Phase 2 — Strengthen partially covered dimensions
5. **operable**: Structured Observability, Canary Deployment
6. **efficient**: Connection Pooling, CDN
7. **reliable**: Retry with Backoff, Idempotent Operations

### Phase 3 — Complete coverage
8. **usable**: Accessibility-First, Skeleton Screens
9. **flexible**: Event-Driven Architecture, Backward-Compatible API Versioning
10. Remaining items from all dimensions

### Execution Notes
- Deliver in batches of 2–3 approaches per commit/PR.
- Each approach must pass the Definition of Done in `TEMPLATE.md`.
- Verify all `supported_qualities` and `tradeoffs` slugs exist in `_qualities/` before merge.
- Cross-reference with the P1/P2/P3 items in `approaches-todo.md` — some overlap (Bulkheads, Blue-Green, etc.) should be merged, not duplicated.

---

## Research Basis

- **Bass, Clements, Kazman**: *Software Architecture in Practice* (4th ed., 2021) — quality attribute tactic catalogues for availability, modifiability, performance, security, usability.
- **SEI Technical Reports**: Quality Attribute Workshops (QAW), ATAM, maintainability report (Kazman et al. 2020).
- **Forsgren, Humble, Kim**: *Accelerate* (2018) — DORA metrics linking deployment practices to organisational performance.
- **Hohpe/Woolf**: *Enterprise Integration Patterns* (2004) — event-driven and messaging tactics.
- **Nygard**: *Release It!* (2nd ed., 2018) — stability patterns (Circuit Breaker, Bulkheads, Timeouts).
- **Ford, Parsons, Kua**: *Building Evolutionary Architectures* (2017) — fitness functions concept.
- **IEC 61508 / ISO 26262**: Safety integrity levels, fail-safe principles, watchdog requirements.
- **OWASP ASVS**: Application Security Verification Standard — defence in depth, input handling, secrets management.
- **W3C WCAG 2.2**: Accessibility guidelines — perceivable, operable, understandable, robust.
- **Google SRE Book** (sre.google): SLO/SLI framework, error budgets, observability practices.
- **Harrer**: *Quality Tactics* (Leanpub, 2025) — quality-driven solution strategies mapped to ISO 25010 dimensions.
