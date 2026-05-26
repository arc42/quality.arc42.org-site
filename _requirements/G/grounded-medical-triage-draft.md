---
title: Grounded medical triage draft
tags: [safe, reliable, suitable]
related: [groundedness, correctness, traceability, safety]
permalink: /requirements/grounded-medical-triage-draft
---

### Context

A clinical assistant drafts non-final triage notes from patient-record data, current encounter notes, and approved medical guidelines.
Clinicians remain responsible for final decisions, but unsupported patient facts or guideline claims can still create safety risks.

### Trigger

A clinician requests a triage recommendation draft for a patient encounter.

### Acceptance Criteria

- Patient-fact grounding: **100%** of patient-specific facts in the draft are present in the patient record, current encounter notes, or clinician-provided input; source: source-span validation report; horizon: each release and monthly audit.
- Guideline grounding: **100%** of guideline-based statements cite an approved guideline identifier and version; source: guideline citation validator; horizon: each release and monthly audit.
- Uncertainty behavior: if required source data is missing, contradictory, or older than the configured clinical freshness threshold, the draft explicitly lists the uncertainty and does not infer missing facts; source: clinical scenario test suite; horizon: each release.
- High-risk unsupported recommendations: in a monthly clinical review of at least **300** drafts, unsupported high-risk recommendations occur in **0** cases; source: clinical review report; horizon: monthly.
- Export guard: if source-span validation fails for any patient fact or guideline statement, the draft is marked **unverified** and cannot be copied into the final clinical note without clinician override and reason capture; source: audit log and UI telemetry; horizon: continuous monitoring.

### Monitoring Artifact

Clinical groundedness review report with source-span coverage, guideline citation coverage, uncertainty cases, overrides, and unsupported-recommendation findings.
