---
title: Access control is enforced
tags: [secure, suitable]
related: access-control, auditability
permalink: /requirements/access-control-is-enforced
---

<div class="quality-requirement" markdown="1">

#### Context/Background

The system operates in a multi-user environment with varying levels of user roles and permissions.

* Sensitive features and confidential information are present within the system.
* Access control is crucial to maintain data security and privacy.
* The system employs role-based access control (RBAC) to manage user permissions.
* An audit trail is maintained for all access attempts to sensitive data.

#### Source

A user attempts to access a sensitive feature or confidential information within the system.

#### Metric/Acceptance Criteria

The system must enforce appropriate access controls based on the user's role and permissions.

The access control mechanism must meet the following criteria:
* 100% of access attempts must be authenticated before granting access to any sensitive data
* Multi-factor authentication (MFA) or biometric authentication is implemented for accessing highly sensitive data
* User roles are precisely defined (e.g., "Customer Service Representative," "Financial Analyst," "Administrator")
* Access permissions are assigned based on the principle of least privilege
* Sensitive data is classified into at least three levels (e.g., public, internal, confidential)
* Access controls are configured according to data classification, with stricter controls for highly sensitive data
* 100% of access attempts (successful and failed) to sensitive data are logged in a tamper-proof audit trail
* Audit logs include user identity, timestamp, accessed data, and outcome (granted or denied)
* Authorized personnel can revoke access permissions immediately, with changes taking effect within 60 seconds
* User sessions automatically timeout after a maximum of 30 minutes of inactivity
* Access denials display a relevant and user-friendly error message within 2 seconds
* 100% of access control violations are logged and reported to authorized personnel within 5 minutes
* The system maintains 99.99% uptime for the access control service
* Access control policy updates are applied system-wide within 5 minutes of being implemented
</div><br>



Source: This scenario has been created with help from [ChatGPT](https://chat.openai.com) by using the prompt `create a quality scenario to describe an access control requirement`.



