---
layout: page_standard
title: "HL7 — Health Level Seven International"
permalink: /standards/hl7
standard_id: hl7
---

## HL7: Healthcare Interoperability Standards

Health Level Seven International (HL7) is an ANSI‑accredited standards‑developing organization that creates specifications for the exchange, integration, sharing, and retrieval of health information. HL7 standards are widely used by EHRs, laboratories, imaging systems, public health, payers, and health apps to achieve syntactic and semantic interoperability across organizations and platforms.

#### Scope and Purpose

- Define common information models, message structures, documents, and APIs to enable interoperable healthcare workflows and data exchange.
- Promote semantic consistency via standard terminologies (e.g., binding to LOINC, SNOMED CT, RxNorm) and strong data typing.
- Provide conformance and profiling mechanisms so regional programs and vendors can constrain and extend the base standards predictably.
- Offer security and privacy guidance aligned with modern web practice (authorization, audit, provenance) without prescribing a single policy regime.

#### Core HL7 Standards (selection)

- HL7 Version 2.x Messaging: Widely adopted event‑driven messages for ADT, orders, results, billing, and more in hospitals and labs.
- HL7 Clinical Document Architecture (CDA): An XML‑based standard for clinical documents (e.g., discharge summaries, CCD/C‑CDA).
- HL7 Version 3 (incl. RIM): A model‑driven family of standards historically used in some domains; less prevalent than V2 and FHIR today.
- HL7 FHIR (Fast Healthcare Interoperability Resources): Resource‑based RESTful APIs (JSON/XML), standardized search, terminology services, and an extension and profiling system enabling implementation guides (IGs) such as US Core, International Patient Access, and Bulk Data (Flat FHIR).
- Related artifacts: Terminology site (code systems, value sets), conformance/capability statements, AuditEvent and Provenance, SMART on FHIR App Launch (OAuth 2.0/OpenID Connect‑based authorization).

## Quality Attributes Addressed or Influenced

HL7 primarily targets interoperability, but its design and accompanying guidance affect several qualities relevant to healthcare systems:

| Attribute                                                                                                                       | How HL7 addresses it                                                                                                                                                                                    |
| :------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **[Interoperability](/qualities/interoperability)**                                                                             | Core purpose: shared data models (resources, messages, documents), uniform encodings, and well‑defined interactions enable cross‑vendor, cross‑organization exchange.                                   |
| **[Compatibility](/qualities/compatibility)**                                                                                   | Profiles, constraints, and capability statements let systems co‑exist and negotiate supported features while sharing environments.                                                                      |
| **[Extensibility](/qualities/extensibility)**                                                                                   | FHIR’s extension mechanism and profiling allow safe, discoverable additions without breaking base conformance; CDA templates provide a similar pattern.                                                 |
| **[Maintainability](/qualities/maintainability)**                                                                               | Versioning, backward‑compatible patterns (e.g., FHIR’s lenient reads), and modular resources/profiles reduce effort to evolve interfaces.                                                               |
| **[Portability](/qualities/portability)** / **[Flexibility](/qualities/flexibility)**                                           | Resource‑based APIs and standardized terminologies ease migration between systems and regions; implementation guides tailor for locales without forking the base.                                       |
| **[Security](/qualities/security)** / **[Confidentiality](/qualities/confidentiality)** / **[Integrity](/qualities/integrity)** | Security considerations across HL7 (e.g., FHIR’s security pages) recommend authenticated, authorized access (often via SMART on FHIR/OAuth 2.0), data integrity safeguards, and least‑privilege access. |
| **[Auditability](/qualities/auditability)** / **[Traceability](/qualities/traceability)**                                       | AuditEvent and Provenance resources support recording access, disclosures, and lineage of clinical data for compliance and investigation.                                                               |
| **[Data Quality](/qualities/data-quality)**                                                                                     | Strong typing, required elements, value set bindings, invariants, and terminology services improve accuracy, completeness, and consistency.                                                             |
| **[Reliability](/qualities/reliability)** / **[Availability](/qualities/availability)**                                         | Indirect: acknowledgement patterns (V2), idempotency guidance, error handling, and async/bulk operations support robust exchanges, but runtime SLOs remain implementer responsibilities.                |

## Authoritative Sources

- HL7 International — About HL7: https://www.hl7.org/about/index.cfm
- HL7 Standards (overview): https://www.hl7.org/standards/
- HL7 Version 2.x Product Brief: https://www.hl7.org/implement/standards/product_brief.cfm?product_id=185
- HL7 CDA R2 Product Brief: https://www.hl7.org/implement/standards/product_brief.cfm?product_id=7
- HL7 FHIR (overview and spec): https://hl7.org/fhir/ and https://hl7.org/fhir/overview.html
- FHIR Security & Privacy: https://hl7.org/fhir/security.html
- FHIR Conformance Module: https://hl7.org/fhir/conformance-module.html
- HL7 Terminology (THO): https://terminology.hl7.org/
- US Core Implementation Guide (example of profiling): https://hl7.org/fhir/us/core/
- SMART App Launch (HL7 IG): https://hl7.org/fhir/smart-app-launch/
