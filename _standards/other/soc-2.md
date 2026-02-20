---
layout: page_standard
title: "SOC 2 — Service Organization Control 2"
standard_id: soc2
shortname: "SOC 2"
categories: [security]
permalink: /standards/soc-2
---

## SOC 2: Service Organization Control 2

SOC 2 is an auditing framework developed by the American Institute of Certified Public Accountants (AICPA), jointly maintained with CIMA (Chartered Institute of Management Accountants).
It specifies criteria — the Trust Services Criteria (TSC) — against which an independent CPA firm evaluates and reports on the controls of a service organization relevant to security, availability, processing integrity, confidentiality, and privacy.

Unlike [ISO/IEC 27001](/standards/iso-27001), SOC 2 does not result in a certificate. It produces an **examination report** — attested by a licensed CPA — that service organizations share with customers and prospects to demonstrate the effectiveness of their controls over customer data.
The current criteria are the *2017 Trust Services Criteria (With Revised Points of Focus — 2022)*, codified as TSP Section 100. The AICPA updated the accompanying Description Criteria in July 2025; the TSC criteria themselves remain as revised in 2022.

### Brief History

- **2011**: AICPA introduced SOC 2 as a successor to SAS 70, purpose-built for cloud and technology service organizations
- **2017**: Major revision of the Trust Services Criteria; aligned criteria with the COSO 2013 internal control framework
- **2022**: Revised Points of Focus published to address evolving technologies, supply-chain risks, and cloud environments
- **July 2025**: Description Criteria updated (criteria themselves unchanged)

## Report Types

SOC 2 examinations are issued as one of two report types:

| Type | Scope | Typical use |
|:-----|:------|:------------|
| **Type I** | Controls are *designed* appropriately at a specific point in time | Initial market entry; demonstrates readiness |
| **Type II** | Controls *operated effectively* over an examination period — minimum 3 months, typically 6–12 months | Ongoing customer assurance; most procurement requirements |

Type II reports carry significantly more assurance because auditors test evidence of control operation across the entire period, not just design at a single date.

## Trust Services Criteria

The five TSC categories are:

| Category | Required? | What it covers |
|:---------|:----------|:---------------|
| **Security** | Always required | Protection of system assets against unauthorized access (logical and physical) |
| **Availability** | Optional | System is available for operation and use as committed |
| **Processing Integrity** | Optional | System processing is complete, valid, accurate, timely, and authorized |
| **Confidentiality** | Optional | Information designated as confidential is protected as committed |
| **Privacy** | Optional | Personal information is collected, used, retained, disclosed, and disposed of in conformity with commitments |

Security is the only mandatory category. The other four are selected based on the nature of the services provided.

### Security Criteria Structure (CC1–CC9)

The Security category is organized into nine Common Criteria (CC) groups, aligned with the five components of the COSO internal control framework:

| Criteria group | Focus area |
|:---------------|:-----------|
| **CC1** | Control Environment — commitment to integrity, competence, accountability |
| **CC2** | Communication and Information — internal and external communication of control responsibilities |
| **CC3** | Risk Assessment — identification and analysis of risks to achieving objectives |
| **CC4** | Monitoring Activities — ongoing evaluation of controls |
| **CC5** | Control Activities — policies and procedures to mitigate identified risks |
| **CC6** | Logical and Physical Access Controls — authentication, authorization, encryption, physical security |
| **CC7** | System Operations — detection and response to threats; incident management |
| **CC8** | Change Management — authorization, testing, and approval of system changes |
| **CC9** | Risk Mitigation — vendor management; business continuity |

## Relationship to Other Standards

| Standard | Relationship |
|:---------|:-------------|
| **[ISO/IEC 27001](/standards/iso-27001)** | ISO 27001 provides formal certification of an Information Security Management System; SOC 2 provides an independent attestation report. The two share approximately 96% of control objectives and are frequently pursued together. ISO 27001 is preferred for international markets; SOC 2 for US-dominated B2B contexts. |
| **[SOX](/standards/sox)** | SOC 2 emerged from the same assurance ecosystem as SOX (Sarbanes-Oxley); a SOC 1 report covers financial reporting controls relevant to SOX, while SOC 2 covers operational and security controls that are complementary. |
| **[PCI DSS](/standards/pci-dss)** | PCI DSS governs payment card data; many organizations pursue both. A SOC 2 report with Processing Integrity and Confidentiality in scope provides significant overlap with PCI DSS requirements. |
| **[NIST SP 800-53](/standards/nist-800-53)** | The AICPA publishes an official crosswalk between the Trust Services Criteria and NIST SP 800-53 controls, allowing organizations to map SOC 2 evidence directly to NIST requirements. |

## Quality Attributes Addressed

| Quality Attribute | Relevance in SOC 2 |
|:--- |:--- |
| **[Security](/qualities/security)** | The Security TSC (CC1–CC9) is the mandatory foundation of every SOC 2 report; it comprehensively evaluates the protection of systems and data against unauthorized access and threats. |
| **[Availability](/qualities/availability)** | The Availability TSC requires controls ensuring systems perform as committed; includes monitoring, incident response, and recovery objectives with defined RTO/RPO. |
| **[Confidentiality](/qualities/confidentiality)** | The Confidentiality TSC requires identification of confidential information and controls over its use, retention, and disposal, including encryption requirements. |
| **[Privacy](/qualities/privacy)** | The Privacy TSC maps to the AICPA's Generally Accepted Privacy Principles (GAPP) and aligns with many GDPR obligations for collection, use, and retention of personal information. |
| **[Access Control](/qualities/access-control)** | CC6 is one of the most control-dense criteria groups; it specifies authentication, authorization, role-based access, and physical access restriction requirements. |
| **[Auditability](/qualities/auditability)** | CC7 (System Operations) requires logging of security-relevant events, threat monitoring, and incident investigation capabilities sufficient for retrospective forensic analysis. |
| **[Accountability](/qualities/accountability)** | CC1 (Control Environment) establishes governance structures, assignment of authority, and individual accountability as the foundation for all other control criteria. |
| **[Non-Repudiation](/qualities/non-repudiation)** | CC7 logging requirements mandate that actions are attributable to authenticated identities, creating an immutable record for dispute resolution. |
## References

### Official AICPA Sources

- [SOC 2 — SOC for Service Organizations: Trust Services Criteria](https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2) — AICPA official overview page
- [2017 Trust Services Criteria (With Revised Points of Focus — 2022)](https://www.aicpa-cima.com/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022) — the current authoritative criteria document (free download, requires registration)

### Related Guidance

- [AICPA Trust Services Criteria crosswalk with NIST SP 800-53](https://www.nist.gov/itl/applied-cybersecurity/privacy-engineering/american-institute-certified-public-accountants-aicpa) — official NIST-hosted mapping between TSC and NIST controls
