---
title: Detailed audit log
tags: secure suitable
related: accountability  
permalink: /requirements/detailed-audit-log
---

<div class="quality-requirement" markdown="1">


#### Context/Background

The system stores personal data and operates in compliance with privacy and data protection regulations.
The system maintains detailed audit logs of all user actions related to personal data.
These logs are crucial for ensuring accountability, transparency, and compliance with regulations.
The logs facilitate the identification and investigation of any unauthorized or suspicious activities related to personal data.

#### Source

User submits a request to access personal data stored in the system.

#### Metric/Acceptance Criteria

The system must maintain a detailed audit log of all user actions, including data access, modification, and deletion.
The audit log must meet the following criteria:
* Include associated timestamps and user identifiers for each action
* Be tamper-proof to prevent unauthorized modifications
* Be accessible only to authorized personnel
* Be retained for a minimum of five years
* Capture 100% of user actions related to personal data
* Be searchable and retrievable within 24 hours of a request by authorized personnel
* Undergo regular integrity checks to ensure no tampering has occurred
* Be backed up securely to prevent data loss
* Comply with all relevant privacy and data protection regulations
</div><br>

>This "requirement" describes a solution approach to accountability.

Source: This scenario has been created with help from [ChatGPT](https://chat.openai.com) by using the prompt `create a quality scenario to describe an accountability requirement`.



