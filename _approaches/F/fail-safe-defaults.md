---
layout: approach
title: "Fail-Safe Defaults"
tags: [safe, reliable]
supported_qualities: [safety, fault-tolerance, fail-safe, robustness, predictability, controllability]
supported_qualities_notes:
  safety: The system transitions to a predefined safe state rather than continuing in an unknown or hazardous condition.
  fault-tolerance: Unrecognized or unexpected inputs are rejected by default, preventing faults from propagating into undefined behavior.
  fail-safe: By design, every failure path ends in a known-safe configuration rather than an open or permissive one.
  robustness: The system handles unexpected conditions — missing configuration, corrupted state, unknown inputs — without entering a dangerous mode.
  predictability: Operators and safety engineers can reason about worst-case behavior because all unhandled paths converge on a documented default state.
  controllability: The predefined safe state keeps the system in a condition that operators or automated recovery logic can act on.
tradeoffs: [availability, graceful-degradation, recoverability]
tradeoff_notes:
  availability: Transitioning to a safe state often means halting or heavily restricting service, reducing availability until the issue is resolved.
  graceful-degradation: A hard safe-state transition shuts down functionality abruptly rather than shedding load gradually; the system is safe but not incrementally useful.
  recoverability: Returning from a safe state may require manual intervention, diagnostic inspection, or a restart sequence, increasing recovery time.
related_requirements: [shutdown-to-safe-state, circuit-breaker-failure-transparency]
related_requirements_notes:
  shutdown-to-safe-state: Directly requires that severe errors trigger a transition into a predefined safe state.
  circuit-breaker-failure-transparency: Circuit breakers implement a form of fail-safe default by cutting off calls to unhealthy dependencies and returning a known fallback.
intent: "Ensure that when a system encounters an unexpected condition — unknown input, missing configuration, corrupted state, or unhandled error — it transitions to a predefined safe state rather than continuing in an undefined or hazardous mode."
mechanism: "Define an explicit safe-state configuration for every component and operational mode; treat all unrecognized inputs, permissions, and conditions as denied or invalid by default; on detecting an anomaly that exceeds defined tolerance, transition the system to the safe state and signal operators."
applicability: "Use wherever the consequences of continuing in an unknown state are worse than stopping or restricting the system — safety-critical controllers, access-control systems, financial transaction processing, and infrastructure with high blast radius. Avoid when maximum availability matters more than safety and the domain tolerates best-effort behavior under uncertainty."
permalink: /approaches/fail-safe-defaults
---

Fail-safe defaults ensure that when something unexpected happens, the system falls into a known-safe state rather than an open, permissive, or undefined one. The principle applies at every level: hardware that de-energizes to a safe position on power loss, software that denies access when an authorization check fails to complete, and configuration that disables dangerous features when a setting is missing.

The idea was formalized by Saltzer and Schroeder in 1975 as one of eight design principles for information protection, where it meant basing access decisions on permission rather than exclusion. In safety engineering, the same concept appears as the de-energize-to-safe principle: a valve closes, a brake engages, a process halts — not because an active command says so, but because the absence of a valid active signal defaults to the safe position.

## How It Works

- Define, for every component and operational mode, what the safe state is — the configuration that minimizes harm when the system cannot determine the correct action.
- Treat all unrecognized or missing inputs as invalid by default: deny access, reject commands, disable features, halt motion.
- On detecting an anomaly that exceeds defined tolerance (watchdog timeout, invariant violation, sensor out of range), transition the component to its safe state and raise an alert.
- Make the safe-state transition atomic where possible — partial transitions can leave the system in a state that is neither operational nor safe.
- Document each safe state explicitly so operators know what to expect after a transition and what recovery steps are required.

## Failure Modes

- A safe state defined too conservatively triggers on benign transients, causing unnecessary shutdowns and eroding operator trust (nuisance trips).
- A safe state defined too loosely allows genuinely hazardous conditions to persist because the threshold for transition is never reached.
- Partial transitions leave the system in a state that is neither safe nor operational — for example, one actuator halted while another continues.
- Missing safe-state definitions for newly added components or modes: developers add a feature but forget to define what happens when it fails.
- Operators override or disable fail-safe logic after repeated nuisance trips, removing the safety net entirely.

## Verification

- Fault injection: for each defined anomaly class (watchdog timeout, invalid input, missing config, sensor out of range), inject the condition and verify the system reaches the documented safe state within the specified time (for example `< 500 ms` for a safety controller).
- Completeness audit: confirm that every component and operational mode has a documented safe state; flag any path that can reach an undefined state as a gap.
- Atomicity check: interrupt the safe-state transition at various points (power cut, process kill) and verify the system does not settle in a half-transitioned state.
- Recovery round-trip: after a safe-state transition, execute the documented recovery procedure and verify the system returns to normal operation within the agreed window.

## Variants and Related Tactics

- Deny-by-default access control applies fail-safe defaults to authorization: any request not explicitly permitted is denied.
- Watchdog supervision uses a periodic heartbeat; absence of the heartbeat triggers the safe-state transition.
- Dead man's switch requires continuous active confirmation to remain in an operational mode — releasing the switch defaults to safe.
- Circuit breaker implements a fail-safe default for remote dependencies: when failures exceed a threshold, the breaker opens and returns a safe fallback rather than forwarding requests.

## References

- [Saltzer & Schroeder: The Protection of Information in Computer Systems (1975)](https://www.cs.virginia.edu/~evans/cs551/saltzer/) — the original formulation of fail-safe defaults as a design principle
- [IEC 61508: Functional Safety of E/E/PE Systems](https://www.iec.ch/functional-safety) — the foundational standard for safety integrity levels and safe-state design
- [Software Architecture in Practice](https://www.sei.cmu.edu/library/software-architecture-in-practice-fourth-edition/) — Bass, Clements & Kazman ([full citation](/references/#bass2021software))
