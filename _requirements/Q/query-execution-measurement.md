---
title: "Low-overhead query execution measurement"
tags: [efficient]
related: [efficiency, time-behaviour, memory-usage, resource-efficiency, resource-utilization]
permalink: /requirements/query-execution-management
---

#### Context

The system runs CPU- and memory-intensive database queries. A diagnostic component can measure execution times when `query-diagnosis` is enabled.

#### Trigger

Query diagnosis is enabled in production or a staging environment.

#### Acceptance Criteria

- p95 runtime overhead ≤ 1% for queries with baseline ≥ 200 ms, and ≤ 2 ms absolute for faster queries, across the top-50 benchmark suite (benchmark report, each diagnostic-component release).
- Peak resident-memory increase ≤ 1 MB vs. baseline under the same benchmark (profiler report, each diagnostic-component release).
- If either threshold is missed, diagnosis stays disabled by default and the component release is blocked within 1 business day (release gate log).
