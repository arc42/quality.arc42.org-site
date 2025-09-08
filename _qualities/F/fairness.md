---
title: Fairness
tags: reliable safe suitable
related: bias-mitigation, explainability, transparency, accountability
standards: iso42001
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

### Scope and Intent
- Aim: ensure outcomes and error rates are not unjustifiably different across protected groups.
- Typical metrics: disparate impact (80% rule), demographic parity difference, equal opportunity (TPR parity), equalized odds (TPR/FPR parity), calibration within groups.
- Lifecycle: apply mitigation pre-/in-/post‑processing and monitor drift and disparities in production.

### See Also
- Bias Mitigation, Explainability, Transparency, Accountability

