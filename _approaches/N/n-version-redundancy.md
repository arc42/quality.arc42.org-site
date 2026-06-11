---
layout: approach
title: "N-Version Redundancy and Voting"
tags: [reliable, safe]
aka: [Voting, Masking, Triple Modular Redundancy, TMR, N-Modular Redundancy]
supported_qualities: [integrity, fault-tolerance, correctness]
supported_qualities_notes:
  integrity: "Comparing redundant results detects a corrupted or wrong output before it propagates."
  fault-tolerance: "A majority vote masks a single faulty component, so its error never reaches the output."
  correctness: "With independently built versions, a design fault in one is outvoted by the others."
tradeoffs: [cost, latency, maintainability]
tradeoff_notes:
  cost: "Running N replicas multiplies compute — three-fold for TMR. Achieving genuine fault independence through N-version diversity also multiplies development effort, since each version must be built separately to avoid shared faults."
  latency: "The voter cannot decide until enough replicas return, so response time tracks the slowest replica plus the comparison step, not the fastest."
  maintainability: "Each independent version is separate code to specify, build, test, and keep in step as requirements change; the voter and its comparison rules add still more to own."
intent: "Run a computation on several redundant components and vote on their outputs, so a single faulty result is detected or masked."
mechanism: "N components compute the same result from the same input. A voter compares outputs and forwards the majority (TMR masks one fault) or flags a mismatch. N-version uses independently built implementations to resist common design faults."
applicability: "Use for high-integrity or safety-critical computation where a wrong output is unacceptable and the N-fold cost is justified. Skip for ordinary services where failover or retry handles faults more cheaply."
related_requirements: [transaction-processing-faultlessness]
related_requirements_notes:
  transaction-processing-faultlessness: "Comparing independent computations catches a silently wrong result before it posts, preventing incorrect ledger state."
permalink: /approaches/n-version-redundancy
---

N-Version Redundancy and Voting runs the same computation on several redundant units and compares their outputs. Where Standby/Failover tolerates a component that crashes, voting tolerates a component that keeps running but returns a wrong answer. The goal is integrity, not availability.

Two flavors share one voter. Triple Modular Redundancy (TMR) runs three identical units and masks a single hardware fault by majority. N-version programming runs independently developed implementations of one specification, so a design fault in one is outvoted by the others.

## How It Works
- N units compute a result from the same input.
- A voter compares the outputs.
- On agreement it forwards the result; on a minority disagreement it masks the outlier and forwards the majority (TMR); on no majority it flags an error or commands a safe state.
- Independent design (N-version) or independent hardware (TMR) reduces correlated faults — though the Knight & Leveson experiment showed independently developed versions still fail together more often than independence predicts.

## Failure Modes
- Common-mode fault: a shared specification error, library, or input defeats the vote because every version fails the same way.
- Voter as single point of failure: a faulty comparator corrupts every decision, so it must stay simple and be verified itself.
- Inexact agreement: floating-point or timing differences make correct outputs disagree, so the voter needs tolerance bands.
- Diversity erosion: budget pressure collapses N versions toward shared code, quietly removing the independence the tactic relies on.

## Verification
- Inject a divergent output in one unit; assert the voter masks it and raises an alert.
- Review versions for shared libraries, teams, or toolchains that would correlate failures.
- Confirm the no-majority path drives the declared safe state within its deadline.
- Track masked-fault counts in production as an early signal of a degrading unit.

## Variants and Related Tactics
- TMR and N-modular redundancy — identical units, hardware-fault masking by majority.
- N-version programming — design diversity against specification and implementation faults.
- Analytic redundancy — a simple high-assurance channel checks a complex high-performance one.
- Standby/Failover — the complementary tactic for crash faults rather than wrong answers.

## References

- [An Experimental Evaluation of the Assumption of Independence in Multiversion Programming](https://doi.org/10.1109/TSE.1986.6312924) — Knight & Leveson, IEEE Transactions on Software Engineering, 1986
