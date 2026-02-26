# Top 10 Proposed Solution Approaches

This backlog is normalized to the canonical schema in `TODO/approaches/TEMPLATE.md`.
All `supported_qualities` and `tradeoffs` values are plain quality slug candidates.

| Priority | Approach | Permalink | Tags (9 dimensions only) | supported_qualities (slug candidates) | tradeoffs (slug candidates) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| P1 | Circuit Breaker | `/approaches/circuit-breaker` | `reliable`, `operable` | `availability`, `fault-tolerance`, `resilience`, `recoverability` | `code-complexity`, `consistency`, `cost` |
| P1 | Rate Limiting | `/approaches/rate-limiting` | `secure`, `reliable` | `availability`, `security`, `information-security`, `resilience` | `usability`, `code-complexity` |
| P1 | Bulkheads | `/approaches/bulkheads` | `reliable`, `operable` | `fault-tolerance`, `resilience`, `availability` | `resource-utilization`, `cost`, `code-complexity` |
| P1 | Graceful Degradation | `/approaches/graceful-degradation` | `reliable`, `usable` | `availability`, `resilience`, `recoverability` | `usability`, `consistency`, `code-complexity` |
| P2 | API Gateway | `/approaches/api-gateway` | `secure`, `operable`, `usable` | `security`, `usability`, `observability`, `operability` | `availability`, `latency`, `code-complexity` |
| P2 | Asynchronous Messaging | `/approaches/asynchronous-messaging` | `efficient`, `reliable`, `flexible` | `scalability`, `throughput`, `availability`, `resilience` | `eventual-consistency`, `observability`, `code-complexity` |
| P2 | Blue-Green Deployment | `/approaches/blue-green-deployment` | `operable`, `reliable` | `availability`, `deployability`, `releasability`, `recoverability` | `cost`, `code-complexity` |
| P2 | Least Privilege | `/approaches/least-privilege` | `secure`, `safe` | `security`, `confidentiality`, `integrity` | `usability`, `operability` |
| P3 | CQRS | `/approaches/cqrs` | `efficient`, `flexible`, `maintainable` | `scalability`, `performance`, `extensibility` | `eventual-consistency`, `code-complexity`, `operability` |
| P3 | Database Sharding | `/approaches/database-sharding` | `efficient`, `reliable` | `scalability`, `performance`, `capacity`, `availability` | `code-complexity`, `operability`, `consistency` |

## Notes for Execution

- Confirm each slug exists in `/qualities/<slug>` before final page merge.
- Keep page body structure concise (max 4 `##` headings).
- Deliver in batches of 2-3 approaches per PR.
