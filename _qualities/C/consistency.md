---
title: Consistency
tags: [usable, efficient]
related: [understandability, coherence]
standards: [iso26514, iso25024, iso42010, iso42030, iso12207, sox, wcag22, en301549]
permalink: /qualities/consistency
---

>Free from variation or contradiction
>
>[Merriam-Webster](https://www.merriam-webster.com/dictionary/consistent)

### Eventual Consistency (in Distributed Systems)

Eventual consistency is a weaker consistency model: after an update, reads may temporarily return stale values, but if no new updates occur, all replicas will eventually converge to the last written value. It is commonly used to improve availability and latency in distributed systems.

**References**

1. Werner Vogels, *Eventually Consistent*, Communications of the ACM (2009): https://cacm.acm.org/practice/eventually-consistent/
2. DeCandia et al., *Dynamo: Amazon's Highly Available Key-Value Store*, SOSP (2007): https://dl.acm.org/doi/10.1145/1294261.1294281
