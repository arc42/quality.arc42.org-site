---
title: Autonomy
tags: [operable, suitable]
related: [independence, self-containedness, controllability, composability, flexibility]
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

Kephart and Chess identify four key self-* properties of autonomic systems: self-configuration, self-healing, self-optimization, and self-protection.

A system can be autonomous without being autonomic (e.g., an independent service that still needs manual configuration), and a system can be autonomic without being fully autonomous (e.g., a self-healing component that depends on external services).

For this quality model, *autonomicity* is treated as an alias of *autonomy*.
