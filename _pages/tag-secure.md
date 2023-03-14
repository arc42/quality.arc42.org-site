---
layout: page
title: "#secure"
hide: true
permalink: /tag-secure/
---



<div class="arc42-help" markdown="1">

- preventing unauthorized access to assets such as computers, networks, and data.
- maintaining integrity and confidentiality of (sensitive) information

</div><br>

<hr class="with-no-margin"/>

### Definition

>Capability of a product to protect information and data so that persons or other products have the degree of data access appropriate to their types and levels of authorization, and to defend against attack patterns by malicious actors.
>
>[ISO-25010-2022](/references/#iso-25010-2022)

## Typical Acceptance Criteria


### Scenario Response Measures from [Bass et al.]

>* How much of a resource is compromised or ensured?
>* Accuracy of attack detection
>* How much time passes before an attack is detected?
>* How many attacks are resisted?
>* How long does it take to recover from successful attack?
>* How much data is vulnerable to a particular attack?
>
>[Bass et. al, 2022](/references/#bass-swa-practice)


### What Stakeholders mean by _secure_


| Stakeholder | (potential) Expectation for _secure_ |
|:--- |:--- |
| User |* my personal data is never compromised or leaked to hostile parties<br>* a good compromise privacy and usability is achieved<br> |
| Management |* lowest possible risk of data breaches<br>* full compliance with [GDPR](https://gdpr.eu/) or similar regulations<br>* full adherence to all licenses, of e.g. commercial or open-source tools, libraries or frameworks<br>* appropriate network security measures taken<br>* regular backups, tested and automated<br>* minimal attack vectors |
| Developer |* despite corporate security rules, public sources (like Stackoverflow, Github and search engines) are accessible<br>security strategies like VPNs or 2FA are easy to use<br>* automated and proven backup for everything<br>* all important documents and files are version-controlled  |
| Tester | - |
| Admin |* smalles possible attack surface<br>* restrictive firewall rules<br>* minimal access rights for all stakeholders<br>* intrusion detection in place<br>* automated malware scans for all incoming data and files<br>*  |
| Domain-Expert | - |
| Others |Security auditor, Data protection officer, government or corporate security departments, attackers  |

<!-- include all qualities associated with this tag -->
{% include one-quality.md topic="secure"  %}
