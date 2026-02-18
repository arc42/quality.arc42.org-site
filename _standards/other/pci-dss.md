---
layout: page_standard
title: "PCI Data Security Standard (PCI DSS)"
standard_id: pcidss
shortname: "PCI DSS"
categories: [security, sector]
permalink: /standards/pci-dss
---

## PCI Data Security Standard (PCI DSS)

The Payment Card Industry Data Security Standard (PCI DSS) defines baseline technical and operational requirements to protect payment account data. 
It applies to all entities that store, process, or transmit cardholder data and/or sensitive authentication data, or can impact their security.


PCI DSS was created in 2004 by consolidating five different security programs from major card brands (Visa, Mastercard, American Express, Discover, and JCB) to address interoperability problems and ensure consistent security measures across the payment industry.

## Core Requirements Structure

PCI DSS organizes its twelve requirements into six control objectives:

| Control Objective                        | Requirements | Purpose                                                                   |
| :--------------------------------------- | :----------- | :------------------------------------------------------------------------ |
| **Build and maintain secure networks**   | 1-2          | Install network security controls and secure system configurations        |
| **Protect cardholder data**              | 3-4          | Protect stored account data and encrypt transmission over public networks |
| **Maintain vulnerability management**    | 5-6          | Protect against malware and develop secure systems                        |
| **Implement access controls**            | 7-8          | Restrict access by business need and authenticate users                   |
| **Monitor and test networks**            | 9-11         | Restrict physical access, log activity, and test security regularly       |
| **Maintain information security policy** | 12           | Support information security with organizational policies                 |

## Compliance Validation

Compliance validation depends on merchant transaction volume levels:

- **Level 1**: Over 6 million transactions annually - requires Report on Compliance (ROC) by Qualified Security Assessor (QSA)
- **Level 2**: 1-6 million transactions - QSA assessment or Self-Assessment Questionnaire (SAQ)
- **Level 3**: 20,000-1 million transactions - SAQ and quarterly network scans
- **Level 4**: Under 20,000 transactions - SAQ (requirements set by acquirer)

## Current Version

The current standard is **PCI DSS v4.0.1** (June 2024), which introduced enhanced security requirements including mandatory multi-factor authentication, increased flexibility for demonstrating security, and updated firewall terminology to address modern threats.

## Quality Attributes Required or Emphasized

| Attribute | Relevance in PCI-DSS |
| :-------- | :------ |
| **[Security](/qualities/security)** | Core objective: prevent unauthorized disclosure, alteration, and misuse of payment account data across people, process, and technology |
| **[Confidentiality](/qualities/confidentiality)** | Encryption and key management protect stored data; strong cryptography protects data in transit |
| **[Integrity](/qualities/integrity)** | Secure configurations, change controls, code security, and monitoring reduce risk of unauthorized or accidental modification |
| **[Availability](/qualities/availability)** | Indirectly supported via hardening, malware protection, logging/monitoring, and testing that reduce outages due to security incidents |
| **[Access Control](/qualities/access-control)** | Need-to-know access, least privilege, strong authentication (including MFA), and session management |
| **[Authenticity](/qualities/authenticity)** | User identification and robust authentication to ensure actions are attributable to legitimate identities |
| **[Accountability](/qualities/accountability)** | Detailed logging, monitoring, and review of security events and access to cardholder data |
| **[Compliance](/qualities/compliance)** | Demonstrable conformance through assessments (QSA, SAQ) and brand/acquirer validation programs |                     |
| **[Non-repudiation](/qualities/non-repudiation)**  | Detailed audit trails to prevent denial of payment transactions and security events                     |
| **[Vulnerability Management](/qualities/vulnerability-management)** | Regular vulnerability scanning and security testing requirements   |

## References


- [PCI Security Standards Council](https://www.pcisecuritystandards.org/)
- [PCI DSS v4.0.1](https://docs-prv.pcisecuritystandards.org/PCI%20DSS/Standard/PCI-DSS-v4_0_1.pdf) - Current version (June 2024)
- [PCI DSS Document Library](https://www.pcisecuritystandards.org/document_library/?category=pcidss)

