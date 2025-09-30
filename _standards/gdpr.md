---
layout: page_standard
title: "GDPR - General Data Protection Regulation"
shortname: "GDPR"
standard_id: gdpr
categories: [privacy, security]
permalink: /standards/gdpr
---

## GDPR: General Data Protection Regulation (EU) 2016/679

The General Data Protection Regulation is a comprehensive data protection law in the European Union that came into effect on May 25, 2018. It regulates the processing of personal data within the EU and the European Economic Area, establishing strict requirements for data protection and privacy.

GDPR represents a paradigm shift from previous data protection approaches, emphasizing individual rights, accountability, and privacy by design. It applies to all organizations processing personal data of EU residents, regardless of where the organization is located.

## Quality Attributes Required or Emphasized

The regulation directly impacts software system design and implementation through specific quality requirements:

| Attribute | Relevance in GDPR |
|:--- |:--- |
| **[Privacy](/qualities/privacy)** | Core principle requiring protection of personal data and individual privacy rights through technical and organizational measures. |
| **[Data Protection](/qualities/data-protection)** | Comprehensive framework for safeguarding personal data throughout its lifecycle, from collection to deletion. |
| **[Transparency](/qualities/transparency)** | Mandatory clear communication about data processing purposes, legal basis, retention periods, and individual rights. |
| **[Accountability](/qualities/accountability)** | Organizations must demonstrate compliance through documentation, impact assessments, and governance structures. |
| **[Consent Management](/qualities/consent-management)** | Technical mechanisms for obtaining, recording, and managing valid consent for data processing activities. |
| **[Data Integrity](/qualities/data-integrity)** | Ensuring personal data accuracy, completeness, and protection against unauthorized alteration or destruction. |
| **[Security](/qualities/security)** | Robust technical and organizational measures to protect personal data against breaches, loss, and unauthorized access. |
| **[Auditability](/qualities/auditability)** | Systems must maintain comprehensive logs and records to demonstrate compliance and support data subject rights. |
| **[Interoperability](/qualities/interoperability)** | Data portability requirements necessitate standard formats and seamless data transfer capabilities. |
| **[Availability](/qualities/availability)** | Ensuring data subjects can exercise their rights (access, rectification, erasure) in a timely manner. |

## Key Principles and Technical Requirements

### **Data Protection by Design and by Default (Article 25)**
- Integration of data protection measures into system development lifecycle
- Implementation of appropriate technical and organizational measures
- Privacy-enhancing technologies and minimization techniques

### **Individual Rights Implementation**
- **Right of Access**: Technical systems for data subject access requests
- **Right to Rectification**: Mechanisms for data correction and updating
- **Right to Erasure**: "Right to be forgotten" implementation capabilities
- **Data Portability**: Structured data export in machine-readable formats

### **Legal Bases and Processing Limitations**
- Purpose limitation and data minimization in system design
- Consent management platforms and withdrawal mechanisms
- Legitimate interest assessments and balancing tests

### **Security and Breach Management**
- Pseudonymization and encryption capabilities
- Security incident detection and response systems
- 72-hour breach notification technical infrastructure

## Compliance Requirements for Software Systems

### **Data Protection Impact Assessment (DPIA)**
- Systematic assessment of high-risk processing activities
- Privacy risk identification and mitigation measures
- Stakeholder consultation and approval processes

### **Records of Processing Activities**
- Automated inventory of data processing operations
- Data mapping and flow documentation systems
- Controller and processor responsibility tracking

### **Cross-Border Data Transfers**
- Adequacy decision compliance mechanisms
- Standard Contractual Clauses (SCCs) implementation
- Binding Corporate Rules (BCRs) technical frameworks

## References

### Official Sources
- [Regulation (EU) 2016/679 - Official Journal of the European Union](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0679)
- [European Data Protection Board (EDPB) Guidelines](https://edpb.europa.eu/our-work-tools/general-guidance/gdpr-guidelines-recommendations-best-practices_en)
- [European Commission GDPR Information](https://commission.europa.eu/law/law-topic/data-protection_en)

### Implementation Guidance
- [ICO (UK) Guide to GDPR](https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/)
- [CNIL (France) GDPR Guide](https://www.cnil.fr/en/data-protection-around-the-world/europe/general-data-protection-regulation-gdpr)
- [NIST Privacy Framework](https://www.nist.gov/privacy-framework) - Complementary privacy risk management guidance

### Technical Implementation Resources
- [EDPB Guidelines on Data Protection by Design and by Default](https://edpb.europa.eu/sites/default/files/consultation/edpb_draft_guidelines_on_data_protection_by_design_and_by_default_v2.0_en.pdf)
- [ISO/IEC 27701:2019 Privacy Information Management](https://www.iso.org/standard/71670.html) - Extension to ISO 27001 for privacy
- [ENISA Privacy and Data Protection by Design Guidelines](https://www.enisa.europa.eu/publications/privacy-and-data-protection-by-design)

### Academic and Industry Research
- [Future of Privacy Forum - GDPR Implementation Studies](https://fpf.org/gdpr/)
- [Centre for Information Policy Leadership - GDPR Resources](https://www.informationpolicycentre.com/areas-of-focus/eu-general-data-protection-regulation/)