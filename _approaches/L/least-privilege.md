---
layout: approach
title: "Least Privilege"
tags: [secure]
supported_qualities: [security, confidentiality, integrity, access-control, compliance]
supported_qualities_notes:
  security: Reducing the permissions available to any actor or process limits the damage an attacker can do after compromising that actor.
  confidentiality: Actors can only read data they are explicitly authorized for, preventing inadvertent or malicious disclosure.
  integrity: Write permissions are scoped narrowly, so a compromised process cannot modify resources outside its designated scope.
  access-control: Every actor operates with the minimum set of permissions required for its function, enforced at runtime.
  compliance: Regulatory frameworks (GDPR, PCI DSS, SOX) require demonstrable access restriction as a baseline control.
tradeoffs: [usability, operability, code-complexity]
tradeoff_notes:
  usability: Users encounter permission-denied errors more frequently when permissions are tightly scoped, increasing friction and support requests.
  operability: Managing many fine-grained permissions, policies, and exception paths across environments requires dedicated tooling and regular access reviews.
  code-complexity: Application code must propagate and check scoped credentials at every boundary rather than relying on broad service accounts.
related_requirements: [access-control-is-enforced, employee-attempts-to-modify-pay-rate, governance-policy-enforcement]
related_requirements_notes:
  access-control-is-enforced: Least privilege is the design principle behind enforced access control — every actor or workload gets only the permissions required for approved actions.
  employee-attempts-to-modify-pay-rate: Demonstrates a scenario where narrow write permissions prevent unauthorized data modification.
  governance-policy-enforcement: Governance policies are enforceable only when permissions are scoped tightly enough to match policy boundaries.
intent: "Grant every actor and process only the minimum permissions required for its specific function, so that a compromise or error in one part of the system cannot escalate into broader unauthorized access."
mechanism: "Assign permissions and policies based on the specific actions each actor or process needs to perform; default to deny-all and grant explicit, scoped permissions; enforce at every trust boundary — API gateway, service-to-service call, database connection, filesystem access — and review regularly to revoke permissions that are no longer needed."
applicability: "Use as a foundational security principle in any system that handles sensitive data or exposes operations with significant impact. Particularly critical in multi-tenant systems, systems under regulatory oversight, and environments with many service-to-service integrations. The principle applies at every layer: user roles, service accounts, database grants, cloud IAM policies, and container security contexts."
permalink: /approaches/least-privilege
---

Least privilege is one of the oldest and most fundamental security design principles, formalized by Saltzer and Schroeder in 1975. The idea is simple: every actor — human user, service account, background job, container — should operate with the smallest set of permissions that allows it to do its job, and no more. If a web server only needs to read from a database, it should not have write access. If a billing service only needs to call the payment API, it should not be able to reach the user-management API.

The principle limits blast radius. When an attacker compromises a component, they inherit that component's permissions. Broad permissions mean broad damage; narrow permissions mean the attacker hits a wall quickly. The same logic applies to accidental errors: a misconfigured job with write access to all tables can corrupt production data, while one with write access to only its own table cannot. Authentication tells the system who is acting; least privilege constrains what that verified actor may do.

## How It Works

- Start from a deny-all baseline: no actor has any permission until explicitly granted.
- Define permissions and policies based on the specific actions each actor or workload needs (read, write, execute, admin) scoped to specific resources (tables, endpoints, buckets, queues).
- Use simple role or group assignments only for stable baseline grants. When access depends on tenant, ownership, geography, time, or workflow state, move that decision to [Fine-Grained Authorization (RBAC/ABAC)](/approaches/fine-grained-authorization) rather than encoding endless exceptions into broad roles.
- Enforce permissions at every trust boundary: API gateway, service mesh, database connection, filesystem, cloud IAM, and container security context.
- Use short-lived, scoped credentials rather than long-lived, broad ones — this is where Least Privilege intersects with [Secret Management](/approaches/secret-management).
- Use [Just-In-Time (JIT) access](https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure) for rare administrative privileges so elevation expires automatically instead of becoming a standing entitlement.
- Conduct regular access reviews to identify and revoke permissions that are no longer needed (role drift, offboarded employees, decommissioned services).
- Audit permission usage: log which permissions are actually exercised, and flag grants that go unused over a threshold period.

## Failure Modes

- Overly broad "convenience" roles or groups (for example `admin`, `power-user`) accumulate because teams find narrower grants too slow to provision.
- Service accounts share credentials across multiple services, making it impossible to scope permissions per service and creating a single point of compromise.
- Permission drift: grants grow over time as new permissions are added for new features but old permissions are never revoked.
- Break-glass procedures (emergency escalation) are used routinely instead of exceptionally, bypassing the principle entirely.
- Enforcement gaps: permissions are checked at the API gateway but not at the database or filesystem level, allowing a compromised service to access resources directly.

## Verification

- Coverage: 100% of privileged operations have automated tests with at least one allowed path and one denied path in CI.
- Review and cleanup: 100% of privileged human and workload identities are recertified at the defined interval (for example quarterly), and unused high-risk permissions are removed within the agreed window (for example <= 30 days after review).
- Revocation: removal of a privileged grant takes effect within the required window (for example <= 15 min for central IAM, <= 60 s for session-bound application permissions).
- Escalation test: for each privileged actor type, attempt an operation outside its granted scope and verify it is denied with an appropriate error and a searchable audit log entry.
- Blast-radius simulation: compromise a service account in a test environment and verify it cannot access resources outside its designated scope, including direct database, bucket, and queue paths.
- Break-glass audit: every emergency escalation has an approved ticket, an automatic expiry (for example <= 4 h), and a completed review within the required follow-up window (for example <= 2 business days).

## References

- [Saltzer & Schroeder: The Protection of Information in Computer Systems (1975)](https://doi.org/10.1109/PROC.1975.9939) — the original formulation of the least-privilege principle
- [OWASP Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/) — access control verification requirements
- [NIST SP 800-53: Security and Privacy Controls](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final) — AC-6 (Least Privilege) control family
- [Software Architecture in Practice](https://www.sei.cmu.edu/library/software-architecture-in-practice-fourth-edition/) — Bass, Clements & Kazman ([full citation](/references/#bass2021software))
