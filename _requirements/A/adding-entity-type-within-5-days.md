---
title: "Adding a new entity type within 5 days and ≤ 3 modules"
tags: [flexible, maintainable]
related: [evolvability, modularity, maintainability, extensibility]
permalink: /requirements/adding-entity-type-within-5-days
---

<div class="quality-requirement" markdown="1">

#### Context

A legacy business application is undergoing incremental modernisation toward a modular architecture.
The business regularly introduces new entity types (e.g., a new product category, contract type, or regulatory report) that require end-to-end support: persistence, validation, REST API, and UI.
The architecture must make such changes predictable, localised, and fast — without cascading modifications across unrelated modules.

#### Trigger

A product team receives a business requirement to add a new entity type to the system, requiring full-stack support (database schema, domain model, service layer, REST endpoint, and basic UI form).

#### Acceptance Criteria

- Full-stack implementation of a new entity type touches **at most 3 existing modules** (measured by the number of top-level module directories modified in the version-control diff, excluding the new module itself)
- The **aggregate number of lines changed** outside the new module's own directory is **≤ 50 lines** (excluding auto-generated code such as OpenAPI stubs or ORM migrations)
- A developer with 3–6 months of codebase experience can complete the implementation within **5 working days**, as validated retrospectively across ≥ 3 completed entity additions
- An **automated fitness function running in CI** (e.g., ArchUnit or Dependency-Check) fails the build if any module imports internal packages from more than **7 other modules**
- Adding the new entity type does not cause any existing automated test to fail; existing logic and test assertions require **zero modifications** (Open-Closed Principle)
- Static analysis at merge time confirms the new module's **afferent coupling (Ca) ≤ 5** and **efferent coupling (Ce) ≤ 8**; furthermore, no existing module's **efferent coupling (Ce)** increases by more than **1**
- The new module itself achieves **≥ 80% statement coverage** and **zero critical issues** in static analysis (e.g., SonarQube 'Blocker' or 'Critical' severity)
- The new REST endpoint passes **automated schema linting** (e.g., Spectral), confirming 100% adherence to project-wide naming, pagination, and error-structure standards
- The new entity type is **automatically reflected** in the OpenAPI/Swagger documentation and the System Data Dictionary upon successful build, requiring zero manual documentation updates

</div>
