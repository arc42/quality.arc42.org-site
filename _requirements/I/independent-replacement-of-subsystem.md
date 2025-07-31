---
title: "Independent replacement of subsystem"
tags: flexible operable efficient
related: adaptability, agility, changeability, efficiency, maintainability
permalink: /requirements/independent-replacement-of-subsystem
---

<div class="quality-requirement" markdown="1">

**Background**: The system will use an external payment provider. If a different payment provider is chosen, the system needs to be able to quickly adapt to the new payment provider.

#### Source

Development team

**Stimulus**: New payment provider needs to be integrated

**Reaction**: Integration can be done without changing any other subsystem or component

**Metric**: The following applies to all other subsystems:
* The source code remains identical
* Compile, build and test processes remain identical
* Deployment, installation and configuration remain identical


</div><br>




