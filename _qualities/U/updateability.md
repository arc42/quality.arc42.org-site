---
title: Updateability
tags: [flexible, operable]
related: [maintainability, upgradeability, installability, modifiability, flexibility, portability, configurability, securability]
standards: [cra, iso25010, iec-62304, iec61508]
permalink: /qualities/updateability
---

> Updateability refers to the capability of a software system to efficiently receive, install, and integrate updates, patches, security fixes, and minor enhancements while maintaining system integrity and minimizing service disruption.

<hr class="with-no-margin"/>

Updateability encompasses the system's ability to handle various types of updates:
- **Security patches** addressing vulnerabilities
- **Bug fixes** resolving defects
- **Performance improvements** optimizing system behavior
- **Minor feature updates** adding functionality
- **Configuration updates** modifying system parameters

Unlike [upgradeability](/qualities/upgradeability), which deals with major version transitions, updateability focuses on incremental changes that preserve existing functionality and data structures.

<hr class="with-no-margin"/>

> Maintainability includes installation of updates and upgrades.
>
> from [ISO-25010:2023](/references/#iso-25010-2023)

<hr class="with-no-margin"/>

The [EU Cyber Resilience Act (CRA)](/standards/cra) emphasizes updateability as a core requirement for cybersecurity:

> Manufacturers must provide secure update mechanisms and deliver timely security fixes (ideally separate from feature updates), and keep released patches available.
>
> CRA mandates vulnerability handling with declared support periods and coordinated disclosure processes.

<hr class="with-no-margin"/>

Effective updateability requires:
- **Automated update mechanisms** for seamless deployment
- **Rollback capabilities** to recover from failed updates
- **Backward compatibility** to preserve existing integrations
- **Update validation** to ensure integrity and authenticity
- **Minimal downtime** during update processes
- **Clear update policies** defining support periods and procedures

Systems with poor updateability face increased security risks, technical debt accumulation, and compliance violations under regulations like CRA.