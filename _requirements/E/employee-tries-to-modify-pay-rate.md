---
title: "Employee attempts to modify pay rate"
tags: [secure]
related: [security, privacy, traceability, integrity]
permalink: /requirements/employee-attempts-to-modify-pay-rate
---

<div class="quality-requirement" markdown="1">

#### Context
The payroll system handles sensitive employee compensation data and must prevent unauthorized modifications while maintaining audit trails for compliance.

#### Trigger
A disgruntled employee at a remote location attempts to improperly modify pay rate data during normal operation.

#### Acceptance Criteria
- Unauthorized access attempts are detected and blocked
- All access attempts are logged in an audit trail
- Compromised data is restored from backups within 1 business day

</div><br>

Source: [Bass et al., 2021](/references/#bass2021software)


