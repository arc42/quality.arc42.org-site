---
title: "Independent enhancement of subsystem"
tags: [efficient, flexible]
related: [efficiency, maintainability, changeability, adaptability, agility] 
permalink: /requirements/independent-enhancement-of-subsystem
---

<div class="quality-requirement" markdown="1">

#### Context

Extensions or changes to a subsystem should be possible independently of all other subsystems.

#### Trigger

Development team changes code or configuration within a subsystem or component.

#### Acceptance Criteria

- No other subsystem needs to be changed
- For all other subsystems, the following remains identical:
  - Source code
  - Compile, build and test processes
  - Deployment, installation and configuration


</div><br>




