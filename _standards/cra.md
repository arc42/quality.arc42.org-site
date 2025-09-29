---
layout: page_standard
title: "EU Cyber Resilience Act (CRA) — Regulation 2024/2847"
shortname: "CRA"
permalink: /standards/cra
standard_id: cra
categories: [security]
---

## Cyber Resilience Act (CRA)

With the CRA, the European Union set essential cybersecurity requirements for products with digital elements (hardware, software, and integrated remote data processing) **across their entire lifecycle**. 
It aims to reduce vulnerabilities at placing on the market, ensure secure-by-design and secure-by-default configurations, mandate vulnerability handling and security updates during a declared support period, and improve transparency for users. 
CRA entered into force on 17 Dec 2024. 
Key milestones:

- 17 Dec 2024: Regulation enters into force.
- 17 Dec 2025: Member States must notify conformity assessment bodies to the European Commission so they can be designated.
- 17 Sep 2026: Early reporting duties for actively exploited vulnerabilities and incidents start via ENISA’s single reporting platform.
- 17 Dec 2027: Core cybersecurity requirements, CE marking obligations, and market placement rules apply.

### Scope: 
Any product with a direct or indirect logical or physical connection to a device or network, with sectoral exclusions where equivalent rules apply (e.g., MDR/IVDR, vehicle type-approval, EASA-certified aviation equipment). 
Open-source is covered only when supplied in a commercial activity;

### Core obligations for manufacturers

- Secure design & development: run end-to-end cybersecurity risk assessments, manage third-party/OSS components with an SBOM, harden configurations, protect
  data/functions, and provide secure update mechanisms.
- Vulnerability handling: declare a support period (≥5 years unless shorter lifetime), operate a coordinated vulnerability disclosure process with a clear
  contact point, deliver timely security fixes (ideally separate from feature updates), and keep released patches available.
- Reporting & conformity: use [ENISA’s](https://www.enisa.europa.eu) platform for 24h early warnings, 72h follow-ups, and final reports; apply the appropriate conformity assessment
  path (internal control for non-critical products, notified body/EU certification for Annex III important or critical products) and affix the CE mark once
  compliant. (ENISA is the European Agency for Cybersecurity)
  

## What does CRA mean for software and systems engineering?

- Secure-by-design/default requirements:
  - run threat and risk analysis and define secure architecture.
  - maintain dependency hygiene and an SBOM.
  - harden configurations, enforce least privilege, and apply defensive coding that minimises attack surface.
  - implement tamper protection, secure boot, and modern cryptography.
  - capture trustworthy telemetry and security logs.
- Lifecycle duties include:
  - declaring the support period transparently.
  - maintaining vulnerability intake, triage, remediation SLAs, and update delivery pipelines.
  - notifying users and authorities about exploited vulnerabilities and severe incidents.
  - keeping security patches available long-term.
- Supply chain expectations:
  - perform due diligence for third-party and OSS components.
  - monitor known vulnerabilities and coordinate disclosure.
  - share fixes upstream where applicable.
- Assurance and evidence activities:
  - compile technical documentation including cybersecurity risk assessment results.
  - apply harmonised standards or common specifications once available.
  - leverage EU cybersecurity certification where appropriate.
  - prepare for CE marking.

## Related quality attributes impacted by CRA

- Security, Securability, Integrity, Confidentiality, Availability, Authenticity, Accountability, Auditability, Dependability, Resilience, Recoverability, Maintainability, Maintainable Security, Updateability, Observability/Logging, Traceability, Compliance, Risk Identification, Transparency.

## References (authoritative sources)

- Regulation (EU) 2024/2847 (Cyber Resilience Act) — Official Journal: https://eur-lex.europa.eu/eli/reg/2024/2847/oj
- European Commission overview: https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act
- Commission Q&A: https://ec.europa.eu/commission/presscorner/detail/en/QANDA_22_5375
- ENISA: The Cyber Resilience Act (CRA): https://www.enisa.europa.eu/publications/the-cyber-resilience-act-cra
- CE marking overview: https://single-market-economy.ec.europa.eu/single-market/ce-marking_en

## Supportive technical guidance (Germany)

- BSI Technical Guideline TR-03183 (Cyber Resilience): English v1.0: https://www.bsi.bund.de/SharedDocs/Downloads/EN/BSI/Standard/CyberResilience_ACT/BSI_TR_03183_EN_V1.0_pdf.pdf
