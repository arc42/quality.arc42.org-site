---
layout: approach
title: "Secret Management"
tags: [secure, operable]
supported_qualities: [security, confidentiality, access-control, auditability, compliance, operability]
supported_qualities_notes:
  security: Eliminates secret sprawl by centralizing sensitive credentials in a hardened, network-isolated perimeter rather than scattered config.
  confidentiality: Secrets remain encrypted at rest and in transit, appearing in plaintext only within the memory space of the authorized consuming process.
  access-control: Fine-grained policies ensure that each service identity (e.g., K8s ServiceAccount, IAM role) accesses only the specific secrets required for its role.
  auditability: Every lifecycle event — creation, access, rotation, and revocation — is recorded in an immutable trail for forensic and compliance use.
  compliance: Automated rotation and centralized auditing fulfill mandatory technical controls for PCI DSS, SOC 2, and ISO 27001.
  operability: Decouples the secret lifecycle (rotation/updates) from application deployment, reducing manual toil and "expired credential" outages.
tradeoffs: [availability, latency, code-complexity]
tradeoff_notes:
  availability: The vault is a Tier-0 dependency; its failure can prevent service startup or renewal of dynamic credentials, potentially causing system-wide cascading outages.
  latency: Authenticating to the vault and fetching secrets at runtime adds overhead to cold starts and introduces latency spikes during periodic credential renewal.
  code-complexity: Developers must solve the "secret zero" bootstrap problem, manage token renewal lifecycles, and implement robust retry/fallback logic for vault transients.
related_requirements: [access-control-is-enforced, encrypted-storage, governance-policy-enforcement]
related_requirements_notes:
  access-control-is-enforced: Secret management enforces access control at the credential layer — only authorized identities receive the secrets they need.
  encrypted-storage: Vault-managed keys enable the encryption-at-rest controls that this requirement demands, while the vault itself requires encrypted backend storage.
  governance-policy-enforcement: Centralized secret policies and immutable audit trails demonstrate that governance controls over sensitive credentials are in place.
intent: "Eliminate secret sprawl by centralizing the storage, distribution, rotation, and revocation of sensitive credentials in a hardened, auditable vault using short-lived, identity-based tokens."
mechanism: "Store all secrets in a dedicated vault with encrypted storage and fine-grained access policies; bootstrap service access via trusted platform identities (OIDC, IAM, K8s) to solve the 'secret zero' problem; issue short-lived, scoped credentials at runtime via API or sidecar injection; automate rotation and revoke compromised credentials immediately; avoid persisting secrets in source code, images, or environment variables (which leak via /proc/self/environ and crash dumps)."
applicability: "Use in any system handling database passwords, API keys, TLS certificates, or encryption keys. Particularly critical in microservice architectures with high credential diversity. Avoid only in truly isolated, single-process systems where the operational risk of a Tier-0 vault dependency outweighs the risk of local, filesystem-protected secrets."
permalink: /approaches/secret-management
---

Secrets — database passwords, API keys, TLS certificates, encryption keys, OAuth client secrets — are the "keys to the kingdom." When secrets are scattered across config files, CI/CD pipelines, and source repositories (secret sprawl), they are impossible to inventory, rotate, or revoke. A single leaked credential can escalate into a full breach.

Secret management centralizes the entire credential lifecycle — creation, storage, distribution, rotation, and revocation — in a hardened vault. Services obtain credentials at runtime through authenticated, audited calls rather than reading static config. The vault enforces [Least Privilege](/approaches/least-privilege) by ensuring each service identity receives only the secrets it needs, scoped to its role, with a short time-to-live.

## How It Works

- **Centralized Vaulting**: Store all secrets in a dedicated vault (HashiCorp Vault, AWS Secrets Manager, etc.) with an encrypted-at-rest backend.
- **Identity-Based Bootstrapping**: Solve the "secret zero" problem (authenticating to the vault) by using trusted platform identities—such as Kubernetes ServiceAccounts, AWS IAM Roles, or OIDC tokens—rather than static, hardcoded vault tokens.
- **Access Policies**: Define fine-grained paths (e.g., `secret/data/payment-service/*`) and map them to specific service identities, ensuring strict isolation between components.
- **Runtime Injection**: Deliver secrets at runtime via vault APIs, sidecar proxies (e.g., vault-agent), or CSI drivers. Avoid environment variables where possible, as they are often logged by monitoring agents or visible in process listings (`/proc`).
- **Dynamic Secrets & Short TTLs**: Prefer dynamic secrets generated on-the-fly (e.g., a database user created for 4 hours) over long-lived static passwords.
- **Automated Rotation**: Configure the vault to automatically rotate credentials on a schedule, updating the target system (e.g., changing the DB password) and notifying or restarting the consuming application if necessary.
- **Master Key Management**: Secure the vault's "root of trust" using Shamir’s Secret Sharing or hardware/cloud-based auto-unseal (KMS/HSM) to prevent a single administrator from compromising or losing the entire secret store.

## Failure Modes

- **The Unseal Trap**: The vault is locked (sealed) after a restart and the unseal keys are missing or held by unavailable personnel, leading to prolonged downtime.
- **The Bootstrap Trap**: A service uses a hardcoded "initial" token to talk to the vault, which is then committed to git, defeating the purpose of the vault.
- **Insecure Backups**: The vault itself is secure, but its database backups are stored unencrypted or with weak access controls in an external bucket.
- **Environment Variable Leakage**: Secrets injected as environment variables leak through diagnostic logs, crash dumps, child processes, or `/proc/self/environ`.
- **Renewal Failure**: An application fails to renew its vault token or dynamic secret lease, resulting in a sudden "Unauthorized" error after hours of successful operation.
- **Circular Dependencies**: The logging or monitoring system requires secrets from the vault to function, but the vault cannot start or log its errors because the logging system is down.

## Verification

- **Secret-Sprawl Scan**: Use automated tools (truffleHog, gitleaks) to verify zero plaintext secrets exist in repositories, container images, or CI/CD logs.
- **Identity Validation**: Audit vault policies to ensure service A cannot, under any circumstances, read secrets belonging to service B.
- **Rotation Validity**: Trigger a manual rotation and verify that (1) the new secret works, and (2) the **old secret is immediately revoked** and no longer functions.
- **Bootstrap Audit**: Verify that services authenticate to the vault using platform-provided identities (K8s, IAM) rather than static files or environment variables.
- **Availability Simulation**: Test the "Tier-0 failure": stop the vault and verify which services fail immediately (cold start) vs. which can continue temporarily with cached/leased secrets.
- **Backup Integrity**: Perform a "fire drill" restore from a vault backup to verify that the root-of-trust (unseal/master keys) can correctly decrypt the data.

## Variants and Related Tactics

- **Dynamic Secrets**: On-demand credential generation that eliminates the need to "store" a password at all.
- **Kubernetes External Secrets**: Operators that sync vault secrets into native K8s Secrets for legacy applications.
- [Encryption at Rest + in Transit](/approaches/encryption-at-rest-and-in-transit) depends on secret management for the "master keys" used in envelope encryption.
- [Least Privilege](/approaches/least-privilege) is applied here at the credential layer via path-based scoping.
- **Hardware Security Modules (HSM)**: Providing a physical "root of trust" for the vault's master keys.

## References

- [NIST SP 800-53: Security and Privacy Controls](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final) — IA-5 (Authenticator Management), SC-12 (Cryptographic Key Establishment and Management)
- [OWASP Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/) — V6 (Cryptography) and V2.10 (Service Authentication)
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Software Architecture in Practice](https://www.sei.cmu.edu/library/software-architecture-in-practice-fourth-edition/) — Bass, Clements & Kazman ([full citation](/references/#bass2021software))
