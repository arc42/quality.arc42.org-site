# Solution Approaches — Merged Overview


**Legend — Done column:**
`✅` published in `_approaches/` · `📋` in backlog (`approaches-todo.md`) · ` ` not started

**Legend — Source column:**
`G` = Gemini · `P` = GPT-5.3 · `O` = Opus 4.6 · `B+` = Bass et al. tactics · `★` = new (not in any prior plan)

---

## `#reliable` — Perform without interruption or failure

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| ✅ | Circuit Breaker | Stop calls to failing dependency, probe recovery after timeout | G·P·O |
| ✅ | Caching | Reduce load and latency via fast-access data copies (secondary) | O |
| ✅ | Bulkheads | Isolate resource pools so one failure path can't exhaust all | P·O |
| 📋 | Graceful Degradation | Disable non-essential features to preserve core function | G·O·B+ |
| ✅ | Rate Limiting | Cap request volume to protect availability under load | P·O |
| ✅ | Saga Pattern | Split a distributed transaction into local steps with compensating actions (also `#flexible`) | ★ |
| | Retry with Exponential Backoff | Retry transient failures with increasing, jittered delays | G·P·O·B+ |
| | Idempotent Operations | Make writes safely repeatable to enable retries and replay | G·O |
| | Health Checks + Auto-Healing | Liveness/readiness probes trigger restart or rerouting | G·P·B+ |
| | Heartbeat + Ping/Echo Probes | Active peer checks detect unresponsive services quickly for reroute or restart | ★·B+ |
| | Condition Monitoring + Sanity Checking | Continuously validate thresholds/invariants to detect drift before hard failure | ★·B+ |
| | Exception Detection + Handling | Catch fault conditions early and route to controlled recovery logic | ★·B+ |
| | Redundancy + Automated Failover | Duplicate instances, switch traffic on primary failure | G·P·B+ |
| | Reconfiguration | Remove or isolate faulty parts and reroute dependencies at runtime | ★·B+ |
| | State Resynchronization | Reconcile state before returning a recovered component to live traffic | ★·B+ |
| | Escalating Restart | Escalate restart scope (process -> node -> zone) if failures persist | ★·B+ |
| | Shadow Mode Reintroduction | Reintroduce recovered/new components on shadow traffic before full cutover | ★·B+ |
| | Removal from Service (Quarantine) | Temporarily detach unstable components until diagnosis/repair completes | ★·B+ |
| | Transactional Safeguards | Use transactional boundaries to prevent partial or inconsistent updates on faults | ★·B+ |
| | Predictive Fault Detection | Use predictive models to anticipate failures and trigger preventive action | ★·B+ |
| | Timeout Management | Bound wait times on all remote calls to prevent indefinite hangs | ★·B+ |
| | Chaos Engineering | Inject failures in production-like environments to validate resilience | ★ |
| | Data Replication | Copy data across nodes/regions for durability and read availability | ★·B+ |

---

## `#flexible` — Adapt to changed requirements or environments

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| ✅ | Feature Toggles | Decouple deployment from release via runtime switches | G·P·O·B+ |
| ✅ | Plugin Architecture | Stable extension points for third-party capabilities | G·P·O |
| ✅ | Asynchronous Messaging | Decouple services in time and space via queues/topics | P·O |
| ✅  | CQRS | Separate read and write models for independent scaling | O |
| | Event-Driven Architecture | Connect components via async events, add consumers without changing producers | G·P·O |
| | Backward-Compatible API Versioning | Evolve public contracts without breaking existing consumers | P·O |
| | Externalized Configuration | Move thresholds, rules, and switches out of compiled code | P·O·B+ |
| | Dependency Injection | Swap concrete implementations at construction time | G·B+ |
| | Interface Tailoring (Adapters) | Tailor external interfaces via adapters/translators without changing providers | ★·B+ |
| | Service Discovery | Discover endpoints/capabilities at runtime to reduce fixed coupling | ★·B+ |
| | Orchestration | Coordinate multi-service workflows with explicit control flow | ★·B+ |
| | Restricted Communication Paths | Constrain interaction paths to reduce integration blast radius | ★·B+ |
| | Standards-Based Integration Contracts | Adhere to standards to ease substitution and ecosystem integration | ★·B+ |
| | Schema Evolution / Tolerant Reader | Evolve data schemas while remaining compatible with older consumers | ★ |
| | Multi-Tenancy | Serve multiple isolated tenants from a single deployment | ★ |
| | Micro-Frontend Architecture | Independently deployable UI modules owned by separate teams | ★ |

---

## `#maintainable` — Analyse, modify, test, evolve with predictable effort

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| | Hexagonal Architecture (Ports & Adapters) | Isolate domain logic from infrastructure behind abstract ports | P·O |
| | Modular Architecture / Bounded Contexts | Split codebase into cohesive, low-coupling modules | G·P·B+ |
| | Automated Test Pyramid | Unit, integration, contract tests as change safety nets | G·P·B+ |
| | Static Analysis + Quality Gates | Block merges when complexity, duplication, or style thresholds are violated | P·O |
| | Strangler Fig Pattern | Incrementally replace legacy via routing facade | O |
| | Layered Architecture | Horizontal layers with strict top-down dependency rules | G |
| | Specialized Test Interfaces | Expose controlled inspection/control points to observe and steer system state in tests | ★·B+ |
| | Record/Playback Harnesses | Capture interaction traces and replay them deterministically for regression tests | ★·B+ |
| | Localized State Storage | Keep mutable state local and explicit to simplify setup, reset, and assertions | ★·B+ |
| | Abstract Data Sources | Use abstractions for external data so tests can swap stubs, fixtures, and simulators | ★·B+ |
| | Sandbox Environments | Execute tests in isolated sandboxes to prevent side effects and improve repeatability | ★·B+ |
| | Executable Assertions | Encode invariants as runtime-checkable assertions in tests and critical code paths | ★·B+ |
| | Limit Structural Complexity | Constrain structure/dependencies to keep components understandable and testable | ★·B+ |
| | Limit Nondeterminism | Reduce time/order randomness for stable, reproducible test outcomes | ★·B+ |
| | Increase Cohesion (Split Modules / Redistribute Responsibilities) | Split oversized modules and reassign responsibilities to localize changes | ★·B+ |
| | Encapsulation Boundaries | Hide internals behind stable interfaces so internal refactors stay local | ★·B+ |
| | Intermediary Pattern (Facade/Broker) | Route dependencies through intermediaries to decouple direct links | ★·B+ |
| | Restrict Dependencies | Enforce allowed dependency directions and bounded contexts | ★·B+ |
| | Defer Binding (Config/Resources/Polymorphism) | Bind implementation choices late via configuration, resource files, or polymorphism | ★·B+ |


---

## `#efficient` — Perform within time, capacity, and resource parameters

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| ✅ | Caching | Serve frequent reads from faster storage layers | G·P·O·B+ |
| ✅ | Asynchronous Messaging | Move long-running work off the request path | G·P·O |
| ✅  | CQRS | Optimise read and write paths independently | O |
| ✅ | Database Sharding | Partition data across nodes for horizontal scale | O |
| | Connection Pooling | Reuse expensive connections (DB, HTTP, gRPC) across requests | G·P·O |
| ✅ | Content Delivery Network (CDN) | Serve static content from edge locations near users | P·O |
| | Lazy Loading | Defer initialisation until actually needed | O |
| | Data Compression | Reduce payload sizes for transfer and storage | G·P |
| | Data Access Optimization (Indexing, Pagination) | Tune queries, indexes, and result-set sizes for workload | P·B+ |
| | Resource Metering + Workload Classification | Meter and classify workloads (static/dynamic) to steer optimization and policies | ★·B+ |
| | Resource Scheduling | Schedule resources and workloads by priority/quotas/deadlines | ★·B+ |
| | Introduce Concurrency | Parallelize independent work to improve throughput and latency | ★·B+ |
| | Bound Queue Sizes | Cap queue lengths to prevent latency collapse and resource exhaustion | ★·B+ |
| | Execution-Time Bounding | Enforce upper bounds for request/task execution times | ★·B+ |
| | Computational Overhead Reduction | Remove unnecessary processing steps to cut resource demand | ★·B+ |
| | Increase Resource Usage Efficiency | Optimize algorithms/implementations to lower cost per transaction | ★·B+ |
| | Load Balancing | Distribute traffic across instances for throughput and fault tolerance | ★·B+ |
| | Batch Processing | Aggregate operations to reduce per-item overhead | ★ |

---

## `#usable` — Enable effective, efficient, satisfying use

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| ✅ | Progressive Disclosure | Show primary actions first, reveal complexity on demand | G·P·O |
| ✅ | Responsive Design | Adapt layout and interactions across screen sizes and inputs | G·P·O |
| | Accessibility-First Design (WCAG) | Semantic HTML, keyboard nav, contrast, screen reader support from day one | P·O |

---

## `#safe` — Avoid states endangering life, health, or environment

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| ✅ | Fail-Safe Defaults | Transition to predefined safe state on unexpected conditions | G·P·O·B+ |
| ✅ | Safety Interlocks | Enforce preconditions before allowing hazardous operations | G·P·O·B+ |
| ✅ | Watchdog Supervision | Independent monitor detects hangs, triggers safe restart | G·P·O·B+ |
| | N-Modular Redundancy + Voting | Run N independent paths, majority vote masks single failures | P·O·B+ |
| | Hazard Analysis (FMEA / STPA) | Systematic derivation of safety constraints from identified hazards | P |
| | Graceful Degradation (safety-focused) | Shed non-essential functions to protect safety-critical core | G·B+ |
| | Unsafe State Detection (Comparison/Timeout/Monitoring) | Detect hazardous drift using comparison, timeout, timestamp, and condition monitoring | ★·B+ |
| | Replication / Analytic / Functional Redundancy | Combine physical and analytical redundancy for stronger containment | ★·B+ |
| | Repair-State Recovery | Transition through a validated repair state before normal operation resumes | ★·B+ |
| | Predictive Hazard Models | Use predictive models to anticipate unsafe states and trigger safeguards | ★·B+ |
| | Dead Man's Switch / Operator Confirmation | Require active periodic confirmation to continue hazardous operations | ★ |
| | Independent Safety Monitor | Separate hardware/software channel that can override primary control | ★ |

---

## `#secure` — Protect data and defend against attack patterns


| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| ✅ | Least Privilege | Grant only minimum permissions required per actor/process | G·P·O·B+ |
| ✅ | Rate Limiting | Throttle requests to limit brute-force and DoS exposure (secondary) | P·O·B+ |
| ✅ | API Gateway | Centralise auth, throttling, and input validation at the edge (secondary) | P·O |
| ✅ | Encryption at Rest + in Transit | Cryptographic protection of stored and transmitted data with key rotation | G·P·O·B+ |
| ✅ | Secret Management | Vault-based credential storage with rotation and short-lived tokens | P·O |
| ✅ | Input Sanitization / Output Encoding | Neutralise untrusted data to prevent injection and XSS | G·P·B+ |
| ✅ | Strong Authentication (MFA / OIDC) | Multi-factor or phishing-resistant identity verification | G·P·B+ |
| ✅ | Fine-Grained Authorization (RBAC/ABAC) | Authorize actors per action/resource with policy-based access control | ★·B+ |
| | Intrusion Detection | Detect indicators of compromise and raise actionable security alerts | ★·B+ |
| | Service Denial Detection | Detect denial-of-service conditions early via traffic and saturation signals | ★·B+ |
| | Message Integrity Verification | Verify message integrity/authenticity to detect tampering in transit | ★·B+ |
| | Message Delivery Anomaly Detection | Detect replay, duplication, reordering, or unexpected delivery gaps | ★·B+ |
| | Restrict Login Attempts | Limit login attempts and enforce lockout/challenge policies | ★·B+ |
| | Audit Logging | Tamper-evident records of security-relevant events | O·B+ |
| | Non-Repudiation Evidence | Preserve signed, verifiable evidence so actors cannot deny critical actions | ★·B+ |
| | Zero Trust Architecture | Authenticate and authorise every request regardless of network origin | ★ |
| | Dependency Vulnerability Scanning | Automated checks for known CVEs in third-party libraries (SCA) | ★ |
| | Network Segmentation / Micro-Segmentation | Isolate workloads so lateral movement after breach is contained | ★·B+ |

---

## `#operable` — Deploy, operate, monitor, and control predictably

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| ✅ | Blue-Green Deployment | Run two identical environments, switch traffic for zero-downtime releases | O·B+ |
| ✅ | API Gateway | Centralise routing, auth, and observability at the edge (secondary) | P·O |
| | Infrastructure as Code (IaC) | Version-controlled, declarative environment definitions | P·O |
| ✅ | Canary Deployment | Route small traffic percentage to new version, promote or rollback on metrics | P·O·B+ |
| | Auto-Scaling / Elasticity | Adjust resources automatically based on demand signals | G |
