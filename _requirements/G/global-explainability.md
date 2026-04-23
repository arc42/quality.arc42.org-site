---
title: Global Explainability
tags: [suitable, safe, reliable]
related: [explainability]
permalink: /requirements/global-explainability
---

#### Requirement

Each production AI model must provide a global explanation view that lets authorized administrators inspect the overall influence of input features on model decisions.

#### Acceptance Criteria

- Report latency: a global explanation report for the current production model is generated within **<= 5 min** on the standard validation dataset of up to **100,000** decisions; source: explainability job log; horizon: each model release.
- Feature coverage: the report includes ranked contribution information for **100%** of model input features, and any protected or policy-restricted feature usage is flagged in **100%** of reports; source: model metadata and explanation report validation; horizon: each model release.
- Gate behavior: if either threshold is missed, promotion of the model to production is blocked; source: model release gate log; horizon: every model release.
