---
layout: page_standard
title: "EU Cyber Resilience Act (CRA) — Regulation (EU) 2024/2847"
permalink: /standards/cra
standard_id: cra
---

## Cyber Resilience Act (CRA)

Horizontal EU regulation setting essential cybersecurity requirements for products with digital elements (hardware, software, and integrated remote data processing) across their entire lifecycle. It aims to reduce vulnerabilities at placing on the market, ensure secure-by-design and secure-by-default configurations, mandate vulnerability handling and security updates during a declared support period, and improve transparency for users. CRA entered into force on 10 Dec 2024; main obligations apply from 11 Dec 2027. Early reporting duties apply from 11 Sep 2026; notification of conformity assessment bodies from 11 Jun 2026.

- Scope: Any product with a direct or indirect logical or physical connection to a device or network, with sectoral exclusions where equivalent rules apply (e.g., MDR/IVDR, vehicle type-approval, EASA-certified aviation equipment). Open-source is covered only when supplied in a commercial activity; a tailored regime applies to open-source software stewards.
- Core obligations for manufacturers:
  - Risk assessment covering planning, design, development, production, delivery, and maintenance; due diligence for third-party components (incl. OSS); SBOM; secure configuration; protection of data and functions (availability, integrity, confidentiality, authenticity); input validation; identity and access control; logging; resilience to attacks; limiting attack surface; secure update mechanisms.
  - Vulnerability handling during a declared support period (at least 5 years unless the product’s lifetime is shorter); coordinated vulnerability disclosure; single point of contact; timely security updates, preferably separated from feature updates; keep released security updates available for at least 10 years or the remainder of support period.
  - Incident and vulnerability reporting via ENISA’s single reporting platform to the CSIRT designated as coordinator and ENISA: early warning within 24h, fuller notice within 72h, and final report (timelines vary for incidents vs. actively exploited vulnerabilities as set out in the regulation).
  - Conformity assessment: internal control for most products; stricter procedures or third‑party assessment for important products (Class I/II) and critical products (potentially mandatory EU cybersecurity certification under EUCC or other schemes). CE marking is required to indicate CRA conformity.
- Economic operators: importers and distributors must verify CRA conformity and cooperate with market surveillance; some obligations shift if they brand or substantially modify products.
- Enforcement: market surveillance under Regulation (EU) 2019/1020, ADCO coordination, Union safeguard procedures, administrative fines, and potential Union-level corrective measures in exceptional cases.
- Relationship to other EU laws: complements NIS2, the Cybersecurity Act (EU 2019/881), the AI Act for high-risk AI, the Machinery Regulation, and sectoral regimes; provides presumption of conformity via harmonised standards, common specifications, or European cybersecurity certification.

## What does CRA mean for software and systems engineering?

- Secure-by-design/default requirements shift assurance left: threat/risk analysis; secure architecture; dependency hygiene and SBOM; hardening and least privilege; defensive coding; attack surface minimisation; tamper protection; secure boot; cryptographic best practice; secure telemetry and logs.
- Lifecycle duties: clearly declare support period; maintain vulnerability intake/triage, remediation SLAs, and update delivery; notify users and authorities about exploited vulnerabilities and severe incidents; keep security patches available long‑term.
- Supply chain: due diligence for third‑party/OSS components; monitor known vulnerabilities; coordinate disclosure; share fixes upstream where applicable.
- Assurance and evidence: technical documentation including cybersecurity risk assessment; apply harmonised standards/common specifications once available; use EU cybersecurity certification where appropriate; prepare for CE marking.

## Related quality attributes impacted by CRA

- Security, Securability, Integrity, Confidentiality, Availability, Authenticity, Accountability, Auditability, Dependability, Resilience, Recoverability, Maintainability, Maintainable Security, Updatability, Patchability, Observability/Logging, Traceability, Compliance, Risk Identification, Transparency.

## References (authoritative sources)

- Regulation (EU) 2024/2847 (Cyber Resilience Act) — Official Journal: https://eur-lex.europa.eu/eli/reg/2024/2847/oj
- European Commission overview: https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act
- Commission Q&A: https://ec.europa.eu/commission/presscorner/detail/en/QANDA_22_5375
- ENISA: The Cyber Resilience Act (CRA): https://www.enisa.europa.eu/publications/the-cyber-resilience-act-cra
- CE marking overview: https://single-market-economy.ec.europa.eu/single-market/ce-marking_en

## Supportive technical guidance (Germany)

- BSI Technical Guideline TR-03183 (Cyber Resilience): English v1.0: https://www.bsi.bund.de/SharedDocs/Downloads/EN/BSI/Standard/CyberResilience_ACT/BSI_TR_03183_EN_V1.0_pdf.pdf
