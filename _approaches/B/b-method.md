---
layout: approach
title: "B-Method"
tags: [reliable, safe]
supported_qualities: [provability, correctness, safety, reliability, verifiability]
supported_qualities_notes:
  provability: Stepwise refinement and mathematical proof produce explicit evidence that stated properties hold.
  correctness: Proof obligations show that each operation and refinement preserves the model's invariants.
  safety: Safety constraints can be encoded as invariants and shown to hold for every modeled state transition.
  reliability: Removing whole classes of logic errors in critical code paths reduces latent defect risk.
  verifiability: Formal models make assumptions, states, and transitions precise enough for automated and manual checking.
tradeoffs: [cost, modifiability, time-to-market, understandability]
tradeoff_notes:
  cost: Modeling, proof, review, and specialist training raise upfront engineering cost.
  modifiability: Changing core requirements can force updates to machines, invariants, refinements, and proofs.
  time-to-market: Early delivery is slower because assurance is built before implementation is considered complete.
  understandability: Many stakeholders can review the intent, but few can read the notation and proof artifacts directly.
related_requirements: [provable-railway-interlocking-routing-logic, provable-railway-interlocking-safety, provable-insulin-dosage-safety]
related_requirements_notes:
  provable-railway-interlocking-routing-logic: Uses automated proof and release gates to keep implementation aligned with the proven model.
  provable-railway-interlocking-safety: Captures the domain-specific safety invariants that a B model is intended to prove.
  provable-insulin-dosage-safety: Illustrates the same proof-oriented approach in a medical-device control domain.
intent: "Ensure software correctness through mathematical proof and stepwise refinement, so critical behavior is justified by evidence stronger than testing alone."
mechanism: "Model the critical state and operations in a formal notation, state invariants explicitly, refine the model in controlled steps, and discharge the generated proof obligations before accepting the implementation."
applicability: "Best fit for discrete, state-rich, high-assurance systems where failure is costly and the core behavior is stable enough to justify upfront modeling and proof effort. Usually a poor fit for fast-moving UI-heavy product surfaces or low-risk business features."
permalink: /approaches/b-method
---

The B-Method is a formal development approach based on set theory, first-order logic, and stepwise refinement. Instead of treating tests as the primary assurance mechanism for critical behavior, it starts with an abstract model of state and operations, states the required invariants explicitly, and then proves that each refinement preserves those invariants.

Its strength is not that it replaces all other engineering work. It narrows the assurance problem to the safety-critical core and demands that every modeled transition be justified against a mathematically precise specification. Testing still matters for integration, performance, usability, and environmental assumptions, but proof gives stronger evidence for the logic that must not fail.

Because of that cost, B is uncommon in mainstream online systems and consumer-facing product development. It is much more at home in domains such as railway control, medical devices, aerospace, or trusted data validation, where the system has rich discrete state and the consequences of a logic defect are severe.

## Mini Example

This simplified sketch shows the central idea without trying to teach full AMN syntax:

```text
MACHINE RouteLock
VARIABLES route_a, route_b
INVARIANT route_a : BOOL & route_b : BOOL &
          not(route_a = TRUE & route_b = TRUE)
INITIALISATION route_a, route_b := FALSE, FALSE
OPERATIONS
  ClearRouteA =
    PRE route_b = FALSE THEN route_a := TRUE END
END
```

The invariant states that two conflicting routes must never both be clear at the same time. From this tiny model, the toolchain generates a proof obligation showing that `ClearRouteA` preserves the invariant. If that proof cannot be discharged, the model or the operation is not ready to trust.

## How It Works
- **Abstract machine**: Model the relevant system state, operations, and data domains in a mathematically precise notation.
- **Invariants and preconditions**: Express critical properties explicitly, such as "these two routes are never clear together" or "dosage never exceeds the configured safety bound".
- **Refinement chain**: Move from abstract behavior to more concrete design in small steps, preserving the properties of the previous level instead of rewriting them informally.
- **Proof obligations**: Use tool support to generate and discharge the proof obligations that arise from operations, invariants, and refinements.
- **Exploration and review**: Complement proofs with animation, model checking, and human review to catch wrong assumptions or missing cases before implementation.

## Trade-offs and Challenges
- **Specialized Expertise**: Requires deep knowledge of formal logic and set theory, which can create a bottleneck in hiring and team scaling.
- **Initial Development Cost**: The upfront effort in formalizing specifications and discharging proofs is significantly higher than traditional coding, even if it can reduce later rework.
- **Rigidity**: Changes to safety-critical requirements may require re-proving large portions of the refinement chain, impacting agility.
- **Toolchain Dependency**: Success depends heavily on capable proof, animation, and model-analysis tools, plus a team that knows how to interpret their output correctly.

## Failure Modes
- **Wrong thing proved**: The model is internally consistent, but it captures the wrong requirement, so the team proves a property nobody actually needed.
- **Too much detail too early**: The model becomes implementation-heavy before the key invariants are stable, making proof effort expensive and brittle.
- **Assurance gap after the model**: The proven model and the delivered implementation drift apart because traceability, code generation, or review discipline is weak.
- **Manual-proof bottleneck**: Automation stops early, a few experts carry the proof burden, and the method turns into a schedule or staffing risk.
- **Ceremonial formalism**: The notation is present, but the team treats proofs as paperwork instead of as a design tool that should expose missing cases and unsafe assumptions.

## Verification
- **Requirement mapping**: Trace every safety-critical rule to an invariant, precondition, refinement step, or proof artifact in the model.
- **Proof status**: For release scope, discharge all required proof obligations or document each unresolved item explicitly with justification and an independent review decision.
- **Counterexample search**: Animate or model-check the abstract machine to detect deadlocks, contradictory guards, or unintended reachable states early.
- **Refinement audit**: Verify that each refinement preserves the abstract invariants and does not silently widen the allowed behavior.
- **Independent review**: Review the model, assumptions, and proof boundaries with someone other than the original author, especially where manual proof or interpretation is involved.

## Variants and Related Tactics
- **Event-B** keeps the core ideas of refinement and proof, but emphasizes event-based system modeling more than implementation-oriented AMN.
- **Model checking** complements theorem proving: it finds concrete counterexamples quickly, while proof establishes that no counterexample exists within the formalized assumptions.
- **Fail-Safe Defaults** and **Safety Interlocks** are domain tactics that B models can specify and prove for critical control logic.
- **Proof assistants and theorem provers** such as Coq or Isabelle pursue similar assurance goals with different notation, automation style, and learning curve.

## References

- [J.-R. Abrial, *The B-Book: Assigning Programs to Meanings* (Cambridge University Press)](https://doi.org/10.1017/CBO9780511624162)
- [J.-R. Abrial, "Formal Methods: Theory Becoming Practice" (Journal of Universal Computer Science, 2007)](https://doi.org/10.3217/jucs-013-05-0619)
- [J.-R. Abrial, M. K. O. Lee, D. Neilson, P. N. Scharbach, I. H. Sorensen, "Formal development in B abstract machine notation" (Information and Software Technology, 1995)](https://doi.org/10.1016/0950-5849(95)99366-U)
- [Michael Butler et al., "The First Twenty-Five Years of Industrial Use of the B-Method" (FMICS 2020)](https://doi.org/10.1007/978-3-030-58298-2_8)
- [ProB Animator and Model Checker](https://prob.hhu.de/) - tool support for animation, model checking, and validation of B and Event-B models
