---
title: "Protect Data by Establishing Security Protocols"
tags: [secure, safe, reliable]
related: [safety, cyber-security, security, information-security, patient-safety]
permalink: /requirements/protect-data-by-security-procols
---

<div class="quality-requirement" markdown="1">

#### Context

A medical system stores, transmits, and administers patient data. Regulatory and ethical obligations require enforceable security controls.

#### Trigger

A release candidate is prepared, or a scheduled security review is due.

#### Acceptance Criteria

- Zero unresolved critical and ≤ 5 unresolved high vulnerabilities older than 30 days on patient-data systems (authenticated vulnerability scan, weekly + every release).
- Penetration test at least once per 12 months and after each major architecture change; critical findings remediated within 14 days; releases with open critical findings are blocked (pen-test report and remediation tracker).
- 100% of privileged access to patient records is logged (identity, timestamp, action, target); audit queries for any 24 h window complete within 60 s (audit-log validation report, every release).

</div><br>
