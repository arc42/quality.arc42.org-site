---
title: "Up to date API"
tags: [reliable, suitable]
related: [reliability, accuracy, correctness]
permalink: /requirements/up-to-date-api
---

#### Context

The configuration API aggregates data from multiple sources. Consumers depend on receiving current values; stale configuration leads to incorrect behavior.

#### Trigger

A source-of-truth configuration change is published.

#### Acceptance Criteria

- ≥ 95% of API responses return the updated value within 30 s of the source change (change-event timestamp vs. response-version telemetry, continuous production sampling).
- Zero stale responses after 60 s from the source change (synthetic freshness probe, continuous).
- If stale-response rate exceeds 5% at 30 s, or any stale response persists beyond 60 s for > 5 min, alert fires within 2 min and cache-invalidation playbook starts (monitoring + incident log).
