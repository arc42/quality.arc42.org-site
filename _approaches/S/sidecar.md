---
layout: approach
title: "Sidecar"
tags: [flexible, operable]
aka: [Ambassador]
supported_qualities: [extensibility, legacy-support, observability, interoperability]
supported_qualities_notes:
  extensibility: "New capabilities — TLS, retries, telemetry — arrive as a deployed companion, with zero changes to application code."
  legacy-support: "Retrofits current platform capabilities onto processes nobody can or wants to modify."
  observability: "A telemetry sidecar gives every service uniform logs, metrics, and traces without touching any codebase."
  interoperability: "An adapter or ambassador sidecar translates protocols, letting mismatched components talk without changing either side."
tradeoffs: [resource-efficiency, latency, simplicity]
tradeoff_notes:
  resource-efficiency: "Every workload instance carries an extra process with its own CPU and memory reservation. At fleet scale this overhead is one of the main drivers behind sidecar-less service-mesh designs."
  latency: "Each intercepted call crosses the proxy twice — small per hop, but it stacks along multi-service request chains and shows in tail latencies."
  simplicity: "Two coupled containers now form one unit: startup order, health checks, and shutdown need coordination, and upgrading the sidecar fleet means restarting every workload that carries it."
intent: "Add or adapt capabilities of an application by deploying a companion process beside it, leaving the application untouched."
mechanism: "A sidecar runs in the same scheduling unit as the application — same host or pod — sharing network and storage. It intercepts or supplements the application's traffic to add capabilities such as TLS termination, retries, or telemetry, and deploys and upgrades on its own cadence."
applicability: "Use to give a polyglot or legacy fleet uniform cross-cutting behavior, or to extend an application you cannot modify. Skip when a shared library is viable across your stacks, or when per-instance overhead outweighs the gain — single-stack shops often need no sidecar."
related: [plugin-architecture, microservice-architecture]
related_notes:
  plugin-architecture: "Plugins extend a system in-process through design-time extension points; a sidecar extends it out-of-process at deployment time, needing no extension points at all."
  microservice-architecture: "In microservice fleets, sidecars apply resilience and security policy uniformly across polyglot services — the building block of a service mesh."
related_requirements: [production-anomalies-detectable-within-2-minutes]
related_requirements_notes:
  production-anomalies-detectable-within-2-minutes: "A telemetry sidecar adds the required logs, metrics, and traces without accessing source code or redeploying instrumentation."
permalink: /approaches/sidecar
---

A sidecar is a companion process deployed beside an application in the same scheduling unit — pod, VM, or host — sharing its network and storage. It adds or adapts capabilities — TLS termination, retries, protocol translation, telemetry — while the application stays unchanged.

Burns and Oppenheimer named the pattern in 2016: containers had made co-deployment cheap enough to turn "modify the application" problems into "deploy a companion" problems. Most service meshes build on it, though sidecar-less variants are emerging.

![Sidecar: a companion process in the same scheduling unit intercepts inbound traffic, hands it to the unchanged application over localhost, proxies outbound calls, and ships telemetry.](/assets/img/approaches/sidecar.svg)

## How It Works

- Sidecar and application share fate: they scale, schedule, and die together.
- The shared network namespace lets the sidecar intercept inbound or outbound traffic transparently via localhost or port redirection.
- The sidecar ships and upgrades on its own cadence, independent of the application's release cycle.
- One sidecar image serves every language in the fleet — the capability is written once, not once per stack.

## Failure Modes

- The application starts before the sidecar is ready, or the sidecar drains first at shutdown; calls fail at every rollout.
- The sidecar accretes features until every release of it risks the whole fleet at once.
- Overhead surfaces at scale: thousands of instances each reserve sidecar CPU and memory; the infrastructure bill jumps.
- A crashing or saturated sidecar takes its healthy application down — shared fate cuts both ways.

## Verification

- Sidecar CPU and memory stay within an agreed per-instance budget, e.g. below 10% of the workload's reservation.
- p95/p99 latency with and without interception stays within the agreed delta.
- Chaos check: killing the sidecar marks the whole instance unhealthy and traffic shifts away; no half-alive instance keeps serving.
- Rollout logs show sidecar upgrades completing fleet-wide with zero application code changes.

## Variants and Related Tactics

- Ambassador: a sidecar proxying the application's outbound calls — discovery, routing, retries — so the application sees only localhost.
- Adapter: a sidecar normalizing the application's output — metrics, logs — to a fleet-wide standard.
- Service mesh: sidecars at fleet scale under central control; sidecar-less designs (ambient, eBPF) move the proxy to node level to cut overhead.

## References

- [Design Patterns for Container-based Distributed Systems](https://www.usenix.org/conference/hotcloud16/workshop-program/presentation/burns) — Brendan Burns, David Oppenheimer (USENIX HotCloud '16, 2016)
- *Designing Distributed Systems*, 2nd ed. — Brendan Burns (O'Reilly, 2025)
