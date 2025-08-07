---
layout: page
title: "#secure"
hide: true
permalink: /tag-secure/
---



<div class="arc42-help" markdown="1">

- preventing unauthorized access to assets such as computers, networks, and data.
- maintaining confidentiality, integrity and availability of (sensitive) information

</div><br>

<hr class="with-no-margin"/>

### Definition

>Capability of a product to protect information and data so that persons or other products have the degree of data access appropriate to their types and levels of authorization, and to defend against attack patterns by malicious actors.
>
>[ISO-25010:2023](/references/#iso-25010-2023)

## Typical Acceptance Criteria


### Scenario Response Measures from [Bass et al.]

>* How much of a resource is compromised or ensured?
>* Accuracy of attack detection
>* How much time passes before an attack is detected?
>* How many attacks are resisted?
>* How long does it take to recover from a successful attack?
>* How much data is vulnerable to a particular attack?
>
>[Bass et al., 2021](/references/#bass2021software)


### What Stakeholders mean by _secure_


| Stakeholder | (potential) Expectation for _secure_ |
|:--- |:--- |
| User |* my personal data is never compromised or leaked to (hostile) third parties<br>* a good compromise between privacy and usability is achieved<br> |
| Management |* lowest possible risk of data breaches<br>* full compliance with [GDPR](https://gdpr.eu/) or similar data protection and privacy regulations<br>* full adherence to all licenses, of e.g. commercial or open-source tools, libraries or frameworks<br>* appropriate network security measures taken<br>* regular backups, tested and automated<br>* minimal attack vectors |
| Developer |* despite corporate security measures, public sources (like Stack Overflow, GitHub and common search engines) are accessible<br>security strategies like VPNs or MFA are easy to use<br>* automated and tested backup for everything<br>* all important documents and files are version-controlled  |
| Tester | - |
| Admin |* smallest possible attack surface<br>* restrictive firewall rules<br>* minimal access rights for all stakeholders (least privilege)<br>* intrusion detection in place<br>* automated malware scans for all incoming data and files<br>*  |
| Domain-Expert | - |
| Others |Security auditor, Data protection officer, government or corporate security departments, attackers  |

<!-- include all qualities associated with this tag -->
{% include one-quality.html tag="secure"  %}

<!-- include all requirements associated with this tag -->
{% include one-requirement.html tag="secure"  %}

