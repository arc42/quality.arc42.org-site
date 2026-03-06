# Solution Approaches — Merged Overview

Consolidated from three independent plans (Gemini, GPT-5.3, Opus 4.6), Bass et al. tactics, plus additional proposals.

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
| 📋 | Bulkheads | Isolate resource pools so one failure path can't exhaust all | P·O |
| 📋 | Graceful Degradation | Disable non-essential features to preserve core function | G·O·B+ |
| 📋 | Rate Limiting | Cap request volume to protect availability under load | P·O |
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
| 📋 | CQRS | Separate read and write models for independent scaling | O |
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

**Zero published approaches — highest priority dimension.**

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| | Hexagonal Architecture (Ports & Adapters) | Isolate domain logic from infrastructure behind abstract ports | P·O |
| | Modular Architecture / Bounded Contexts | Split codebase into cohesive, low-coupling modules | G·P·B+ |
| | Automated Test Pyramid | Unit, integration, contract tests as change safety nets | G·P·B+ |
| | Static Analysis + Quality Gates | Block merges when complexity, duplication, or style thresholds are violated | P·O |
| | Architecture Decision Records (ADRs) | Numbered, immutable records of why decisions were made | P·O |
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
| | Component Replacement | Design components for plug-compatible substitution with minimal ripple effects | ★·B+ |
| | Abstract Common Services | Extract repeated cross-cutting capabilities into shared services/contracts | ★·B+ |
| | Dependency Update Automation | Automated PRs for library updates (Dependabot, Renovate) | ★ |
| | Continuous Refactoring Discipline | Systematic small improvements (boy-scout rule) embedded in daily work | ★ |
| | API Documentation as Code | Generate and version API docs from source (OpenAPI, AsyncAPI) | ★ |

---

## `#efficient` — Perform within time, capacity, and resource parameters

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| ✅ | Caching | Serve frequent reads from faster storage layers | G·P·O·B+ |
| ✅ | Asynchronous Messaging | Move long-running work off the request path | G·P·O |
| 📋 | CQRS | Optimise read and write paths independently | O |
| 📋 | Database Sharding | Partition data across nodes for horizontal scale | O |
| | Connection Pooling | Reuse expensive connections (DB, HTTP, gRPC) across requests | G·P·O |
| | Content Delivery Network (CDN) | Serve static content from edge locations near users | P·O |
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
| | Maintain Multiple Copies of Data/Computation | Use replicas and cached/precomputed results to reduce contention and delay | ★·B+ |
| | Load Balancing | Distribute traffic across instances for throughput and fault tolerance | ★·B+ |
| | Backpressure / Flow Control | Let consumers signal capacity limits to upstream producers | ★·B+ |
| | Batch Processing | Aggregate operations to reduce per-item overhead | ★ |

---

## `#usable` — Enable effective, efficient, satisfying use

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| ✅ | Progressive Disclosure | Show primary actions first, reveal complexity on demand | G·P·O |
| ✅ | Responsive Design | Adapt layout and interactions across screen sizes and inputs | G·P·O |
| | Accessibility-First Design (WCAG) | Semantic HTML, keyboard nav, contrast, screen reader support from day one | P·O |
| | Inline Validation + Error Recovery | Real-time input feedback with clear recovery paths (undo, retry) | G·P·O·B+ |
| | Consistent Design System | Shared UI components, terminology, and interaction patterns | G·P |
| | Skeleton Screens / Optimistic UI | Show placeholder layouts immediately, apply actions before confirmation | O |
| | Cancel Operations | Let users cancel in-progress actions safely before irreversible effects occur | ★·B+ |
| | Undo/Redo | Provide reversible operations so users can recover quickly from mistakes | ★·B+ |
| | Pause/Resume Flows | Allow temporary interruption/resumption of long-running user workflows | ★·B+ |
| | Aggregate Actions | Group repetitive actions to reduce effort and interaction overhead | ★·B+ |
| | Maintain Task Model | Keep UI behavior aligned with user tasks and goals rather than system internals | ★·B+ |
| | Maintain User Model | Keep terminology/mental model consistent with user expectations | ★·B+ |
| | Maintain System Model | Make system state/modes visible and coherent to reduce confusion | ★·B+ |
| | Internationalization (i18n) | Multi-language, locale-aware formatting, and right-to-left support | ★ |
| | Dark Mode / Theming | User-selectable visual themes via design token architecture | ★ |
| | Onboarding / Guided Tours | Step-by-step first-use guidance to accelerate learnability | ★ |

---

## `#safe` — Avoid states endangering life, health, or environment

**Zero published approaches — high priority dimension.**

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| | Fail-Safe Defaults | Transition to predefined safe state on unexpected conditions | G·P·O·B+ |
| | Safety Interlocks | Enforce preconditions before allowing hazardous operations | G·P·O·B+ |
| | Watchdog Supervision | Independent monitor detects hangs, triggers safe restart | G·P·O·B+ |
| | N-Modular Redundancy + Voting | Run N independent paths, majority vote masks single failures | P·O·B+ |
| | Hazard Analysis (FMEA / STPA) | Systematic derivation of safety constraints from identified hazards | P |
| | Graceful Degradation (safety-focused) | Shed non-essential functions to protect safety-critical core | G·B+ |
| | Unsafe State Detection (Comparison/Timeout/Monitoring) | Detect hazardous drift using comparison, timeout, timestamp, and condition monitoring | ★·B+ |
| | Barrier Containment (Firewall/Interlock) | Place barriers that block propagation of unsafe effects across boundaries | ★·B+ |
| | Consequence Limitation (Masking/Abort) | Mask faults when possible; otherwise abort/degrade to minimize harm | ★·B+ |
| | Replication / Analytic / Functional Redundancy | Combine physical and analytical redundancy for stronger containment | ★·B+ |
| | Repair-State Recovery | Transition through a validated repair state before normal operation resumes | ★·B+ |
| | Predictive Hazard Models | Use predictive models to anticipate unsafe states and trigger safeguards | ★·B+ |
| | Dead Man's Switch / Operator Confirmation | Require active periodic confirmation to continue hazardous operations | ★ |
| | Safety-Certified RTOS / Execution Environment | Run safety-critical code on a pre-certified runtime with deterministic scheduling | ★ |
| | Independent Safety Monitor | Separate hardware/software channel that can override primary control | ★ |

---

## `#secure` — Protect data and defend against attack patterns

**Zero published approaches — high priority dimension.**

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| 📋 | Least Privilege | Grant only minimum permissions required per actor/process | G·P·O·B+ |
| 📋 | Rate Limiting | Throttle requests to limit brute-force and DoS exposure (secondary) | P·O·B+ |
| 📋 | API Gateway | Centralise auth, throttling, and input validation at the edge (secondary) | P·O |
| | Encryption at Rest + in Transit | Cryptographic protection of stored and transmitted data with key rotation | G·P·O·B+ |
| | Secret Management | Vault-based credential storage with rotation and short-lived tokens | P·O |
| | Defense in Depth | Layer independent controls so no single failure yields a breach | O |
| | Input Sanitization / Output Encoding | Neutralise untrusted data to prevent injection and XSS | G·P·B+ |
| | Strong Authentication (MFA / OIDC) | Multi-factor or phishing-resistant identity verification | G·P·B+ |
| | Fine-Grained Authorization (RBAC/ABAC) | Authorize actors per action/resource with policy-based access control | ★·B+ |
| | Intrusion Detection | Detect indicators of compromise and raise actionable security alerts | ★·B+ |
| | Service Denial Detection | Detect denial-of-service conditions early via traffic and saturation signals | ★·B+ |
| | Message Integrity Verification | Verify message integrity/authenticity to detect tampering in transit | ★·B+ |
| | Message Delivery Anomaly Detection | Detect replay, duplication, reordering, or unexpected delivery gaps | ★·B+ |
| | Revoke Access + Credential Rotation | Revoke compromised access quickly and rotate credentials safely | ★·B+ |
| | Restrict Login Attempts | Limit login attempts and enforce lockout/challenge policies | ★·B+ |
| | Security Notifications | Inform users/operators promptly about relevant security events | ★·B+ |
| | Audit Logging | Tamper-evident records of security-relevant events | O·B+ |
| | Non-Repudiation Evidence | Preserve signed, verifiable evidence so actors cannot deny critical actions | ★·B+ |
| | Separation of Entities (Isolation) | Separate tenants/components/security domains to reduce cross-impact | ★·B+ |
| | Zero Trust Architecture | Authenticate and authorise every request regardless of network origin | ★ |
| | Dependency Vulnerability Scanning | Automated checks for known CVEs in third-party libraries (SCA) | ★ |
| | Network Segmentation / Micro-Segmentation | Isolate workloads so lateral movement after breach is contained | ★·B+ |

---

## `#suitable` — Meet stated and implied stakeholder needs

**Zero published approaches, zero in backlog — largest gap.**

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| | Domain-Driven Design (DDD) | Align model, terminology, and module boundaries with business domain | G·P·O |
| | Fitness Functions | Automated architectural tests that continuously verify quality constraints | O |
| | ATDD / Scenario-Based Requirements | Executable acceptance tests before implementation | P·O |
| | Compliance as Code | Encode regulatory rules as automated policy checks in CI/CD or runtime | O |
| | Configurable Business Rules | Policy/rules engine for behaviour changes without redeployment | G·P |
| | A/B Testing / Evidence-Driven Validation | Compare alternatives with real usage outcomes and metrics | G·P |
| | Role-Based Workflows / Persona-Based UI | Tailor interactions and data views to user role and task context | G·P |
| | Prototyping / Spike Solutions | Build throwaway implementations to validate feasibility early | ★ |
| | Impact Mapping | Connect features to business goals via actors and impacts | ★ |
| | Stakeholder Feedback Loops | Structured, recurring collection of user/operator feedback into backlog | ★ |

---

## `#operable` — Deploy, operate, monitor, and control predictably

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| 📋 | Blue-Green Deployment | Run two identical environments, switch traffic for zero-downtime releases | O·B+ |
| 📋 | API Gateway | Centralise routing, auth, and observability at the edge (secondary) | P·O |
| | Scripted Deployment Commands | Capture deployment procedures as versioned scripts for repeatable releases | ★·B+ |
| | Progressive Rollouts (Scale Rollouts) | Expand rollout scope in stages with health gates and stop criteria | ★·B+ |
| | Explicit Rollback Strategy | Define and rehearse rollback paths before each production change | ★·B+ |
| | Manage Service Interactions | Coordinate service interaction policies/contracts during deployment changes | ★·B+ |
| | Package Dependency Management | Control package versions and compatibility to reduce deployment drift | ★·B+ |
| | Structured Observability (Logs, Metrics, Traces) | Correlated telemetry via unified pipeline (OpenTelemetry) | G·P·O |
| | Infrastructure as Code (IaC) | Version-controlled, declarative environment definitions | P·O |
| | Canary Deployment | Route small traffic percentage to new version, promote or rollback on metrics | P·O·B+ |
| | Runbooks + Automated Remediation | Executable SOPs for known failure modes, progressing toward auto-fix | P·O |
| | SLO/SLI-Based Alerting | Alert on user-impacting objectives, not raw infrastructure noise | P |
| | CI/CD Pipelines | Automate build, test, and release for repeatable delivery | G·P·B+ |
| | Auto-Scaling / Elasticity | Adjust resources automatically based on demand signals | G |
| | Containerization + Orchestration | Package workloads as containers, manage with Kubernetes or similar | ★ |
| | ChatOps / Incident Communication | Integrate operational commands and alerts into team chat channels | ★ |
| | On-Call Rotation + Blameless Post-Mortems | Structured incident response with learning-focused retrospectives | ★ |

---

## Summary: Approaches per Dimension

| Dimension | ✅ | 📋 | New | Total |
|-----------|:--:|:--:|:---:|:-----:|
| reliable | 2 | 3 | 17 | **22** |
| flexible | 3 | 1 | 12 | **16** |
| maintainable | 0 | 0 | 25 | **25** |
| efficient | 2 | 2 | 16 | **20** |
| usable | 2 | 0 | 14 | **16** |
| safe | 0 | 0 | 15 | **15** |
| secure | 0 | 3 | 19 | **22** |
| suitable | 0 | 0 | 10 | **10** |
| operable | 0 | 2 | 15 | **17** |
| **Total** | **9** | **11** | **143** | **163** |

Note: Some approaches appear in multiple dimensions (e.g. Caching in reliable+efficient, Rate Limiting in reliable+secure). The unique approach count is lower than 163.
