---
title: Atomicity
tags: [reliable]
related: [transactionality, consistency, durability, data-integrity, robustness]
permalink: /qualities/atomicity
---

Atomicity ensures that a transaction is an all-or-nothing unit of work:
either all operations are applied, or none are.
This prevents partially applied changes and hazardous intermediate states.

<hr class="with-no-margin"/>

In ACID terminology, atomicity works together with:

* [Consistency](/qualities/consistency): transactions preserve integrity constraints.
* Isolation: concurrent transactions do not interfere with each other.
* [Durability](/qualities/durability): committed results survive failures.

Atomicity is therefore a core mechanism behind [Transactionality](/qualities/transactionality).

## References

1. Jim Gray, "The Transaction Concept: Virtues and Limitations" (1981): https://www.microsoft.com/en-us/research/publication/the-transaction-concept-virtues-and-limitations/
2. Theo Haerder, Andreas Reuter, "Principles of Transaction-Oriented Database Recovery" (1983): https://dl.acm.org/doi/10.1145/357389.357413
