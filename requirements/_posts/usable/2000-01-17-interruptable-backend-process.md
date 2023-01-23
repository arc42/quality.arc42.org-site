---
title: "Interruptable backend process"
tags: usable
related: usability, user-experience, time-behaviour
permalink: /requirements/interruptable-backend-process
---

<div class="quality-requirement" markdown="1">

**Stimulus**: User has (accidently) started a report generation, but now wants to interrupt and clicks the `abort` or `cancel` button or select the cancel-function via keyboard.
**Reaction**: The system interrupts the report generation, saves the current generation state (in case user wants to continue later) and returns control to the user interface. 
**Metric**: User gets back full keyboard or mouse control within at most 10 seconds. That means that all backend generation tasks or processes have acknowledged the abort/cancel signal.

**Background**: The generation of such reports is performed in several parallel threads or processes, eventually on different OS-processes, virtual machines or containers. Cancelling or aborting needs to handle such kind of distributed execution.
</div><br>




