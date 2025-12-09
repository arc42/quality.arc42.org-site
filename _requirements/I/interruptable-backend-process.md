---
title: "Interruptable backend process"
tags: [usable]
related: [usability, user-experience, time-behaviour, interaction-capability]
permalink: /requirements/interruptable-backend-process
---

<div class="quality-requirement" markdown="1">

#### Context

Report generation is performed in several parallel threads or processes, eventually on different OS-processes, virtual machines or containers. Cancelling or aborting needs to handle distributed execution.

#### Trigger

User has (accidentally) started report generation, but now wants to interrupt and clicks `abort` or `cancel` button or selects cancel-function via keyboard.

#### Acceptance Criteria

- System interrupts report generation
- Current generation state saved (in case user wants to continue later)
- Control returns to user interface
- User gets back full keyboard or mouse control within at most 10 seconds
- All backend generation tasks or processes have acknowledged abort/cancel signal

</div><br>



