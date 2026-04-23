---
title: "Fast creation of sales report"
tags: [efficient]
related: [efficiency, performance, time-behaviour, speed, responsiveness]
permalink: /requirements/fast-creation-of-sales-report
---

#### Context

The warehouse business generates hundreds of thousands of sales per day, and users request a daily sales report as a PDF from the graphical user interface. Report generation must stay fast enough that users can work interactively instead of queueing manual follow-up work.

#### Trigger

An authenticated user requests the daily sales report in PDF format for the previous business day.

#### Acceptance Criteria

- Report latency: for a report covering up to **500,000** sales records, the PDF is generated within **<= 10 s at p95**; source: report-generation traces; horizon: rolling 7-day window.
- Generation success: the report-generation success rate is **>= 99.5%** for the same workload profile; source: application metrics and error log; horizon: rolling 30-day window.
- Failure-path behavior: if either threshold is missed in staging or production validation, release of report-generation changes is blocked until the target is restored; source: release gate log; horizon: every qualifying release.
