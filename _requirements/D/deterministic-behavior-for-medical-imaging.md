---
title: Deterministic behavior for medical imaging
tags: [reliable, safe]
related: [determinism, explainability, reproducibility]
---

#### Context
An AI-enabled medical imaging system provides automated radiology triage for acute stroke detection. In this high-stakes clinical domain, deterministic behavior is essential for regulatory auditability and explainability, ensuring that a specific patient scan always results in the same diagnostic classification when revisited by auditors or clinicians.

#### Trigger
A regulatory auditor initiates a retrospective validation by re-processing a historical dataset of 5,000 medical images through the inference engine.

#### Acceptance Criteria
- At least 99.9% of inference responses for a fixed input set must produce identical bit-level classification outputs when re-executed under identical initial state conditions across a batch of 1,000 requests, verified by a test harness comparison tool during each release cycle.
- The variance in inference response time (jitter) must remain under 50ms for the p95 of 5,000 requests when the system is under a steady load of 10 requests per second, as measured by the APM dashboard over a rolling 24-hour window.
- Exactly 0 deviations in classification results must occur when processing the same 500 input samples in 10 different randomized sequence orders within a single processing window, measured by automated audit log analysis during weekly quality checks. `Assumption: Software-level synchronization mitigates non-deterministic hardware-level race conditions.`
- If a non-deterministic output variance is detected between primary and shadow execution paths during production monitoring, the system must tag the result as "unverified" and trigger a high-priority alert to the operations dashboard within 30 seconds of detection, as recorded by the telemetry system.
- The enforcement of deterministic execution logic must not increase peak memory consumption by more than 15% compared to the non-deterministic baseline when processing 50 concurrent scans, verified by resource profiling reports per release.

#### Monitoring Artifact
Monthly Regulatory Compliance and Reproducibility Audit Report.
