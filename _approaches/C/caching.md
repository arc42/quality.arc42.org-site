---
title: Caching
tags: [efficient, reliable]
supported_qualities: [performance, scalability, responsiveness]
tradeoffs: [consistency, availability]
intent: Store frequently accessed data closer to the consumer to reduce latency and load on backend systems.
mechanism: Intercept data requests and serve previously computed or fetched results from a fast-access store, avoiding repeated expensive operations.
applicability: Use when data is read more often than written, when slight staleness is acceptable, and when backend latency or load is a concern. Avoid when data must always be real-time consistent or when the working set exceeds available cache memory.
permalink: /approaches/caching
---

## How It Works

Caching places a fast-access storage layer between the data consumer and the data source. When a request arrives, the cache is checked first (cache hit). If the data is not present or has expired (cache miss), it is fetched from the source, stored in the cache, and returned to the consumer.

### Common Caching Strategies

- **Read-through**: The cache itself fetches missing data from the source on a cache miss.
- **Write-through**: Data is written to both the cache and the source simultaneously, keeping them in sync.
- **Write-behind (write-back)**: Data is written to the cache first and asynchronously propagated to the source, improving write performance at the risk of data loss.
- **Cache-aside (lazy loading)**: The application manages the cache explicitly -- checking it before reads and updating it after writes.

### Cache Eviction Policies

- **TTL (Time-To-Live)**: Entries expire after a fixed duration.
- **LRU (Least Recently Used)**: The least recently accessed entries are evicted first.
- **LFU (Least Frequently Used)**: The least frequently accessed entries are evicted first.

## Failure Modes

- **Stale data**: Serving outdated information when the source has changed.
- **Cache stampede**: Many concurrent requests for the same expired key overwhelm the backend.
- **Cold start**: After a restart, the cache is empty and all requests hit the backend.
- **Memory pressure**: An unbounded cache consumes excessive memory, potentially destabilizing the system.
- **Cache poisoning**: Incorrect or corrupted data enters the cache and is served repeatedly.

## Verification Ideas

- Measure cache hit ratio under realistic workloads (target depends on use case, typically > 80%).
- Compare response times with and without caching enabled.
- Simulate cache failures and verify graceful degradation.
- Monitor memory usage and eviction rates in production.

## Variants

- **In-process cache**: Data stored in application memory (e.g., hash maps, Guava Cache). Fastest access, but not shared across instances.
- **Distributed cache**: Shared cache across multiple application instances (e.g., Redis, Memcached). Enables horizontal scaling.
- **CDN caching**: Content cached at edge locations close to users. Best for static or semi-static content.
- **HTTP caching**: Browser and proxy caches using HTTP headers (Cache-Control, ETag). Zero infrastructure cost for cacheable responses.
