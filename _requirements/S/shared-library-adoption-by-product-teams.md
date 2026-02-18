---
title: "Shared library adoption by product teams"
tags: [flexible, maintainable]
related: [reusability, maintainability, modifiability, adaptability]
permalink: /requirements/shared-library-adoption-by-product-teams
---

<div class="quality-requirement" markdown="1">

#### Context

Multiple product teams build user-facing features and should reuse a shared component library instead of duplicating common implementations.

#### Trigger

A team starts a new feature stream or a new product integration.

#### Acceptance Criteria

- Over a rolling quarter, at least **80%** of UI components used in shipped features come from the shared library.
- A new team can integrate the library and deliver its first production use within **<= 2 hours**, using only the provided documentation and examples.
- For all reusable components, usage guidance (API contract, examples, and version compatibility notes) is available and current at release time.
- Over a rolling quarter, duplicated local re-implementations of components already available in the shared library account for **<= 10%** of shipped components.
- Breaking changes in shared components include a documented migration path and a deprecation period of at least **1** regular release cycle.

</div><br>
