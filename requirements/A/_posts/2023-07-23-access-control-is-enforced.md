---
title: Access control is enforced
tags: secure suitable
related: access control, auditability
permalink: /requirements/access-control
---

<div class="quality-requirement" markdown="1">

### Stimulus 
A user attempts to access a sensitive feature or confidential information within the system.

### Environment 
Multi-user environment with varying levels of user roles and permissions.

### Response
The system should enforce appropriate access controls based on the user's role and permissions. 
If the user's role grants access to the requested feature or information, the system should allow access without any impediments. 
However, if the user's role does not have the required permissions, the system should deny access and display a relevant and user-friendly error message. 
Additionally, any access control violations should be logged and reported to authorized personnel for further investigation.


### Background 
In this scenario, the access control requirement is defined for a multi-user system with different levels of user roles and permissions. 
When a user attempts to access a sensitive feature or confidential information, the system should respond by enforcing appropriate access controls.

Precise metrics to determine when the requirement is met include:

**Authentication**: Users must be authenticated before accessing any sensitive data. Authentication should be based on a strong authentication method, such as multi-factor authentication (MFA) or biometric authentication.

**Authorization**: The system should grant access to sensitive customer data based on the principle of least privilege. Authorized users should have only the minimum level of access necessary to perform their tasks.

**Role-Based Access Control** (RBAC): Access to sensitive data should be determined by user roles. Precise roles should be defined, such as "Customer Service Representative," "Financial Analyst," and "Administrator," and access permissions should be assigned accordingly.

**Data Classification**: Sensitive customer data should be classified based on its level of sensitivity (e.g., public, internal, confidential). Access controls should be configured according to these classifications, with stricter controls for highly sensitive data.

**Audit Trail**: The system should maintain a detailed audit trail of all access attempts to sensitive data. This includes recording the user's identity, timestamp, accessed data, and the outcome (granted or denied). Audit logs should be tamper-proof and securely stored.

**Access Revocation**: The system should allow authorized personnel to revoke access permissions immediately when necessary, such as in cases of employee termination or data breaches.

**Session Management**: Sessions should have a timeout mechanism to automatically log users out after a period of inactivity to prevent unauthorized access in the event a user leaves their session unattended.
</div><br>



Source: This scenario has been created with help from [ChatGPT](https://chat.openai.com) by using the prompt `create a quality scenario to describe an access control requirement`.



