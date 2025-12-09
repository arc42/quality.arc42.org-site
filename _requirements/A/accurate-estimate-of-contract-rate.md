---
title: Accurate estimate of insurance contract rate
tags: [usable, suitable]
related: [accuracy, preciseness, precision, reliability, functional-correctness, interaction-capability]
permalink: /requirements/accurate-estimate-of-insurance-rate
---

<div class="quality-requirement" markdown="1">

#### Context

The system is an online application for configuring health insurance contracts. The final price of the insurance rate needs to be determined by backoffice employees due to legal and organizational reasons. This constraint cannot currently be relaxed.

#### Trigger

A user configures a health insurance contract in the online app.

#### Acceptance Criteria

- System calculates price estimate based on currently available information
- Estimate falls within ±15% margin relative to the final price
- At least 95% of estimates meet the ±15% margin requirement
- Regular audits performed on contract samples to verify compliance

</div><br>







