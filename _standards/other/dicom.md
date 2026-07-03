---
layout: page_standard
title: "DICOM — Digital Imaging and Communications in Medicine"
shortname: "DICOM"
permalink: /standards/dicom
standard_id: dicom
categories: [sector]
---

## DICOM: Medical Imaging Interoperability

DICOM (Digital Imaging and Communications in Medicine) is the international standard for storing, transmitting, and managing medical imaging information and related data. Maintained by the DICOM Standards Committee (co‑sponsored by NEMA together with radiology, cardiology, and other imaging‑related professional bodies), DICOM is used worldwide by imaging modalities (CT, MRI, ultrasound, X‑ray, PET), PACS (Picture Archiving and Communication Systems), workstations, and increasingly by AI/analytics platforms to ensure interoperability of imaging data across vendors and care settings. It is frequently paired with [HL7](/standards/hl7) messaging for order/result context, and [IHE](/standards/ihe) integration profiles build on it for real‑world workflows.

## Scope and Purpose

- Define a standardized file format and information model for medical images and associated metadata (patient, study, series, equipment, acquisition parameters).
- Specify network protocols and services (Store, Query/Retrieve, Modality Worklist, Print) enabling imaging devices, archives, and viewers to exchange data reliably.
- Ensure that pixel data remains diagnostically usable and correctly interpretable regardless of vendor, by binding image data to consistent metadata (orientation, spacing, modality, transfer syntax).
- Support workflow integration between imaging modalities, RIS/PACS, and broader EHR systems.
- Provide conformance statements so vendors can declare exactly which parts of the standard, SOP classes, and transfer syntaxes their products support.

## Core DICOM Components (selection)

- Information Object Definitions (IODs): Standardized data models for images and non‑image objects (e.g., CT Image, MR Image, Structured Report, Waveform), organized hierarchically as Patient → Study → Series → Instance.
- DICOM File Format: A file structure combining a File Meta Information header with a Data Set, enabling self‑contained, portable image files (typically `.dcm`).
- Service‑Object Pair (SOP) Classes: Combinations of an Information Object with a Service (e.g., Storage, Query/Retrieve) that define what a device or system can do with that object type.
- DICOM Network Services: C‑STORE (transfer), C‑FIND (query), C‑MOVE/C‑GET (retrieve), and Modality Worklist for scheduling; more recently, DICOMweb (QIDO‑RS, WADO‑RS, STOW‑RS) provides RESTful equivalents.
- Transfer Syntaxes: Defined encodings (uncompressed, JPEG, JPEG 2000, RLE, etc.) negotiated between systems to ensure correct interpretation of pixel data.
- Structured Reporting (SR): A standardized way to encode measurements, findings, and observations (e.g., from imaging AI or CAD tools) as structured, queryable data rather than free text.
- Conformance Statements: Vendor‑published documents specifying supported SOP classes, roles, and transfer syntaxes, used for interoperability testing (e.g., [IHE](/standards/ihe) profiles build on these).

## Quality Attributes Addressed or Influenced

DICOM primarily targets interoperability of imaging data, but its design and surrounding ecosystem affect several qualities relevant to healthcare and imaging systems:

| Attribute                                                                                                                       | How DICOM addresses it                                                                                                                                                                            |
| :------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **[Interoperability](/qualities/interoperability)**                                                                             | Core purpose: standardized IODs, network services, and transfer syntaxes let imaging modalities, PACS, and viewers from different vendors exchange and correctly render images.                   |
| **[Compatibility](/qualities/compatibility)**                                                                                   | Conformance statements and negotiated transfer syntaxes let systems with different capabilities interoperate by explicitly declaring and matching supported features.                             |
| **[Extensibility](/qualities/extensibility)**                                                                                   | Private tags/data elements and vendor‑specific SOP classes allow proprietary extensions while preserving a standard‑conformant core data set.                                                     |
| **[Maintainability](/qualities/maintainability)**                                                                               | Modular IODs, versioned Parts of the standard, and backward‑compatible tag encoding reduce the effort needed to evolve devices and archives over time.                                            |
| **[Portability](/qualities/portability)** / **[Flexibility](/qualities/flexibility)**                                           | The self‑contained DICOM file format (header + pixel data) allows images to be moved between systems, institutions, or storage media while remaining interpretable.                               |
| **[Security](/qualities/security)** / **[Confidentiality](/qualities/confidentiality)** / **[Integrity](/qualities/integrity)** | Part 15 (Security and System Management Profiles) defines TLS‑based network security, digital signatures, and de‑identification profiles for protecting patient imaging data.                     |
| **[Auditability](/qualities/auditability)** / **[Traceability](/qualities/traceability)**                                       | Audit trail mechanisms (aligned with IHE ATNA) and consistent patient/study/series identifiers support tracking access to and movement of imaging data.                                           |
| **[Data Quality](/qualities/data-quality)**                                                                                     | Mandatory and conditional data elements, defined value representations (VR), and structured reporting reduce ambiguity and improve consistency of imaging metadata and findings.                  |
| **[Scalability](/qualities/scalability)** / **[Performance](/qualities/performance)**                                           | Efficient compressed transfer syntaxes, DICOMweb's RESTful bulk retrieval, and query/retrieve services support large imaging volumes typical of modern radiology departments.                     |
| **[Reliability](/qualities/reliability)** / **[Availability](/qualities/availability)**                                         | Defined association negotiation, status codes, and retry‑friendly network services support robust transfer, though archive uptime and redundancy remain implementer/PACS‑vendor responsibilities. |

## Authoritative Sources

- DICOM Standard — Official Site: https://www.dicomstandard.org/
- DICOM Standard, Current Edition (all Parts): https://www.dicomstandard.org/current
- Part 15 — Security and System Management Profiles: https://dicom.nema.org/medical/dicom/current/output/html/part15.html
- DICOMweb (RESTful Services): https://www.dicomstandard.org/using/dicomweb
- IHE Radiology Technical Frameworks (profiles built on DICOM): https://www.ihe.net/resources/technical_frameworks/#radiology
- NEMA — DICOM Sponsor: https://www.nema.org/standards/view/digital-imaging-and-communications-in-medicine
