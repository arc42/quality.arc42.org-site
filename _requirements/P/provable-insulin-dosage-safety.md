---
title: "Provable Insulin Dosage Safety"
tags: [reliable, safe]
related: [provability, safety, reliability, certifiability]
permalink: /requirements/provable-insulin-dosage-safety
---

#### Context
An automated insulin delivery (AID) system adjusts insulin delivery based on continuous glucose monitor (CGM) sensor data. In this safety-critical medical context, "provability" is the highest level of assurance that the control algorithm will never command a dosage that could lead to severe hypoglycemia (dangerously low blood sugar), regardless of sensor noise or software state transitions. Relying on testing alone is insufficient for such life-critical logic; mathematical proof of safety properties is required for certification and patient safety.

#### Trigger
The control algorithm calculates a new insulin infusion rate based on the latest sensor readings and patient history.

#### Acceptance Criteria
- **100%** of the core control-law implementation is formally verified against a mathematical model of the safety constraints (e.g., using TLA+, Coq, or bounded model checking).
- **Formal Proof**: The system must provide machine-checkable proof that no combination of inputs within the defined physiological range can result in a "Max Basal" command exceeding the patient-specific safety limit defined by the physician.
- **State Invariants**: All safety-critical state variables (e.g., `active_insulin`, `current_glucose_trend`) are proven to remain within valid bounds across all defined state transitions.
- **Verification Artifacts**: Proof scripts or model-checking logs are generated for every version of the control module, showing zero counter-examples to the safety properties.
