---
layout: approach
title: "Encryption at Rest + in Transit"
tags: [secure]
supported_qualities: [confidentiality, data-integrity, data-protection, privacy, compliance]
supported_qualities_notes:
  confidentiality: Data is unreadable without the corresponding decryption key, whether stored on disk or intercepted on the network.
  data-integrity: Authenticated encryption (AEAD) detects tampering — any modification to ciphertext or metadata causes decryption to fail.
  data-protection: Cryptographic protection is a primary technical control for safeguarding personal and sensitive data at every stage of its lifecycle.
  privacy: Encryption limits exposure of personal data to authorized processors, supporting data-protection-by-design requirements.
  compliance: Regulatory frameworks (GDPR, PCI DSS, HIPAA) mandate or strongly recommend encryption as a baseline control for sensitive data.
tradeoffs: [performance, operability, code-complexity]
tradeoff_notes:
  performance: On modern CPUs with hardware AES acceleration (AES-NI), raw crypto overhead is often negligible; the real performance cost comes from TLS handshake latency on short-lived connections and from re-encryption operations during key rotation on large datasets.
  operability: Key lifecycle management — generation, distribution, rotation, revocation, and disaster recovery of keys — adds significant operational complexity.
  code-complexity: Application code must handle key references, envelope encryption, and graceful re-encryption during key rotation without downtime.
related_requirements: [encrypted-storage, zero-knowledge-data-storage, personal-data-lifecycle-protection]
related_requirements_notes:
  encrypted-storage: Directly requires that stored data is cryptographically protected.
  zero-knowledge-data-storage: Client-side or customer-controlled keys build on encryption, but generic server-side encryption alone is not sufficient for true zero-knowledge storage.
  personal-data-lifecycle-protection: Encryption is a key technical measure for protecting personal data throughout its lifecycle.
intent: "Protect data confidentiality and integrity by applying cryptographic protection both when data is stored (at rest) and when it moves between components (in transit), ensuring that unauthorized access to storage media or network traffic does not expose plaintext."
mechanism: "Encrypt data at rest using storage-level, database-level, or application-level encryption with current, well-vetted algorithms and keys managed through a dedicated key-management system; encrypt data in transit using TLS 1.2+ with strong configurations; implement automated key rotation on a defined schedule and support re-encryption of stored data without downtime where the storage mechanism requires it."
applicability: "Use for any data classified as sensitive, personal, financial, or regulated — the default should be to encrypt rather than to justify why encryption is needed. Avoid only for data that is genuinely public and where the performance overhead is prohibitive and measurably impactful (for example, high-throughput video streaming of public content)."
permalink: /approaches/encryption-at-rest-and-in-transit
---

Encryption is the most fundamental technical control for data protection. At rest, it ensures that unauthorized access to storage media — a stolen disk, a leaked backup, a misconfigured cloud bucket — does not expose plaintext data. In transit, it ensures that network interception, man-in-the-middle attacks, or misconfigured routing cannot read or tamper with data moving between components.

The two complement each other: encrypting only in transit leaves data vulnerable on disk; encrypting only at rest leaves it vulnerable on the wire. A complete data-protection posture requires both, managed through a consistent key-management lifecycle.

## How It Works

- Classify data by sensitivity and regulatory requirements to determine encryption scope and key-management rigor.
- Encrypt at rest with mechanisms appropriate to the layer: application-level field or object encryption, database or tablespace encryption, or full-disk / volume encryption, each with current, approved algorithms and key sizes. Understand what each layer actually protects against: full-disk and volume encryption (e.g., AWS EBS, S3-SSE) primarily guards against physical media theft or unauthorized storage access, but does nothing once an attacker has a valid instance session or service account; application-level encryption protects data even from compromised infrastructure, at the cost of query and indexing complexity.
- Manage encryption keys through a dedicated key-management system (KMS) — never store keys alongside the data they protect.
- Use envelope encryption for large datasets: encrypt data with a data-encryption key (DEK), then encrypt the DEK with a key-encryption key (KEK) held in the KMS.
- Encrypt in transit using TLS 1.2 or 1.3 with strong cipher suites; disable legacy protocols (SSL, TLS 1.0/1.1) and weak ciphers.
- Rotate keys on a defined schedule and support re-encryption of stored data during rotation without downtime.
- [Secret Management](/approaches/secret-management) provides the infrastructure for storing and distributing encryption keys and TLS certificates securely.

## Failure Modes

- Keys stored alongside encrypted data (for example in the same database or the same cloud storage bucket) — a single breach exposes both.
- TLS termination at a load balancer with plaintext traffic on the internal network, exposing data to internal attackers or misconfigured logging.
- Key rotation deferred indefinitely because re-encryption is seen as too expensive or risky, leaving long-lived keys that accumulate exposure.
- Deprecated or weak transport settings remain enabled for compatibility, allowing downgrade or legacy-protocol exposure.
- Encryption applied selectively (for example database columns but not backups, or API traffic but not internal service-to-service calls) leaves gaps in coverage.
- Application-level field encryption breaks database indexes and query predicates — a `WHERE email = '...'` on ciphertext returns nothing, forcing teams to fall back to infrastructure-only encryption or adopt specialized techniques (blind indexes, searchable encryption) that add significant complexity.
- KMS key policies that are overly broad (for example granting decrypt to an entire account or role) make encryption cosmetic — any compromised principal with that role reads plaintext without ever touching the raw key.

## Verification

- At-rest verification: inspect raw storage artifacts (backup file, disk image, object-store dump) and confirm that primary sensitive payloads are unreadable without decryption keys, while explicitly checking for residual plaintext exposure in metadata, file names, indexes, or logs.
- In-transit verification: capture network traffic between components and confirm all service-to-service and client-to-service communication uses TLS 1.2+ with no fallback to plaintext.
- Key isolation: verify that encryption keys are not accessible from the same credentials or storage path as the encrypted data.
- Rotation test: trigger a key rotation and verify that new writes use the new key, existing data remains readable during the transition, and any required re-encryption completes within the defined window.
- TLS configuration audit: scan all TLS endpoints and verify no deprecated protocols (TLS 1.0/1.1) or broken/legacy cipher suites such as RC4 or 3DES are negotiable; if older CBC-based suites remain for compatibility, document and justify them explicitly with a retirement plan.

## Variants and Related Tactics

- **Client-Side Encryption**: Customer-managed keys move key custody to the data owner, enabling zero-knowledge architectures but shifting key-management burden to the client.
- **Mutual TLS (mTLS)**: Adds certificate-based peer authentication to transport encryption, ensuring both sides of the connection prove their identity.
- **Transparent Data Encryption (TDE)**: Database-level encryption protects storage media but not data after decryption in the database engine — an attacker with a valid database session reads plaintext.
- [Secret Management](/approaches/secret-management) handles key and certificate distribution and rotation.
- [Least Privilege](/approaches/least-privilege) restricts access to decryption keys through KMS policies.
- [Strong Authentication (MFA / OIDC)](/approaches/strong-authentication) ensures that only verified identities can request decryption keys from the KMS.

## References

- [NIST SP 800-53: Security and Privacy Controls](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final) — SC-12, SC-13, SC-28
- [OWASP Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/) — V6 and V9
- [NIST SP 800-57: Recommendation for Key Management](https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final) — key lifecycle, algorithms, and key lengths
- [RFC 9325: Recommendations for Secure Use of TLS and DTLS](https://www.rfc-editor.org/rfc/rfc9325.html)
- [Software Architecture in Practice](https://www.sei.cmu.edu/library/software-architecture-in-practice-fourth-edition/) — Bass, Clements & Kazman ([full citation](/references/#bass2021software))
