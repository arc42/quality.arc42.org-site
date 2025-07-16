---
title: "Expressive error messages"
tags: usable
related: usability, user-experience, fault-isolation, graceful-degradation, hazard-warning, user-assistance, interaction-capability
permalink: /requirements/expressive-error-messages
---

<div class="quality-requirement" markdown="1">

**Stimulus**: An error / exceptional situation occurs in the technical infrastructure (memory overflow, out-of-memory, hardware error, virtual-machine-issue, container-related-issue).

**Reaction**: The system detects the error, reports (as far as possible) to the user and shuts down in a controlled manner. The message shall contain specific explanations and instructions on possible reactions. 

**Metric**: Error detection occurs within 15 seconds, message to user (if still possible) within 1 second, shutdown within 15 seconds.


**Background**: If an error situation occurs, this is displayed to the user in expressive, meaningful messages. 

</div><br>




