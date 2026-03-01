# Solution Approaches — Merged Overview

Consolidated from three independent plans (Gemini, GPT-5.3, Opus 4.6) plus additional proposals.

**Legend — Done column:**
`✅` published in `_approaches/` · `📋` in backlog (`approaches-todo.md`) · ` ` not started

**Legend — Source column:**
`G` = Gemini · `P` = GPT-5.3 · `O` = Opus 4.6 · `★` = new (not in any prior plan)

---

## `#reliable` — Perform without interruption or failure

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| ✅ | Circuit Breaker | Stop calls to failing dependency, probe recovery after timeout | G·P·O |
| ✅ | Caching | Reduce load and latency via fast-access data copies (secondary) | O |
| 📋 | Bulkheads | Isolate resource pools so one failure path can't exhaust all | P·O |
| 📋 | Graceful Degradation | Disable non-essential features to preserve core function | G·O |
| 📋 | Rate Limiting | Cap request volume to protect availability under load | P·O |
| | Retry with Exponential Backoff | Retry transient failures with increasing, jittered delays | G·P·O |
| | Idempotent Operations | Make writes safely repeatable to enable retries and replay | G·O |
| | Health Checks + Auto-Healing | Liveness/readiness probes trigger restart or rerouting | G·P |
| | Redundancy + Automated Failover | Duplicate instances, switch traffic on primary failure | G·P |
| | Timeout Management | Bound wait times on all remote calls to prevent indefinite hangs | ★ |
| | Chaos Engineering | Inject failures in production-like environments to validate resilience | ★ |
| | Data Replication | Copy data across nodes/regions for durability and read availability | ★ |

---

## `#flexible` — Adapt to changed requirements or environments

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| ✅ | Feature Toggles | Decouple deployment from release via runtime switches | G·P·O |
| ✅ | Plugin Architecture | Stable extension points for third-party capabilities | G·P·O |
| 📋 | Asynchronous Messaging | Decouple services in time and space via queues/topics | P·O |
| 📋 | CQRS | Separate read and write models for independent scaling | O |
| | Event-Driven Architecture | Connect components via async events, add consumers without changing producers | G·P·O |
| | Backward-Compatible API Versioning | Evolve public contracts without breaking existing consumers | P·O |
| | Externalized Configuration | Move thresholds, rules, and switches out of compiled code | P·O |
| | Dependency Injection | Swap concrete implementations at construction time | G |
| | Schema Evolution / Tolerant Reader | Evolve data schemas while remaining compatible with older consumers | ★ |
| | Multi-Tenancy | Serve multiple isolated tenants from a single deployment | ★ |
| | Micro-Frontend Architecture | Independently deployable UI modules owned by separate teams | ★ |

---

## `#maintainable` — Analyse, modify, test, evolve with predictable effort

**Zero published approaches — highest priority dimension.**

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| | Hexagonal Architecture (Ports & Adapters) | Isolate domain logic from infrastructure behind abstract ports | P·O |
| | Modular Architecture / Bounded Contexts | Split codebase into cohesive, low-coupling modules | G·P |
| | Automated Test Pyramid | Unit, integration, contract tests as change safety nets | G·P |
| | Static Analysis + Quality Gates | Block merges when complexity, duplication, or style thresholds are violated | P·O |
| | Architecture Decision Records (ADRs) | Numbered, immutable records of why decisions were made | P·O |
| | Strangler Fig Pattern | Incrementally replace legacy via routing facade | O |
| | Layered Architecture | Horizontal layers with strict top-down dependency rules | G |
| | Dependency Update Automation | Automated PRs for library updates (Dependabot, Renovate) | ★ |
| | Continuous Refactoring Discipline | Systematic small improvements (boy-scout rule) embedded in daily work | ★ |
| | API Documentation as Code | Generate and version API docs from source (OpenAPI, AsyncAPI) | ★ |

---

## `#efficient` — Perform within time, capacity, and resource parameters

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| ✅ | Caching | Serve frequent reads from faster storage layers | G·P·O |
| 📋 | Asynchronous Messaging | Move long-running work off the request path | G·P·O |
| 📋 | CQRS | Optimise read and write paths independently | O |
| 📋 | Database Sharding | Partition data across nodes for horizontal scale | O |
| | Connection Pooling | Reuse expensive connections (DB, HTTP, gRPC) across requests | G·P·O |
| | Content Delivery Network (CDN) | Serve static content from edge locations near users | P·O |
| | Lazy Loading | Defer initialisation until actually needed | O |
| | Data Compression | Reduce payload sizes for transfer and storage | G·P |
| | Data Access Optimization (Indexing, Pagination) | Tune queries, indexes, and result-set sizes for workload | P |
| | Load Balancing | Distribute traffic across instances for throughput and fault tolerance | ★ |
| | Backpressure / Flow Control | Let consumers signal capacity limits to upstream producers | ★ |
| | Batch Processing | Aggregate operations to reduce per-item overhead | ★ |

---

## `#usable` — Enable effective, efficient, satisfying use

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| ✅ | Progressive Disclosure | Show primary actions first, reveal complexity on demand | G·P·O |
| ✅ | Responsive Design | Adapt layout and interactions across screen sizes and inputs | G·P·O |
| | Accessibility-First Design (WCAG) | Semantic HTML, keyboard nav, contrast, screen reader support from day one | P·O |
| | Inline Validation + Error Recovery | Real-time input feedback with clear recovery paths (undo, retry) | G·P·O |
| | Consistent Design System | Shared UI components, terminology, and interaction patterns | G·P |
| | Skeleton Screens / Optimistic UI | Show placeholder layouts immediately, apply actions before confirmation | O |
| | Internationalization (i18n) | Multi-language, locale-aware formatting, and right-to-left support | ★ |
| | Dark Mode / Theming | User-selectable visual themes via design token architecture | ★ |
| | Onboarding / Guided Tours | Step-by-step first-use guidance to accelerate learnability | ★ |

---

## `#safe` — Avoid states endangering life, health, or environment

**Zero published approaches — high priority dimension.**

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| | Fail-Safe Defaults | Transition to predefined safe state on unexpected conditions | G·P·O |
| | Safety Interlocks | Enforce preconditions before allowing hazardous operations | G·P·O |
| | Watchdog Supervision | Independent monitor detects hangs, triggers safe restart | G·P·O |
| | N-Modular Redundancy + Voting | Run N independent paths, majority vote masks single failures | P·O |
| | Hazard Analysis (FMEA / STPA) | Systematic derivation of safety constraints from identified hazards | P |
| | Graceful Degradation (safety-focused) | Shed non-essential functions to protect safety-critical core | G |
| | Dead Man's Switch / Operator Confirmation | Require active periodic confirmation to continue hazardous operations | ★ |
| | Safety-Certified RTOS / Execution Environment | Run safety-critical code on a pre-certified runtime with deterministic scheduling | ★ |
| | Independent Safety Monitor | Separate hardware/software channel that can override primary control | ★ |

---

## `#secure` — Protect data and defend against attack patterns

**Zero published approaches — high priority dimension.**

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| 📋 | Least Privilege | Grant only minimum permissions required per actor/process | G·P·O |
| 📋 | Rate Limiting | Throttle requests to limit brute-force and DoS exposure (secondary) | P·O |
| 📋 | API Gateway | Centralise auth, throttling, and input validation at the edge (secondary) | P·O |
| | Encryption at Rest + in Transit | Cryptographic protection of stored and transmitted data with key rotation | G·P·O |
| | Secret Management | Vault-based credential storage with rotation and short-lived tokens | P·O |
| | Defense in Depth | Layer independent controls so no single failure yields a breach | O |
| | Input Sanitization / Output Encoding | Neutralise untrusted data to prevent injection and XSS | G·P |
| | Strong Authentication (MFA / OIDC) | Multi-factor or phishing-resistant identity verification | G·P |
| | Audit Logging | Tamper-evident records of security-relevant events | O |
| | Zero Trust Architecture | Authenticate and authorise every request regardless of network origin | ★ |
| | Dependency Vulnerability Scanning | Automated checks for known CVEs in third-party libraries (SCA) | ★ |
| | Network Segmentation / Micro-Segmentation | Isolate workloads so lateral movement after breach is contained | ★ |

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
| 📋 | Blue-Green Deployment | Run two identical environments, switch traffic for zero-downtime releases | O |
| 📋 | API Gateway | Centralise routing, auth, and observability at the edge (secondary) | P·O |
| | Structured Observability (Logs, Metrics, Traces) | Correlated telemetry via unified pipeline (OpenTelemetry) | G·P·O |
| | Infrastructure as Code (IaC) | Version-controlled, declarative environment definitions | P·O |
| | Canary Deployment | Route small traffic percentage to new version, promote or rollback on metrics | P·O |
| | Runbooks + Automated Remediation | Executable SOPs for known failure modes, progressing toward auto-fix | P·O |
| | SLO/SLI-Based Alerting | Alert on user-impacting objectives, not raw infrastructure noise | P |
| | CI/CD Pipelines | Automate build, test, and release for repeatable delivery | G·P |
| | Auto-Scaling / Elasticity | Adjust resources automatically based on demand signals | G |
| | Containerization + Orchestration | Package workloads as containers, manage with Kubernetes or similar | ★ |
| | ChatOps / Incident Communication | Integrate operational commands and alerts into team chat channels | ★ |
| | On-Call Rotation + Blameless Post-Mortems | Structured incident response with learning-focused retrospectives | ★ |

---

## Summary: Approaches per Dimension

| Dimension | ✅ | 📋 | New | Total |
|-----------|:--:|:--:|:---:|:-----:|
| reliable | 2 | 3 | 7 | **12** |
| flexible | 2 | 2 | 7 | **11** |
| maintainable | 0 | 0 | 10 | **10** |
| efficient | 1 | 3 | 8 | **12** |
| usable | 2 | 0 | 7 | **9** |
| safe | 0 | 0 | 9 | **9** |
| secure | 0 | 3 | 9 | **12** |
| suitable | 0 | 0 | 10 | **10** |
| operable | 0 | 2 | 10 | **12** |
| **Total** | **7** | **13** | **77** | **97** |

Note: Some approaches appear in multiple dimensions (e.g. Caching in reliable+efficient, Rate Limiting in reliable+secure). The unique approach count is lower than 97.
