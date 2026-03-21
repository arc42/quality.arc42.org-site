---
title: Testability
aka: [Unit Testability]
tags: [suitable, maintainable]
related: [determinism, maintainability, flexibility, modifiability, analysability]
standards: [iso25010, iso26262, misra-c, iec61508, iso15408, do178c, iso24028, iso29119]
permalink: /qualities/testability
---

> Capability of a product to enable an objective and feasible test to be designed and performed to determine whether a requirement is met.
>
> [ISO-25010:2023](/references/#iso-25010-2023)

> Effort required to test a program to ensure it performs its intended function.
>
> [McCall-1978](/references/#mccall)

### Developer Perspective: Unit Testing

In day-to-day development, testability also depends on having quick, snappy unit tests. 
Fast unit tests shorten feedback loops, make refactoring safer, and let developers detect regressions within seconds instead of waiting for slower integration or end-to-end suites. 

A system may be testable in principle, but if its unit tests are slow or brittle, it still undermines developer productivity and confidence.
