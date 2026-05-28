---
title: "Medical triage model confidence is calibrated"
tags: [safe, reliable]
related: [calibration, safety, accuracy, reliability]
permalink: /requirements/calibrated-medical-triage-confidence
---

### Context

A medical triage model assigns urgency categories and confidence values for incoming patient cases.
Clinicians use the confidence value to decide whether to accept the recommendation directly, review it more carefully, or escalate immediately.

### Trigger

The triage model produces a recommendation and confidence score for a patient case.

### Acceptance Criteria

- Confidence reliability: among cases assigned **>= 90%** confidence, observed correctness is at least **87%** in monthly clinical review samples; source: labeled outcome review; horizon: monthly.
- Critical-condition calibration: for high-risk categories, underconfidence and overconfidence gaps must each remain within **<= 5 percentage points** against confirmed clinical outcomes; source: safety validation report; horizon: each release.
- Abstention threshold: if model confidence is below the configured threshold for a critical condition, the system must route the case to clinician review instead of presenting a high-confidence recommendation; source: clinical scenario test suite; horizon: each release.
- Site-level calibration: calibration metrics are reported separately for each clinical site with at least **200** labeled cases per quarter; source: site calibration dashboard; horizon: quarterly.
- Failure-path behavior: if calibration monitoring data is unavailable for **> 7 days**, triage recommendations are marked "confidence unverified" until monitoring is restored.
