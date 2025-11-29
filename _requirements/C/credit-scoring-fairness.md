---
title: "Credit Scoring Fairness"
tags: [reliable, safe, suitable]
related: [fairness, bias-mitigation, transparency, accountability]
permalink: /requirements/credit-scoring-fairness
---

<div class="quality-requirement" markdown="1">
#### Context

An ML-based credit scoring model ranks applicants for loan approval. Historical data may embed societal or institutional biases. The system must ensure equitable performance and decisions across protected groups while maintaining predictive validity.

#### Trigger

Retail banking credit risk platform (scoring + decisioning) processes loan applications for underwriting teams.

#### Acceptance Criteria

- Demographic parity difference (selection-rate gap) limited to ≤ 0.10 across any protected-group comparison
- Disparate impact investigated and remediated if falling below 0.80 (4/5ths rule per EEOC Uniform Guidelines)
- Equal opportunity difference (TPR gap) ≤ 0.05 for "good payer" prediction across protected groups
- Equalized odds (TPR/FPR gaps) reported each release
- Group-wise calibration (Brier or ECE) maintained within ±2% across protected groups
- Mitigation documented (reweighing, adversarial debiasing, post-processing thresholds) with justified trade-offs
- Model cards and data sheets provided with quarterly group-wise performance dashboards
- Continuous disparity monitoring runs in production
- Alerts triggered when fairness metric breaches threshold for >24h with rollback or human review
- Auditable log maintained for model versions, features, thresholds, and mitigation settings for at least 24 months

#### Terminology

- **True Positive Rate (TPR)**: Share of actual positives correctly predicted as positive; also called recall/sensitivity
- **Expected Calibration Error (ECE)**: Weighted average gap between predicted probability (by bin) and observed outcome frequency; lower is better

#### Measurement & Verification

- Use held-out, stratified evaluation set with sufficient support per group (≥100 positives/negatives) and fixed data-splits
- Compute per-group metrics (selection rate, DI, parity diff, TPR/FPR, calibration curves) and confidence intervals (bootstrap 95% CI) each release
- Validate calibration via reliability diagrams and ECE/Brier
- Verify group-wise parity against thresholds
- Recommended tooling: scikit-learn + Fairlearn or AIF360
- Archive notebooks/reports with data and code hashes
- Monitor same metrics on fresh labeled samples in production
- Alert and trigger rollback/human review on sustained breaches

</div><br>
