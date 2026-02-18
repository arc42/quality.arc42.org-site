---
title: "Safety requirements traceable to executable evidence"
tags: [reliable, maintainable]
related: [verifiability, testability, certifiability, traceability]
permalink: /requirements/safety-requirements-traceable-to-evidence
---

<div class="quality-requirement" markdown="1">

#### Context

An autonomous vehicle software platform implements safety-critical perception, planning, and control functions.  
Regulatory and certification activities require repeatable proof that safety requirements are verified with objective evidence.  
This quality is critical for safety engineering and compliance stakeholders.

#### Trigger

A release candidate is submitted for safety verification and approval.

#### Acceptance Criteria

- Coverage of safety requirements: **100%** of safety-classified requirements in the approved baseline are linked to at least one automated verification artifact with unique identifiers; scope: all safety requirements in the release baseline; source: requirements repository and traceability export; horizon: each release candidate.
- Traceability completeness: end-to-end trace links requirement -> design element -> implementation unit -> verification result are complete for **>= 98%** of safety requirements; scope: release candidate baseline; source: generated traceability matrix; horizon: each release candidate.
- Verification execution reliability: automated safety verification artifacts execute successfully for **>= 99%** of planned runs, with unresolved critical test-infrastructure failures at **0**; scope: full safety verification set; source: CI pipeline logs; horizon: last 10 pipeline runs for the release candidate.
- Verification turnaround: full safety verification suite completes within **<= 4 hours at p90** on the reference CI environment; scope: full suite execution; source: CI timing telemetry; horizon: rolling 30 days.
- Failure-path release gating: when any safety requirement lacks passing evidence, release promotion is automatically blocked within **<= 5 minutes** of verification completion and safety leads are notified within **<= 15 minutes**; scope: all release candidates; source: release-gate logs and incident notifications; horizon: each release candidate.

#### Monitoring Artifact

Release verification packet containing traceability matrix, CI execution report, and release-gate decision log.

</div><br>
