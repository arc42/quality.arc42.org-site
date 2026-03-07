---
layout: approach
title: "Rate Limiting"
tags: [secure, reliable]
supported_qualities: [security, intrusion-prevention, availability, resilience, stability]
supported_qualities_notes:
  security: Slows brute-force login attempts, credential stuffing, scraping, and abusive automation before those requests consume expensive application work.
  intrusion-prevention: Blocks or delays suspicious request patterns at the edge instead of merely detecting them after the protected handler has already been reached.
  availability: Preserves worker threads, database connections, and identity-provider capacity by rejecting excess requests before scarce resources are exhausted.
  resilience: Converts overload into explicit, bounded rejection so the system can continue providing an acceptable level of service to legitimate traffic under hostile or accidental surges.
  stability: Bounds queue growth and latency amplification by enforcing admission control rather than letting demand grow unbounded inside the service.
tradeoffs: [usability, operability, latency, code-complexity]
tradeoff_notes:
  usability: Legitimate users can be throttled during bursts or when many users share one source address unless keys and budgets are chosen carefully.
  operability: Per-route tuning, tenant exceptions, incident overrides, and telemetry review require continuous operational ownership.
  latency: Distributed counters, shared quota stores, or cross-node synchronization add request-path overhead, especially on globally distributed ingress.
  code-complexity: Correctly combining per-IP, per-account, per-tenant, and global limits across multiple replicas is harder than applying a single static threshold.
related_requirements: [public-api-intrusion-attempts-blocked, withstand-ddos-attack, handle-sudden-increase-in-traffic]
related_requirements_notes:
  public-api-intrusion-attempts-blocked: Directly addresses brute-force throttling, block timing, and auditability expectations on public authentication and API endpoints.
  withstand-ddos-attack: Helps against application-layer denial-of-service by capping admitted work, but does not replace upstream CDN, WAF, or provider-level filtering for volumetric network floods.
  handle-sudden-increase-in-traffic: Prevents a subset of callers or expensive routes from monopolizing shared capacity during spikes, buying time for autoscaling and caching to absorb legitimate demand.
intent: "Protect scarce resources by capping request admission per client, identity, tenant, or route over time, so brute-force attempts, abusive automation, and sudden traffic spikes cannot exhaust shared capacity or overwhelm sensitive endpoints."
mechanism: "Enforce request budgets as close to ingress as possible using deterministic algorithms such as token bucket or sliding window, keyed by IP address, account, API key, tenant, route, or operation cost as appropriate; apply layered quotas for global traffic, high-risk endpoints, and expensive handlers; reject excess requests immediately with explicit backpressure such as `429 Too Many Requests`, optional `Retry-After`, and structured audit events for tuning and incident response."
applicability: "Use on any internet-facing endpoint and any internal API where overload from misuse, retries, or fan-out can exhaust shared resources. Most valuable on authentication, password reset, search, export, and write-heavy endpoints. Do not treat it as the only DDoS control when upstream bandwidth can be saturated before the request reaches the application; pair it with upstream filtering, caching, bulkheads, and autoscaling."
permalink: /approaches/rate-limiting
---

Rate limiting is admission control for requests. Instead of letting every caller consume as much of the system as it can, the system defines explicit budgets over time and rejects excess demand early. This is especially effective against application-layer abuse such as brute-force login attempts, credential stuffing, scraping, retry storms, and expensive API misuse.

It is not a complete denial-of-service strategy. If an attack saturates the network link, CDN edge, or load balancer before requests reach the limiter, application-side throttling cannot help. The pattern is strongest when placed at the first hop that still has enough context to distinguish callers and enough control to reject work cheaply.

## How It Works

- Choose rate-limit keys by abuse pattern and business semantics: per-account plus per-source for login, per-API-key or per-tenant for partner APIs, and per-route or cost-weighted budgets for expensive endpoints such as search or export.
- Enforce limits at the earliest practical boundary: CDN, WAF, API gateway, or ingress proxy. Use token bucket, leaky bucket, or sliding-window counters, but keep the decision deterministic and cheap.
- Layer the budgets: a global limit protects the platform, narrower per-route limits protect expensive handlers, and identity-specific limits protect authentication and authorization endpoints from distributed guessing.
- Reject immediately once the budget is exhausted. In normal throttle scenarios return `429 Too Many Requests`; when the retry window is known, include `Retry-After` rather than silently queueing or timing out. At extreme edge saturation, documented connection-drop behavior can still be valid.
- Keep counters consistent across replicas. Use shared state or carefully bounded local budgets so a client cannot multiply its allowance simply by spreading traffic across ingress nodes.
- Combine the limiter with [Bulkheads](/approaches/bulkheads), [Caching](/approaches/caching), and autoscaling. Rate limiting controls admitted work; it does not remove the need to isolate downstream pools or absorb legitimate bursts efficiently.

## Failure Modes

- Limits are keyed only by IP address. This penalizes users behind carrier NAT or corporate proxies, while distributed botnets still spread attempts across many addresses. Authentication flows usually need both per-account and per-source controls.
- Counters are local to each node without coordination. Attackers send traffic through multiple replicas and effectively multiply the configured budget.
- Excess requests are queued instead of rejected. The limiter appears to work, but worker pools and databases still receive overload via backlog growth and latency inflation.
- One static threshold is applied to all routes and tenants. Cheap reads, expensive exports, and login endpoints have different abuse costs and need different budgets.
- Limiter-state failure is handled poorly: fail-open removes protection exactly when traffic is high, while fail-closed on all endpoints can create a self-inflicted outage. High-risk endpoints often need protective deny behavior; low-risk reads may tolerate conservative local fallback budgets.

## Verification

- Brute-force resistance: send at least 100 invalid login attempts for one account from 10 source IPs within 10 minutes and verify that the configured threshold engages consistently across all ingress nodes (for example block after 5 failures within 10 minutes for 15 minutes), with 100% of throttle events logged.
- Distributed-budget consistency: with traffic spread across all production-like ingress replicas, verify that one API key or tenant cannot exceed the configured aggregate budget by more than 5% over a 5-minute window.
- Availability under abusive load: under a representative attack profile such as 10x normal authentication traffic or 3x baseline on an expensive endpoint, legitimate requests still meet the protected SLO (for example success rate >= 99.9% and p95 latency <= 500 ms).
- Signaling correctness: in controlled throttle scenarios, verify that 100% of throttled requests return `429`, and when the reset time is known, `Retry-After` is present and matches the configured wait window. If the edge intentionally drops connections under extreme saturation, that behavior must be documented and monitored separately.
- Failure drill: simulate unavailability of the shared counter store for at least 30 seconds and verify that high-risk endpoints switch to protective mode within the defined window, low-risk endpoints apply the documented fallback behavior, and alerting reaches operators within 60 seconds.

## References

- [RFC 6585: Additional HTTP Status Codes](https://www.rfc-editor.org/rfc/rfc6585) — defines `429 Too Many Requests`
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) — login throttling, account lockout, and brute-force resistance guidance
- [OWASP API Security Top 10: API4 Unrestricted Resource Consumption](https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/) — API-specific guidance on resource exhaustion controls
- [Release It!](https://pragprog.com/titles/mnee2/release-it-second-edition/) — Michael Nygard ([full citation](/references/#nygard2018release))
