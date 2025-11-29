---
title: "Independent replacement of subsystem"
tags: [flexible, operable, efficient]
related: [adaptability, agility, changeability, efficiency, maintainability]
permalink: /requirements/independent-replacement-of-subsystem
---

<div class="quality-requirement" markdown="1">

#### Context

The system will use an external payment provider. If a different payment provider is chosen, the system needs to be able to quickly adapt to the new payment provider.

#### Trigger

Development team needs to integrate a new payment provider.

#### Acceptance Criteria

- Integration can be done without changing any other subsystem or component
- For all other subsystems, the following remains identical:
  - Source code
  - Compile, build and test processes
  - Deployment, installation and configuration


</div><br>




