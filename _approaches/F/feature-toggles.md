---
title: Feature Toggles
tags: [flexible, operable]
supported_qualities: [deployability, flexibility, testability, changeability]
tradeoffs: [maintainability, code-complexity, reliability]
intent: Decouple the deployment of code from the release of features by wrapping new behaviour behind a runtime-configurable flag.
mechanism: Wrap new or risky code paths in a conditional check against a toggle store (configuration file, database, or feature-flag service). The toggle can be switched on or off per environment, user cohort, or percentage rollout — without a code deployment.
applicability: Use when you need to merge incomplete features to the main branch without exposing them to users (trunk-based development), when you want to do canary releases or A/B tests, or when you need a fast kill switch for risky changes. Avoid retaining toggles permanently — treat them as technical debt with an explicit expiry.
permalink: /approaches/feature-toggles
---

## How It Works

Every toggle is a named boolean (or multi-variant) condition evaluated at runtime. The application checks the toggle store and takes the appropriate code path. Toggle state is managed outside the codebase — enabling or disabling a feature requires no redeployment.

<div class="mermaid">
sequenceDiagram
    participant App as Application
    participant TS as Toggle Store
    participant User

    User->>App: Request
    App->>TS: isEnabled("new-checkout-flow", user)
    alt Toggle ON
        TS-->>App: true
        App-->>User: New checkout flow
    else Toggle OFF
        TS-->>App: false
        App-->>User: Existing checkout flow
    end
</div>

### Toggle Lifecycle

1. **Create:** Wrap new code behind a toggle; default OFF in production.
2. **Validate:** Enable for internal users, then a small canary percentage.
3. **Roll out:** Increase rollout percentage; monitor error rates and business metrics.
4. **Clean up:** Once fully released and stable, remove the toggle and dead code path. Set a calendar reminder when the toggle is created.

### Toggle Categories

| Category | Lifespan | Who controls? | Example |
| :--- | :--- | :--- | :--- |
| Release toggle | Days to weeks | Engineering | Enable incomplete feature on main branch |
| Experiment toggle | Weeks | Product / data | A/B test a UI variant |
| Ops toggle | Hours to days | Operations | Kill switch for a misbehaving service |
| Permission toggle | Long-lived | Product | Beta access for paying customers |

## Failure Modes

- **Toggle debt:** Toggles that are never cleaned up multiply over time, creating a combinatorial explosion of code paths that is hard to test and reason about.
- **Stale toggles in tests:** Tests that hard-code toggle states become misleading — new code paths are never exercised, or old paths never removed from the suite.
- **Inconsistent evaluation:** Toggle state evaluated multiple times in a request (e.g. once in the UI, once in the API) may differ if the store changes mid-request, causing incoherent behaviour.
- **Configuration drift:** Toggle state in staging diverges from production; a feature passes QA but breaks in production because the toggle defaults differ.
- **Cascading toggles:** Toggle A depends on Toggle B; enabling A without B causes an unexpected failure that is hard to debug.

## Verification Ideas

- **Toggle inventory:** Keep a registry of all active toggles with their expected expiry dates; fail the build if any toggle is older than its maximum allowed lifespan (e.g. 90 days).
- **Test matrix:** For critical toggles, run the test suite with the toggle both ON and OFF in CI.
- **Rollout monitoring:** After each increment of a canary rollout, monitor error rate, p95 latency, and key business metrics for at least 30 minutes before proceeding.
- **Kill-switch drill:** Periodically verify that an ops toggle can be flipped to OFF within the SLA recovery window (e.g. ≤ 5 minutes) without a code deploy.

## Related Requirements

- [fast-deployment](/requirements/fast-deployment)
- [fast-rollout-of-changes](/requirements/fast-rollout-of-changes)

## Variants

- **Dark launching:** The new code path executes in production (often reading data or making calls) but its output is discarded — used to validate correctness and performance before exposing results to users.
- **Percentage rollout:** The toggle is ON for a configurable fraction of users (e.g. 5 %, then 25 %, then 100 %), allowing gradual exposure and early detection of issues at scale.
- **User-segment targeting:** Toggles can be scoped to specific user attributes (country, plan, cohort), enabling localised releases and targeted experiments.
