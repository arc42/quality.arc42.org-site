---
layout: approach
title: "Content Delivery Network (CDN)"
tags: [efficient, operable]
supported_qualities: [latency, response-time, throughput, availability, scalability]
supported_qualities_notes:
  latency: Serving assets from edge nodes geographically close to users cuts round-trip time across long-haul links.
  response-time: Cached static responses return from the edge without touching the origin, shortening time-to-first-byte.
  throughput: Fan-out of requests across thousands of edge nodes multiplies effective serving capacity far beyond a single origin.
  availability: The origin stays reachable during traffic spikes and regional outages because edge caches absorb most of the load.
  scalability: Traffic surges are absorbed by the CDN's elastic edge fleet without provisioning origin capacity.
tradeoffs: [currentness, cost, debuggability]
tradeoff_notes:
  currentness: Cached content can lag the origin until TTLs expire or explicit purges propagate across the edge network.
  cost: Commercial CDN egress and request pricing adds a recurring operational expense that scales with traffic.
  debuggability: Faults and anomalies can originate at any of many edge nodes, cache layers, or routing decisions outside direct control.
related_requirements: [near-instant-search-results, response-time-for-image-rendering, handle-sudden-increase-in-traffic]
related_requirements_notes:
  near-instant-search-results: Edge caches return frequently requested results within tight latency budgets regardless of user location.
  response-time-for-image-rendering: Image assets are served from the closest edge, shrinking render time for global users.
  handle-sudden-increase-in-traffic: The edge fleet absorbs traffic spikes so the origin remains responsive under sudden load.
intent: "Reduce latency and offload origin capacity by serving cacheable content from edge nodes close to users."
mechanism: "Route requests to a globally distributed edge cache fleet via DNS or anycast to serve content from the nearest healthy node."
applicability: "Use for static or semi-static content with many geographically dispersed consumers. Avoid for highly dynamic, per-user, or strongly consistent data where cache invalidation overhead outweighs the latency benefit."
permalink: /approaches/content-delivery-network
---

A Content Delivery Network pushes cacheable responses out to a fleet of edge nodes so users receive content from a location geographically close to them. The origin only handles cache misses, purges, and non-cacheable traffic.

CDNs are most effective for static assets (images, scripts, stylesheets, video segments, downloads) and semi-static API responses. Highly personalized or transactional responses either bypass the edge or require careful cache-key design and short TTLs.

## How It Works

- **Request routing**: DNS-based or anycast routing directs each user request to the nearest healthy edge node (PoP).
- **Edge cache lookup**: The edge checks its local cache using a key derived from URL, headers, and query parameters; a hit returns immediately.
- **Origin fetch on miss**: On a miss, the edge fetches from the origin (optionally through a mid-tier shield cache) and stores the response according to `Cache-Control`, `ETag`, and `Vary` headers.
- **Invalidation and purge**: Content freshness is controlled via TTLs, stale-while-revalidate, conditional revalidation, or explicit purge APIs.
- **Offload features**: TLS termination, HTTP/3, compression, image optimization, and WAF/DDoS absorption run at the edge.
- **Composition**: Pairs naturally with [Caching](/approaches/caching) at the application layer and with Load Balancing at the origin.

## Failure Modes

- **Cache key explosion**: Including volatile headers, cookies, or query parameters in the cache key collapses hit ratio and pushes traffic to the origin.
- **Stale-forever content**: Long TTLs without a working purge or versioning strategy leave outdated assets at the edge for days.
- **Cache poisoning via unkeyed headers**: Attacker-controlled input reflected in responses but not included in the cache key serves malicious content to other users.
- **Thundering herd on purge**: A global purge of a hot object causes simultaneous misses across every edge, hammering the origin.
- **Origin exposure**: The origin IP leaks or is reachable directly, letting attackers bypass the CDN's DDoS protection.
- **Protocol mismatch**: Misconfigured `Vary` or compression negotiation causes the wrong variant (language, encoding) to be served to a user.

## Verification

- Edge hit ratio for static assets stays above 90%; origin fetch rate per 1000 requests stays below 10.
- p95 time-to-first-byte from representative user regions is at least 50% lower than direct-to-origin access.
- Purge propagation: verify that 99.9% of edge nodes return the new version within 60 seconds of a purge API call.
- Origin shielding: verify via origin access logs that unauthorized traffic (not from CDN IP ranges) is rejected with 100% consistency.
- DDoS resilience: verify origin CPU stays below 20% during a simulated 10× baseline traffic surge absorbed by the edge.
- Cache key integrity: verify that varying `User-Agent` or `Accept-Language` headers produce distinct cache entries when the origin response differs.

## Variants and Related Tactics

- **Push CDN**: Assets are uploaded to the edge ahead of demand. Useful for predictable release artifacts and media libraries.
- **Pull CDN**: The edge fetches from the origin on first miss. Default for most web workloads.
- **Edge compute**: Executing logic (auth, A/B routing, personalization fragments) at the edge via workers or functions to expand what can be cached.
- **Multi-CDN**: Routing across two or more providers for resilience and cost optimization; requires neutral configuration tooling.
- **Private CDN**: Self-operated edge fleet for sovereignty, compliance, or cost reasons at very large scale.

## References

- [RFC 9111: HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html)
- [Web Almanac: CDN chapter](https://almanac.httparchive.org/en/2022/cdn)
- [MDN: HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
