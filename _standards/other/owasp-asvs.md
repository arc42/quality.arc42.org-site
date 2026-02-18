---
layout: page_standard
title: "OWASP Application Security Verification Standard (ASVS)"
standard_id: owaspasvs
shortname: "OWASP ASVS"
categories: [security]
permalink: /standards/owasp-asvs
---

## OWASP Application Security Verification Standard (ASVS)

The OWASP Application Security Verification Standard (ASVS) is an open framework of security requirements for designing, developing, and testing modern web applications and APIs.
Maintained by the Open Worldwide Application Security Project (OWASP) as a Flagship Project and licensed under Creative Commons CC BY-SA 4.0, version 5.0.0 was released in May 2025.
ASVS fills a gap that general security standards (such as [ISO/IEC 27001](/standards/iso-27001)) leave open: instead of organisational controls, it provides concrete, requirement-level guidance that development teams can use directly in code reviews, testing, and procurement.

### Version History

- **v1.0** (2008): Initial release, focused on web application testing
- **v4.0** (2019), **v4.0.3** (2021): Major restructuring; introduced a tiered level model and broadened API coverage
- **v5.0.0** (May 2025): Modernisation milestone — 17 chapters, revised level model, expanded OAuth/OIDC and WebRTC coverage; released at Global AppSec EU Barcelona

## Scope and Coverage

ASVS applies to web applications, web APIs, and web services of all types and scales.
Requirements are identified in the format `<chapter>.<section>.<requirement>` and are recommended to be cited including the version number (e.g., `v5.0.0-6.2.1`) to avoid ambiguity across releases.

### Verification Levels

ASVS defines three cumulative security levels to let organisations calibrate depth of verification to risk:

| Level | Share of Requirements | Intent |
|:------|:---------------------|:-------|
| **L1 — Basic** | ~20% | Critical first-layer defences against the most commonly exploited vulnerabilities; appropriate as a minimum baseline for any web application |
| **L2 — Standard** | ~50% | Protections against less common or more complex attack patterns; recommended for most business applications handling sensitive data |
| **L3 — Advanced** | ~30% | Defence-in-depth controls for the highest-assurance contexts (financial, healthcare, critical infrastructure) |

Levels are cumulative: L2 includes all L1 requirements, L3 includes all L2 requirements.

## Chapter Structure

ASVS 5.0.0 organises its requirements across 17 chapters:

| Chapter | Topic |
|:--------|:------|
| **V1** | Encoding and Sanitization |
| **V2** | Validation and Business Logic |
| **V3** | Web Frontend Security |
| **V4** | API and Web Service |
| **V5** | File Handling |
| **V6** | Authentication |
| **V7** | Session Management |
| **V8** | Authorization |
| **V9** | Self-contained Tokens |
| **V10** | OAuth and OIDC |
| **V11** | Cryptography |
| **V12** | Secure Communication |
| **V13** | Configuration |
| **V14** | Data Protection |
| **V15** | Secure Coding and Architecture |
| **V16** | Security Logging and Error Handling |
| **V17** | WebRTC |

## Use Cases

ASVS is designed to serve multiple audiences with the same artefact:

- **Developers and architects** use it to define security requirements during design and to guide secure coding practices
- **Testers and security engineers** use it as a blueprint for penetration testing checklists and automated test suites
- **Procurement and compliance teams** reference it in RFPs and contracts to specify minimum acceptable security levels for custom-developed software

## Relationship to Other Standards

ASVS is complementary to, not a replacement for, broader frameworks:

- **[ISO/IEC 27001](/standards/iso-27001)**: Defines organisational information security management; ASVS provides the application-level technical requirements that ISO 27001 does not specify.
- **[PCI DSS](/standards/pci-dss)**: ASVS L2 covers a substantial portion of PCI DSS web application requirements (Requirement 6); teams can cite ASVS compliance as evidence within PCI DSS assessments.
- **[ISO/IEC 15408 (Common Criteria)](/standards/iso-15408)**: Both focus on assurance; ASVS is faster to adopt for web contexts, while Common Criteria is used for formal product certification.

## Quality Attributes Addressed

| Quality Attribute | Relevance in OWASP ASVS |
|:--- |:--- |
| **[Security](/qualities/security)** | Core focus of the entire standard; all 17 chapters collectively define what it means for a web application to be secure. |
| **[Access Control](/qualities/access-control)** | V8 (Authorization) specifies requirements for enforcing least-privilege, preventing privilege escalation, and protecting resource boundaries. |
| **[Authenticity](/qualities/authenticity)** | V6 (Authentication), V9 (Self-contained Tokens), and V10 (OAuth and OIDC) define how systems must verify the identity of users and services. |
| **[Confidentiality](/qualities/confidentiality)** | V12 (Secure Communication) and V14 (Data Protection) require encryption in transit, secure storage, and minimisation of sensitive data exposure. |
| **[Data Integrity](/qualities/data-integrity)** | V1 (Encoding and Sanitization) and V11 (Cryptography) mandate that data is protected from tampering through input validation and cryptographic integrity controls. |
| **[Non-Repudiation](/qualities/non-repudiation)** | V16 (Security Logging and Error Handling) requires tamper-evident, attributable audit logs that make actions traceable to authenticated identities. |
| **[Intrusion Prevention](/qualities/intrusion-prevention)** | V1 (Encoding and Sanitization) and V2 (Validation and Business Logic) address injection, XSS, and business-logic attacks — the primary application-layer intrusion vectors. |
| **[Intrusion Detection](/qualities/intrusion-detection)** | V16 requires logging of security-relevant events at sufficient fidelity to detect and investigate attacks after the fact. |
| **[Auditability](/qualities/auditability)** | V16 specifies what must be logged, the required log content, and protection of log integrity to support forensic investigations and compliance audits. |
| **[Vulnerability](/qualities/vulnerability)** | The ASVS level model directly operationalises vulnerability risk: L1 addresses high-severity, easily exploitable weaknesses; L3 addresses sophisticated, low-probability threats. |
| **[Resistance](/qualities/resistance)** | V2 (Validation and Business Logic), V3 (Web Frontend Security), and V4 (API and Web Service) define how applications must resist abuse, denial-of-service, and data exfiltration patterns. |

## References

### Official Sources

- [OWASP ASVS Project Page](https://owasp.org/www-project-application-security-verification-standard/) — project overview, downloads, and translations
- [OWASP ASVS GitHub Repository](https://github.com/OWASP/ASVS) — full source, version history, and issue tracker
- [ASVS 5.0.0 Release — GitHub](https://github.com/OWASP/ASVS/releases/tag/v5.0.0) — release notes for the current version

### Related Standards and Guidance

- [OWASP Testing Guide (OTG)](https://owasp.org/www-project-web-security-testing-guide/) — companion testing methodology; ASVS requirements map to OTG test cases
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) — risk-ranked list of the most critical web vulnerabilities; ASVS L1 addresses all Top 10 categories
