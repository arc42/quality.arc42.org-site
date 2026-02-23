# UI Testing Plan (Playwright)

## Objective
Introduce automated UI tests for q42 that catch regressions early, without creating brittle tests or high maintenance overhead.

## Guiding Principles
1. Prefer behavior checks over visual pixel checks.
2. Assert stable invariants, not exact counts or node coordinates.
3. Keep the PR suite fast (`<= 4 minutes` target).
4. Focus on critical user journeys first: navigate, search/filter, open details, redirect behavior.
5. Keep selectors stable (`id`, `role`, `aria-label`, and `data-testid` where needed).

## Scope
In scope:
- Dimensions page (`/dimensions/`)
- Quality characteristics page (`/qualities/`)
- Requirements page (`/requirements/`)
- Standards pages (`/standards/`, `/standards/explorer/`)
- Basic graph interactions (`/`, `/full-quality-graph`, `/mobile`)

Out of scope for v1:
- Full visual regression snapshots.
- Exact force-graph layout verification.
- Cross-browser matrix on every PR (run Chromium on PR, expand later).

## Recommended Tooling
- Framework: `@playwright/test`
- Primary browser for PRs: Chromium
- Optional nightly: Firefox + WebKit
- Failure diagnostics: Playwright trace + screenshot + video on retry

## Test Suite Design

### 1) Smoke Navigation Suite (always on PR)
Goal: detect broken routes/assets and basic interaction failures.

| Test | Route | Assertions (non-brittle) |
|:--|:--|:--|
| Home loads | `/` | Hero heading visible; graph container exists; no fatal console/page errors |
| Dimensions page loads | `/dimensions/` | At least one tag link exists (`.tag-box .tags`) |
| Characteristics page loads | `/qualities/` | Jump links exist; at least one quality entry link exists |
| Requirements page loads | `/requirements/` | Tag cloud exists; at least one requirement link exists |
| Standards overview loads | `/standards/` | Category cards exist; explorer switch link exists |
| Standards explorer loads | `/standards/explorer/` | Search input exists; cards list is non-empty |
| Full graph loads | `/full-quality-graph?view=full` | SVG in graph container exists; filter input and button exist |
| Mobile graph loads | `/mobile` | Mobile controls button exists; graph container exists |

### 2) Core Functional Suite (always on PR)
Goal: protect high-value interactions users depend on.

| Area | Test | Assertions (non-brittle) |
|:--|:--|:--|
| Dimensions | Tag navigation works | Click a core tag link (e.g., `reliable`) -> URL contains `/tag-` and page heading/text is visible |
| Characteristics | Open quality detail | Click first quality link -> detail page has title and related/tags area |
| Requirements | Open requirement detail | Click first requirement link -> page has `Context` and `Acceptance Criteria` headings |
| Standards explorer | Search filter | Enter `iso`; visible card count decreases or stays valid; clear/reset restores broader list |
| Standards explorer | Facet filter | Click one facet button -> visible cards all include selected category token in card metadata |
| Standards overview | Card to detail navigation | Open first category-card standard chip -> standard detail page title visible |

### 3) Graph Basic Suite (always on PR, non-brittle)
Goal: verify graph controls and filtering logic without layout fragility.

| Area | Test | Assertions (non-brittle) |
|:--|:--|:--|
| Home graph | Graph renders | `#q-graph-container svg` exists; at least one visible label contains `Quality` |
| Full graph | Manual filter works | Fill `secure`, click filter -> at least one filter chip appears in `#full-q-graph-filter__chips` |
| Full graph | Quick filter works | Click `.full-quick-filter[data-term=\"secure\"]` -> chip contains `secure` |
| Full graph | Toggle interaction works | Toggle standards checkbox off -> checkbox state changes and no JS error |
| Full graph | Center button works | Click center button -> no JS error and graph SVG still present |
| Mobile redirect | Dispatcher behavior | In iPhone viewport open `/full-quality-graph` -> redirected to `/mobile` |
| Mobile graph | Quick filter flow | Open controls, click quick filter -> chip appears; controls can close |

## Anti-Brittle Rules (mandatory)
1. Never assert exact node positions (`x/y`) or exact number of graph nodes.
2. Never assert exact total counts that depend on content growth (qualities/requirements/standards).
3. Use `toBeVisible`, `toHaveURL`, `toBeChecked`, `toHaveCount(>0)` patterns.
4. For dynamic lists, assert relative behavior (filtered list is subset, reset restores broader result).
5. Prefer semantic selectors:
   - `getByRole(...)`
   - stable IDs already present (`#full-q-graph-filter__input`, `#legend-toggle-standards`)
   - add `data-testid` only where current selectors are unstable.

## Selector Stabilization Plan
Current IDs/classes already cover much of the graph and standards explorer.  
Add small, explicit `data-testid` hooks only for:
- Home mode cards (`small-graph`, `full-graph`, `textual-navigation`)
- Standards category cards/chips if class names are likely to change
- Requirement list container on `/requirements/`

This keeps tests robust against styling refactors.

## Implementation Phases

### Phase 0: Setup (0.5 day)
- Add Playwright dependencies and config.
- Add scripts:
  - `test:ui`
  - `test:ui:headed`
  - `test:ui:debug`
- Configure retries (`1` in CI), trace-on-retry, screenshots on failure.

### Phase 1: Smoke Suite (1 day)
- Implement the 8 smoke tests from section "Smoke Navigation Suite".
- Ensure stable local run against local server.

### Phase 2: Content Navigation Suite (1 day)
- Implement dimensions/characteristics/requirements/standards functional tests.
- Add helpers for common assertions (page loaded, list non-empty, link opens detail page).

### Phase 3: Graph Basic Suite (1 to 1.5 days)
- Implement basic home/full/mobile graph tests from section "Graph Basic Suite".
- Add helper for "no severe page errors" (`pageerror` and severe `console` errors).

### Phase 4: CI Integration (0.5 day)
- PR workflow:
  - install deps
  - build site assets/data
  - start site
  - run Playwright Chromium suite
- Upload traces/screenshots as artifacts on failure.

Total initial investment: `~4 to 4.5 days`.

## Proposed Repository Layout

```text
tests/
  ui/
    smoke.spec.ts
    dimensions.spec.ts
    qualities.spec.ts
    requirements.spec.ts
    standards.spec.ts
    graph-basic.spec.ts
    mobile.spec.ts
    helpers/
      routes.ts
      assertions.ts
playwright.config.ts
```

## CI Strategy
- Required on PR:
  - `npm run test:links`
  - `npm run test:ui` (Chromium only)
- Optional nightly:
  - `npm run test:ui -- --project=firefox`
  - `npm run test:ui -- --project=webkit`

## Pass/Fail Criteria
Minimum bar to merge:
1. All smoke tests green.
2. At least one functional test green for each area:
   - dimensions
   - characteristics
   - requirements
   - standards
   - graph
3. No uncaught page errors in tested flows.

## Maintenance Budget and Discipline
- Keep test count lean: target `20-30` tests total in PR suite.
- Time budget: `<= 4 min` in CI.
- Every new interactive page feature should add either:
  - one smoke assertion, or
  - one focused functional test.
- If a test breaks due to intentional content evolution, update assertions to remain invariant-based.

## Risks and Mitigations

| Risk | Mitigation |
|:--|:--|
| Graph tests become flaky | Assert controls/chips/state, not layout geometry |
| Refactors break selectors | Introduce minimal `data-testid` anchors for key controls |
| CI duration grows too much | Keep PR suite small; move broad browser matrix to nightly |
| False positives from benign console logs | Fail only on `pageerror` and severe console errors |

## Suggested Next Step
Start with Phase 0 + Phase 1 in one PR, then add Phases 2-3 in a second PR.  
This reduces rollout risk and gives fast feedback on runner stability.
