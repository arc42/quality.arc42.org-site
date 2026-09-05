---
title: Durability
tags: [reliable]
related: [atomicity, consistency, transactionality, reliability, availability, robustness, data-integrity]
permalink: /qualities/durability
---

> Durability guarantees that once a transaction has been committed, it will remain committed even in the case of a system failure (e.g., power outage or crash).
>
> [Wikipedia: ACID](https://en.wikipedia.org/wiki/ACID)

Durability is one of the four ACID properties (Atomicity, Consistency, Isolation, Durability) of transactional systems.
It depends on successful commit semantics from [Atomicity](/qualities/atomicity), and together with [Consistency](/qualities/consistency) and isolation it forms the ACID transaction guarantees.

<hr class="with-no-margin"/>

The everyday meaning of "durable", a product that stays useful for a long time, is a different quality: see [longevity](/qualities/longevity).
