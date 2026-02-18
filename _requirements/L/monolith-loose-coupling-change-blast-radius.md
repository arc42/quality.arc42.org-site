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

- Per change, implementation touches no more than **2 modules** outside the owning functional module.
- Architecture tests in CI report **0** violations of declared layer/module dependency rules (for example no direct UI -> persistence dependencies, and no cyclic dependencies across modules).
- Over a rolling 90-day window, at least **90%** of classes in changed modules keep class coupling (CBO) **<= 10** after the change.
- Over a rolling 90-day window, at least **90%** of functional changes are implemented without code changes in unrelated modules.
- Over a rolling 90-day window, at least **80%** of such changes are delivered (code, tests, and release) by one developer within **<= 3 working days**.

</div><br>
