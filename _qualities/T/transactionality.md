---
title: Transactionality
tags: reliable secure
related: consistency, integrity, reliability, fault-tolerance, dependability, fault-isolation
permalink: /qualities/transactionality
---

See [#reliable](/tag-reliable), [#secure](/tag-secure)

### Definitions:

>**Transactionality** refers to the capability of a system to ensure that a group of related operations either all complete successfully or all fail together, maintaining data integrity and system consistency throughout the process.

<hr class="with-no-margin"/>

>A transaction is a sequence of database operations that satisfies the ACID properties (Atomicity, Consistency, Isolation, Durability). ACID transactions ensure reliable processing of database transactions.
>
>[Wikipedia/ACID](https://en.wikipedia.org/wiki/ACID)

<hr class="with-no-margin"/>

### ACID Properties:

**Atomicity**: All operations within a transaction succeed or all fail. There are no partial updates.

**Consistency**: Transactions maintain database integrity constraints and business rules.

**Isolation**: Concurrent transactions do not interfere with each other, appearing to execute sequentially.

**Durability**: Once committed, transaction results persist even in case of system failures.

### Related Concepts:

- **Two-phase commit**: Protocol ensuring transactionality across distributed systems
- **Rollback capability**: Ability to undo transaction changes when failures occur
- **Concurrency control**: Mechanisms to manage simultaneous access to shared resources
- **Transaction logging**: Recording transaction details for recovery purposes

