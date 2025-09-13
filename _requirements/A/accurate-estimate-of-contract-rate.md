---
title: Accurate estimate of insurance contract rate
tags: [usable, suitable]
related: [accuracy, preciseness, precision, reliability, functional-correctness, interaction-capability]
permalink: /requirements/accurate-estimate-of-insurance-rate
---

<div class="quality-requirement" markdown="1">

#### Context/Background

The system is an online application for configuring health insurance contracts.
The final price of the insurance rate needs to be determined by the backoffice employees of the insurance company due to legal and organizational reasons.
This constraint cannot currently be relaxed.

#### Source

User interaction: A user configures a health insurance contract in the online app.

#### Metric/Acceptance Criteria

The system must calculate a price estimate based on the currently available information.
This estimate must be within a ±15% margin relative to the final price.
This can be measured by:
* Comparing the system-generated estimate to the final price determined by backoffice employees
* Calculating the percentage difference between the estimate and final price
* Ensuring that at least 95% of estimates fall within the ±15% margin
* Regularly auditing a sample of contracts to verify compliance with this metric
</div><br>







