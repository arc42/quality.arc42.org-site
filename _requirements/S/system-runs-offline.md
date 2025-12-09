---
title: "System runs offline"
tags: [reliable, operable]
related: [reliability, autonomy]
permalink: /requirements/system-runs-offline
---

<div class="quality-requirement" markdown="1">

#### Context

Conductor in a train uses device to validate tickets without any network connection being available. During validation only 5% false-negatives are allowed.

#### Trigger

Conductor validates ticket using device while offline.

#### Acceptance Criteria

- Ticket is validated using certificate information stored on the device
- Validation accuracy does not drop below 95% when device is offline
- Maximum false-negative rate: 5%


</div><br>




