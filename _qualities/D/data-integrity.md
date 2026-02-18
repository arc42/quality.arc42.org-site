---
title: Data Integrity
tags: [reliable, secure]
related: [integrity, data-quality, accuracy, correctness, consistency, authenticity, non-repudiation, transactionality]
standards: [iso27001, iso25024, pcidss, hl7, nist80053, iso15408, gdpr, sox, ieee2857, owaspasvs, iso8000]
permalink: /qualities/data-integrity
---

See also [#reliable](/tag-reliable) and [#secure](/tag-secure).

## Definitions

>Data integrity refers to the maintenance and assurance of accuracy, consistency, and reliability of data over its entire life cycle. It ensures that data remains unaltered and consistent from creation to deletion, maintaining its original state unless specifically modified through authorized processes.

<hr class="with-no-margin"/>

>Data integrity is the maintenance of, and the assurance of, data accuracy and consistency over its entire life-cycle and is a critical aspect to the design, implementation, and usage of any system that stores, processes, or retrieves data.
>
>[Wikipedia - Data Integrity](https://en.wikipedia.org/wiki/Data_integrity)

<hr class="with-no-margin"/>

>Data integrity refers to the overall completeness, accuracy and consistency of data. Data must be maintained in a correct state during its entire lifecycle, including storage, transfer and processing.
>
>[IBM - What is Data Integrity?](https://www.ibm.com/topics/data-integrity)

<hr class="with-no-margin"/>

>The property that data has not been altered or destroyed in an unauthorized manner.
>
>[NIST SP 800-53 Rev. 5](https://csrc.nist.gov/glossary/term/data_integrity)

<hr class="with-no-margin"/>

>Data integrity is a fundamental component of information security. In its broadest use, "data integrity" refers to the accuracy and consistency of data stored in a database, data warehouse, data mart or other construct.
>
>[Oracle - What is Data Integrity?](https://www.oracle.com/database/what-is-data-integrity/)

## Types of Data Integrity

### **Physical Integrity**
- Protection against hardware failures, power outages, and natural disasters
- Ensures data remains intact despite physical storage medium issues
- Implemented through redundancy, backups, and error-correcting codes

### **Logical Integrity** 
- Maintains data accuracy and consistency according to business rules
- Includes entity integrity, referential integrity, and domain integrity
- Enforced through database constraints, validation rules, and data types

## Key Characteristics

- **Accuracy**: Data correctly represents the real-world entities or events
- **Consistency**: Data remains uniform across all systems and databases
- **Completeness**: All required data elements are present and accounted for
- **Validity**: Data conforms to defined formats, ranges, and business rules
- **Reliability**: Data can be trusted for decision-making and operations
- **Non-repudiation**: Changes to data can be tracked and verified

## Implementation Mechanisms

- **Database constraints** (primary keys, foreign keys, check constraints)
- **Data validation** at input and processing stages
- **Checksums and hash functions** for detecting unauthorized changes
- **Digital signatures** for authenticity verification
- **Access controls** and audit trails
- **Backup and recovery procedures**
- **Transaction logging** and rollback capabilities

## Relationship to Other Qualities

**Data Integrity builds upon:**
- **[Integrity](/qualities/integrity)**: General system integrity principles
- **[Data Quality](/qualities/data-quality)**: Broader data fitness for purpose
- **[Accuracy](/qualities/accuracy)**: Precise representation of true values
- **[Correctness](/qualities/correctness)**: Functional accuracy of operations
- **[Consistency](/qualities/consistency)**: Uniform behavior across systems
- **[Authenticity](/qualities/authenticity)**: Verification of data source and genuineness

## Standards and Compliance

- **ISO/IEC 27001**: Information security management including data protection
- **ISO/IEC 25024**: Data quality measurement frameworks
- **NIST SP 800-53**: Security controls including data integrity measures
- **PCI DSS**: Payment data protection requirements
- **GDPR**: Data protection and accuracy requirements in EU
- **SOX**: Financial data accuracy and audit requirements

## Measurement Approaches

- **Data validation error rates** during input processing
- **Checksum verification** success rates for stored data
- **Audit trail completeness** for data modifications
- **Recovery testing** effectiveness and data consistency post-recovery
- **Cross-system data consistency** verification results
- **Unauthorized modification detection** capabilities