---
layout: approach
title: Bulkheads
tags: [reliable]
supported_qualities: [fault-tolerance, availability, resilience, stability, graceful-degradation]
supported_qualities_notes:
  fault-tolerance: A failure in one compartment cannot propagate to others, so the system keeps functioning despite partial outages.
  availability: Unaffected resource pools continue serving requests while the degraded pool is isolated or recovering.
  resilience: Blast radius is bounded by design — resource exhaustion in one path does not cascade system-wide.
  stability: Load spikes or failures in one consumer cannot destabilize unrelated workloads sharing the same infrastructure.
  graceful-degradation: When a pool is saturated, only its callers see errors; the rest of the system degrades gracefully rather than collapsing entirely.
tradeoffs: [resource-utilization, capacity, code-complexity, observability]
tradeoff_notes:
  resource-utilization: Dedicated pools reserve capacity per compartment, leaving some resources idle even when other pools are under pressure.
  capacity: Total peak throughput is lower than with a single shared pool because spare capacity in one partition cannot absorb bursts in another.
  code-complexity: Partition boundaries, pool sizing, and per-compartment configuration add operational and architectural overhead.
  observability: Monitoring per-pool utilization, rejection rates, and queue depths across many compartments increases telemetry volume.
related_requirements: [server-fails-operation-without-downtime, zone-failure-no-service-interruption]
related_requirements_notes:
  server-fails-operation-without-downtime: Bulkheads ensure that a server or dependency failure only affects the isolated pool, not the entire system.
  zone-failure-no-service-interruption: Partitioning resources across zones is a bulkhead strategy at infrastructure level.
intent: "Isolate resource pools so that a failure, slowdown, or overload in one part of the system cannot exhaust shared resources and cascade into unrelated parts."
mechanism: "Partition shared resources — thread pools, connection pools, memory regions, or entire service instances — into isolated compartments, each with its own capacity limits; when one compartment saturates or fails, the others continue operating within their own budgets."
applicability: "Use when a system has multiple callers, dependencies, or workload classes competing for shared resources, and a failure in one must not degrade the others. Avoid when workloads are uniform and the overhead of maintaining separate pools outweighs the isolation benefit."
permalink: /approaches/bulkheads
---

Bulkheads borrow their name from ship construction, where watertight compartments prevent a single hull breach from flooding the entire vessel. In software, the same principle partitions shared resources — threads, connections, memory, or entire service instances — so that one misbehaving dependency or workload cannot monopolize capacity and drag down everything else.

## How It Works

- **Resource Partitioning**: Identify the shared resources at risk of contention (e.g., thread pools, DB connection pools, HTTP clients, memory budgets) and divide them into isolated pools.
- **Dedicated Sizing**: Size each pool based on the specific workload's expected throughput and latency, plus a small headroom for bursts.
- **Hard Enforcement**: Enforce limits per pool so that once a pool is full, new requests for that specific resource are rejected immediately without affecting other pools.
- **Local Load Shedding**: When a bulkhead is saturated, the system sheds load locally (returning a fail-fast error like `503 Service Unavailable`) to prevent back-pressure from building up system-wide.
- **Health Monitoring**: Track pool utilization, rejection rates, and wait times per compartment as the primary health signals for capacity planning.

## Failure Modes

- **Sizing Imbalance**: Pools sized too small cause premature rejection during normal peaks (false positives); pools sized too large allow too much pressure to leak into the host before the "wall" works.
- **Downstream Bottlenecks**: Even with separate pools, a single shared resource further downstream (e.g., a central database lock or a shared network link) still acts as a single point of failure.
- **Shared Ingress Queues**: If all requests pass through a single, deep global queue before reaching the bulkhead, a slowdown in one path will still block the entire queue and starve other compartments.
- **Static Sizing Fatigue**: Fixed pool sizes cannot adapt to seasonal traffic shifts, leading to either resource waste or excessive rejections as the application evolves.
- **Silent Saturation**: Without per-pool alerting, operators may see high overall error rates but fail to realize that only one isolated compartment is failing while the rest of the system is healthy.

## Verification

- **Compartment Isolation Test**: Under production-like load, saturate one bulkhead (e.g., by delaying its downstream dependency) and verify that the success rate in other bulkheads stays above the target SLO (e.g., `> 99.9%`).
- **Fail-Fast Latency**: Assert that requests hitting a saturated bulkhead are rejected immediately (e.g., p99 rejection latency `< 50 ms`) rather than waiting for timeouts.
- **Headroom Validation**: Verify that the sum of all bulkhead limits (threads, memory) stays within the physical limits of the host under peak load to avoid overcommitment.
- **Recovery SLO**: After the saturated dependency recovers, verify that the bulkhead drains its backlog and resumes normal operation within the agreed time window (e.g., `< 30 s`).

## Variants and Related Tactics

- **Service-Level Bulkheads**: Deploying dedicated service instances per tenant class or per critical caller to provide infrastructure-level isolation.
- **Thread Pool Partitioning**: Using separate `ExecutorService` instances in JVM-based systems or separate worker pools in Node.js/Go to prevent slow I/O from blocking unrelated CPU tasks.
- **Circuit Breaker Integration**: Using bulkheads to limit the blast radius of a slowdown, while the circuit breaker prevents persistent pressure on the failing dependency itself.
- **Cell-Based Architecture**: Scaling by dividing the entire system into "cells" that share no runtime resources, providing a massive bulkhead at the deployment level.

## References

- [Release It!](https://pragprog.com/titles/mnee2/release-it-second-edition/) — Michael Nygard ([full citation](/references/#nygard2018release))
- [Software Architecture in Practice](https://www.sei.cmu.edu/library/software-architecture-in-practice-fourth-edition/) — Bass, Clements & Kazman ([full citation](/references/#bass2021software))
