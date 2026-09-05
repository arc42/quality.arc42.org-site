---
layout: page_standard
title: "C3A — Criteria enabling Cloud Computing Autonomy"
standard_id: c3a
shortname: "C3A"
categories: [governance, data]
permalink: /standards/c3a
summary: "BSI's non-binding criteria for judging how much control a customer keeps over a cloud service: data location, key management, staff, non-EU dependencies."
---

## C3A: Cloud Autonomy

C3A is a criteria framework from Germany's Federal Office for Information Security (BSI). Version 1.0, dated 27 April 2026, lets cloud customers assess how much control they retain over a service and its dependencies, and lets providers evidence that control through an audit. BSI calls C3A "a guiding framework" that "is not binding in itself": customers select criteria and additional criteria for their own use case and risk context (sections 1.1–1.4).

## Scope and Coverage

C3A covers six areas: strategic, legal and jurisdictional, data, operational, supply chain, and technology sovereignty. Its criteria address provider control, data location, access management, operating staff, supplier dependencies, and continued operation when external support stops.

Location requirements distinguish between the EU and Germany. For example, SOV-3-01 separates customer data, account data, derived data, and provider data; its service options specify where each is stored and processed. Where a provider also operates outside the EU or Germany, SOV-3-01-SI requires the storage and processing location to remain clearly identifiable to the customer.

## Relationship to Other Standards

C3A adopts the structure and objectives of the [EU Cloud Sovereignty Framework](/standards/eu-cloud-sovereignty-framework) and expands its contributing factors into verifiable criteria. It presupposes that the provider meets C5:2026, BSI's criteria catalogue for cloud security. It omits the EU framework's security and compliance area, which other BSI publications cover, and environmental sustainability, which lies outside BSI's remit (section 1.2).

BSI assigns portability to the Portability and Interoperability section of C5:2026 rather than to C3A. C3A's operational focus includes maintaining service when the provider disconnects non-EU dependencies.

## Quality Attributes Addressed

| Attribute                                           | How C3A addresses it                                                                                                                          |
| :-------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| **[Data Sovereignty](/qualities/data-sovereignty)** | SOV-3-02-C requires external encryption key management, or equivalent mechanisms, for IaaS and PaaS; SOV-3-02-AC extends this to SaaS.        |
| **[Data Residency](/qualities/data-residency)**     | SOV-3-01-C1 requires customers to be able to check storage and processing locations; C2–C5 define location-specific service options.          |
| **[Auditability](/qualities/auditability)**         | SOV-3-04-C requires logs that customers can record, retain, and review to identify access to their data.                                      |
| **[Autonomy](/qualities/autonomy)**                 | SOV-4-09-C requires continued service when non-EU network connections are disconnected, with annual tests; customer connections are excluded. |

## References

### Official Sources

- [C3A, version 1.0, 27 April 2026 — BSI (PDF)](https://www.bsi.bund.de/SharedDocs/Downloads/EN/BSI/Publications/CloudComputing/C3A_Cloud_Computing_Autonomy.pdf?__blob=publicationFile&v=10), sections 1.1–1.4, SOV-3 and SOV-4-09.
- [C3A overview — BSI](https://www.bsi.bund.de/EN/Themen/Unternehmen-und-Organisationen/Informationen-und-Empfehlungen/Empfehlungen-nach-Angriffszielen/Cloud-Computing/C3A/C3A_node.html), including the clarification on portability and C5.
