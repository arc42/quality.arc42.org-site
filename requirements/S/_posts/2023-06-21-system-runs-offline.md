---
title: "System runs offline"
tags: reliable operable
related: reliability, autonomy
permalink: /requirements/system-runs-offline
---

<div class="quality-requirement" markdown="1">

**Background**: Conductor in a train uses device to validate a ticket without any network connection being available. During validation only 5% false-negatives are allowed

**Source**: Conductor

**Stimulus**: Validates ticket using device

**Reaction**: Ticket is validated using certificate information on the device

**Metric**: When the device is offline, the validation accuracy should not drop below 95%


</div><br>




