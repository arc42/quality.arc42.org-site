# Solution Approaches — Planning & Status (single source)

Single planning source for `_approaches/`. Merged from the former `bass-tactics.md`
on 2026-07-01 (that file is removed; its full catalogue lives in git history). The Bass
tactic catalogue is preserved condensed in the [Appendix](#appendix--bass-et-al-tactic-index)
so literature terms stay searchable for `aka:` harvesting.

Re-evaluated 2026-07-01: overly simple / non-architectural rows moved to
[removal candidates](#removal-candidates); missing surprising/effective tactics added (`★`).

**Legend — Done:**
`✅` published in `_approaches/` · ` ` not yet started.

**Legend — Prio** (open candidates only; published rows show `—`):
`P1` high — surprising, rare, specialized, or under-appreciated; high teaching value, write sooner ·
`P2` medium — a known pattern with real depth, not universally applied ·
`P3` low — obvious to an experienced developer, standard toolkit.

**Legend — Source:**
`G` = Gemini · `P` = GPT-5.3 · `O` = Opus 4.6 · `B+` = Bass et al. tactics · `★` = new (not in any prior plan).

Within each dimension: published approaches first, then open candidates ordered `P1 → P2 → P3`.

---

## `#reliable` — Perform without interruption or failure

| Done | Prio | Approach | One-line description | Source |
|:----:|:----:|----------|----------------------|:------:|
| ✅ | — | Circuit Breaker | Stop calls to a failing dependency, probe recovery after a timeout | G·P·O·B+ |
| ✅ | — | Timeout | Bound wait times on remote calls to prevent indefinite hangs | ★·B+ |
| ✅ | — | Bulkheads | Isolate resource pools so one failure path can't exhaust all | P·O |
| ✅ | — | Rate Limiting | Cap request volume to protect availability under load | P·O·B+ |
| ✅ | — | Caching | Reduce load and latency via fast-access data copies (secondary) | O·B+ |
| ✅ | — | Saga Pattern | Split a distributed transaction into local steps with compensating actions (also `#flexible`) | ★ |
| ✅ | — | Standby/Failover | Duplicate instances, switch traffic on primary failure (Redundancy + Automated Failover) | G·P·B+ |
| ✅ | — | Data Replication | Copy data across nodes/regions for durability and read availability | ★·B+ |
| ✅ | — | Quarantine | Temporarily detach unstable components until diagnosis/repair completes (Removal from Service) | ★·B+ |
| ✅ | — | Feature Degradation | Disable non-essential features to preserve core function (Graceful Degradation) | G·O·B+ |
| ✅ | — | N-Version Redundancy and Voting | Run N independent paths, majority vote masks single failures (also `#safe`) | P·O·B+ |
|✅ | P1 | Transactional Outbox | Write events and state in one local transaction; a relay publishes the outbox, solving dual-write | ★ |
| | P1 | Backpressure Propagation | Signal overload upstream so producers slow down before queues collapse | ★ |
| | P1 | Conflict-Free Replicated Data Types (CRDTs) | Data types whose replicas merge deterministically, allowing coordination-free concurrent writes | ★ |
| | P1 | Consensus / Leader Election | Agree on one leader or value despite node failures (Raft, Paxos) — failover without split-brain | ★ |
| | P1 | Predictive Fault Detection | Use predictive models to anticipate failures and trigger preventive action | ★·B+ |
| | P1 | State Resynchronization | Reconcile state before returning a recovered component to live traffic | ★·B+ |
| | P1 | Escalating Restart | Escalate restart scope (process → node → zone) if failures persist | ★·B+ |
| | P1 | Shadow Mode Reintroduction | Reintroduce recovered/new components on shadow traffic before full cutover | ★·B+ |
| | P1 | Reconfiguration | Remove or isolate faulty parts and reroute dependencies at runtime | ★·B+ |
| | P1 | Process Pairs | A backup checkpoints from its primary, ready to take over instantly on failure | B+ |
| | P1 | Forward Error Recovery | Move forward to a good (possibly degraded) state via built-in correction, not rollback | B+ |
| | P1 | Nonstop Forwarding | Split control and data plane so work keeps flowing while control state rebuilds | B+ |
| | P1 | Hitless Software Upgrade | In-service code upgrade with no disruption (function/class patch, ISSU) | B+ |
| | P1 | Timestamp Ordering | Detect out-of-sequence events via local clocks or sequence numbers | B+ |
| | P2 | Transactional Safeguards | Use transactional boundaries to prevent partial or inconsistent updates on faults | ★·B+ |
| | P2 | Condition Monitoring + Sanity Checking | Continuously validate thresholds/invariants to detect drift before hard failure | ★·B+ |
| | P2 | Heartbeat + Ping/Echo Probes | Active peer checks detect unresponsive services quickly for reroute or restart | ★·B+ |
| | P2 | Self-Test | Components run scheduled/on-demand procedures to test their own correct operation | B+ |
| | P2 | Rollback / Checkpoint | Revert to a previous known-good checkpoint on failure detection, then continue | B+ |
| | P2 | Increase Competence Set | Design a component to handle more cases/faults as part of normal operation | B+ |
| | P2 | Ignore Faulty Behavior | Ignore messages from a source judged spurious (e.g. a failed sensor) | B+ |
| | P3 | Retry with Exponential Backoff | Retry transient failures with increasing, jittered delays | G·P·O·B+ |
| | P3 | Idempotent Operations | Make writes safely repeatable to enable retries and replay | G·O |

---

## `#flexible` — Adapt to changed requirements or environments

| Done | Prio | Approach | One-line description | Source |
|:----:|:----:|----------|----------------------|:------:|
| ✅ | — | Feature Toggles | Decouple deployment from release via runtime switches | G·P·O·B+ |
| ✅ | — | Plugin Architecture | Stable extension points for third-party capabilities | G·P·O·B+ |
| ✅ | — | Asynchronous Messaging | Decouple services in time and space via queues/topics (Publish-Subscribe) | P·O·B+ |
| ✅ | — | Event-Driven Architecture | Connect components via async events; add consumers without changing producers | G·P·O·B+ |
| ✅ | — | Event Sourcing | Persist state as an append-only log of events, rebuildable and auditable | ★ |
| ✅ | — | CQRS | Separate read and write models for independent scaling | O |
| ✅ | — | Microservice Architecture | Independently deployable, message-only services with a discovery service | B+ |
| ✅ | — | Self-Contained Systems | Autonomous, full-stack systems integrated at the UI, each owning its data | ★ |
| ✅ | — | Backends for Frontends | A tailored backend per frontend to decouple client needs from shared services | ★ |
| ✅ | — | Open Host Service | Publish a stable, documented integration API for many consumers | ★ |
| ✅ | — | Externalized Business Rules | Move decision logic into an editable rule set outside compiled code | ★ |
| | P1 | Schema Evolution / Tolerant Reader | Evolve data schemas while remaining compatible with older consumers | ★ |
| | P1 | Shared Repositories (Blackboard) | Bind producers and consumers via a runtime shared data store | B+ |
| | P2 | Anti-Corruption Layer | Translate a foreign model at the boundary so an external system's concepts can't leak into the domain | ★ |
| | P2 | Backward-Compatible API Versioning | Evolve public contracts without breaking existing consumers | P·O |
| | P2 | Service Discovery | Discover endpoints/capabilities at runtime to reduce fixed coupling | ★·B+ |
| | P2 | Orchestration | Coordinate multi-service workflows with explicit control flow | ★·B+ |
| | P2 | Interface Tailoring (Adapters) | Tailor external interfaces via adapters/wrappers/bridges without changing providers | ★·B+ |
| | P2 | Restricted Communication Paths | Constrain interaction paths to reduce integration blast radius | ★·B+ |
| | P2 | Standards-Based Integration Contracts | Adhere to standards to ease substitution and ecosystem integration | ★·B+ |
| | P2 | Multi-Tenancy | Serve multiple isolated tenants from a single deployment | ★ |
| | P2 | Micro-Frontend Architecture | Independently deployable UI modules owned by separate teams | ★ |

---

## `#maintainable` — Analyse, modify, test, evolve with predictable effort

| Done | Prio | Approach | One-line description | Source |
|:----:|:----:|----------|----------------------|:------:|
| ✅ | — | Increase Cohesion | Split oversized modules and reassign responsibilities to localize change | ★·B+ |
| ✅ | — | Reduce Coupling | Encapsulate, add intermediaries, restrict and abstract dependencies to localize change | ★·B+ |
| ✅ | — | Defer Binding | Bind implementation choices late via config, resources, or polymorphism | ★·B+ |
| ✅ | — | Hexagonal Architecture (Ports & Adapters) | Isolate domain logic from infrastructure behind abstract ports | P·O |
| | P1 | Record/Playback Harnesses | Capture interaction traces and replay them deterministically for regression tests | ★·B+ |
| | P1 | Executable Assertions | Encode invariants as runtime-checkable assertions in tests and critical paths | ★·B+ |
| | P1 | Limit Nondeterminism | Reduce time/order randomness for stable, reproducible test outcomes | ★·B+ |
| | P1 | Specialized Test Interfaces | Expose controlled inspection/control points to observe and steer state in tests | ★·B+ |
| | P1 | Localized State Storage | Keep mutable state local and explicit to simplify setup, reset, and assertions | ★·B+ |
| | P2 | Modular Architecture / Bounded Contexts | Split codebase into cohesive, low-coupling modules | G·P·B+ |
| | P2 | Strangler Fig Pattern | Incrementally replace legacy behind a routing facade | O |
| | P2 | Abstract Data Sources | Abstract external data so tests can swap stubs, fixtures, and simulators | ★·B+ |
| | P2 | Sandbox Environments | Run tests in isolated sandboxes to prevent side effects and improve repeatability | ★·B+ |
| | P2 | Limit Structural Complexity | Constrain structure/dependencies to keep components understandable and testable | ★·B+ |
| | P3 | Layered Architecture | Horizontal layers with strict top-down dependency rules | G·B+ |

---

## `#efficient` — Perform within time, capacity, and resource parameters

| Done | Prio | Approach | One-line description | Source |
|:----:|:----:|----------|----------------------|:------:|
| ✅ | — | Caching | Serve frequent reads from faster storage layers | G·P·O·B+ |
| ✅ | — | Content Delivery Network (CDN) | Serve static content from edge locations near users | P·O |
| ✅ | — | Database Sharding | Partition data across nodes for horizontal scale | O |
| ✅ | — | CQRS | Optimise read and write paths independently | O |
| ✅ | — | Asynchronous Messaging | Move long-running work off the request path | G·P·O |
| ✅ | — | Computational Overhead Reduction | Remove unnecessary processing steps to cut resource demand | ★·B+ |
| ✅ | — | Manage Event Arrival | Cap or shape the event-arrival rate a component accepts (SLA) | B+ |
| ✅ | — | Limit Event Response | Process events only up to a set maximum rate; queue or discard excess | B+ |
| | P1 | Probabilistic Data Structures | Bloom filters, HyperLogLog, sketches — approximate answers in tiny, bounded memory | ★ |
| | P1 | Request Coalescing | Merge concurrent identical requests into one upstream call to prevent thundering herds | ★ |
| | P1 | Resource Metering + Workload Classification | Meter and classify workloads (static/dynamic) to steer optimization | ★·B+ |
| | P1 | Execution-Time Bounding | Enforce upper bounds for request/task execution times | ★·B+ |
| | P1 | Map-Reduce | Distributed, parallel sort-and-analyze of very large data sets | B+ |
| | P1 | Sensor Fusion | Use low-power sensor data to decide whether higher-power sensors must be read | B+ |
| | P2 | Materialized Views | Precompute and store query results, refreshed on data change, to serve complex reads cheaply | ★ |
| | P2 | Introduce Concurrency | Parallelize independent work to improve throughput and latency | ★·B+ |
| | P2 | Bound Queue Sizes | Cap queue lengths to prevent latency collapse and resource exhaustion | ★·B+ |
| | P2 | Resource Scheduling | Schedule resources and workloads by priority/quotas/deadlines | ★·B+ |
| | P2 | Load Balancing | Distribute traffic across instances for throughput and fault tolerance | ★·B+ |
| | P2 | Increase Resource Usage Efficiency | Optimize algorithms/implementations to lower cost per transaction | ★·B+ |
| | P2 | Batch Processing | Aggregate operations to reduce per-item overhead | ★ |
| | P2 | Prioritize Events | Rank events by importance; service high-priority first, shed low under load | B+ |
| | P2 | Manage Sampling Rate | Reduce input sampling frequency to keep latency predictable, trading fidelity | B+ |
| | P2 | Reduce Indirection | Remove intermediaries from a hot path to lower per-event latency (modifiability tradeoff) | B+ |
| | P2 | Co-locate Communicating Resources | Place cooperating components together to cut communication cost | B+ |
| | P2 | Periodic Cleaning | Periodically reclaim resources that degrade over time (caches, VM maps) | B+ |
| | P2 | Service Mesh | Sidecar proxies handle cross-cutting concerns close to each service | B+ |

---

## `#usable` — Enable effective, efficient, satisfying use

| Done | Prio | Approach | One-line description | Source |
|:----:|:----:|----------|----------------------|:------:|
| ✅ | — | Progressive Disclosure | Show primary actions first, reveal complexity on demand | G·P·O |
| ✅ | — | Responsive Design | Adapt layout and interactions across screen sizes and inputs | G·P·O |
| | P1 | Optimistic UI Updates | Apply user actions locally at once, reconcile with the server asynchronously, undo on rejection | ★ |
| | P1 | Undo by Design | Make actions reversible (command log, soft delete) so users explore without fear — forgiveness over confirmation | ★ |
| | P2 | Accessibility-First Design (WCAG) | Semantic HTML, keyboard nav, contrast, screen-reader support from day one | P·O |

---

## `#safe` — Avoid states endangering life, health, or environment

| Done | Prio | Approach | One-line description | Source |
|:----:|:----:|----------|----------------------|:------:|
| ✅ | — | Fail-Safe Defaults | Transition to a predefined safe state on unexpected conditions | G·P·O·B+ |
| ✅ | — | Safety Interlocks | Enforce preconditions before allowing hazardous operations | G·P·O·B+ |
| ✅ | — | Watchdog Supervision | Independent monitor detects hangs, triggers safe restart | G·P·O·B+ |
| ✅ | — | N-Modular Redundancy + Voting | Run N independent paths, majority vote masks single failures | P·O·B+ |
| ✅ | — | B-Method | Formal, refinement-based specification and proof of critical logic | ★ |
| | P1 | Analytic Redundancy | High-assurance + high-performance split tolerating spec errors (Simplex) | ★·B+ |
| | P1 | Independent Safety Monitor | Separate hardware/software channel that can override primary control | ★ |
| | P1 | Monitor-Actuator | A monitor checks an actuator's computed values for reasonableness before they act | B+ |
| | P1 | Separated Safety | Split into certified safety-critical and non-critical portions to cut certification cost | B+ |
| | P1 | Repair-State Recovery | Transition through a validated repair state before normal operation resumes | ★·B+ |
| | P1 | Predictive Hazard Models | Use predictive models to anticipate unsafe states and trigger safeguards | ★·B+ |
| | P1 | Dead Man's Switch / Operator Confirmation | Require active periodic confirmation to continue hazardous operations | ★ |
| | P2 | Unsafe State Detection (Comparison/Timeout/Monitoring) | Detect hazardous drift via comparison, timeout, timestamp, condition monitoring | ★·B+ |
| | P2 | Redundant Sensors | Replicate safety-critical sensors, monitored independently, to survive single-sensor failure | B+ |
| | P2 | Hazard Analysis (FMEA / STPA) | Systematic derivation of safety constraints from identified hazards | P |

---

## `#secure` — Protect data and defend against attack patterns

| Done | Prio | Approach | One-line description | Source |
|:----:|:----:|----------|----------------------|:------:|
| ✅ | — | Least Privilege | Grant only the minimum permissions required per actor/process | G·P·O·B+ |
| ✅ | — | Strong Authentication (MFA / OIDC) | Multi-factor or phishing-resistant identity verification | G·P·B+ |
| ✅ | — | Fine-Grained Authorization (RBAC/ABAC) | Authorize actors per action/resource with policy-based access control | ★·B+ |
| ✅ | — | Encryption at Rest + in Transit | Cryptographic protection of stored and transmitted data with key rotation | G·P·O·B+ |
| ✅ | — | Secret Management | Vault-based credential storage with rotation and short-lived tokens | P·O |
| ✅ | — | Input Sanitization / Output Encoding | Neutralise untrusted data to prevent injection and XSS | G·P·B+ |
| ✅ | — | Rate Limiting | Throttle requests to limit brute-force and DoS exposure (secondary) | P·O·B+ |
| ✅ | — | API Gateway | Centralise auth, throttling, and input validation at the edge (secondary) | P·O |
| | P1 | Deception / Honeypots | Decoy services and canary tokens turn attacker reconnaissance into high-fidelity alerts | ★ |
| | P1 | Message Delivery Anomaly Detection | Detect replay, duplication, reordering, or unexpected delivery gaps | ★·B+ |
| | P1 | Non-Repudiation Evidence | Preserve signed, verifiable evidence so actors cannot deny critical actions | ★·B+ |
| | P2 | Intrusion Detection | Detect indicators of compromise and raise actionable security alerts | ★·B+ |
| | P2 | Service Denial Detection | Detect denial-of-service conditions early via traffic and saturation signals | ★·B+ |
| | P2 | Message Integrity Verification | Verify message integrity/authenticity to detect tampering in transit | ★·B+ |
| | P2 | Network Segmentation / Micro-Segmentation | Isolate workloads so lateral movement after breach is contained | ★·B+ |
| | P2 | Zero Trust Architecture | Authenticate and authorise every request regardless of network origin | ★ |
| | P2 | Audit Logging | Tamper-evident records of security-relevant events | O·B+ |
| | P2 | Limit Exposure | Minimise the data and services reachable through any single access point | B+ |
| | P2 | Revoke Access | Sharply limit access to sensitive resources when an attack is suspected | B+ |

---

## `#operable` — Deploy, operate, monitor, and control predictably

| Done | Prio | Approach | One-line description | Source |
|:----:|:----:|----------|----------------------|:------:|
| ✅ | — | Blue-Green Deployment | Run two identical environments, switch traffic for zero-downtime releases | O·B+ |
| ✅ | — | Canary Deployment | Route a small traffic percentage to a new version, promote or roll back on metrics | P·O·B+ |
| ✅ | — | A/B Testing | Run versions on different user groups to determine which performs best | B+ |
| ✅ | — | API Gateway | Centralise routing, auth, and observability at the edge (secondary) | P·O |
| ✅ | — | Sidecar | Attach cross-cutting infrastructure to a service as a co-located process | ★ |
| | P1 | Manage Service Interactions | Mediate interactions so multiple service versions run simultaneously | B+ |
| | P2 | Distributed Tracing + Correlation IDs | Propagate trace context across service hops so one request's path is reconstructable end-to-end | ★ |
| | P2 | Immutable Infrastructure | Replace servers instead of mutating them; every change ships as a new image | ★ |
| | P2 | Auto-Scaling / Elasticity | Adjust resources automatically based on demand signals | G |
| | P2 | Package Dependencies | Bundle an element with its dependencies for consistent deployment | B+ |

---

## Removal candidates

Moved out of the dimension tables on 2026-07-01. Two removal reasons recur: **too simple** — an
experienced developer applies these without a reference page (framework defaults, config flags,
checklist items); and **not constructive** — process/tooling/verification practices rather than
design-time architectural patterns (site curation rule). Rows are preserved verbatim; veto by
moving a row back.

| Dimension | Approach | One-line description | Removal reason | Source |
|-----------|----------|----------------------|----------------|:------:|
| `#reliable` | Exception Detection + Handling | Catch fault conditions early and route to controlled recovery logic | Code-level practice below architecture altitude; runtimes provide it | ★·B+ |
| `#reliable` | Health Checks + Auto-Healing | Liveness/readiness probes trigger restart or rerouting | Platform default (probes); depth covered by Watchdog Supervision ✅, Quarantine ✅, Escalating Restart | G·P·B+ |
| `#reliable` | Chaos Engineering | Inject failures in production-like environments to validate resilience | Verification practice, not a constructive design-time pattern | ★ |
| `#flexible` | Externalized Configuration | Move thresholds, rules, and switches out of compiled code | Subsumed by published Defer Binding ✅ (configuration-time binding) | P·O·B+ |
| `#flexible` | Dependency Injection | Swap concrete implementations at construction time | Code-level idiom; subsumed by Defer Binding ✅ (runtime binding) | G·B+ |
| `#flexible` | Client-Server | Clients bind to servers at runtime for low coupling and independent scaling | Too generic to guide a design decision today | B+ |
| `#maintainable` | Automated Test Pyramid | Unit, integration, and contract tests as change safety nets | Process practice, not architecture | G·P·B+ |
| `#maintainable` | Static Analysis + Quality Gates | Block merges when complexity, duplication, or style thresholds are violated | Tooling/process practice, not architecture | P·O |
| `#efficient` | Connection Pooling | Reuse expensive connections (DB, HTTP, gRPC) across requests | Framework/driver default; no design decision left to make | G·P·O |
| `#efficient` | Lazy Loading | Defer initialisation until actually needed | Language-level idiom | O |
| `#efficient` | Data Compression | Reduce payload sizes for transfer and storage | Configuration flag, not a structure | G·P |
| `#efficient` | Kill Abnormal Tasks | Interrupt energy- or resource-greedy operations after a timeout | Trivial corollary of Timeout ✅ + Watchdog Supervision ✅ | B+ |
| `#efficient` | Increase Resources (Scale Up) | Add faster/more processors, memory, or network | "Buy bigger hardware" — a budget decision, not a design | B+ |
| `#efficient` | Data Access Optimization (Indexing, Pagination) | Tune queries, indexes, and result-set sizes for the workload | Tuning practice ("add an index"), not a pattern | P·B+ |
| `#safe` | Graceful Degradation (safety-focused) | Shed non-essential functions to protect the safety-critical core | Duplicate of Feature Degradation ✅ — add the safety angle to that page | G·B+ |
| `#secure` | Identify Actors | Identify the source of external input (user IDs, IPs, ports, protocols) | Subsumed by Strong Authentication ✅ | B+ |
| `#secure` | Restrict Login Attempts | Limit login attempts and enforce lockout/challenge policies | Rate Limiting ✅ applied to login — fold as a variant there | ★·B+ |
| `#secure` | Dependency Vulnerability Scanning (SCA) | Automated checks for known CVEs in third-party libraries | Tooling/process practice (CI scanner) | ★ |
| `#secure` | Change Credential Settings | Force change of default settings/passwords so known defaults can't be exploited | Hardening checklist item | B+ |
| `#secure` | Inform Actors | Notify operators or cooperating systems when an attack is detected | Plain alerting; no architectural content | B+ |
| `#operable` | Infrastructure as Code (IaC) | Version-controlled, declarative environment definitions | Ops/process practice per curation rule (constructive patterns only) | P·O·B+ |

---

## Appendix — Bass et al. tactic index

Provenance for the `B+` source tag, condensed from the former `bass-tactics.md` (Bass, Clements & Kazman,
*Software Architecture in Practice*, 4th ed.). Kept so the book's tactic names stay searchable — e.g. when
harvesting `aka:` terms for a new approach page. Format: **Bass tactic** → site approach (`✅` if published).

**Performance (Ch. 9)** — Manage Event Arrival → Manage Event Arrival ✅ · Limit Event Response → Limit Event Response ✅ · Reduce Computational Overhead → Computational Overhead Reduction ✅ · Bound Execution Times → Execution-Time Bounding · Increase Efficiency of Resource Usage → Increase Resource Usage Efficiency · Introduce Concurrency → Introduce Concurrency · Maintain Multiple Copies of Computations → Load Balancing · Maintain Multiple Copies of Data → Caching ✅ / Data Replication ✅ · Bound Queue Sizes → Bound Queue Sizes · Schedule Resources / Load Balancer → Resource Scheduling / Load Balancing · Throttling → Rate Limiting ✅ · Service Mesh, Map-Reduce, Manage Sampling Rate, Prioritize Events, Reduce Indirection, Co-locate Communicating Resources, Periodic Cleaning, Increase Resources → open.

**Availability (Ch. 4)** — Monitor → Watchdog Supervision ✅ · Ping/Echo, Heartbeat → Heartbeat + Ping/Echo Probes · Condition Monitoring, Sanity Checking → Condition Monitoring + Sanity Checking · Voting, TMR → N-Version Redundancy and Voting ✅ · Exception Detection/Handling/Prevention → Exception Detection + Handling · Redundant Spare, Active/Passive/Cold Spare → Standby/Failover ✅ · Graceful Degradation → Feature Degradation ✅ · Reconfiguration → Reconfiguration · Shadow → Shadow Mode Reintroduction · State Resynchronization → State Resynchronization · Escalating Restart → Escalating Restart · Removal from Service → Quarantine ✅ · Transactions → Transactional Safeguards · Predictive Model → Predictive Fault Detection · Circuit Breaker → Circuit Breaker ✅ · Timestamp, Self-Test, Rollback, Software Upgrade, Retry, Ignore Faulty Behavior, Nonstop Forwarding, Increase Competence Set, Process Pairs, Forward Error Recovery → open.

**Deployability (Ch. 5)** — Scale Rollouts, Canary Testing → Canary Deployment ✅ · Feature Toggle → Feature Toggles ✅ · Microservice Architecture → Microservice Architecture ✅ · A/B Testing → A/B Testing ✅ · Script Deployment Commands → Infrastructure as Code · Roll Back → Rollback / Checkpoint · Manage Service Interactions, Package Dependencies → open.

**Energy Efficiency (Ch. 6)** — Metering, Static/Dynamic Classification → Resource Metering + Workload Classification · Discovery → Service Discovery · Schedule Resources → Resource Scheduling · Reduce-Resource-Demand tactics → see Performance · Sensor Fusion, Kill Abnormal Tasks → open · Power Monitor, Reduce Usage → out of scope (device-level).

**Integrability (Ch. 7)** — Encapsulate, Use an Intermediary, Abstract Common Services → Reduce Coupling ✅ · Restrict Communication Paths → Restricted Communication Paths · Adhere to Standards → Standards-Based Integration Contracts · Discover, Dynamic Discovery → Service Discovery · Tailor Interface, Wrappers, Bridges → Interface Tailoring (Adapters) · Mediators → Reduce Coupling ✅ (intermediary) · Orchestrate → Orchestration · Manage Resources → Resource Scheduling · Configure Behavior → Externalized Configuration · SOA → open.

**Modifiability (Ch. 8)** — Split Module, Redistribute Responsibilities → Increase Cohesion ✅ · Encapsulate, Use an Intermediary, Abstract Common Services, Restrict Dependencies → Reduce Coupling ✅ · Component Replacement, Configuration-Time Binding, Resource Files, Polymorphism → Defer Binding ✅ · Plug-in (Microkernel) → Plugin Architecture ✅ · Publish-Subscribe → Asynchronous Messaging ✅ / Event-Driven Architecture ✅ · Layers → Layered Architecture · Client-Server, Compile-Time Parameterization, Aspects, Interpret Parameters, Shared Repositories → open.

**Safety (Ch. 10)** — Substitution, Interlock → Safety Interlocks ✅ / Watchdog Supervision ✅ · Timeout, Timestamp, Condition Monitoring, Sanity Checking, Comparison → Unsafe State Detection · Replication → Data Replication ✅ · Functional Redundancy, Masking → N-Version Redundancy and Voting ✅ · Analytic Redundancy → open · Abort → Fail-Safe Defaults ✅ · Degradation → Feature Degradation ✅ · Firewall → Network Segmentation · Rollback, Repair State → Repair-State Recovery · Reconfiguration → Reconfiguration · Predictive Model → Predictive Hazard Models · Redundant Sensors, Monitor-Actuator, Separated Safety → open.

**Security (Ch. 11)** — Authenticate Actors → Strong Authentication ✅ · Authorize Actors → Fine-Grained Authorization ✅ · Limit Access → Least Privilege ✅ / Network Segmentation · Encrypt Data → Encryption at Rest + in Transit ✅ · Validate Input → Input Sanitization / Output Encoding ✅ · Detect Intrusion, IPS → Intrusion Detection · Detect Service Denial → Service Denial Detection · Verify Message Integrity → Message Integrity Verification · Detect Message Delivery Anomalies → Message Delivery Anomaly Detection · Separate Entities → Network Segmentation · Restrict Login → Restrict Login Attempts · Audit → Audit Logging · Nonrepudiation → Non-Repudiation Evidence · Identify Actors, Limit Exposure, Change Credential Settings, Revoke Access, Inform Actors, Intercepting Validator → open.

**Testability (Ch. 12)** — Specialized Interfaces → Specialized Test Interfaces · Record/Playback → Record/Playback Harnesses · Localize State Storage → Localized State Storage · Abstract Data Sources → Abstract Data Sources · Sandbox → Sandbox Environments · Executable Assertions → Executable Assertions · Limit Structural Complexity → Limit Structural Complexity · Limit Nondeterminism → Limit Nondeterminism · Component Replacement, Preprocessor Macros, Aspects → open (niche).
