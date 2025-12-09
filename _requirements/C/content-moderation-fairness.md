---
title: "Content Moderation Fairness"
tags: [reliable, safe, suitable]
related: [fairness, bias-mitigation, transparency, accountability]
permalink: /requirements/content-moderation-fairness
---

<div class="quality-requirement" markdown="1">
#### Context

An automated content moderation system classifies user posts for policy violations across multiple languages and regions. Prior studies show performance disparities by language, dialect, and demographic proxies. The system must ensure equitable error rates and transparent processes.

#### Trigger

Trust & Safety moderation service processes content for platform operations and policy teams.

#### Acceptance Criteria

- False positive rate (FPR) and false negative rate (FNR) gaps ≤ 2.0 percentage points between any language/dialect groups on stratified benchmark
- Macro-averaged F1 within ±3 points across languages/regions with published per-group PR curves
- Balanced, representative evaluation datasets include adversarial and dialectal examples, refreshed quarterly
- Documented mitigation applied (group-aware thresholds, calibration, post-processing) with validation that no group's precision or recall worsens by >3 points (regret bound)
- Appeal workflows and human-in-the-loop review provided for low-confidence decisions
- Reviewer overrides captured for continuous improvement
- Production disparities monitored with auto-alert on sustained (>24h) metric breaches
- Safe rollback to prior model enabled
- Monthly fairness reports produced with per-group metrics and mitigation notes
- Audit artifacts retained for 12 months

</div><br>

