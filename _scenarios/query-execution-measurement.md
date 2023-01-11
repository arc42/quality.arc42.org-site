---
title: "Query execution measurement"
tags: efficient
related: efficiency, time-behaviour, memory-usage, resource-efficiency, resource-utilization
permalink: /scenarios/query-execution-management
---

<div class="arc42-help" markdown="1">
**Background**: We execute a large number of cpu- and memory-intensive database queries within our system. A dignostic component can measure the execution time of these queries, if `query-diagnosis` configuration is turned on.

Query diagnosis must not add more than 1% or 2msec runtime overhead to the queries, whichever is larger. 
For example, a query which takes 200msec to complete must not take more than 202msec with diagnosis, a 100msec query not more than 102msec.

Query diagnosis must not add more than 1MB memory footprint to system execution.

</div><br>







