---
layout: approach
title: Plugin Architecture
tags: [flexible]
aka: [Microkernel, Add-in Architecture]
supported_qualities: [extensibility, modifiability, configurability, reusability]
supported_qualities_notes:
  extensibility: "New capabilities arrive as plugins against a stable extension point; the core stays closed to modification, open to extension."
  modifiability: "A behavior change lands in one plugin behind a contract; the blast radius stops at the extension-point boundary."
  configurability: "Per-customer or per-environment feature sets become composition: ship the same core, vary the plugin set."
  reusability: "A plugin written once runs in every product and version that hosts the same extension point."
tradeoffs: [security, performance, maintainability]
tradeoff_notes:
  security: "A plugin inherits the host's privileges unless sandboxed; one malicious or compromised third-party extension reads what the host reads and writes what it writes. Marketplace ecosystems carry this as a permanent supply-chain risk."
  performance: "Every extension-point call pays indirection — registry lookup, dynamic dispatch, sometimes a process or sandbox crossing. One slow synchronous plugin stalls the host's whole pipeline, and the isolation levels strong enough for safety cost the most latency."
  maintainability: "The extension API is a public contract: every change must stay compatible with plugins the team neither owns nor sees. Versioning, deprecation windows, and compatibility test suites become permanent core-team work that grows with the ecosystem."
intent: "Let third parties or independent teams extend system behavior without modifying or redeploying its core."
mechanism: "Define a stable extension point (API, interface, or event bus) in the core; plugins register themselves at startup or runtime, and the host invokes them through the shared contract."
applicability: "Use when the capability set varies or is unknown — third-party extensions, per-customer feature combinations, hardware drivers. Skip when the extension set is small and fixed: a stable public API is permanent work that a handful of known variants never repays."
related: [externalized-business-rules]
related_notes:
  externalized-business-rules: "Both defer binding of volatile behavior: rules externalize decision logic declaratively, plugins extend the system imperatively through code."
related_requirements: [compatible-with-5-battery-providers, service-loose-coupling-change-blast-radius, fast-rollout-of-changes]
related_requirements_notes:
  compatible-with-5-battery-providers: "Each battery provider becomes a driver-style plugin behind one hardware contract; a sixth provider means adding a plugin, not changing core logic."
  service-loose-coupling-change-blast-radius: "Plugin contracts confine a change to one module; the core and all other plugins stay untouched."
  fast-rollout-of-changes: "New capabilities roll out by enabling plugins one at a time, without redeploying the host."
permalink: /approaches/plugin-architecture
---

Plugin architecture lets a system grow beyond its initial requirements: the core defines stable extension points, and features arrive as plugins that add, swap, or drop behavior without touching it. Richards catalogs the style as microkernel — a minimal core whose features are all plugins.

The price sits in the contract: once third parties build against the API, the core team maintains a public product.

![Plugin architecture: the host core owns extension-point contracts and a plugin registry; plugins implement the contracts and register at startup or runtime, so features can be added, swapped, or dropped without changing the core.](/assets/img/approaches/plugin-architecture.svg)

## How It Works

- The core declares extension points — interfaces, abstract classes, event topics — and owns their semantics.
- Plugins implement a contract and register through discovery: directory scan, service registry (e.g. Java ServiceLoader, Python entry points), or runtime hot-plug.
- The host invokes extension points without knowing concrete types; one or all registered plugins answer.
- Isolation is a dial: in-process is fastest, classloader isolation prevents dependency conflicts, subprocess or sandbox contains crashes and malice — each step up costs latency.

## Failure Modes

- A breaking API change strands the plugin ecosystem; core upgrades stall until plugins catch up.
- A plugin leaks memory, handles, or threads across unload cycles and slowly destabilizes the host.
- The host invokes an extension point before plugins finish registering; behavior varies silently with startup timing.
- An unsandboxed plugin runs with the host's privileges; one compromised extension becomes a supply-chain incident.

## Verification

- Every plugin passes the extension point's shared compliance test suite before release.
- A chaos plugin that throws and hangs leaves the host and all other plugins serving.
- 100 consecutive load/unload cycles show flat memory and handle counts.
- Per-plugin p99 invocation time is tracked; one plugin adding over 10% to request latency triggers an alert.

## Variants and Related Tactics

- Microkernel: the limiting case, where even built-in features are plugins — IDEs and module systems work this way.
- Extension hooks: named attachment points (before-save, after-login) — simpler and weaker than full contracts.
- Marketplace model: third-party plugins ship through a curated registry with automated quality and security gates.
- Sidecar moves the same extend-without-modifying idea out of process, to deployment time.

## References

- *Software Architecture Patterns*, 2nd ed. — Mark Richards (O'Reilly, 2022), the Microkernel chapter
- *Pattern-Oriented Software Architecture, Volume 1* — Frank Buschmann et al. (Wiley, 1996), the Microkernel pattern
