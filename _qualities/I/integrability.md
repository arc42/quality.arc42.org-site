---
title: Integrability
tags: [flexible, operable]
related: [interoperability, modularity, composability, compatibility, integrity]
permalink: /qualities/integrability
---

### Definitions

> Integrability is the ease with which a software component or system can be integrated with other components or systems.
>
>[System integration - Wikipedia](https://en.wikipedia.org/wiki/System_integration)

<hr class="with-no-margin"/>

> In the ISO/IEC 25010 quality model, related characteristics such as Compatibility (Interoperability) and Modularity describe how components interact and compose; 
> integrability focuses on the effort required to make those interactions work in a specific context with minimal change.
>
>[ISO/IEC 25010 (overview)](https://en.wikipedia.org/wiki/ISO/IEC_25010) · See also: [/standards/iso-25010](/standards/iso-25010)

### Scope and Intent
- Aim: enable seamless combination of software components and systems with minimal integration effort.
- Techniques: contract‑first APIs, standardized interfaces, explicit versioning and deprecation policy, backward‑compatibility guarantees, event/data schemas, loose coupling, clear extension points.
- Evidence: median time to integrate a new provider (e.g., ≤ 40h); contract‑test suite passes across supported versions; % of integrations requiring custom adapters kept low (e.g., ≤ 20%); interface compatibility tests green in CI.

### Notes
- [Interoperability](/qualities/interoperability): ability of systems to exchange/use information at runtime (ISO/IEC 25010 Compatibility).
- Integrability: the work/effort to make such interactions operational in a given environment (adapters, mappings, contracts).
