---
title: "Credit Scoring Fairness"
tags: reliable safe suitable
related: fairness, bias-mitigation, transparency, accountability
permalink: /requirements/credit-scoring-fairness
---

<div class="quality-requirement" markdown="1">
#### Context/Background

An ML-based credit scoring model ranks applicants for loan approval. Historical data may embed societal or institutional biases. The system must ensure equitable performance and decisions across protected groups while maintaining predictive validity.

#### Source

Retail banking credit risk platform (scoring + decisioning) used by underwriting teams.

#### Metric/Acceptance Criteria

The credit scoring system must:

* Limit demographic parity difference (selection-rate gap) to ≤ 0.10 across any protected-group comparison; investigate and remediate if disparate impact falls below 0.80 (4/5ths rule) [EEOC Uniform Guidelines].
* Achieve equal opportunity difference (TPR gap) ≤ 0.05 for “good payer” prediction across protected groups; report equalized odds (TPR/FPR gaps) each release.
* Maintain group-wise calibration (Brier or ECE) within ±2% across protected groups.
* Document mitigation applied (e.g., reweighing, adversarial debiasing, post‑processing thresholds) and justify trade‑offs with model utility.
* Provide model cards and data sheets; publish group-wise performance dashboards quarterly.
* Run continuous disparity monitoring in production; alert when any fairness metric breaches threshold for >24h and trigger rollback or human review.
* Keep an auditable log of model versions, features, thresholds, and mitigation settings for at least 24 months.

</div><br>

