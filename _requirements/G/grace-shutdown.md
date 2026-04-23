---
title: "Severe errors are detected and the system shuts down into safe state"
tags: [operable, safe, reliable]
related: [dependability, safety, operability, fail-safe, reliability]
permalink: /requirements/shutdown-to-safe-state
---

#### Context

The system controls physical processes where undetected severe faults can cause hazardous conditions or data corruption.

#### Trigger

A documented severe fault condition occurs during operation.

#### Acceptance Criteria

- In fault-injection tests covering 100% of documented severe fault classes, shutdown starts within 1 s for ≥ 99% of injected faults (safety test report, every release).
- System reaches the documented safe state within 5 s of shutdown start, accepts zero new commands/transactions, and post-test integrity checks find zero data-corruption incidents (integration + safety test report, every release).
- Release is blocked within 10 min if either threshold is missed (release gate log).
