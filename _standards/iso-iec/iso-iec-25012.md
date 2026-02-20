---
layout: page_standard
title: "ISO/IEC 25012 - Data Quality Model"
standard_id: iso25012
shortname: "ISO/IEC 25012"
categories: [data]
permalink: /standards/iso-iec-25012
---

## ISO/IEC 25012: Data Quality Model

ISO/IEC 25012 defines a data quality model in the SQuaRE family (ISO/IEC 25000). It gives a shared structure for specifying, discussing, and evaluating data quality characteristics in software and information systems.

Why it matters:
- It provides a common quality vocabulary for data, not just for software behavior.
- It complements [ISO/IEC 25024](/standards/iso-25024), which focuses on **measurement**.
- It is complementary to [ISO 8000](/standards/iso-8000), which focuses strongly on **data quality governance, exchange, and operational quality practices**.

## Scope and Model Structure

ISO/IEC 25012 models data quality from two perspectives:
- **Inherent data quality**: quality properties that can be assessed from the data itself.
- **System-dependent data quality**: quality properties influenced by the system environment where data is stored, processed, and accessed.

The ISO catalog abstract states that the model defines **15 data quality characteristics** across these perspectives.

## Practical Use in Projects

Use ISO/IEC 25012 as a framing model when you need to:
- define data quality requirements early (before implementation choices),
- align stakeholders on what “good data” means in your context,
- map quality goals to measurable checks via [ISO/IEC 25024](/standards/iso-25024),
- separate data-intrinsic issues (for example completeness/consistency) from platform/operations issues (for example availability/recoverability).

## Quality Attributes Emphasized

The standard directly or indirectly addresses these q42 quality characteristics:

| Quality Attribute | Why it is relevant in ISO/IEC 25012 |
|:--- |:--- |
| **[Data Quality](/qualities/data-quality)** | Core focus of the standard: defines a formal model for data quality characteristics. |
| **[Accuracy](/qualities/accuracy)** | Data should correctly represent real-world values and facts. |
| **[Completeness](/qualities/completeness)** | Required information should be present for intended use. |
| **[Consistency](/qualities/consistency)** | Data should not contradict itself across records/sources/rules. |
| **[Currentness](/qualities/currentness)** | Data should be sufficiently up to date for the intended decision/process. |
| **[Credibility](/qualities/credibility)** | Data should be trustworthy for stakeholders and use cases. |
| **[Availability](/qualities/availability)** | Data should be available when needed by authorized users/processes. |
| **[Confidentiality](/qualities/confidentiality)** | Data access/disclosure must be controlled and protected. |
| **[Compliance](/qualities/compliance)** | Data handling should conform to regulatory and organizational constraints. |
| **[Traceability](/qualities/traceability)** | Data lineage/provenance should be understandable and auditable. |

## References and Resources

### Authoritative Sources
- [ISO/IEC 25012:2008 — Data quality model (official ISO catalog)](https://www.iso.org/standard/35736.html)
- [ISO/IEC 25024:2015 — Measurement of data quality (official ISO catalog)](https://www.iso.org/standard/35749.html)
- [ISO/IEC 25000:2014 — SQuaRE guide (official ISO catalog)](https://www.iso.org/standard/64764.html)
- [ISO 8000-8:2015 — Data quality concepts and measuring (official ISO catalog)](https://www.iso.org/standard/60805.html)

### Notes on Currency
- The ISO catalog entry for ISO/IEC 25012 indicates the standard is still current and was most recently confirmed in **2025**.
