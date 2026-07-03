---
layout: page_standard
title: "IHE — Integrating the Healthcare Enterprise"
shortname: "IHE"
permalink: /standards/ihe
standard_id: ihe
categories: [sector]
---

## IHE: Verified Healthcare Interoperability

IHE (Integrating the Healthcare Enterprise) is an international initiative by healthcare professionals and industry to improve the way computer systems in healthcare share information. Rather than creating new base standards, IHE defines Integration Profiles that specify how existing standards — primarily [HL7](/standards/hl7) (V2, FHIR) and [DICOM](/standards/dicom) — should be used together to solve specific, real‑world interoperability problems. IHE profiles are used by hospitals, imaging centers, health information exchanges, and vendors to procure and configure systems that are demonstrably interoperable, verified through annual Connectathon testing events.

## Scope and Purpose

- Provide implementation‑ready guidance ("profiles") that constrain and combine existing standards (HL7 V2/FHIR, DICOM, W3C, OASIS) to solve concrete clinical and administrative workflows.
- Reduce ambiguity in base standards by specifying exact transactions, actor roles, and options needed for a given use case, closing gaps that generic standards leave open to interpretation.
- Enable vendor‑neutral procurement: healthcare organizations can require "IHE XDS.b" or "IHE PIX/PDQ" conformance in RFPs instead of negotiating custom interfaces.
- Validate interoperability claims through structured Connectathon testing and published Integration Statements, giving buyers evidence beyond vendor self‑attestation.
- Organize work by clinical domain (Radiology, IT Infrastructure, Cardiology, Patient Care Coordination, Laboratory, Pharmacy, etc.) so profiles stay grounded in real workflows.

## Core IHE Concepts (selection)

- Integration Profiles: Named specifications (e.g., XDS.b, PIX, PDQ, ATNA, XCA, MHD, mCSD) describing a specific interoperability problem, the actors involved, and the transactions between them.
- Actors and Transactions: Each profile defines abstract system roles ("actors," e.g., Document Source, Document Consumer) and the standardized message exchanges ("transactions") between them, typically built on [HL7](/standards/hl7) or [DICOM](/standards/dicom).
- Technical Frameworks: Domain‑specific documents (IT Infrastructure, Radiology, Cardiology, etc.) that formally define the profiles, actors, and transactions for that domain.
- Cross‑Enterprise Document Sharing (XDS.b) / Mobile access to Health Documents (MHD): Profiles enabling document‑based sharing of clinical content across organizations, the latter using FHIR‑based RESTful transactions.
- Patient Identifier Cross‑Referencing (PIX) / Patient Demographics Query (PDQ): Profiles for reliably matching and querying patient identities across systems.
- Audit Trail and Node Authentication (ATNA): A security profile defining audit logging and node‑to‑node authentication, commonly paired with DICOM Part 15 and FHIR AuditEvent.
- Connectathon and Integration Statements: Structured, supervised interoperability testing events, after which vendors publish Integration Statements declaring tested profile/actor support.

## Quality Attributes Addressed or Influenced

IHE primarily targets real‑world, verifiable interoperability, but its profiling and testing approach affects several qualities relevant to healthcare systems:

| Attribute                                                                                                                                   | How IHE addresses it                                                                                                                                                                                                                       |
| :------------------------------------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[Interoperability](/qualities/interoperability)**                                                                                         | Core purpose: profiles remove optionality and ambiguity from base standards (HL7, FHIR, DICOM), specifying exact actors and transactions so independently built systems interoperate in practice, not just in theory.                      |
| **[Compatibility](/qualities/compatibility)**                                                                                               | Defined actor/transaction combinations let systems from different vendors participate in the same workflow (e.g., document sharing, patient matching) by implementing a common, testable subset of behavior.                               |
| **[Extensibility](/qualities/extensibility)**                                                                                               | Profiles are modular and composable; new profiles can be added for emerging domains (e.g., mobile, AI results) without altering the underlying base standards.                                                                             |
| **[Maintainability](/qualities/maintainability)**                                                                                           | Well‑bounded, versioned profiles with clear actor/transaction scope make it easier to implement, test, and evolve individual interfaces rather than a monolithic integration.                                                              |
| **[Portability](/qualities/portability)** / **[Flexibility](/qualities/flexibility)**                                                       | Profiles built on widely adopted base standards (FHIR, DICOM) allow solutions to be transferred between institutions or regions with comparable IHE adoption.                                                                              |
| **[Security](/qualities/security)** / **[Confidentiality](/qualities/confidentiality)** / **[Integrity](/qualities/integrity)**             | ATNA and related security/privacy profiles define audit logging, secure node authentication, and consistent handling of access events across participating systems.                                                                        |
| **[Auditability](/qualities/auditability)** / **[Traceability](/qualities/traceability)**                                                   | ATNA's audit trail requirements, combined with DICOM/FHIR audit resources, give a standardized, cross‑system record of who accessed or shared what data, and when.                                                                         |
| **[Data Quality](/qualities/data-quality)** / **[Data Integrity](/qualities/data-integrity)**                                               | PIX/PDQ reduce duplicate or mismatched patient records; document‑sharing profiles (XDS.b/MHD) enforce consistent metadata — including document hash and size for integrity verification — for retrievability and correct clinical context. |
| **[Testability](/qualities/testability)** / **[Verifiability](/qualities/verifiability)** / **[Certifiability](/qualities/certifiability)** | Connectathon testing and published Integration Statements provide objective, third‑party‑verified evidence of conformance, going beyond a vendor's own claims.                                                                             |
| **[Reliability](/qualities/reliability)** / **[Availability](/qualities/availability)**                                                     | Well‑defined transaction sequences and error‑handling expectations within profiles support predictable, robust cross‑system workflows, though runtime SLOs remain implementer responsibilities.                                            |

## Authoritative Sources

- IHE International — Official Site: https://www.ihe.net/
- IHE Profiles Overview: https://www.ihe.net/resources/profiles/
- IHE IT Infrastructure Technical Framework: https://www.ihe.net/resources/technical_frameworks/#IT
- IHE Radiology Technical Frameworks: https://www.ihe.net/resources/technical_frameworks/#radiology
- IHE Connectathon: https://www.ihe.net/testing/connectathons/
- IHE Mobile access to Health Documents (MHD) Profile: https://profiles.ihe.net/ITI/MHD/
- IHE Audit Trail and Node Authentication (ATNA) Profile: https://profiles.ihe.net/ITI/TF/Volume1/ch-9.html
