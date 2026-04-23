---
title: "Zero-knowledge data storage"
tags: [secure]
related: [confidentiality, security, privacy]
permalink: /requirements/zero-knowledge-data-storage
---

#### Requirement

The file-storage service must be zero-knowledge for user file content: the operator stores encrypted content, but neither the service nor administrative staff can decrypt that content without user-controlled keys. This claim applies to file content, not necessarily to operational metadata such as file size or upload time.

#### Acceptance Criteria

- Key-custody boundary: in each production release review, **0** service-side identities in the application, operations, support, or database-admin scope can export or retrieve plaintext customer content keys; source: IAM/KMS policy audit and privileged-access test report; horizon: every production release.
- Operator non-decryptability: in a quarterly audit drill with full operator access to storage, backups, logs, and databases but without user-supplied keys, **100%** of a random sample of **>= 20** customer files remain undecryptable; source: audit drill report; horizon: quarterly.
- Recovery boundary and gate: in simulated lost-key tests, operator-assisted recovery succeeds for **0 of 10** encrypted sample files; if any threshold above is missed, the product must not be described as zero-knowledge and the affected release is blocked within **<= 1 business day**; source: recovery test report, product copy review, and release gate log; horizon: each release candidate.
