---
title: Determinism
tags: [reliable, efficient]
related: [reproducibility, consistency, testability, reliability, time-behaviour, transactionality, explainability]
permalink: /qualities/determinism
---

Determinism means that under the same inputs and initial conditions, a system produces the same externally observable behavior.
This is foundational for reproducible testing, debugging, formal reasoning, and fault-tolerant replication.

## Determinism Levels

* **Functional determinism**: same inputs and state lead to the same outputs.
* **Temporal determinism**: responses are produced within specified time bounds.
* **Sequential determinism**: relevant event ordering is consistent and well-defined.

## Notes For AI-Enabled Systems

Determinism can be engineered at system level even when model internals are probabilistic, for example by controlling prompts, tool orchestration, model/version pinning, and runtime configuration.

Lack of determinism (indeterminism) complicates **[explainability](/qualities/explainability)**, as non-reproducible behavior makes it difficult to trace outputs back to consistent causes or features.

## References

1. Fred B. Schneider, "Implementing Fault-Tolerant Services Using the State Machine Approach: A Tutorial", ACM Computing Surveys 22(4), 1990. https://dl.acm.org/doi/10.1145/98163.98167
2. Leslie Lamport, "Time, Clocks, and the Ordering of Events in a Distributed System", Communications of the ACM 21(7), 1978. https://dl.acm.org/doi/10.1145/359545.359563
3. C. L. Liu and James W. Layland, "Scheduling Algorithms for Multiprogramming in a Hard-Real-Time Environment", Journal of the ACM 20(1), 1973. https://dl.acm.org/doi/10.1145/321738.321743
