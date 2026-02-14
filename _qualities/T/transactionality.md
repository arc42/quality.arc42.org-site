---
title: Transactionality
tags: [reliable]
related: [atomicity, consistency, durability, data-integrity, robustness]
permalink: /qualities/transactionality
---

> A transaction is a sequence of operations performed as a single, logical unit of work. For a transaction to be considered complete, all operations within it must succeed. If any single operation fails, the entire transaction fails, and the system is rolled back to the state it was in before the transaction began.
> 
> Source: [Jim Gray, "The Transaction Concept: Virtues and Limitations", 1981](https://www.microsoft.com/en-us/research/publication/the-transaction-concept-virtues-and-limitations/)

<hr class="with-no-margin"/>

> Transactions are most commonly discussed in the context of databases and are defined by the **ACID properties**:
> *   **[Atomicity](/qualities/atomicity):** Guarantees that all operations within a transaction are treated as a single, indivisible unit.
> *   **[Consistency](/qualities/consistency):** Ensures that a transaction brings the database from one valid state to another, upholding all predefined rules.
> *   **Isolation:** Ensures that concurrent transactions do not interfere with each other.
> *   **[Durability](/qualities/durability):** Guarantees that once a transaction is committed, it will remain so, even in the event of a system failure.
> 
> Source: [Härder, T., Reuter, A. "Principles of transaction-oriented database recovery.", 1983](https://dl.acm.org/doi/10.1145/357389.357413)
>

## Related Topics

- [atomicity](/qualities/atomicity)
- [consistency](/qualities/consistency)
- isolation
- [durability](/qualities/durability)
