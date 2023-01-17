---
title: "Efficient generation of test data"
tags: efficient testable
related: efficiency, time-behaviour, capacity
permalink: /scenarios/efficient-generation-of-test-data
---

<div class="quality-requirement" markdown="1">

**Stimulus**: A tester needs a large set of test data for system xyz.


**Reaction**: A specific generator creates 1GByte of test data for system xyz.


**Metric**: The data is created in less than 60minutes

**Background**: The complex database structure of system xyz contains a few dozens of tables with around 100 columns and several dozens of (foreign-key) relationsships/dependencies between these tables.

Data from production must only be used when heavily anonymized.
</div><br>



