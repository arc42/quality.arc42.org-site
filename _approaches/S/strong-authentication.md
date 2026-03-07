---
layout: approach
title: "Strong Authentication (MFA / OIDC)"
tags: [secure]
supported_qualities: [security, authenticity, access-control, accountability, non-repudiation, compliance]
supported_qualities_notes:
  security: Multi-factor and phishing-resistant authentication prevents credential-based attacks — the most common initial access vector in breaches.
  authenticity: The system can verify with high confidence that an actor is who they claim to be, not an impersonator with stolen credentials.
  access-control: Reliable identity verification is the prerequisite for all access-control decisions — [Least Privilege](/approaches/least-privilege) only works if the identity is trustworthy.
  accountability: Actions can be attributed to a verified identity rather than a shared or spoofed account.
  non-repudiation: Strong authentication binds actions to a verified identity, making it difficult for actors to deny having performed them.
  compliance: Regulatory frameworks (PCI DSS, NIST 800-63, GDPR for sensitive processing) require multi-factor or phishing-resistant authentication for privileged access.
tradeoffs: [usability, availability, operability]
tradeoff_notes:
  usability: Additional authentication steps (second factor, biometric, redirect to identity provider) add friction to every login and can frustrate users.
  availability: Dependency on an external identity provider (OIDC issuer, SMS gateway, push-notification service) introduces a single point of failure for authentication.
  operability: Operating an identity provider or integrating with external ones requires ongoing maintenance of OIDC configurations, certificate rotation, and MFA device lifecycle management.
related_requirements: [only-authenticated-users-can-access, access-control-is-enforced, access-control-via-sso, governance-policy-enforcement]
related_requirements_notes:
  only-authenticated-users-can-access: Directly requires that every data access is gated behind authentication.
  access-control-is-enforced: Access control decisions depend on a trustworthy identity — strong authentication is the foundation.
  access-control-via-sso: SSO via OIDC centralizes authentication and simplifies the user experience while maintaining strong identity verification.
  governance-policy-enforcement: Authentication policies (MFA required for admin, session timeout, device trust) are governance controls that must be enforceable and auditable.
intent: "Verify the identity of every actor — human user, service, or device — with sufficient assurance that credential-based attacks (phishing, credential stuffing, brute force) cannot succeed, providing a trustworthy foundation for all downstream access-control decisions."
mechanism: "Authenticate actors using at least two independent factors (knowledge, possession, inherence) or a phishing-resistant protocol (FIDO2/WebAuthn, mutual TLS); centralize identity verification through an OIDC-compliant identity provider that issues short-lived, signed tokens; enforce authentication at every trust boundary and re-authenticate for sensitive operations."
applicability: "Use for any system that distinguishes between actors and grants differentiated access — which is nearly every system. Multi-factor is mandatory for privileged access (admin, infrastructure, financial). Phishing-resistant methods (FIDO2/WebAuthn) are preferred for high-value targets. Single-factor password authentication is acceptable only for low-risk, non-sensitive contexts. Service-to-service authentication should use mutual TLS or signed JWT tokens, not shared secrets."
permalink: /approaches/strong-authentication
---

Authentication answers the question "who is this actor?" before the system decides what that actor is allowed to do. Passwords alone are insufficient — they are phished, stuffed from breach databases, guessed, and shared. Strong authentication raises the bar by requiring a second independent factor (something the user has or is) or by using a protocol that is inherently resistant to phishing (FIDO2/WebAuthn, mutual TLS).

Centralizing authentication through an OIDC-compliant identity provider (IdP) gives every application in the ecosystem a consistent, auditable identity signal without each application implementing its own credential storage and verification logic. The IdP issues short-lived, signed tokens (JWTs) that downstream services can verify independently, decoupling identity verification from session management.

## How It Works

- Centralize user authentication through an OIDC-compliant identity provider that handles credential verification, MFA enforcement, and token issuance.
- Require at least two independent factors for all privileged access: password + TOTP, password + push notification, or (preferred) FIDO2/WebAuthn hardware key.
- Issue short-lived, signed tokens (access tokens, ID tokens) with defined scopes and audience claims; services verify tokens locally using the IdP's published signing keys (JWKS).
- Enforce re-authentication for sensitive operations (privilege escalation, financial transactions, security setting changes) even within an active session.
- For service-to-service authentication, use mutual TLS or OAuth 2.0 client credentials with [Secret Management](/approaches/secret-management)-issued client secrets and short-lived tokens.
- Monitor authentication events: failed logins, MFA bypasses, token-refresh anomalies, and geographic or device changes — feed these into intrusion detection.
- [Least Privilege](/approaches/least-privilege) takes over after authentication: the verified identity determines what the actor can access.

## Failure Modes

- MFA fatigue: attackers bombard a user with push notifications until the user approves one out of frustration — mitigated by number-matching or FIDO2.
- Fallback to password-only: MFA is configured but a "skip for now" or "remember this device for 90 days" escape hatch weakens the second factor.
- Token lifetime too long: access tokens that live for hours or days reduce the value of token revocation and increase the window for stolen-token abuse.
- Identity provider outage: if the IdP is unreachable, all authentication fails; cached tokens may continue to work but new logins are impossible.
- Service-to-service authentication using long-lived shared secrets instead of short-lived tokens — equivalent to a shared password with no rotation.

## Verification

- Phishing simulation: send a credential-harvesting page to test users and verify that FIDO2/WebAuthn users cannot be phished (the authenticator will not respond to a different origin).
- MFA enforcement: attempt login to privileged resources with valid password only and verify that access is denied until the second factor is provided.
- Token lifetime: inspect issued tokens and verify that access-token lifetime does not exceed the defined maximum (for example `15 min` for access tokens, `8 h` for refresh tokens).
- Brute-force resistance: send 100 failed login attempts for a single account and verify that rate limiting or account lockout engages within the configured threshold (for example after 5 attempts).
- IdP failover: simulate IdP unavailability and verify that existing sessions remain valid (cached token verification) while new logins fail fast with a clear error.

## Variants and Related Tactics

- FIDO2/WebAuthn eliminates passwords entirely — the authenticator (hardware key or platform biometric) performs a challenge-response that is bound to the origin, making phishing structurally impossible.
- Mutual TLS (mTLS) provides certificate-based authentication for service-to-service communication, combining identity verification with [Encryption at Rest + in Transit](/approaches/encryption-at-rest-and-in-transit).
- Step-up authentication dynamically requires a stronger factor for high-risk operations based on transaction risk scoring.
- [Least Privilege](/approaches/least-privilege) depends on strong authentication: permissions are only meaningful when the identity claiming them is verified.
- [Secret Management](/approaches/secret-management) stores and rotates the OIDC client secrets, signing keys, and mTLS certificates that the authentication infrastructure depends on.
- [Input Sanitization / Output Encoding](/approaches/input-sanitization-output-encoding) prevents XSS-based session theft that could bypass even strong authentication.

## References

- [NIST SP 800-63B: Digital Identity Guidelines — Authentication and Lifecycle Management](https://pages.nist.gov/800-63-4/sp800-63b.html) — the authoritative framework for authentication assurance levels (AAL1–AAL3)
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html) — the identity layer on top of OAuth 2.0
- [FIDO Alliance: WebAuthn Specification](https://fidoalliance.org/fido2/fido2-web-authentication-webauthn/) — phishing-resistant, passwordless authentication
- [OWASP Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/) — V2 (Authentication)
- [Software Architecture in Practice](https://www.sei.cmu.edu/library/software-architecture-in-practice-fourth-edition/) — Bass, Clements & Kazman ([full citation](/references/#bass2021software))
