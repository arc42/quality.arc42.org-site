---
title: Fairness
tags: [reliable, safe, suitable]
related: [bias-mitigation, explainability, transparency, accountability]
standards: [iso42001, isoiec22989]
permalink: /qualities/fairness
---

### Definitions

> In machine learning, fairness refers to the absence of any prejudice or favoritism toward an individual or group based on their inherent or acquired characteristics; many formal criteria (e.g., demographic parity, equalized odds, equal opportunity) are used to assess it.
>
>[Wikipedia: Fairness (machine learning)](https://en.wikipedia.org/wiki/Fairness_(machine_learning))

<hr class="with-no-margin"/>

> Fairness is a key characteristic of trustworthy AI systems and requires identifying, measuring, and mitigating harmful bias across the AI lifecycle, including data, models, and human processes.
>
>[NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)

<hr class="with-no-margin"/>

> IEEE 7003 provides processes to identify, document, measure, and mitigate algorithmic bias so that AI-enabled systems achieve context-appropriate fairness toward affected persons and groups.
>
>[IEEE 7003-2024 Standard for Algorithmic Bias Considerations](https://standards.ieee.org/ieee/7003/10453/)

### Scope and Intent
- Aim: ensure outcomes and error rates are not unjustifiably different across protected groups.
- Typical metrics: disparate impact (80% rule), demographic parity difference, equal opportunity (TPR parity), equalized odds (TPR/FPR parity), calibration within groups.
- Lifecycle: apply mitigation pre-/in-/post‑processing and monitor drift and disparities in production.

### See Also (relationships)
- Bias Mitigation: the set of techniques (pre‑/in‑/post‑processing, monitoring) used to achieve fairness targets defined for a system.
- Explainability: helps diagnose sources of unfairness (feature attributions, counterfactuals) and justify mitigation choices to stakeholders.
- Transparency: disclosures (model cards, data sheets, per‑group metrics) that enable external review of fairness goals and outcomes.
- Accountability: governance assigning responsibility for fairness policies, reviews, approvals, and remediation when disparities arise.

### Metrics (brief)
- Disparate Impact (80% rule): ratio of selection rates between protected and reference groups; example: 0.78 (< 0.80) flags possible adverse impact.
- Demographic Parity Difference: difference in selection rates; example: 0.10 means a 10‑point gap in positive decisions.
- Equal Opportunity: difference in true positive rates (TPR/recall) for the qualified class; example: |TPR_A − TPR_B| ≤ 0.05.
- Equalized Odds: both TPR and FPR are similar across groups; enforce combined bounds (e.g., ≤ 0.05 each).
- Calibration within Groups: predicted probabilities match observed frequencies per group (assess via reliability curves, ECE/Brier).
- Predictive Parity (PPV parity): positive predictive value similar across groups; note trade‑offs with other criteria when base rates differ.
