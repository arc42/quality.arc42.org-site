---
title: "Fraud detection drift detected within 1 hour"
tags: [reliable, operable]
related: [drift-detectability, reliability, diagnosability, data-quality]
permalink: /requirements/fraud-detection-drift-detected-within-1-hour
---

### Context

A payment platform uses a machine-learning model to score card and wallet transactions for fraud risk.
Fraud patterns, merchant behavior, customer behavior, and attack campaigns change over time.
The fraud team needs early evidence when production traffic or model behavior diverges from the validated release baseline.

### Trigger

Production transaction traffic is scored by the fraud detection model.

### Acceptance Criteria

- Feature drift: for the top **30** model features, distribution drift is evaluated every **15 min** against the approved release baseline; source: feature-monitoring job; horizon: continuous production monitoring.
- Score drift: if the prediction-score distribution's Population Stability Index (PSI) against the approved release baseline is **PSI >= 0.20** for **2 consecutive 15-minute windows**, an alert is emitted within **<= 60 min** of the first breached window; source: model-monitoring dashboard and alert log.
- Segment localization: every drift alert ranks merchant category, country, and payment method by their **per-segment PSI** against the release baseline and explicitly names every segment whose **per-segment PSI >= 0.20**; the active model version is always recorded; source: drift-analysis report.
- Delayed-label quality drift: once confirmed fraud labels are available, recall and false-positive-rate are evaluated daily against the release baseline on a rolling 7-day window; a **recall drop of >= 3 percentage points** or a **false-positive-rate rise of >= 0.5 percentage points** creates a fraud-analyst review task within **1 business day**; source: labeled-outcome evaluation job.
- Failure-path behavior: if monitoring data is missing for **> 30 min**, the system emits a high-priority monitoring-gap alert and marks the model-health status as **unknown**; source: monitoring heartbeat and incident log.

### Monitoring Artifact

Fraud model drift dashboard with feature drift, score drift, delayed-label quality drift, affected segments, and alert history.
