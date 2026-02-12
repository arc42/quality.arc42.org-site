---
title: Debuggability
tags: [operable, maintainable]
related: [analysability, maintainability, operability, observability, testability, transparency]
permalink: /qualities/debuggability
---

> Ability of a system to make defects and undesired behaviors easy to diagnose and localize in development, test, and production environments.

Debuggability focuses on shortening time-to-diagnosis and reducing the effort to pinpoint root causes. 
It is closely related to but distinct from:
- [Observability](/qualities/observability): raw signals (logs, metrics, traces) vs. using those signals effectively to debug
- [Testability](/qualities/testability): how easily a system can be tested vs. how easily failures can be diagnosed
- [Analysability](/qualities/analysability): impact/change assessment; debuggability emphasizes incident and defect diagnosis

### Typical enablers:
- High-quality logs with context, identifiers, and correlation
- Tracing across service boundaries; consistent request IDs
- Actionable error messages and failure signatures
- Reproducibility aids: feature flags, deterministic modes, seedable randomness
- Safe debug access in production-like environments (guarded, auditable)
- Diagnostics: memory/thread dumps, heap profiles, event timelines

### Outcomes
- Faster incident resolution and MTTR
- Lower debugging effort during development and operations
- Better knowledge capture through clear diagnostics