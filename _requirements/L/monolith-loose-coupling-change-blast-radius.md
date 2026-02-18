---
title: "Monolith loose coupling: change blast radius"
tags: [maintainable, suitable, efficient]
related: [loose-coupling, modularity, modifiability, maintainability, cohesion]
permalink: /requirements/monolith-loose-coupling-change-blast-radius
---

<div class="quality-requirement" markdown="1">

#### Context

A conventional client/server business application with a modular monolith backend (UI, application, domain, persistence modules).

#### Trigger

A new business rule is added in one functional area (for example pricing or invoicing).

#### Acceptance Criteria

- The implementation change touches no more than **2 modules** outside the owning functional module.
- There are **0** compile-time dependencies from UI module directly to persistence module (architecture tests in CI).
- At least **90%** of classes in changed modules keep class coupling (CBO) **<= 10** after the change.
- Unit/integration tests outside the changed functional area requiring updates are limited to **<= 10 test cases** per change.
- The change is delivered (code, tests, and release) by one developer within **<= 3 working days**.

</div><br>
