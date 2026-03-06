---
layout: approach
title: Caching
tags: [efficient, reliable]
supported_qualities: [performance, scalability, responsiveness]
supported_qualities_notes:
  performance: Reduces repeated expensive operations and lowers response time.
  scalability: Offloads backend services to handle higher concurrent demand.
  responsiveness: Returns frequent queries faster from near-memory storage.
tradeoffs: [consistency, code-complexity, memory-usage, observability]
tradeoff_notes:
  consistency: Cached values can become stale between updates and invalidation.
  code-complexity: Cache invalidation and eviction policies add implementation overhead.
  memory-usage: Large or unbounded caches can consume significant memory.
  observability: Monitoring cache hit rates, eviction frequency, and data staleness adds operational overhead.
related_requirements: [response-time-for-image-rendering]
intent: "Store frequently accessed data closer to the consumer to reduce latency and load on backend systems."
mechanism: "Interpose a fast-access storage layer between the consumer and the source, check it first for a match (hit), and only fetch from the source (miss) when necessary, optionally updating the cache according to read/write strategies."
applicability: "Use when data is read significantly more often than it is written, when slight staleness is acceptable, and when backend latency or load is a concern. Avoid when data must always be real-time consistent or when the working set exceeds available cache memory."
permalink: /approaches/caching
---

Caching adds a fast storage layer between consumers and the primary data source to reduce repeated expensive reads and improve response times.

It is most effective when reads dominate writes and when the system can tolerate bounded staleness with explicit invalidation and expiry behavior.

## How It Works

Caching places a fast-access storage layer (near-memory or distributed) between the data consumer and the data source. When a request arrives, the cache is checked first. If the data is present (hit), it is returned immediately. If not (miss), it is fetched from the source, stored in the cache, and then returned.

- **Read-through**: The cache itself fetches missing data from the source on a cache miss.
- **Write-through**: Data is written to both the cache and the source simultaneously, ensuring they stay in sync.
- **Write-behind (write-back)**: Data is written to the cache first and asynchronously propagated to the source, improving write performance but increasing risk of data loss.
- **Cache-aside (lazy loading)**: The application manages the cache explicitly — checking it before reads and updating it after writes.
- **TTL (Time-To-Live)**: Entries expire and are automatically removed after a fixed duration.
- **LRU (Least Recently Used)**: The least recently accessed entries are evicted first to make room for new data.

## Failure Modes

- **Stale data**: Serving outdated information because the source changed but the cache has not yet expired or been invalidated.
- **Cache stampede (Thunderous Herd)**: Many concurrent requests for the same expired key all trigger a miss simultaneously, overwhelming the backend with redundant recomputations.
- **Cold start**: After a restart or deployment, the cache is empty, causing all initial requests to hit the backend at once.
- **Memory pressure**: An unbounded cache consumes excessive memory, leading to garbage collection pauses or system instability.
- **Cache poisoning**: Incorrect, unauthorized, or corrupted data enters the cache and is served repeatedly to multiple users.

## Verification

- Under realistic load, p99 response time for cached endpoints stays below the target threshold (e.g., `< 100 ms`) with a cache hit ratio of at least 80%.
- Latency reduction: Verify that p95 response time is at least 50% lower with caching enabled compared to a non-cached baseline.
- Invalidation check: After a write to the source, the cache reflects the new value within the agreed TTL window or immediately upon explicit invalidation.
- Simulation: Verify that the system degrades gracefully and does not crash when the caching layer (e.g., Redis) is unavailable.

## Variants and Related Tactics

- **In-process cache**: Data stored in application memory (e.g., hash maps, Caffeine). Fastest access, but not shared across instances.
- **Distributed cache**: Shared cache across multiple application instances (e.g., Redis, Memcached, Hazelcast). Enables horizontal scaling and consistency across the cluster.
- **CDN caching**: Content cached at edge locations close to users. Essential for static or semi-static assets in global applications.
- **HTTP caching**: Browser and proxy caches using standard headers (Cache-Control, ETag).
- **Memoization**: Caching the results of pure functions based on their input parameters.

## References
- [Caching Strategies and Eviction Policies](https://codeahoy.com/2017/08/11/caching-strategies-and-eviction-policies/)
- [RFC 9111: HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html)
