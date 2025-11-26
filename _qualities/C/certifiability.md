---
title: Certifiability
tags: [suitable, reliable, safe]
related: [compliance, testability, auditability, traceability, documentation, verifiability, safety, analyzability]
standards: [iso26262, do178c, iec62304, iec61508]
permalink: /qualities/certifiability
---

>The degree to which a system can be certified to meet specific regulatory, safety, or quality standards through demonstration of compliance evidence.

<hr class="with-no-margin"/>

>Certifiability refers to the ease with which a product or system can be assessed and approved by certification authorities against applicable standards and regulations.
>
>High certifiability requires:
>- Complete and traceable requirements
>- Comprehensive documentation
>- Verifiable test evidence
>- Auditability of development processes
>- Compliance with standard-specific practices
>
>[Adapted from safety-critical systems literature]

<hr class="with-no-margin"/>

Certifiability is essential in safety-critical and regulated domains:

**Aviation (DO-178C)**
- Software certification for airborne systems
- Requires extensive documentation, traceability, and testing evidence
- Different assurance levels based on failure severity

**Automotive (ISO 26262)**
- Functional safety certification for road vehicles
- Automotive Safety Integrity Levels (ASIL A-D)
- Systematic capability and hardware integrity requirements

**Medical Devices (IEC 62304)**
- Software lifecycle processes for medical device software
- Safety classifications based on potential harm
- Design control and risk management requirements

**Industrial Systems (IEC 61508)**
- Functional safety for electrical/electronic/programmable systems
- Safety Integrity Levels (SIL 1-4)
- Systematic and random hardware failure management

<hr class="with-no-margin"/>

### Key Factors Affecting Certifiability

1. **Traceability** - Requirements to design to code to tests
2. **Documentation** - Architecture, design decisions, verification results
3. **Process Compliance** - Following standard-mandated development processes
4. **Tool Qualification** - Certification of development and verification tools
5. **Configuration Management** - Version control and change tracking
6. **Verification Evidence** - Test coverage, static analysis, formal methods
7. **Independence** - Separation between development and verification

See also: [compliance](/qualities/compliance), [safety](/qualities/safety), [traceability](/qualities/traceability)
