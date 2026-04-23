---
title: "Provable railway interlocking routing logic"
tags: [reliable, safe]
related: [provability, verifiability, correctness, certifiability]
permalink: /requirements/provable-railway-interlocking-routing-logic
---

#### Context
A computer-based interlocking (CBI) system is responsible for controlling signals and points to ensure safe train movements in a high-density rail network. In this domain, testing alone is not sufficient assurance for the safety-critical routing logic, because the set of possible route combinations and state transitions is too large to justify safety by sampling alone. This requirement focuses on the **automated verification pipeline** that ensures implementation code strictly adheres to the proven safety specification before any release.

#### Trigger
A release candidate of the safety-critical routing logic is submitted for safety verification.

#### Acceptance Criteria
- **100%** of safety-critical route-setting rules are represented in a machine-checkable specification linked to the release-candidate implementation baseline; source: specification coverage report; evaluation horizon: every release candidate.
- **100%** of generated proof obligations for the defined collision-prevention and point-consistency invariants are discharged, with **0** open counterexamples; source: formal verification report; evaluation horizon: every release candidate.
- If any proof obligation fails or any counterexample is found, release promotion is blocked within **5 min** and the failing invariant identifier and affected rule identifier are recorded in the verification log within **1 min**; source: release-gate log and verification report; evaluation horizon: every release candidate.

> See also: [provable-railway-interlocking-safety](/requirements/provable-railway-interlocking-safety) for the domain-specific safety invariants and EN 50128 compliance details.

#### Monitoring Artifact
- Release-candidate formal verification report
- Release-gate decision log
- [EN 50128: Formal Methods for Railway Safety](https://www.railengineer.co.uk/formal-methods-for-railway-safety/)
