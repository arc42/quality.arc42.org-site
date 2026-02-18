---
layout: page_standard
title: "ISO/IEC/IEEE 29119 - Software Testing"
shortname: "ISO/IEC/IEEE 29119"
standard_id: iso29119
categories: [general, documentation]
permalink: /standards/iso-iec-ieee-29119
---


ISO/IEC/IEEE 29119 is the international software testing standard series. It provides a common vocabulary, a process framework, standardized test work products, and test-technique guidance that can be tailored from small projects to regulated environments.

The series is process- and evidence-oriented: it does not define product quality characteristics by itself (that role is covered by standards such as [ISO/IEC 25010](/standards/iso-25010)). Instead, it defines how testing should be planned, executed, documented, and reported so verification results are consistent and auditable.

## Structure of the 29119 Series

| Part | Focus | Status |
|:--- |:--- |:--- |
| **ISO/IEC/IEEE 29119-1** | Concepts and definitions for software testing terminology | International Standard, 2022 edition |
| **ISO/IEC/IEEE 29119-2** | Test processes (organizational and project/test management processes) | International Standard, 2021 edition |
| **ISO/IEC/IEEE 29119-3** | Test documentation (test work products and reporting artifacts) | International Standard, 2021 edition |
| **ISO/IEC/IEEE 29119-4** | Test techniques | International Standard, 2021 edition |
| **ISO/IEC/IEEE 29119-5** | Keyword-driven testing | International Standard, 2024 edition |
| **ISO/IEC TR 29119-6** | Using the standard in agile development contexts | Technical Report, 2021 edition |
| **ISO/IEC TR 29119-11** | Guidance for testing AI-based systems | Technical Report, 2020 edition |

## What It Changes in Practice

- Establishes a common language for test policy, planning, design, execution, and reporting.
- Makes testing outcomes more comparable across teams by standardizing work products and process expectations.
- Supports risk-based testing and prioritization of test effort.
- Improves auditability by requiring explicit evidence and trace links from test basis to results.
- Allows tailoring: the standard defines a framework, not a single mandatory test lifecycle.

## Relationship to Other Standards

- **[ISO/IEC 25010](/standards/iso-25010)** defines *which* quality characteristics matter; ISO/IEC/IEEE 29119 defines *how* to test and evidence them.
- **[ISO/IEC/IEEE 12207](/standards/iso12207)** provides lifecycle processes; 29119 specializes the testing-related processes and work products.
- **ISO/IEC 20246** complements 29119 with guidance for static testing (reviews and static analysis).

## Quality Attributes Required or Emphasized

| Quality Attribute | Relevance in ISO/IEC/IEEE 29119 |
|:--- |:--- |
| **[Testability](/qualities/testability)** | Core focus: structures test conditions, test cases, procedures, and execution so systems can be systematically tested. |
| **[Verifiability](/qualities/verifiability)** | Core focus: requires objective, reviewable evidence that requirements and expected behavior have been verified. |
| **[Traceability](/qualities/traceability)** | Strongly emphasized through links between test basis, test design, execution records, and test reports. |
| **[Reproducibility](/qualities/reproducibility)** | Standardized processes and documentation improve repeatability and reproducibility of test results across teams and time. |
| **[Auditability](/qualities/auditability)** | Test evidence and reporting artifacts support internal/external assessments and compliance audits. |
| **[Correctness](/qualities/correctness)** | Testing against expected outcomes helps detect deviations and defects in functional and non-functional behavior. |
| **[Reliability](/qualities/reliability)** | Systematic dynamic testing contributes to confidence in stable behavior under intended operating conditions. |
| **[Maintainability](/qualities/maintainability)** | Structured regression testing assets and clearer test documentation support safer change and evolution. |
| **[Compliance](/qualities/compliance)** | Consistent test records and reports provide evidence needed in contractual and regulated delivery contexts. |

## References and Authoritative Sources

### Core Standard Series (ISO)
- [ISO/IEC/IEEE 29119 series overview (ISO/IEC JTC 1/SC 7)](https://committee.iso.org/sites/jtc1sc7/home/projects/flagship-standards/isoiecieee-29119-series.html)
- [ISO/IEC/IEEE 29119-1:2022 (General concepts)](https://www.iso.org/standard/81291.html)
- [ISO/IEC/IEEE 29119-2:2021 (Test processes)](https://www.iso.org/standard/79428.html)
- [ISO/IEC/IEEE 29119-3:2021 (Test documentation)](https://www.iso.org/standard/79429.html)
- [ISO/IEC/IEEE 29119-4:2021 (Test techniques)](https://www.iso.org/standard/79430.html)
- [ISO/IEC/IEEE 29119-5:2024 (Keyword-driven testing)](https://www.iso.org/standard/87233.html)


### Guidance Extensions
- [ISO/IEC TR 29119-6:2021 (Using ISO/IEC/IEEE 29119 in agile development)](https://www.iso.org/standard/81293.html)
- [ISO/IEC TR 29119-11:2020 (Guidelines on testing AI-based systems)](https://www.iso.org/standard/79016.html)

### Related ISO Standards
- [ISO/IEC 20246:2017 (Work product reviews)](https://www.iso.org/standard/67407.html)
