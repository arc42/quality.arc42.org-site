---
title: Evolvability
tags: [flexible, maintainable]
related: [adaptability, maintainability, extensibility, scalability, modularity, traceability, auditability]
permalink: /qualities/evolvability
---

> The ability of a system to adapt to changes in its environment, requirements, and implementation technologies in a cost-effective way.

<hr class="with-no-margin"/>

> An evolvable system is one that is designed to accommodate change. This is achieved through principles like modular design, loose coupling, and the use of fitness functions to guide and verify architectural changes.
> 
> Source: [Neal Ford, Rebecca Parsons, Patrick Kua, "Building Evolutionary Architectures"](https://www.oreilly.com/library/view/building-evolutionary-architectures/9781491986356/)

### Business and semantic uncertainty

Future change is not limited to requirements that are already understood. Business semantics may still be unresolved when a system is implemented, or may be reinterpreted as the domain becomes better understood.

Prematurely encoding such assumptions into persistent schemas, public contracts, workflow states, or other hard-to-reverse structures can turn **semantic uncertainty into structural debt**. If the implementation discards facts needed for later reinterpretation, structural modifiability alone is insufficient: the system may remain easy to change while no longer possessing the information required to reinterpret historical cases.

Preserving stable business facts and deriving replaceable interpretations can reduce this risk. It keeps later semantic change localized and supports traceability and auditability of how current and historical interpretations were derived.
