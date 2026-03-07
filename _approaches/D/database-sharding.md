---
layout: approach
title: "Database Sharding"
tags: [efficient, reliable]
supported_qualities: [scalability, capacity, throughput, availability, distributability]
supported_qualities_notes:
  scalability: Read and write load can be spread across multiple shards instead of concentrating on one database node or cluster.
  capacity: Total data volume can grow beyond the storage, memory, and index limits of a single server.
  throughput: Targeted operations can execute in parallel on different shards, increasing aggregate cluster throughput.
  availability: When each shard is independently replicated, a shard failure can be isolated to only the data or tenants on that shard instead of stopping the whole dataset.
  distributability: Data can be placed across multiple nodes or regions based on key ranges or placement rules.
tradeoffs: [consistency, code-complexity, operability, latency]
tradeoff_notes:
  consistency: Cross-shard transactions, joins, and global constraints require extra coordination and are often slower or weaker than single-shard operations.
  code-complexity: Applications and routing layers must understand shard keys, fan-out behavior, online migration, and failure handling.
  operability: Resharding, balancing, hotspot detection, and per-shard backup or restore add substantial operational surface area.
  latency: Queries that do not include the shard key can fan out to many shards and become slower than the same query on a single well-indexed database.
related_requirements: [respond-to-15000-requests-per-workday, data-throughput-for-visual-test-system, handle-sudden-increase-in-traffic]
related_requirements_notes:
  respond-to-15000-requests-per-workday: Sharding raises the storage and request-volume ceiling when the database tier is the limiting factor.
  data-throughput-for-visual-test-system: Partitionable workloads can be processed in parallel across shards when the dominant access path is tied to a stable partition key.
  handle-sudden-increase-in-traffic: Distributing reads and writes over multiple shards helps prevent one database node from saturating first during traffic growth.
intent: "Scale a database horizontally by partitioning one logical dataset into multiple shards so that storage growth, write load, and targeted query traffic no longer hit the limits of a single database server or cluster."
mechanism: "Choose a shard key that matches dominant access patterns, partition the data horizontally by range, hash, or directory mapping, route each request to the owning shard through a router or metadata service, replicate each shard independently for durability, and reshard online when data volume or key distribution changes."
applicability: "Use when a single database instance or replica set is no longer sufficient for dataset size, write throughput, or sustained hot-key traffic after schema tuning, indexing, caching, and read replicas have been exhausted. Avoid when the workload depends on frequent cross-shard joins, multi-shard transactions, or global uniqueness constraints that dominate the traffic profile."
permalink: /approaches/database-sharding
---

Database sharding horizontally partitions one logical database into multiple shards, each responsible for a subset of rows. Requests are routed by shard key so that most reads and writes hit one shard, not the whole fleet. Sharding is primarily a scale-out technique for data size and write throughput.

It is not a default optimization. A well-indexed single cluster, read replicas, archival, or CQRS are usually cheaper to operate. The shard key is the make-or-break design decision: a poor key creates hot shards, scatter-gather queries, and painful resharding.

![Database sharding diagram](/assets/img/approaches/database-sharding.svg)


## How It Works

- Choose a shard key that appears in the dominant read and write paths, for example `tenant_id`, `customer_id`, or an order-range identifier.
- Partition rows by range, hash, or directory lookup so each shard owns a non-overlapping subset of the key space.
- Route requests through a router or metadata service that maps the shard key to the correct shard; queries without the key usually fan out to multiple shards.
- Keep data that must be queried or updated together on the same shard whenever possible; sharding and replication are orthogonal, so each shard typically has its own primary and replicas.
- Plan online resharding from day one: copy data to new shards, keep source and target in sync, verify counts and checksums, then cut over routing with a bounded window.

## Failure Modes

- Hot shard: the chosen key is monotonic or heavily skewed, so one shard receives disproportionate write load or storage growth.
- Scatter-gather queries dominate because the application often queries by fields that are not the shard key or its prefix.
- Cross-shard joins, transactions, or global unique constraints become common, eliminating the expected scale benefit and increasing coordination cost.
- Resharding is treated as an exceptional project instead of a rehearsed operation, leading to long cutovers, drift, or data loss risk.
- Large tenants or key ranges outgrow the original distribution model, forcing emergency repartitioning under production load.

## Verification

- Balance SLI: under representative load, no shard exceeds 125% of the cluster median for data size, write QPS, or storage utilization for more than the agreed observation window.
- Routing efficiency: at least 95% of OLTP reads and writes are targeted to a single shard; scatter-gather operations stay below the agreed threshold (for example <= 5% of requests).
- Hotspot test: during peak load, the hottest shard stays within the declared headroom budget (for example p95 CPU, IOPS, or QPS <= 1.5x the shard median).
- Resharding drill: perform an online split or merge on representative production-like data; row counts and checksums match 100%, no acknowledged write is lost, and p95 latency degradation during cutover stays within the agreed limit (for example <= 25%).
- Failure isolation: take one shard replica set out in staging and verify that unaffected shards remain within normal latency and error budgets while the impact on the failed shard matches the documented SLO.

## References

- [Vitess Docs: Sharding](https://vitess.io/docs/22.0/reference/features/sharding/)
- [Vitess Docs: VSchema](https://vitess.io/docs/reference/features/vschema/)
- [MongoDB Manual: Sharding](https://www.mongodb.com/docs/manual/sharding/)
- [Spanner: Google's Globally-Distributed Database](https://research.google/pubs/pub39966/)
