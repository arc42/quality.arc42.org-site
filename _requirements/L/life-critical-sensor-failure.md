---
title: "Backup patient monitoring sensor takes over"
tags: [safe]
related: [safety, efficiency, reliability, patient-safety]
permalink: /requirements/backup-patient-monitoring-sensor
---

<div class="quality-requirement" markdown="1">

Idea: [Bass et al., 2021](/references/#bass2021software)

#### Context

The system monitors patients several health and vitality parameters (e.g. heartbeat frequency and amplitude, blood flow in coronary artery etc).

#### Trigger

A sensor in the patient monitoring system fails to report a life-critical value after 100 ms.

#### Acceptance Criteria

- Failure is logged
- Warning light is illuminated on the console
- Backup (lower-fidelity) sensor is engaged
- System monitors patient using backup sensor after no more than 300 ms

</div><br>




