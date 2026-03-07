---
layout: approach
title: "Fine-Grained Authorization (RBAC/ABAC)"
tags: [secure]
supported_qualities: [security, access-control, confidentiality, integrity, compliance, policy-enforcement, auditability]
supported_qualities_notes:
  security: Fine-grained authorization is a core security control that limits what authenticated actors can do, reducing the impact of compromised accounts and insider threats.
  access-control: Decides permission per actor, action, resource, and context instead of relying on coarse endpoint visibility or UI hiding.
  confidentiality: Prevents users and services from reading records outside their tenant, ownership scope, clearance, or purpose of use.
  integrity: Blocks unauthorized state changes such as modifying salaries, approvals, or regulated records without the required entitlements.
  compliance: Regulatory frameworks (GDPR, PCI DSS, HIPAA, SOX) require demonstrable, auditable access restrictions at the data and action level.
  policy-enforcement: Central policy definitions can be evaluated consistently across APIs, services, and data-access paths.
  auditability: Decision logs can record who attempted which action on which resource, under which policy, and with what result.
tradeoffs: [code-complexity, operability, latency, usability]
tradeoff_notes:
  code-complexity: Action and resource modeling, policy composition, exception handling, and authorization tests grow quickly as the domain expands.
  operability: Roles, attributes, policy versions, and attribute sources need ownership, rollout discipline, monitoring, and regular review.
  latency: Remote policy evaluation and attribute lookups add per-request overhead unless bounded by careful caching and freshness rules.
  usability: Legitimate work is blocked when roles or attributes are incomplete, stale, or modeled too narrowly.
related_requirements: [access-control-is-enforced, employee-attempts-to-modify-pay-rate, confidentiality-by-multitenance, governance-policy-enforcement]
related_requirements_notes:
  access-control-is-enforced: Directly addresses per-role and per-data-classification access decisions, revocation, and access-violation handling.
  employee-attempts-to-modify-pay-rate: Prevents unauthorized salary changes by checking write permission on the specific action and record.
  confidentiality-by-multitenance: ABAC-style tenant, ownership, and classification attributes can enforce tenant isolation when every access path applies the same policy and downstream query constraints.
  governance-policy-enforcement: Central policy distribution and consistent enforcement are necessary when authorization rules must be applied across many services.
intent: "Authorize each request against explicit policies for actor, action, resource, and context so that only permitted operations are allowed, even inside shared, multi-tenant, or highly regulated systems."
mechanism: "Model permissions as action-resource policies, assign stable baseline entitlements via roles where appropriate, refine decisions with attributes such as tenant, ownership, classification, region, time, device state, or workflow status, evaluate at every business operation with deny-by-default semantics, and log the policy, subject, resource, and outcome for audit."
applicability: "Use when coarse roles alone are insufficient, especially in multi-tenant products, delegated administration, approval workflows, regulated data access, and systems with record-level or context-dependent permissions. Prefer RBAC alone when the permission model is stable and simple; introduce ABAC when context materially changes access and role explosion would otherwise dominate."
permalink: /approaches/fine-grained-authorization
---

Fine-grained authorization answers a narrower question than authentication: not who are you, but may you perform this action on this resource now? RBAC groups permissions into stable business roles; ABAC adds resource and context rules such as tenant, ownership, data classification, geography, time window, or workflow state. In practice, robust systems usually combine both.

This approach must be enforced at the business boundary, not only in the UI or at the edge. Hidden buttons are not authorization, and a gateway-only check is insufficient if internal services or data stores can still be reached through other paths.

## How It Works

- Define protected resources and actions explicitly, for example `invoice:read`, `invoice:approve`, `salary:update`, not just "access this endpoint".
- Use RBAC for stable job-function entitlements and ABAC for constraints that depend on subject, resource, or environment attributes.
- Evaluate authorization for every protected operation and constrain the downstream query or command with the same policy decision so that record filtering matches the allow/deny result.
- Fail closed: if the policy is missing, an attribute cannot be resolved, or the policy engine is unavailable, the protected action is denied.
- Version policies, assign each decision a policy identifier, and log subject, action, resource, result, and reason so denials and overrides are explainable.

## Failure Modes

- Authorization is enforced only in the UI or API gateway, while internal services or direct data paths bypass the same policy.
- RBAC becomes a large set of special-case roles, or ABAC rules are scattered in application code, producing inconsistent semantics between services.
- Attribute freshness is not controlled, so stale tenant, employment, or approval-state data causes over-permit or over-deny decisions.
- The API decision says "allowed", but the underlying query is not filtered by tenant or ownership, leaking other records through direct object references.
- Policy evaluation fails open under timeout or dependency failure, turning a control-plane outage into unauthorized access.

## Verification

- Coverage: 100% of non-public business operations have explicit authorization tests with at least one allow case and one deny case in CI.
- Isolation: in security tests, 100% of cross-tenant and out-of-scope record-access attempts are denied, and no forbidden record fields are returned in error payloads or partial responses.
- Revocation and policy propagation: critical role revocations take effect within the required window (for example <= 60 s), and centrally managed policy updates reach all enforcement points within the agreed window (for example <= 15 min).
- Decision latency: p95 authorization evaluation stays within the allocated request budget (for example <= 20 ms local, or <= 75 ms including remote policy and attribute calls) under representative load.
- Fail-closed drill: disconnect the policy engine or an authoritative attribute source and verify protected operations deny rather than allow, with an alert and audit entry for each failure mode.
- Audit completeness: 100% of denied requests and privileged grants include subject, action, resource identifier, policy identifier, result, and timestamp in searchable logs.

## Variants, Related Tactics, and References

- RBAC-only is the simpler variant: sufficient when the permission model is stable, the number of roles is manageable, and context does not materially change access decisions.
- Relationship-Based Access Control (ReBAC), as pioneered by Google Zanzibar, models authorization as graph relationships (owner-of, member-of, viewer-of) and evaluates access by traversing the graph — well suited for document sharing and social-graph-style permissions.
- Policy-as-code engines (Open Policy Agent/Rego, AWS Cedar, Casbin) externalize authorization logic from application code into declarative, testable, versionable policies.
- [Least Privilege](/approaches/least-privilege) is the design principle that fine-grained authorization implements: every actor gets only the permissions required for its function.
- [Strong Authentication (MFA / OIDC)](/approaches/strong-authentication) provides the verified identity that authorization decisions depend on — authorization is only as trustworthy as the identity signal it receives.
- [Input Sanitization / Output Encoding](/approaches/input-sanitization-output-encoding) reduces injection paths that can subvert authorization-sensitive query logic, but it does not replace object-level authorization checks.

References:

- [NIST Model for Role-Based Access Control: Toward a Unified Standard](https://www.nist.gov/publications/nist-model-role-based-access-control-towards-unified-standard)
- [NIST SP 800-162: Guide to Attribute Based Access Control (ABAC) Definition and Considerations](https://csrc.nist.gov/pubs/sp/800/162/upd2/final)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [Zanzibar: Google's Consistent, Global Authorization System](https://www.usenix.org/conference/atc19/presentation/pang)
- [Software Architecture in Practice](https://www.sei.cmu.edu/library/software-architecture-in-practice-fourth-edition/) — Bass, Clements & Kazman ([full citation](/references/#bass2021software))
