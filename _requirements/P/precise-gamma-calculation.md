---
title: "Precise calculation of gamma coefficient"
tags: [reliable]
related: [reliability, preciseness, accuracy, correctness]
permalink: /requirements/high-precision-calculation
---

<div class="quality-requirement" markdown="1">

#### Context

The Gamma coefficient drives machine energy-efficiency decisions. Standard math libraries do not support it, so the system computes it from proprietary algorithms.

#### Trigger

A release candidate is built.

#### Acceptance Criteria

- Absolute error vs. the reference implementation is ≤ 0.0001 for ≥ 99.9% of ≥ 500 validation-corpus inputs and never exceeds 0.0005 (numerical regression suite, every release).
- 100 repeated runs per deterministic input set produce identical 4-decimal-place results on the reference platform (deterministic test report, every release).
- Release is blocked within 10 min if either threshold is missed (CI gate log).

</div><br>
