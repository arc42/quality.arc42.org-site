# Bass et al. — *Software Architecture in Practice* — Tactics Catalog

Tactics extracted verbatim (by name) from the quality-attribute chapters of
Bass, Clements & Kazman, *Software Architecture in Practice* (`B+` in our source legend).
One PDF per quality attribute; this file is built up attribute by attribute.

Purpose: a complete inventory of the book's tactics so we can later decide which to
elaborate into full `_approaches/` pages. Descriptions are deliberately brief — we
elaborate later.

**Legend — Done column:**
`✅` published in `_approaches/` · `📋` queued in `approaches-planning-and-status.md` · ` ` not yet on the site

**Legend — Source column:**
`B+` = Bass et al. tactic · co-credits added where the same idea is already tracked under another plan (`G` Gemini · `P` GPT-5.3 · `O` Opus 4.6 · `★` new).

**Note on naming:** Approach names are the book's tactic names. The Done column reflects whether an
equivalent already exists on the site, even if our site uses different phrasing (noted in the description).

---

## Performance (Ch. 9)

Bass groups performance tactics under two goals: **Control Resource Demand** and **Manage Resources**,
plus a set of performance **patterns**.

### Control Resource Demand

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| | Manage Event Arrival (SLA) | Cap the maximum event-arrival rate a component will accept via a service-level agreement | B+ |
| | Manage Sampling Rate | Reduce the sampling frequency of inputs (sensor/video) to keep latency predictable, trading fidelity | B+ |
| | Limit Event Response | Process events only up to a set maximum rate; queue or discard the excess | B+ |
| | Prioritize Events | Rank events by importance; service high-priority first, drop low-priority under load | B+ |
| | Reduce Computational Overhead | Cut the work per event — site tracks this as "Computational Overhead Reduction" | B+ |
| | Reduce Indirection | Remove intermediaries from the event path to lower per-event latency (modifiability tradeoff) | B+ |
| | Co-locate Communicating Resources | Place cooperating components together (same processor/runtime/rack) to cut communication cost | B+ |
| | Periodic Cleaning | Periodically clean up resources that degrade over time (hash tables, virtual-memory maps) | B+ |
| | Bound Execution Times | Cap execution time per event (e.g. limit iterations) — site tracks this as "Execution-Time Bounding" | B+ |
| | Increase Efficiency of Resource Usage | Improve algorithms in critical areas to cut latency and resource use — site: "Increase Resource Usage Efficiency" | B+ |

### Manage Resources

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| | Increase Resources | Add faster/more processors, memory, or network to improve performance | B+ |
| | Introduce Concurrency | Process events in parallel across threads to reduce blocked time — site tracks this as "Introduce Concurrency" | B+ |
| | Maintain Multiple Copies of Computations | Replicate services behind a load balancer to cut contention — site tracks the realization as "Load Balancing" | B+ |
| | Maintain Multiple Copies of Data | Data replication + caching to reduce access contention — Caching is published; data replication still open | B+ |
|  | Bound Queue Sizes | Cap queued arrivals (and the resources to process them) — site tracks this as "Bound Queue Sizes" | B+ |
|  | Schedule Resources | Schedule contended resources with an appropriate policy (FIFO, fixed/dynamic priority, etc.) — site: "Resource Scheduling" | B+ |

### Performance Patterns (Sec. 9.4)

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| | Service Mesh | Sidecar proxies co-located with each microservice handle cross-cutting concerns, cutting network latency | B+ |
|  | Load Balancer | Single entry point farms requests across a provider pool (realizes Schedule Resources) — site: "Load Balancing" | B+ |
| | Throttling | Intermediary limits access to a service to keep it in its efficient operating range — site: "Rate Limiting" | B+ |
| | Map-Reduce | Distributed, parallel sort-and-analyze of very large data sets via stateless map + reduce functions | B+ |

---

## Availability (Ch. 4)

Bass groups availability tactics under three goals: **Detect Faults**, **Recover from Faults**
(split into *Preparation and Repair* and *Reintroduction*), and **Prevent Faults**, plus a set of
availability **patterns** (Sec. 4.4).

### Detect Faults

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
|  | Monitor | A component that watches the health of other parts of the system (a watchdog when timer-based) — site tracks the realization as "Watchdog Supervision" | B+ |
|  | Ping/Echo | Async request/response between nodes to test reachability and round-trip delay — site: "Heartbeat + Ping/Echo Probes" | B+ |
|  | Heartbeat | Periodic message from a monitored process to its monitor signals it is alive — site: "Heartbeat + Ping/Echo Probes" | B+ |
| | Timestamp | Detect incorrect event sequences in distributed systems via local clock or sequence numbers | B+ |
|  | Condition Monitoring | Check conditions/invariants (e.g. checksums) in a process to prevent faulty behavior — site: "Condition Monitoring + Sanity Checking" | B+ |
|  | Sanity Checking | Validate the reasonableness of a component's operations or outputs, often at interfaces — site: "Condition Monitoring + Sanity Checking" | B+ |
|  | Voting | Compare results from redundant sources and decide which to use (incl. Replication, Functional, Analytic redundancy) — site: "N-Modular Redundancy + Voting" / "Replication / Analytic / Functional Redundancy" | B+ |
|  | Exception Detection | Detect a system condition that alters normal execution flow (system exceptions, parameter fence, parameter typing, timeout) — site: "Exception Detection + Handling" | B+ |
| | Self-Test | Components run procedures to test themselves for correct operation, on demand or on a schedule | B+ |

### Recover from Faults — Preparation and Repair

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
|  | Redundant Spare | Duplicate components take over on primary failure (hot/warm/cold spare variants) — site: "Redundancy + Automated Failover" | B+ |
| | Rollback | Revert to a previous known-good checkpoint on failure detection, then continue | B+ |
|  | Exception Handling | Handle a detected exception to mask or repair the fault rather than crash — site: "Exception Detection + Handling" | B+ |
| | Software Upgrade | Achieve in-service code upgrades non-disruptively (function patch, class patch, hitless ISSU) | B+ |
| | Retry | Assume a transient fault and retry the operation up to a bounded limit — site has "Retry with Exponential Backoff" (queued, no Done mark) | B+ |
| | Ignore Faulty Behavior | Ignore messages from a source judged to be spurious (e.g. a failed sensor) | B+ |
|  | Graceful Degradation | Maintain critical functions while dropping less critical ones under failure — site: "Graceful Degradation" | B+ |
|  | Reconfiguration | Reassign responsibilities to remaining functioning resources to preserve functionality — site: "Reconfiguration" | B+ |

### Recover from Faults — Reintroduction

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
|  | Shadow | Run a repaired/upgraded component in shadow mode before reverting it to active — site: "Shadow Mode Reintroduction" | B+ |
|  | State Resynchronization | Reconcile active and standby state (checksum/checkpoint) before going live — site: "State Resynchronization" | B+ |
|  | Escalating Restart | Recover by varying the granularity of components restarted to minimize service impact — site: "Escalating Restart" | B+ |
| | Nonstop Forwarding | Split control and data plane (router design) so packets keep flowing while control state rebuilds | B+ |

### Prevent Faults

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
|  | Removal from Service | Temporarily take a component out of service to scrub latent faults (software rejuvenation) — site: "Removal from Service (Quarantine)" | B+ |
|  | Transactions | Use ACID transactional semantics (e.g. 2PC) to keep distributed updates consistent — site: "Transactional Safeguards" | B+ |
|  | Predictive Model | Monitor operational metrics to predict fault onset and take corrective action — site: "Predictive Fault Detection" | B+ |
|  | Exception Prevention | Techniques that prevent exceptions (exception classes, ECC, smart pointers, wrappers) — site: "Exception Detection + Handling" (closest; prevention partially overlaps) | B+ |
| | Increase Competence Set | Design a component to handle more cases/faults as part of its normal operation | B+ |

### Availability Patterns (Sec. 4.4)

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
|  | Active Redundancy (Hot Spare) | All nodes process identical inputs in parallel; spare takes over in milliseconds — site: "Redundancy + Automated Failover" | B+ |
|  | Passive Redundancy (Warm Spare) | Active node feeds periodic state updates to loosely-coupled standby spares — site: "Redundancy + Automated Failover" | B+ |
|  | Spare (Cold Spare) | Spares stay out of service until failover triggers a power-on-reset, then go live — site: "Redundancy + Automated Failover" | B+ |
|  | Triple Modular Redundancy (TMR) | Three components do the same work; voter masks an inconsistent output — site: "N-Modular Redundancy + Voting" | B+ |
| ✅ | Circuit Breaker | Break the endless retry cycle when a service is deemed failed, returning immediately until reset — site: "Circuit Breaker" | B+ |
| | Process Pairs | Backup checkpoints (and rolls back) to stay ready to take over on failure | B+ |
| | Forward Error Recovery | Move forward to a desirable (possibly degraded) state using built-in error correction, not rollback | B+ |

---

## Deployability (Ch. 5)

Bass groups deployability tactics under two goals: **Manage Deployment Pipeline** and
**Manage Deployed System** (six tactics total), plus a set of deployability **patterns** (Sec. 5.6).

### Manage Deployment Pipeline

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| ✅ | Scale Rollouts | Deploy a new version gradually to controlled subsets of users, monitoring and rolling back if needed — site tracks this as "Canary Deployment" | B+·P·O |
| | Roll Back | Revert a defective or unsatisfactory deployment to its prior state, ideally fully automated | B+ |
|  | Script Deployment Commands | Treat scripted, automated deployment steps like code (documented, reviewed, tested, version-controlled) — site tracks the realization as "Infrastructure as Code (IaC)" | B+ |

### Manage Deployed System

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| | Manage Service Interactions | Mediate interactions so multiple service versions can run simultaneously without incompatibilities | B+ |
| | Package Dependencies | Bundle an element with its dependencies (libraries, OS, sidecars) for consistent deployment | B+ |
| ✅ | Feature Toggle | Runtime "kill switch" disables a released feature without redeploying — site tracks this as "Feature Toggles" | B+·G·P·O |

### Deployability Patterns (Sec. 5.6)

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| | Microservice Architecture | Structure the system as independently deployable, message-only services with a discovery service | B+ |
| | Canary Testing | Test a new release in production with a small set of designated users before full rollout — site tracks this as "Canary Deployment" | B+·P·O |
| | A/B Testing | Run multiple versions on different user groups to determine which yields the best business results | B+ |

---

## Energy Efficiency (Ch. 6)

Bass groups energy efficiency tactics under three goals: **Monitor Resources**, **Allocate Resources**,
and **Reduce Resource Demand** (the last category is detailed in the Performance chapter, Ch. 9), plus a
set of energy efficiency **patterns** (Sec. 6.4).

### Monitor Resources

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
|  | Metering | Collect near-real-time energy-consumption data via a sensor infrastructure — site tracks this as "Resource Metering + Workload Classification" | B+ |
|  | Static Classification | Estimate energy use by cataloging resources and their known energy characteristics — site: "Resource Metering + Workload Classification" | B+ |
|  | Dynamic Classification | Estimate energy use from transient conditions like workload (table/regression/simulation) — site: "Resource Metering + Workload Classification" | B+ |

### Allocate Resources

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| | Reduce Usage | Cut device-level usage (dim display, spin down drives, slow clock, consolidate VMs, offload to cloud) | B+ |
|  | Discovery | Match requests to providers via a "green service directory" annotated with energy data — site tracks the realization as "Service Discovery" | B+ |
|  | Schedule Resources | Allocate tasks to resources to manage energy use under task constraints and priorities — site: "Resource Scheduling" | B+ |

### Reduce Resource Demand (detailed in Ch. 9)

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| | Manage Event Arrival | Cap or shape the event-arrival rate to do less work and save energy | B+ |
| | Limit Event Response | Process events only up to a set rate to reduce energy spent | B+ |
| | Prioritize Events | Rank events; let low-priority events go unserviced to save energy | B+ |
|  | Reduce Computational Overhead | Cut the work per event to lower energy demand — site tracks this as "Computational Overhead Reduction" | B+ |
|  | Bound Execution Times | Cap execution time per task to reduce energy use — site tracks this as "Execution-Time Bounding" | B+ |
|  | Increase Resource Usage Efficiency | Improve algorithms/implementations to lower energy cost per unit of work — site: "Increase Resource Usage Efficiency" | B+ |

### Energy Efficiency Patterns (Sec. 6.4)

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| | Sensor Fusion | Use low-power sensor data to infer whether higher-power sensors must be consulted | B+ |
| | Kill Abnormal Tasks | Monitor energy use of apps and interrupt/kill energy-greedy operations after a timeout | B+ |
| | Power Monitor | Automatically disable devices and interfaces not being actively used | B+ |

---

## Integrability (Ch. 7)

Bass groups integrability tactics under three goals: **Limit Dependencies**, **Adapt**, and
**Coordinate**, plus a set of integrability **patterns** (Sec. 7.5).

### Limit Dependencies

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
|  | Encapsulate | Introduce an explicit interface so all access flows through it, eliminating dependencies on internals — site: "Encapsulation Boundaries" | B+·★ |
|  | Use an Intermediary | Break dependencies between components via a broker (pub-sub bus, data transformer, protocol translator) — site: "Intermediary Pattern (Facade/Broker)" | B+·★ |
|  | Restrict Communication Paths | Limit which elements an element may talk to, via visibility and authorization (e.g. ESB-only routing) — site: "Restricted Communication Paths" | B+·★ |
|  | Adhere to Standards | Conform to platform/vendor standards (IEEE, ISO, OMG) to cut potential dependencies and ease substitution — site: "Standards-Based Integration Contracts" | B+·★ |
| | Abstract Common Services | Hide similar elements behind one common abstraction so future components integrate once, not per-element | B+ |

### Adapt

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
|  | Discover | A catalog (discovery service) lets services locate each other and bind dynamically at runtime — site: "Service Discovery" | B+·★ |
|  | Tailor Interface | Add or hide capabilities (translation, buffering, validation filters) on an interface without changing its API — site: "Interface Tailoring (Adapters)" | B+·★ |
| | Configure Behavior | Make a component configurable (build/init/runtime) so it interoperates with a wider range of components | B+ |

### Coordinate

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
|  | Orchestrate | A control mechanism coordinates service invocations so services stay unaware of each other (workflow/BPEL) — site: "Orchestration" | B+·★ |
|  | Manage Resources | A resource manager governs access to computing resources, enforcing fair-access/invariant policies — site tracks the closest realization as "Resource Scheduling" (partial overlap) | B+·★ |

### Integrability Patterns (Sec. 7.5)

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
|  | Wrappers | Encapsulate a component behind an alternative abstraction that translates, hides, or preserves interface elements — site: "Interface Tailoring (Adapters)" | B+·★ |
|  | Bridges | A component-independent translator mapping one component's "requires" to another's "provides," invoked externally — site: "Interface Tailoring (Adapters)" (closest) | B+·★ |
|  | Mediators | First-class intermediary combining bridge and wrapper traits, deciding translation at runtime — site: "Intermediary Pattern (Facade/Broker)" | B+·★ |
| | Service-Oriented Architecture (SOA) | Distributed, heterogeneous service providers/consumers with SLAs, communicating via web standards (WSDL/SOAP) | B+ |
|  | Dynamic Discovery | Apply the discover tactic so service providers are found and bound at runtime — site: "Service Discovery" | B+·★ |

---

## Modifiability (Ch. 8)

Bass groups modifiability tactics under three goals: **Increase Cohesion**, **Reduce Coupling**, and
**Defer Binding**, plus a set of modifiability **patterns** (Sec. 8.4). The reduce-coupling tactics
overlap with the integrability tactics of Ch. 7.

### Increase Cohesion

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
|  | Split Module | Refactor a non-cohesive module into several cohesive submodules to localize change — site: "Increase Cohesion (Split Modules / Redistribute Responsibilities)" | B+·★ |
|  | Redistribute Responsibilities | Group similar responsibilities scattered across modules into one place — site: "Increase Cohesion (Split Modules / Redistribute Responsibilities)" | B+·★ |

### Reduce Coupling

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
|  | Encapsulate | Introduce an explicit interface so access flows through it, hiding internals from dependents — site: "Encapsulation Boundaries" | B+·★ |
|  | Use an Intermediary | Break a dependency between two modules by placing a broker/mediator between them — site: "Intermediary Pattern (Facade/Broker)" | B+·★ |
| | Abstract Common Services | Hide similar elements behind one common abstraction so dependents bind once, not per-element | B+ |
|  | Restrict Dependencies | Limit which modules a module may use, via visibility and authorization (e.g. layered architecture) — site: "Restrict Dependencies" | B+·★ |

### Defer Binding

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
|  | Component Replacement | Swap a component at compile/build time (e.g. via build script or makefile) — site: "Defer Binding (Config/Resources/Polymorphism)" | B+·★ |
| | Compile-Time Parameterization | Bind parameter values at compile time to vary behavior without source changes | B+ |
| | Aspects | Bind cross-cutting concerns at compile/build time via aspect weaving | B+ |
|  | Configuration-Time Binding | Bind values at deployment/startup via configuration — site: "Defer Binding (Config/Resources/Polymorphism)" / "Externalized Configuration" | B+·★ |
|  | Resource Files | Bind values at startup/init from external resource files — site: "Defer Binding (Config/Resources/Polymorphism)" | B+·★ |
|  | Discovery | Locate and bind a service provider at runtime via a discovery service — site: "Service Discovery" | B+·★ |
| | Interpret Parameters | Read and interpret parameter values at runtime to vary behavior | B+ |
| | Shared Repositories | Bind via a runtime shared data store that decouples producers and consumers | B+ |
|  | Polymorphism | Bind method implementations at runtime via late binding — site: "Defer Binding (Config/Resources/Polymorphism)" | B+·★ |

### Modifiability Patterns (Sec. 8.4)

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| | Client-Server | Clients request services from servers bound dynamically at runtime, giving low coupling and independent scaling | B+ |
| ✅ | Plug-in (Microkernel) | A core provides base functionality; plug-ins add capabilities via fixed interfaces, bound at build time or later — site: "Plugin Architecture" | B+·★ |
| | Layers | Partition software into layers with a strict unidirectional allowed-to-use relation — site tracks "Layered Architecture" (queued, no Done mark) | B+ |
| ✅ | Publish-Subscribe | Components communicate via async events through a bus; publishers and subscribers stay loosely coupled — site: "Asynchronous Messaging" / "Event-Driven Architecture" | B+·★ |

---

## Safety (Ch. 10)

Bass categorizes safety tactics as **Unsafe State Avoidance**, **Unsafe State Detection**,
**Containment** (split into *Redundancy*, *Limit Consequences*, and *Barrier*), and **Recovery**,
plus a set of safety **patterns** (Sec. 10.4). The chapter notes substantial overlap with the
availability tactics of Ch. 4.

### Unsafe State Avoidance

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| ✅ | Substitution | Replace dangerous software features with hardware protection (watchdogs, monitors, interlocks) — site: "Safety Interlocks" / "Watchdog Supervision" | B+·G·P·O |
|  | Predictive Model | Predict system health from monitoring to give early warning of a potential unsafe state — site: "Predictive Hazard Models" | B+·★ |

### Unsafe State Detection

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
|  | Timeout | Detect late or omitted operations by checking a component's timing constraints — site: "Unsafe State Detection (Comparison/Timeout/Monitoring)" | B+·★ |
|  | Timestamp | Detect incorrect event sequences via local clock or sequence numbers in distributed systems — site: "Unsafe State Detection (Comparison/Timeout/Monitoring)" | B+·★ |
|  | Condition Monitoring | Check conditions/assumptions (e.g. assertions) to identify states leading to hazard — site: "Unsafe State Detection (Comparison/Timeout/Monitoring)" | B+·★ |
|  | Sanity Checking | Validate reasonableness of a component's results, inputs, or outputs, usually at interfaces — site: "Unsafe State Detection (Comparison/Timeout/Monitoring)" | B+·★ |
|  | Comparison | Detect unsafe states by comparing outputs of synchronized/replicated elements — site: "Unsafe State Detection (Comparison/Timeout/Monitoring)" | B+·★ |

### Containment — Redundancy

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
|  | Replication | Run identical clones of a component to tolerate random hardware failures (no diversity) — site: "Replication / Analytic / Functional Redundancy" | B+·★ |
|  | Functional Redundancy | Add design diversity across replicas to address common-mode failures — site: "Replication / Analytic / Functional Redundancy" | B+·★ |
|  | Analytic Redundancy | Diversity at input/output level (high-assurance + high-performance split) tolerating spec errors — site: "Replication / Analytic / Functional Redundancy" | B+·★ |

### Containment — Limit Consequences

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| ✅ | Abort | Abort an operation determined to be unsafe before it can cause damage — site: "Fail-Safe Defaults" (closest realization) | B+·G·P·O |
|  | Degradation | Maintain critical functions while dropping/replacing less critical ones in a controlled way — site: "Graceful Degradation (safety-focused)" | B+·G |
|  | Masking | Mask a fault by voting across redundant components' results — site: "N-Modular Redundancy + Voting" | B+·P·O |

### Containment — Barrier

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| | Firewall | Limit access to specified resources (processors, memory, network) — realization of the limit-access tactic (Ch. 11) | B+ |
| ✅ | Interlock | Control all access to protected components, including correct event sequencing — site: "Safety Interlocks" | B+·G·P·O |

### Recovery

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| | Rollback | Revert to a saved known-good state on failure detection, then continue | B+ |
|  | Repair State | Repair an erroneous state (widen the handled state set) and continue — site: "Repair-State Recovery" | B+·★ |
|  | Reconfiguration | Remap the logical architecture onto remaining functioning resources after failure — site: "Reconfiguration" | B+·★ |

### Safety Patterns (Sec. 10.4)

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| | Redundant Sensors | Replicate safety-critical sensors and monitor each independently to survive single-sensor failure | B+ |
| | Monitor-Actuator | A monitor checks an actuator controller's computed values for reasonableness before they reach the actuator | B+ |
| | Separated Safety | Split the system into certified safety-critical and non-safety-critical portions to cut certification cost | B+ |

---

## Security (Ch. 11)

Bass groups security tactics under four goals — **Detect Attacks**, **Resist Attacks**, **React to
Attacks**, and **Recover from Attacks** — and notes that the availability tactics/patterns of Ch. 4
also apply (recovery is reused by reference). Two security **patterns** are given in Sec. 11.4.

### Detect Attacks

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
|  | Detect Intrusion | Compare network traffic/request patterns to a database of known malicious signatures — site: "Intrusion Detection" | B+·★ |
|  | Detect Service Denial | Compare incoming traffic patterns to historical profiles of known DoS attacks — site: "Service Denial Detection" | B+·★ |
|  | Verify Message Integrity | Use checksums or hash values to verify integrity of messages, resource/deployment/config files — site: "Message Integrity Verification" | B+·★ |
|  | Detect Message Delivery Anomalies | Detect man-in-the-middle via abnormal delivery timing or connection/disconnection counts — site: "Message Delivery Anomaly Detection" | B+·★ |

### Resist Attacks

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| | Identify Actors | Identify the source of external input (user IDs, access codes, IP addresses, ports, protocols) | B+ |
| ✅ | Authenticate Actors | Ensure an actor is who it claims to be (passwords, OTP, certificates, 2FA, biometrics, CAPTCHA) — site: "Strong Authentication (MFA / OIDC)" | B+·G·P |
| ✅ | Authorize Actors | Ensure an authenticated actor has rights to access/modify data or services (access control per actor/class/role) — site: "Fine-Grained Authorization (RBAC/ABAC)" | B+·★ |
| ✅ | Limit Access | Restrict access points or traffic types to shrink the attack surface (e.g. DMZ, firewalls) — site: "Least Privilege" / "Network Segmentation / Micro-Segmentation" | B+·G·P·O |
| | Limit Exposure | Passively minimize damage by reducing data/services reachable through a single access point | B+ |
| ✅ | Encrypt Data | Achieve confidentiality via symmetric/asymmetric encryption of data and communication — site: "Encryption at Rest + in Transit" | B+·G·P·O |
|  | Separate Entities | Limit attack scope by separating entities (different servers/networks, VMs, air gap, sensitive vs nonsensitive data) — site: "Network Segmentation / Micro-Segmentation" | B+·★ |
| ✅ | Validate Input | Clean and check input (filtering, canonicalization, sanitization) to resist SQL injection and XSS — site: "Input Sanitization / Output Encoding" | B+·G·P |
| | Change Credential Settings | Force users to change default settings/passwords so publicly known defaults can't be exploited | B+ |

### React to Attacks

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| | Revoke Access | Severely limit access to sensitive resources (even for legitimate users) when an attack is suspected | B+ |
|  | Restrict Login | Limit access from a computer after repeated failed login attempts (timed/doubling lock-out) — site: "Restrict Login Attempts" | B+·★ |
| | Inform Actors | Notify operators, personnel, or cooperating systems when an attack is detected | B+ |

### Recover from Attacks

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
|  | Audit | Keep a record of user/system actions and effects to trace and identify an attacker — site: "Audit Logging" | B+·O |
|  | Nonrepudiation | Guarantee a sender cannot deny sending and a recipient cannot deny receiving (digital signatures + trusted third parties) — site: "Non-Repudiation Evidence" | B+·★ |

### Security Patterns (Sec. 11.4)

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
| | Intercepting Validator | A wrapper inserted between message source and destination, realizing verify-message-integrity (and other detect-attack tactics) | B+ |
|  | Intrusion Prevention System (IPS) | Standalone element that identifies, blocks, and reports suspicious usage patterns — site: "Intrusion Detection" (closest; IPS adds the react/block step) | B+·★ |

---

## Testability (Ch. 12)

Bass groups testability tactics under two goals: **Control and Observe System State** and
**Limit Complexity**. This chapter has no separate "X.4" patterns section.

### Control and Observe System State

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
|  | Specialized Interfaces | Provide test-only interfaces (set/get, report, reset, verbose-output methods) to control and capture component state — site: "Specialized Test Interfaces" | B+·★ |
|  | Record/Playback | Capture state crossing an interface, then replay it to re-create a fault — site: "Record/Playback Harnesses" | B+·★ |
|  | Localize State Storage | Store state in a single place (e.g. a state machine) so a component can be started in an arbitrary test state — site: "Localized State Storage" | B+·★ |
|  | Abstract Data Sources | Abstract data interfaces so test data can be substituted without changing functional code — site: "Abstract Data Sources" | B+·★ |
|  | Sandbox | Isolate a system instance from the real world (often via resource virtualization) for consequence-free experimentation — site: "Sandbox Environments" | B+·★ |
|  | Executable Assertions | Hand-coded assertions check data constraints at runtime, flagging faulty state and boosting observability — site: "Executable Assertions" | B+·★ |
| | Component Replacement | Swap a component's implementation for a test-friendly version, often in build scripts | B+ |
| | Preprocessor Macros | Activate state-reporting code or probe statements that return/display info to a test console | B+ |
| | Aspects | Handle the cross-cutting concern of how state is reported via aspect-oriented programming | B+ |

### Limit Complexity

| Done | Approach | One-line description | Source |
|:----:|----------|----------------------|:------:|
|  | Limit Structural Complexity | Avoid cyclic dependencies, encapsulate external deps, lower coupling, simplify inheritance — site: "Limit Structural Complexity" | B+·★ |
|  | Limit Nondeterminism | Find and remove sources of nondeterminism (e.g. unconstrained parallelism) for repeatable behavior — site: "Limit Nondeterminism" | B+·★ |

---
