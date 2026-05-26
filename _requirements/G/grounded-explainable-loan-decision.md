---
title: Grounded and explainable loan decision
tags: [safe, reliable, suitable]
related: [groundedness, explainability, traceability, accountability]
permalink: /requirements/grounded-explainable-loan-decision
---

### Context

An AI-assisted lending system recommends approval, rejection, or manual review for loan applications.
The decision must be understandable to applicants and grounded in verified application data, credit-policy rules, and approved risk-model outputs.

### Trigger

The lending system produces a recommendation for a submitted loan application.

### Acceptance Criteria

- Explanation clarity: the applicant-facing explanation lists the top **3** decision factors in plain language and is no longer than **150 words**; source: explanation-rendering test and content review; horizon: each release.
- Factor grounding: **100%** of explanation factors are grounded in recorded source data used at decision time, such as application fields, credit-bureau attributes, policy rules, or approved model-output artifacts; source: decision trace validator; horizon: each release and monthly audit.
- Adverse-action traceability: **100%** of adverse-action reasons are mapped to approved reason codes and traceable to source data used at decision time; source: adverse-action audit report; horizon: monthly.
- Failure-path behavior: if any explanation factor cannot be grounded in recorded source data, the system must not issue an automated final decision and routes the application to manual review; source: release-gate test suite and production decision logs; horizon: each release and continuous monitoring.
- Audit sample: in monthly audit samples of at least **500** decisions, at least **98%** of explanations are both understandable to reviewers and fully source-supported; unsupported critical adverse-action reasons occur in **0** cases; source: compliance audit sample; horizon: monthly.

### Monitoring Artifact

Monthly lending-decision audit report combining explanation quality review, source-grounding validation, adverse-action reason mapping, and manual-review routing metrics.
