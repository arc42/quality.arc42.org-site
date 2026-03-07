---
layout: approach
title: "API Gateway"
tags: [secure, operable, reliable]
supported_qualities: [security, interoperability, observability, scalability, availability, modularity]
supported_qualities_notes:
  security: Centralizes authentication, authorization, and request validation at a single enforcement point instead of duplicating those controls in every backend service.
  interoperability: Translates between client-facing protocols (REST, GraphQL, WebSocket) and internal protocols, shielding consumers from backend technology choices.
  observability: Produces a uniform stream of access logs, latency histograms, error rates, and distributed-trace headers for every request entering the system.
  scalability: Offloads cross-cutting work from backend services and absorbs traffic spikes via connection pooling, request buffering, and integration with autoscaling.
  availability: Enables transparent failover, health-check-based routing, and retry with jitter so that transient backend failures do not propagate to callers.
  modularity: Decouples client-facing API contracts from internal service boundaries, allowing backend teams to split, merge, or rewrite services without breaking consumers.
tradeoffs: [latency, operability, loose-coupling, availability]
tradeoff_notes:
  latency: Every request traverses an additional network hop; TLS termination, policy evaluation, and logging add measurable overhead on the critical path.
  operability: The gateway's routing rules, rate-limit policies, certificate rotation, and plugin configuration become a shared operational surface that requires dedicated ownership.
  loose-coupling: If routing rules, request transformations, or response shaping accumulate business logic, the gateway becomes a coupling bottleneck that must change whenever any backend changes.
  availability: A single gateway fleet is a chokepoint — if it goes down, every backend behind it becomes unreachable regardless of its own health.
related_requirements: [access-control-is-enforced, withstand-ddos-attack, handle-sudden-increase-in-traffic, production-anomalies-detectable-within-2-minutes, public-api-intrusion-attempts-blocked]
related_requirements_notes:
  access-control-is-enforced: The gateway validates tokens or API keys on every inbound request before any backend is reached, enforcing authentication and coarse-grained authorization in one place.
  withstand-ddos-attack: Connection limits, IP reputation filtering, and integration with upstream WAF/CDN allow the gateway to shed malicious traffic before it reaches application logic.
  handle-sudden-increase-in-traffic: Request buffering, connection pooling, and tight integration with autoscaling absorb legitimate traffic spikes without cascading overload to backends.
  production-anomalies-detectable-within-2-minutes: Centralized access logging and per-route latency/error metrics give operators a single pane of glass to detect anomalies within seconds.
  public-api-intrusion-attempts-blocked: The gateway enforces rate limits, payload validation, and bot detection rules at the edge, blocking intrusion attempts before they reach internal services.
intent: "Provide a single, managed entry point that enforces cross-cutting concerns — authentication, rate limiting, routing, observability, and protocol translation — so that backend services remain focused on business logic."
mechanism: "Route all external (and optionally internal) traffic through a reverse-proxy layer that terminates TLS, validates credentials, enforces quotas, selects the target backend via declarative routing rules, and emits structured telemetry for every request — rejecting or transforming requests before they reach application code."
applicability: "Use when multiple backend services share common cross-cutting concerns that would otherwise be duplicated in each service, or when client-facing API contracts must remain stable while internal service boundaries evolve. Avoid when the system has a single backend with no cross-cutting requirements, or when the added hop and operational complexity outweigh the consolidation benefit."
permalink: /approaches/api-gateway
---

An API gateway is a reverse-proxy layer that sits between external clients and backend services. It consolidates cross-cutting concerns — TLS termination, authentication, rate limiting, request routing, protocol translation, and telemetry — into a single managed component so that individual services do not need to implement them independently.

The pattern becomes especially valuable once a system grows beyond a handful of services. Without a gateway, every team reimplements token validation, rate limiting, and logging with subtle inconsistencies; with a gateway, those policies are defined once and enforced uniformly. The risk is that a poorly governed gateway accumulates business logic and becomes the bottleneck it was supposed to prevent.

## How It Works

- **TLS Termination and Re-encryption**: The gateway terminates client-facing TLS, inspects and validates the request, then forwards it to the backend over internal TLS (or mTLS). This concentrates certificate management and cipher-suite policy in one fleet. See [Encryption at Rest + in Transit](/approaches/encryption-at-rest-and-in-transit) for the underlying principles.
- **Authentication and Coarse Authorization**: Validate tokens (JWT, OAuth 2.0, API keys) on every inbound request. Reject unauthenticated or expired credentials with `401`/`403` before the request reaches any backend. Delegate fine-grained permission checks to the owning service — the gateway enforces identity, not business rules. See [Strong Authentication](/approaches/strong-authentication) and [Fine-Grained Authorization](/approaches/fine-grained-authorization).
- **Rate Limiting and Admission Control**: Enforce per-client, per-tenant, and per-route request budgets at the edge. Reject excess traffic with `429 Too Many Requests` and `Retry-After`, shedding load before it reaches downstream pools. See [Rate Limiting](/approaches/rate-limiting) for algorithm and key-selection details.
- **Declarative Routing**: Map external URL paths, headers, or hostnames to internal service endpoints via configuration, not code. Support canary releases, blue-green deployments, and A/B routing by shifting traffic weights without redeploying backend services.
- **Protocol Translation**: Accept client-preferred protocols (REST/JSON, GraphQL, gRPC-Web) and translate to the internal protocol the backend expects. This shields consumers from internal technology choices and simplifies client integration.
- **Centralized Telemetry**: Emit structured access logs, request/response latency histograms, per-route error rates, and inject distributed-trace context (e.g., W3C Trace Context) into every forwarded request. This gives operators a single, consistent telemetry stream across all backends.

## Failure Modes

- **Single Point of Failure**: A single gateway fleet without redundancy is a chokepoint — its outage takes down every backend behind it. Multi-zone deployment with health-checked load balancing is a minimum; even then, a bad configuration push (wrong routing rule, expired certificate) can cause a fleet-wide outage.
- **Business Logic Creep**: Teams add request enrichment, response aggregation, or orchestration logic to the gateway because "it's easier." Over time the gateway becomes a monolithic coupling point that must be changed and redeployed for every backend modification, negating the modularity benefit.
- **Stale Routing Configuration**: When service registrations are not synchronized with deployments, the gateway routes traffic to decommissioned or unhealthy instances, causing 502/503 errors that look like backend failures.
- **Authentication Bypass via Misconfiguration**: An unprotected route, an overly broad path match, or a missing middleware in the request pipeline lets unauthenticated traffic reach a sensitive backend — effectively turning the gateway into a direct tunnel.
- **Latency Amplification**: Layering too many plugins (WAF, bot detection, request transformation, logging, tracing) on the critical path can push gateway-added latency from single-digit milliseconds into the tens, disproportionately affecting latency-sensitive endpoints.
- **Certificate and Secret Rotation Failures**: If TLS certificates or signing keys managed by the gateway expire without automated rotation, the entire external API surface goes offline simultaneously.

## Verification

- **End-to-End Latency Overhead**: Measure p50/p95/p99 latency through the gateway versus direct backend access under representative load. The gateway-added overhead should stay within a defined budget (e.g., p99 `< 15 ms` added latency). Note that p99 spikes usually come from synchronous plugin execution (WAF rule evaluation, JWT signature verification, request body inspection) rather than asynchronous work like access logging; profiling per-plugin latency contribution is essential for tuning.
- **Authentication Enforcement Audit**: Enumerate all registered routes and verify that 100% of non-public routes reject requests without valid credentials. Automate this as a CI/CD gate via contract tests against the gateway's route table.
- **Failover Drill**: Terminate one gateway instance or availability zone and verify that remaining capacity absorbs all traffic within the agreed failover window (e.g., `< 30 s`) with no client-visible errors beyond the in-flight requests on the terminated instance.
- **Configuration Rollback**: Push a deliberately broken routing rule and verify that the deployment pipeline detects the error (via health checks or canary analysis) and rolls back automatically within the defined window (e.g., `< 2 min`).
- **Rate-Limit Accuracy**: Under a controlled burst, verify that per-client and per-route limits engage within 5% of the configured threshold across all gateway replicas.

## Variants and Related Tactics

- **Backend-for-Frontend (BFF)**: A dedicated gateway per client type (mobile, web, partner) that tailors the API surface, aggregation, and protocol to the client's needs — avoiding a one-size-fits-all gateway that grows complex trying to serve everyone.
- **Service Mesh Sidecar**: Moves cross-cutting concerns (mTLS, retries, circuit breaking, telemetry) into per-pod proxies (e.g., Envoy, Linkerd) rather than a centralized fleet. Eliminates the single-chokepoint risk but trades it for distributed sidecar management.
- **Edge Gateway vs. Internal Gateway**: An edge gateway handles external traffic (TLS, authentication, DDoS mitigation), while an internal gateway enforces service-to-service policies (mTLS, traffic shaping, canary routing). Splitting the two prevents the edge gateway from accumulating internal orchestration logic.
- [Rate Limiting](/approaches/rate-limiting) provides the admission-control algorithms the gateway enforces at the edge.
- [Circuit Breaker](/approaches/circuit-breaker) protects the gateway's backend connections from cascading failure when a downstream service becomes unhealthy.
- [Bulkheads](/approaches/bulkheads) isolate gateway resources (thread pools, connection pools) per backend to prevent one slow service from starving others.
- [Caching](/approaches/caching) at the gateway layer reduces backend load for cacheable responses and improves client-perceived latency.

## References

- [OWASP API Security Top 10](https://owasp.org/API-Security/) — threat model and mitigation guidance for API-layer security
- [RFC 6749: The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749) — token-based authentication and delegation model enforced at the gateway
- [Software Architecture in Practice](https://www.sei.cmu.edu/library/software-architecture-in-practice-fourth-edition/) — Bass, Clements & Kazman ([full citation](/references/#bass2021software))
- [Release It!](https://pragprog.com/titles/mnee2/release-it-second-edition/) — Michael Nygard ([full citation](/references/#nygard2018release))
