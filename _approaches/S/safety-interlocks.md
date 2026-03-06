---
layout: approach
title: "Safety Interlocks"
tags: [safe]
supported_qualities: [safety, fail-safe, controllability, integrity, hazard-warning, user-error-protection]
supported_qualities_notes:
  safety: Hazardous operations cannot execute unless all preconditions are satisfied, preventing the system from entering dangerous states.
  fail-safe: If an interlock check fails or cannot be evaluated, the operation is blocked — the default is always the safe path.
  controllability: Operators retain explicit control over hazardous transitions because each gate requires deliberate confirmation that conditions are met.
  integrity: Data and physical state are protected from corruption caused by operations executed under invalid preconditions.
  hazard-warning: Interlock violations produce immediate, unambiguous feedback explaining which precondition is not met and what must change.
  user-error-protection: Interlocks prevent accidental initiation of dangerous operations by requiring that safety-relevant conditions are verified before execution.
tradeoffs: [availability, usability, code-complexity]
tradeoff_notes:
  availability: Blocking operations on unmet preconditions can delay or prevent work when conditions are transiently unsatisfied or sensors report false negatives.
  usability: Additional confirmation steps and gate checks slow workflows and frustrate users when the hazard is not immediately obvious to them.
  code-complexity: Each interlock requires precondition logic, sensor integration, bypass governance, and audit logging, adding implementation and maintenance effort.
related_requirements: [shutdown-to-safe-state, safety-requirements-traceable-to-evidence]
related_requirements_notes:
  shutdown-to-safe-state: A failed interlock check can trigger a safe-state shutdown when the precondition violation indicates an active hazard.
  safety-requirements-traceable-to-evidence: Interlock logic and its test results provide traceable evidence that safety constraints are enforced.
intent: "Enforce verified preconditions before allowing hazardous operations to execute, ensuring the system never enters a dangerous state through premature, accidental, or unauthorized action."
mechanism: "Guard every hazardous operation with a gate that evaluates required preconditions — sensor readings, system state, operator confirmations, or environmental conditions; block execution and provide explicit feedback when any precondition is not met; log every check, pass, and override for audit."
applicability: "Use wherever an operation can cause harm to people, equipment, data, or environment if executed under wrong conditions — industrial control, medical devices, financial transactions with irreversible effect, infrastructure provisioning. Avoid for low-risk operations where the gate overhead reduces throughput without meaningful safety benefit."
permalink: /approaches/safety-interlocks
---

Safety interlocks place explicit gates in front of hazardous operations. Each gate evaluates a set of preconditions — sensor readings within range, system state valid, operator confirmation received — and blocks execution until all conditions are satisfied. The concept originates in physical engineering (electrical interlocks that prevent a machine from starting while a guard is open) and translates directly to software: a deployment pipeline that refuses to proceed without passing health checks, a medical device that will not deliver treatment until patient parameters are confirmed, or a financial system that blocks large transfers without dual authorization.

The key property is that the interlock defaults to blocking. If a precondition cannot be evaluated — a sensor is offline, a confirmation times out, a state check returns an error — the operation does not proceed. This fail-safe default distinguishes interlocks from advisory warnings, which inform but do not prevent.

Whether "safe" means fail-closed or fail-open depends on the primary hazard. A firewall interlock fails closed — all traffic blocked — because the hazard is unauthorized access. A fire-exit interlock fails open — door unlocked — because the hazard is people trapped inside. The interlock designer must derive the correct default from the hazard analysis, not assume one direction fits all cases.

## How It Works

- Identify every operation that can cause harm if executed under wrong conditions, and for each, define the preconditions that must hold before execution is safe.
- Implement each precondition as a verifiable check: a sensor reading within a defined range, a state-machine transition that is valid, an operator confirmation received within a time window, or a multi-party authorization quorum.
- Gate the operation behind the conjunction of all its preconditions — if any check fails or cannot be evaluated, block execution and return an explicit reason.
- Log every interlock evaluation — which preconditions were checked, which passed, which failed, and whether any bypass was invoked — to provide a tamper-evident audit trail.
- Define a formal bypass governance process for maintenance or emergency scenarios: require elevated authorization, time-limit the bypass, log it separately, and alert operations.

## Failure Modes

- Sensor drift or false negatives cause interlocks to block operations that are actually safe, leading to unnecessary downtime (nuisance blocking).
- Interlocks are bypassed informally because operators find them too restrictive, and the bypass becomes permanent without formal review.
- Preconditions are defined too narrowly, covering the originally identified hazards but missing new hazards introduced by system changes.
- Interlock checks execute but their results are not enforced — the gate logs a failure but the operation proceeds anyway due to a race condition or missing enforcement in the execution path.
- Missing interlock coverage: new hazardous operations are added without corresponding precondition gates because the interlock inventory is not maintained.

## Verification

- For each defined interlock, inject a precondition violation and verify the operation is blocked within the specified response time (for example `< 200 ms` for a safety controller, `< 1 s` for a software gate).
- Bypass audit: invoke every documented bypass path and verify it requires the specified authorization level, is time-limited, and produces a distinct audit log entry.
- Coverage check: map every operation classified as hazardous to its interlock definition; flag any hazardous operation without a corresponding gate.
- False-negative test: simulate sensor failure or timeout during a precondition check and verify the interlock defaults to blocking, not permitting.
- Audit trail integrity: verify that interlock logs are tamper-evident and that every gate evaluation — pass, fail, and bypass — is recorded with timestamp, actor, and precondition details.

## Variants and Related Tactics

- Dual-authorization (two-person rule) is an interlock where the precondition is independent confirmation from a second authorized actor.
- Confirmation dialogs in user interfaces are software interlocks for irreversible actions — effective only when they require meaningful input (for example typing a resource name), not just a reflexive click.
- Permit-to-work systems in industrial settings combine physical interlocks with procedural authorization documents.
- Fail-Safe Defaults complements interlocks: interlocks enforce preconditions before an operation, while fail-safe defaults define where the system goes when something unexpected happens during or after it.

## References

- [Leveson: Engineering a Safer World (MIT Press, 2011)](https://mitpress.mit.edu/9780262533690/engineering-a-safer-world/) — systems-theoretic approach to safety constraints and control structures, including interlocks as enforcement mechanisms
- [IEC 61508: Functional Safety of E/E/PE Systems](https://www.iec.ch/functional-safety) — the foundational standard for safety integrity levels and safety-instrumented systems
- [ISO 26262: Road Vehicles — Functional Safety](https://www.iso.org/standard/68383.html) — sector-specific adaptation of IEC 61508 for automotive systems, widely cited for safety-critical interlock design
- [Software Architecture in Practice](https://www.sei.cmu.edu/library/software-architecture-in-practice-fourth-edition/) — Bass, Clements & Kazman ([full citation](/references/#bass2021software))
