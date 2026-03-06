---
layout: approach
title: Plugin Architecture
tags: [flexible]
supported_qualities: [extensibility, modifiability, reusability, availability, security]
supported_qualities_notes:
  extensibility: Allows new capabilities to be added without core code changes.
  modifiability: Localizes many behavior changes to plugin modules and contracts.
  reusability: Shared plugin APIs can be reused across products and deployments.
  availability: Enables fault isolation; a crashing plugin should not bring down the entire host.
  security: Provides a framework for sandboxing and validating untrusted code.
tradeoffs: [security, performance, maintainability]
tradeoff_notes:
  security: Untrusted plugins can execute harmful behavior without strict isolation.
  performance: Indirection and plugin boundaries can increase invocation overhead.
  maintainability: Versioning plugin contracts and compatibility adds ongoing effort.
related_requirements: [compatible-with-5-battery-providers, service-loose-coupling-change-blast-radius, fast-rollout-of-changes]
related_requirements_notes:
  compatible-with-5-battery-providers: Supports hardware-agnostic logic via driver-style plugins.
  service-loose-coupling-change-blast-radius: Plugin contracts isolate changes from the core system.
  fast-rollout-of-changes: Enables targeted capability rollout by enabling plugins incrementally.
intent: "Enable third parties or independent teams to extend system behavior without modifying or redeploying its core."
mechanism: "Define a stable extension point (API, interface, or event bus) in the core; plugins are self-contained units that register themselves at startup or runtime and are invoked by the host through a shared contract."
applicability: "Use when you need to support a varying or unknown set of capabilities that cannot all be built into the core, or when different customers or environments need different feature combinations. Avoid when the extension set is fully known and fixed, or when the overhead of maintaining a plugin API is greater than the benefit."
permalink: /approaches/plugin-architecture
---

Plugin architecture (or Add-in architecture) allows a system to grow beyond its initial requirements. By providing stable extension points, the core application remains lean while allowing new features to be added, swapped, or removed without impacting the base system.

## How It Works

The core application defines one or more **extension points** — typically interfaces, abstract base classes, or event types. Plugins implement those contracts and are discovered by the host.

1. **Registration:** At startup or on demand, each plugin registers itself with the host's plugin registry, declaring which extension point it implements.
2. **Discovery:** The host discovers available plugins by querying the registry without needing to know any concrete plugin types.
3. **Execution:** When specific behavior is needed, the host invokes the extension point contract, which delegates the call to one or all registered plugins.

### Common Loading Strategies

- **Static (Classpath / File-system Scan):** Plugins are placed in a known directory; the host scans and loads them at startup.
- **Service Locator / SPI (Java `ServiceLoader`, Python `entry_points`):** Plugins declare themselves in metadata; the host discovers them dynamically.
- **Hot-plug / Hot-reload:** Plugins can be added, updated, or removed while the host is running (e.g., OSGi, VS Code extension host).
- **Event-driven:** The host publishes lifecycle and data events; plugins subscribe to specific topics without direct coupling to the host's call stack.

### Plugin Isolation Options

| Isolation level | Mechanism | Trade-off |
| :--- | :--- | :--- |
| **None (In-process)** | Direct class loading | Maximum performance; any plugin crash kills the host. |
| **Classloader isolation** | Separate `ClassLoader` | Prevents library version conflicts; moderate memory overhead. |
| **Process isolation** | Plugin in subprocess | Strong fault isolation; high IPC latency. |
| **Sandbox / WASM** | WebAssembly or VM guard | Maximum security and isolation; limited to specific language targets. |

## Failure Modes

- **API versioning breakage:** Changing the core extension API breaks existing plugins; semantic versioning and long deprecation cycles are mandatory for public APIs.
- **Resource Leaks:** Plugins that fail to release memory, file handles, or thread pools upon unloading eventually destabilize the host.
- **Registration race conditions:** In dynamic environments, the host invokes an extension point before the required plugins have fully initialized or registered.
- **Malicious plugins:** Without sandboxing, a plugin inherits the host's privileges, creating a significant security risk for third-party extensions.
- **Performance unpredictability:** A single slow or blocking plugin executed synchronously can stall the entire host request-handling pipeline.

## Verification

- **Compliance Tests:** For each extension point, maintain a suite of tests (e.g., a "TCK" or shared test base class) that all plugins must pass to ensure contract adherence.
- **Fault Injection:** Use a "Chaos Plugin" that throws exceptions or times out to verify the host continues running with other plugins active.
- **Unload/Reload Cycle:** Perform 100 consecutive load/unload cycles while monitoring memory usage to detect resource leaks in the plugin lifecycle.
- **Latency Budgeting:** Measure the p99 invocation time for each extension point; alert if a single plugin increases total request latency by more than 10% over the baseline.

## Variants and Related Tactics

- **Micro-kernel:** A design where the core is reduced to a minimal engine and nearly all behavior, including built-in features, is implemented as plugins.
- **Extension Hooks:** Named points (e.g., `before-save`, `after-login`) where external handlers can be attached; simpler but less powerful than full interface implementation.
- **Marketplace Model:** Distribution through a curated, versioned registry with automated quality and security checks.

## References
- [Pattern: Microkernel (Plugin) Architecture](https://www.oreilly.com/library/view/software-architecture-patterns/9781491971437/ch03.html) — Mark Richards ([full citation](/references/#richards2022patterns))
- [Eclipse Plugin Architecture](https://www.eclipse.org/articles/Article-Plug-in-architecture/plugin_architecture.html)
