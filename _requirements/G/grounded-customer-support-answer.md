---
title: Grounded customer support answer
tags: [reliable, suitable]
related: [groundedness, correctness, traceability]
permalink: /requirements/grounded-customer-support-answer
---

### Context

A customer-support assistant answers questions about billing, cancellation, account settings, and product behavior using the current product documentation and support knowledge base.
Because customers may act on these answers, factual claims must be grounded in approved source material instead of generated from model priors alone.

### Trigger

A customer asks the assistant a support question through chat or the help-center search interface.

### Acceptance Criteria

- Source support: in a weekly groundedness evaluation set of at least **500** representative Q&A pairs, at least **98%** of factual claims in assistant answers are supported by retrieved source passages; source: groundedness evaluation report; horizon: weekly.
- Citation coverage: **100%** of answers containing factual product, billing, cancellation, or account-behavior claims include at least **1** link to an approved source document; source: answer telemetry and citation validator; horizon: rolling 7 days.
- Refusal behavior: if no source passage reaches the configured retrieval-confidence threshold, the assistant states that it does not have enough information instead of producing a factual answer; source: no-context test suite; horizon: each release.
- Critical unsupported claims: unsupported claims about pricing, legal terms, data retention, security controls, or customer obligations occur in **0** sampled answers; source: weekly review sample and escalation log; horizon: weekly.
- Auditability: for **100%** of sampled answers, the system stores the prompt, retrieved source identifiers, generated answer, citations, model version, and retrieval configuration; source: audit-log completeness report; horizon: rolling 30 days.

### Monitoring Artifact

Groundedness evaluation dashboard combining retrieval traces, citation validation, sampled human review results, and unsupported-claim alerts.
