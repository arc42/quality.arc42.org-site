---
title: Automated Personal Data Lifecycle Protection
tags: [secure, suitable]
related: [data-protection, privacy, compliance, security, auditability]
permalink: /requirements/personal-data-lifecycle-protection
---

<div class="quality-requirement" markdown="1">

#### Context
A multinational Financial Services platform processes "Personally Identifiable Information" (PII) and "Sensitive Personal Data" across multiple jurisdictions (EU/GDPR, California/CCPA). The system must ensure data remains protected even in the event of partial system compromise or administrative errors.

#### Trigger
Personal data is ingested, stored, accessed for processing, or requested for deletion by a data subject.

#### Acceptance Criteria

*   **Encryption at Rest & Transit**: 100% of PII fields (defined in the Data Dictionary) are encrypted at rest using **AES-256-GCM** with per-customer keys (Envelope Encryption). 100% of data in transit uses **TLS 1.3** with Perfect Forward Secrecy.
*   **Anonymization for Non-Production**: 100% of data exported to staging or analytics environments is automatically anonymized via **k-anonymity (k≥5)** or differential privacy, ensuring no individual can be re-identified with >0.01% probability.
*   **Data Subject Rights (SRR)**: The system provides an automated "Self-Service Privacy Portal" where users can trigger a "Right to be Forgotten." 100% of the user's PII is purged from all active databases and search indexes within **24 hours**, and from all immutable backups within **30 days**.
*   **Access Accountability**: Every access to sensitive data fields (e.g., Social Security Numbers, Health Records) is logged with a tamper-proof audit trail (HMAC-chained). Audit logs must be searchable and reportable within **60 seconds** for any 24-hour window.
*   **Breach Notification Latency**: In the event of unauthorized data access detection, the system automatically generates a "Data Impact Report" identifying 100% of affected records and their jurisdictions within **4 hours** of incident confirmation.
*   **Data Retention Enforcement**: 100% of records exceeding the legal retention period (e.g., 7 years for financial records) are automatically flagged and securely overwritten (not just logically deleted) within **7 days** of expiry.

</div>
