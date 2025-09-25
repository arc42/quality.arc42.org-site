---
title: "Content Moderation Fairness"
tags: [reliable, safe, suitable]
related: [fairness, bias-mitigation, transparency, accountability]
permalink: /requirements/content-moderation-fairness
---

<div class="quality-requirement" markdown="1">
#### Context/Background

An automated content moderation system classifies user posts for policy violations across multiple languages and regions. Prior studies show performance disparities by language, dialect, and demographic proxies. The system must ensure equitable error rates and transparent processes.

#### Source

Trust & Safety moderation service used by platform operations and policy teams.

#### Metric/Acceptance Criteria

The moderation system must:

* Keep false positive rate (FPR) and false negative rate (FNR) gaps ≤ 2.0 percentage points between any language/dialect groups on a stratified benchmark.
* Maintain macro-averaged F1 within ±3 points across languages/regions; publish per‑group PR curves.
* Use balanced, representative evaluation datasets; include adversarial and dialectal examples; refresh quarterly.
* Apply documented mitigation (e.g., group-aware thresholds, calibration, post‑processing) and validate no group’s precision or recall worsens by >3 points after mitigation (regret bound).
* Provide appeal workflows and human-in-the-loop review for low‑confidence decisions; capture reviewer overrides for continuous improvement.
* Monitor production disparities; auto‑alert on sustained (>24h) metric breaches; enable safe rollback to prior model.
* Produce monthly fairness reports with per‑group metrics and mitigation notes; retain audit artifacts for 12 months.

</div><br>

