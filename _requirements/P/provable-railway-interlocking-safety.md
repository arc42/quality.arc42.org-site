---
title: "Provable Railway Interlocking Safety"
tags: [reliable, safe]
related: [provability, safety, reliability, certifiability]
permalink: /requirements/provable-railway-interlocking-safety
---

<div class="quality-requirement" markdown="1">

#### Context
A computer-based interlocking (CBI) system must guarantee that conflicting routes are never cleared simultaneously, preventing train collisions. In compliance with safety standards such as **EN 50128 (SIL 4)**, the system's safety-critical logic must be "correct by construction" and its correctness mathematically provable. This requirement focuses on the **formal safety invariants** and mathematical proofs that demonstrate collision-free operation across all possible system states.

#### Trigger
The formal safety model of the interlocking logic is submitted for mathematical verification or certification review.

#### Acceptance Criteria
- **Formal Safety Invariants**: The system provides machine-checkable proofs that for all possible system states, the "No Collision" invariant holds (i.e., no two routes that share a common track segment can be in the "Clear" state simultaneously).
- **Proof Coverage**: **100%** of the interlocking logic (safety-critical part) is developed using a formal method (e.g., the **B-method** or **Event-B**). All generated proof obligations (POs) must be discharged.
- **Automation Threshold**: At least **90%** of these proofs must be automated (using tools like Atelier B), and **100%** of any manually proven obligations must be independently reviewed and verified by a separate safety team.
- **Standard Compliance**: Verification results must be sufficient to support a **SIL 4 (EN 50128)** safety case for the specific site deployment.

> See also: [provable-railway-interlocking-routing-logic](/requirements/provable-railway-interlocking-routing-logic) for the automated verification pipeline and release-gate integration.

#### Reliable Resources
- [EN 50128: Formal Methods for Railway Safety](https://www.railengineer.co.uk/formal-methods-for-railway-safety/)
- [The B-Method in Railway Industry (ClearSy)](https://www.clearsy.com/en/our-expertise/formal-methods/)
- [Case Study: METEOR Paris Metro Line 14 (Formal Methods Europe)](https://fmeurope.org/success-stories/meteor/)

</div>
