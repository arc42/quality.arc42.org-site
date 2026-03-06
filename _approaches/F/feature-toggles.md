---
layout: approach
title: Feature Toggles
tags: [flexible, operable]
supported_qualities: [deployability, flexibility, testability, changeability, modifiability]
supported_qualities_notes:
  deployability: Allows code deployment independently from feature release timing.
  flexibility: Enables runtime control by cohort, environment, or rollout percentage.
  testability: Supports safe experiments and canary rollout validation in production.
  changeability: Decouples implementation changes from immediate user exposure.
  modifiability: Localizes behavior changes to specific conditional paths without affecting core logic.
tradeoffs: [maintainability, code-complexity, reliability, observability]
tradeoff_notes:
  maintainability: Long-lived toggles create technical debt and dead paths.
  code-complexity: Branching logic multiplies execution paths and test effort.
  reliability: Inconsistent flag evaluation can produce incoherent behavior.
  observability: Monitoring which users see which toggle state adds operational logging overhead.
related_requirements: [fast-deployment, fast-rollout-of-changes]
related_requirements_notes:
  fast-deployment: Supports shipping code quickly while keeping risky behavior disabled.
  fast-rollout-of-changes: Enables gradual rollout and rapid rollback without redeploy.
intent: "Decouple code deployment from feature release by wrapping new behavior behind a runtime-configurable flag."
mechanism: "Wrap new or risky code paths in a conditional check against a toggle store (configuration file, database, or feature-flag service), allowing the switch to be flipped per environment, user cohort, or percentage rollout without a redeployment."
applicability: "Use when merging incomplete features to the main branch (trunk-based development), conducting canary releases or A/B tests, or providing a fast kill switch for risky changes. Avoid retaining toggles permanently; treat them as technical debt with an explicit expiry date."
permalink: /approaches/feature-toggles
---

Feature toggles (also known as feature flags) allow teams to modify system behavior at runtime without changing or redeploying code. By wrapping new logic in a conditional check, developers can ship "dark" code to production and enable it only when ready.

## How It Works

Every toggle is a named boolean (or multi-variant) condition evaluated at runtime. The application checks the toggle store and takes the appropriate code path. Toggle state is managed outside the codebase — enabling or disabling a feature requires no redeployment.

- **Toggle Check**: A request arrives. The application checks the toggle store for the named flag, passing the current user context if targeting rules (e.g., country, user ID) apply.
- **Branching**: If the flag is **ON**, the new code path executes. If **OFF**, the existing path runs. The caller sees no difference in the interface.
- **Runtime Control**: An operator can flip the flag in the toggle store at any time to enable a feature, start an experiment, or kill a misbehaving service.

### Toggle Lifecycle

1. **Create:** Wrap new code behind a toggle; default OFF in production.
2. **Validate:** Enable for internal users, then a small canary percentage.
3. **Roll out:** Increase rollout percentage; monitor error rates and business metrics.
4. **Clean up:** Once fully released and stable, remove the toggle and dead code path to avoid technical debt. Set a calendar reminder or use a "stale flag" alert when the toggle is created.

### Toggle Categories

| Category | Lifespan | Who controls? | Example |
| :--- | :--- | :--- | :--- |
| Release toggle | Days to weeks | Engineering | Enable incomplete feature on main branch |
| Experiment toggle | Weeks | Product / Data | A/B test a UI variant |
| Ops toggle | Hours to days | Operations | Kill switch for a misbehaving service |
| Permission toggle | Long-lived | Product | Beta access for paying customers |

## Failure Modes

- **Toggle debt:** Toggles that are never cleaned up multiply over time, creating a combinatorial explosion of code paths that is impossible to test or reason about.
- **Stale toggles in tests:** Tests that hard-code toggle states can become misleading, where new code paths are never exercised or old paths are never removed from the suite.
- **Evaluation Latency**: Frequent checks against a remote toggle store (e.g., an external SaaS) can significantly increase request latency if not cached locally with a short TTL.
- **Inconsistent evaluation:** Toggle state evaluated multiple times in a single request (e.g. once in the UI, once in the API) may differ if the store changes mid-request, causing incoherent behavior.
- **Configuration drift:** Toggle state in staging diverges from production; a feature passes QA but breaks in production because the default flag values differ.
- **Toggle Collision**: Two independent toggles affecting the same code area create unexpected side effects when enabled together (e.g., Toggle A changes the UI layout, Toggle B changes the data format).

## Verification

- **Automated Inventory**: Keep a registry of all active toggles with their expected expiry dates; fail the build or send an alert if any toggle is older than its maximum allowed lifespan (e.g., 90 days).
- **Dual-Path Testing**: For critical toggles, run the automated test suite with the toggle both ON and OFF in CI to ensure no regressions in either path.
- **Canary Monitoring**: After each increment of a percentage rollout, monitor error rates, p95 latency, and key business metrics (e.g., conversion) for a defined period (e.g., 30 minutes) before proceeding.
- **Kill-switch Drill**: Periodically verify that an ops toggle can be flipped to OFF and the change propagates across the system within the SLA recovery window (e.g., ≤ 5 minutes) without a code deployment.

## Variants and Related Tactics

- **Dark launching**: The new code path executes in production (often reading data or making calls) but its output is discarded—used to validate performance and correctness before exposure.
- **Percentage rollout**: The toggle is ON for a configurable fraction of users (e.g. 5 %, then 25 %, then 100 %), allowing gradual exposure and early detection of issues at scale.
- **User-segment targeting**: Toggles scoped to specific user attributes (country, plan, cohort), enabling localized releases and targeted experiments.
- **Branch by Abstraction**: A technique for making large-scale changes by introducing an abstraction layer that can toggle between old and new implementations.

## References
- [Feature Toggles](https://martinfowler.com/articles/feature-toggles.html) — Pete Hodgson ([full citation](/references/#hodgson2017feature))
- [Trunk Based Development](https://trunkbaseddevelopment.com/feature-flags/)
