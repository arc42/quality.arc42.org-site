---
title: "Expressive error messages"
tags: [usable]
related: [usability, user-experience, fault-isolation, graceful-degradation, hazard-warning, user-assistance, interaction-capability]
permalink: /requirements/expressive-error-messages
---

<div class="quality-requirement" markdown="1">

#### Context

When error situations occur, they must be displayed to user in expressive, meaningful messages.

#### Trigger

Error or exceptional situation occurs in technical infrastructure (memory overflow, out-of-memory, hardware error, virtual-machine-issue, container-related-issue).

#### Acceptance Criteria

- System detects error, reports (as far as possible) to user and shuts down in controlled manner
- Message contains specific explanations and instructions on possible reactions
- Error detection occurs within 15 seconds
- Message to user (if still possible) within 1 second
- Shutdown within 15 seconds

</div><br>




