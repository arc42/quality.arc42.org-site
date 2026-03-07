# High-Priority Requirements for New Approach Proposals

Selection criteria:
- High risk/impact if unmet (security, safety, compliance, operational continuity).
- No direct coverage yet via `related_requirements` from existing `_approaches`.
- Clear, measurable acceptance criteria that can anchor concrete approach pages.

## Top 5

| Rank | Requirement | Why this should be first | Suggested approach proposals to create first |
|:---:|---|---|---|
| 1 | `/requirements/public-api-intrusion-attempts-blocked` | Internet-facing attack surface, explicit blocking/latency/audit SLIs, direct business and incident risk. | `Rate Limiting`, `API Gateway`, `Intrusion Detection`, `Restrict Login Attempts` |
| 2 | `/requirements/personal-data-lifecycle-protection` | Strong regulatory and breach impact (GDPR/CCPA), cross-cutting controls (crypto, retention, audit, deletion). | `Encryption at Rest + in Transit`, `Secret Management`, `Audit Logging`, `Revoke Access + Credential Rotation` |
| 3 | `/requirements/confidentiality-by-multitenance` | Cross-tenant data leak is a high-severity trust/compliance failure in multi-tenant systems. | `Separation of Entities (Isolation)`, `Fine-Grained Authorization (RBAC/ABAC)`, `Zero Trust Architecture` |
| 4 | `/requirements/adding-entity-type-within-5-days` | Directly targets maintainability/flexibility (currently under-covered by published approaches), with concrete architecture fitness metrics. | `Modular Architecture / Bounded Contexts`, `Hexagonal Architecture (Ports & Adapters)`, `Dependency Injection` |
| 5 | `/requirements/fleet-ota-updates-with-safe-rollback` | High operational and safety impact in distributed IoT fleets; strong measurable rollout/rollback criteria. | `Progressive Rollouts`, `Explicit Rollback Strategy`, `Health Checks + Auto-Healing`, `Scripted Deployment Commands` |

## Near-Miss Candidates

- `/requirements/safety-requirements-traceable-to-evidence` (excellent candidate for `Compliance as Code` / `Executable Assertions` / `Automated Test Pyramid`)
- `/requirements/avoid-common-vulnerabilities` (broad baseline security hardening requirement)
- `/requirements/tamper-evident-digital-signatures` (high-value integrity and non-repudiation scenario)
