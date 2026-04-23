---
title: "Interoperable with Java 12"
tags: [operable]
related: [compatibility, interoperability, backward-compatibility]
stakeholder: management, product-owner, user
permalink: /requirements/interoperable-with-java-12
---

#### Context

The system has been implemented on the Java(tm) virtual machine.

#### Requirement

The application must run on supported Java runtime baselines (12, 17, 21) from a single build artifact.

#### Acceptance Criteria

- 100% of smoke tests pass on reference runtimes for Java 12, 17, and 21 (CI compatibility matrix, every release).
- Zero source-code forks or runtime-specific packaging branches required (build-config review, every release).
- If any baseline fails, that runtime is removed from the supported-platform list and its distribution is blocked within 1 business day (release gate log).
