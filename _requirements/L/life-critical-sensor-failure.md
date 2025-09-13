---
title: "Backup patient monitoring sensor takes over"
tags: [safe]
related: [safety, efficiency, reliability, patient-safety]
permalink: /requirements/backup-patient-monitoring-sensor
---

<div class="quality-requirement" markdown="1">

Idea: [Bass et al., 2021](/references/#bass2021software)

#### Context

The system monitors patients several health and vitality parameters (e.g. heartbeat frequency and amplitude, blood flow in coronary artery etc)

#### Stimulus

A sensor in the patient monitoring system fails to report a life-critical value after 100 ms. 

#### Reaction


The failure is logged, a warning light is illuminated on the console, and a backup (lower-fidelity) sensor is engaged. 

#### Metric


The system monitors the patient using the backup sensor after no more than 300 ms.


</div><br>




