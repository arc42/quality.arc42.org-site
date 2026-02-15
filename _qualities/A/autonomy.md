---
title: Autonomy
aka: [Autonomicity]
tags: [operable, suitable]
related: [independence, self-containedness, controllability, composability, flexibility, configurability, adaptability, recoverability, fault-tolerance, resilience]
permalink: /qualities/autonomy
---

The ability of a system or component to operate independently, without requiring continuous control or intervention from external entities.

>An autonomous decentralized system is a decentralized system composed of modules or components that are designed to operate independently but are capable of interacting with each other to meet the overall goal of the system.
>
>[Wikipedia: Autonomous decentralized system](https://en.wikipedia.org/wiki/Autonomous_decentralized_system)

In software and systems architecture, autonomy means a component can function, be deployed, and evolve on its own — for example, a microservice that owns its data and lifecycle, or a subsystem that operates even when other parts of the system are unavailable.

### Autonomy vs. Autonomicity

**Autonomy** describes a system's ability to operate independently — it does not _need_ others to function.
**Autonomicity** is a closely related but distinct concept from autonomic computing that emphasizes self-management: a system that automatically adapts its own behavior without human intervention.

>Autonomic computing [...] creates systems that can manage themselves when given high-level objectives from administrators. [...] These ideas are not science fiction, but elements of the grand challenge to create self-managing computing systems.
>
>Kephart, J.O. and Chess, D.M. (2003). The Vision of Autonomic Computing. _IEEE Computer_, 36(1), pp. 41-50. [DOI: 10.1109/MC.2003.1160055](https://doi.org/10.1109/MC.2003.1160055)

Kephart and Chess identify four key self-* properties of autonomic systems:

#### Self-Configuring

Automatic discovery of the environment and dynamic adjustment of parameters at runtime.
A self-configuring system adapts to changing conditions — such as new components joining, resources becoming available, or workload patterns shifting — without requiring manual intervention.
Related qualities: [configurability](/qualities/configurability), [adaptability](/qualities/adaptability).

#### Self-Healing

Automatic detection, diagnosis, and recovery from failures.
A self-healing system monitors its own health, identifies faults, and takes corrective action (e.g., restarting failed components, rerouting traffic, restoring state from checkpoints) without human intervention.
Related qualities: [recoverability](/qualities/recoverability), [fault-tolerance](/qualities/fault-tolerance), [resilience](/qualities/resilience).

#### Self-Optimizing

Continuous performance improvement through runtime adaptation to changing workloads.
A self-optimizing system monitors its own performance and resource usage, identifies inefficiencies, and adjusts its behavior — such as reallocating resources, tuning cache sizes, or rebalancing load — to improve throughput, latency, or resource utilization.
Related qualities: [performance](/qualities/performance), [resource-utilization](/qualities/resource-utilization), [energy-proportionality](/qualities/energy-proportionality).

#### Self-Protecting

Autonomous security response combining proactive defense with reactive containment.
A self-protecting system detects threats, takes defensive measures (e.g., blocking suspicious traffic, isolating compromised components, revoking credentials), and adapts its security posture based on observed attack patterns.
Related qualities: [security](/qualities/security), [resistance](/qualities/resistance), [resilience](/qualities/resilience).

<hr>

A system can be autonomous without being autonomic (e.g., an independent service that still needs manual configuration), and a system can be autonomic without being fully autonomous (e.g., a self-healing component that depends on external services).

For this quality model, *autonomicity* is treated as an alias of *autonomy*.
