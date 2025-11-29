---
title: "Efficient generation of test data"
tags: [efficient, suitable]
related: [efficiency, time-behaviour, capacity]
permalink: /requirements/efficient-generation-of-test-data
---

<div class="quality-requirement" markdown="1">

#### Context

The complex database structure of system xyz contains a few dozens of tables with around 100 columns and several dozens of (foreign-key) relationships/dependencies between these tables. Data from production must only be used when heavily anonymized.

#### Trigger

A tester needs a large set of test data for system xyz.

#### Acceptance Criteria

- Specific generator creates 1GByte of test data for system xyz
- Test data created in less than 60 minutes
- Generated data respects foreign-key relationships and dependencies
- Production data only used when heavily anonymized

</div><br>



