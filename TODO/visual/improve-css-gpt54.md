# CSS Migration GitHub Issue Breakdown

## Ordering

Create and execute the issues in this order:

1. `Improve visual testing`
2. `Add CSS linting to make test`
3. `Cleanup CSS`
   - then its CSS cleanup sub-issues one by one

This ordering keeps the site safe during migration:

- test coverage first
- automated guardrails second
- CSS cleanup only after both are in place

## Global Constraints

Apply these rules to every issue below:

- no CSS toolchain changes
- no major restyling
- no broad folder reorganization
- every PR must be shippable on its own
- the site must remain intact after every merged step
- `make test` must stay green for every merged cleanup step

---

## Issue: Improve visual testing

### Type

Standalone issue. Must be completed before any CSS cleanup sub-issue is merged.

### Description

Expand Playwright coverage so CSS-sensitive regressions are caught before cleanup work starts.

Focus on stable UI contracts, not broad screenshot baselines:

- visible headings and panels
- expected semantic colors on key elements
- visible and usable controls
- no obvious mobile overflow
- mobile toggles/graph controls still work

Keep the assertions targeted and robust. Prefer DOM and CSS checks over full-page screenshot testing.

### Scope

Add or extend Playwright tests for these routes:

- `/`
- `/qualities/accessibility`
- `/requirements/`
- `/standards/`
- `/standards/explorer/`
- `/aliases/`
- `/full-quality-graph`
- `/mobile`

Include at least one mobile viewport flow for navigation or graph controls.

### Out of scope

- site-wide visual snapshot baselines
- pixel-perfect screenshot approval workflow
- non-CSS feature expansion

### Acceptance criteria

- `npm run test:ui` passes
- `make test` passes once the CSS test issue is merged
- Playwright coverage exists for all routes listed above
- at least one mobile viewport test verifies a CSS-sensitive interaction on `/mobile` or `/full-quality-graph`
- tests assert stable contracts such as:
  - required headings/panels are visible
  - key tag/panel colors match expected semantic colors
  - graph controls are visible and usable
  - tested pages do not show horizontal overflow in the chosen mobile viewport
- no full-site screenshot baseline suite is introduced

### Notes for implementation

- keep tests page-family oriented
- add assertions only for stable UI contracts
- if screenshots are added later, keep them small and local to fragile areas

---

## Issue: Add CSS linting to make test

### Type

Standalone issue. Must be completed before any CSS cleanup sub-issue is merged.

### Description

Add lightweight automated CSS validation to the existing test flow without changing the CSS build toolchain.

The goal is not a heavyweight generic lint setup. The goal is a small, repo-specific safety gate that prevents new drift while cleanup proceeds.

### Scope

Add a CSS test entrypoint and wire it into `make test`.

Planned scripts:

- `npm run test:css`
- `npm run test:css:format`
- `npm run test:css:rules`

Recommended behavior:

- `test:css:format`
  - runs `prettier --check` on authored Sass/CSS files
- `test:css:rules`
  - runs a repo-local validation script, for example `src/scripts/validate-css.js`
  - checks a small allowlist-based ruleset

Recommended ruleset:

1. no new ID selectors in authored CSS/Sass except explicit allowlisted graph/runtime selectors
2. no new `!important` except explicit allowlisted cases
3. no new inline breakpoint values outside the approved set
4. no new hard-coded brand colors outside the approved token owner files
5. no authored stylesheet left unreferenced by `assets/css/style.scss`

### Out of scope

- switching to a new CSS pipeline
- generic enterprise lint rules
- large style refactors in the same PR

### Acceptance criteria

- `package.json` contains `test:css`, `test:css:format`, and `test:css:rules`
- `npm run test:css:format` checks authored files under `_sass/` and `assets/css/`
- `npm run test:css:rules` exists and exits non-zero on rule violations
- `make test` invokes `npm run test:css` before Playwright UI tests
- `make test` exits non-zero if `npm run test:css` fails
- `npm run test:css` exits `0` on the default branch after the issue is complete

### Notes for implementation

- keep the ruleset intentionally small
- use allowlists for current legacy exceptions instead of trying to eliminate all legacy patterns in this issue
- the validator should prevent *new* debt first

---

## Issue: Cleanup CSS

### Type

Main issue / umbrella issue.

Create the cleanup tasks below as GitHub sub-issues of this issue.

### Description

Perform low-risk CSS cleanup in small, independent slices after testing and CSS validation are in place.

This is not a redesign and not a structural rewrite. The purpose is to:

- reduce duplication
- improve consistency
- make CSS ownership easier to understand
- lower the chance of regressions in future small changes

Each cleanup sub-issue must:

1. start from a green `make test`
2. touch one CSS area only
3. add or update tests first if needed
4. keep markup changes minimal
5. end with a green `make test`

### Out of scope

- CSS toolchain changes
- full Sass architecture redesign
- broad selector renaming
- large visual refresh
- one-pass cleanup across the whole repo

### Acceptance criteria

- `Improve visual testing` is closed before the first cleanup sub-issue merges
- `Add CSS linting to make test` is closed before the first cleanup sub-issue merges
- all cleanup sub-issues below are closed or explicitly deprioritized
- every merged cleanup PR keeps `make test` green
- no cleanup PR introduces CSS toolchain changes, major restyling, or broad folder reshuffling

### Sub-issues

- [ ] `Cleanup CSS: stabilize shared tokens in place`
- [ ] `Cleanup CSS: consolidate repeated tag/chip/button styles`
- [ ] `Cleanup CSS: consolidate graph controls and mobile graph CSS`
- [ ] `Cleanup CSS: clean up content page header/callout hotspots`
- [ ] `Cleanup CSS: clean up standards page duplication`

---

## Sub-issue: Cleanup CSS: stabilize shared tokens in place

### Parent

`Cleanup CSS`

### Description

Reduce token duplication without changing the current overall structure.

Keep the current ownership model simple:

- `_sass/base/_variables.scss`
  - Sass-side layout and scalar values
- `assets/css/arc42-doc.css`
  - shared semantic color custom properties
- page-local custom properties
  - allowed only when truly page-specific

This issue should stop new token sprawl and clean up obvious duplication only in touched areas. It should not attempt a global token rewrite.

### Scope

- replace obvious duplicated brand colors in touched files with existing shared tokens
- document or preserve legitimate page-local custom properties
- keep changes local and low-risk

### Out of scope

- global token redesign
- large file moves
- mass replacement of every literal color in the repo

### Acceptance criteria

- no new hard-coded brand colors are introduced in touched files
- `npm run test:css:rules` passes
- `make test` passes
- covered routes keep their existing semantic color assertions green in Playwright
- changes stay limited to token owners and the active CSS slice being cleaned up

---

## Sub-issue: Cleanup CSS: consolidate repeated tag/chip/button styles

### Parent

`Cleanup CSS`

### Description

Reduce local duplication across repeated tag, chip, pill, and button-like styles without redesigning the visual language.

Focus on the highest-reuse patterns first and keep the result readable. This issue should not rename selectors broadly or rewrite unrelated page styles.

### Scope

- consolidate repeated declarations where tag/chip/button styles currently diverge only slightly
- keep semantic colors and current page behavior unchanged
- add or update tests first if the affected routes are not yet protected well enough

### Out of scope

- full component library extraction
- markup redesign
- broad naming cleanup

### Acceptance criteria

- `npm run test:css:rules` passes
- `make test` passes
- Playwright tests pass for:
  - `/qualities/accessibility`
  - `/requirements/`
  - `/dimensions/`
  - `/aliases/`
- affected tag/chip/button elements keep their expected semantic colors in tests
- no new ID selectors or new `!important` usages are introduced in touched files

---

## Sub-issue: Cleanup CSS: consolidate graph controls and mobile graph CSS

### Parent

`Cleanup CSS`

### Description

Clean up graph-control styling and mobile graph overrides while preserving current behavior.

This area is coupled to markup and JS, so the issue should stay narrow and prioritize test coverage over aggressive refactoring.

### Scope

- reduce duplication between desktop graph controls and mobile graph overrides where safe
- preserve current control visibility and interaction behavior
- keep existing graph-specific selector exceptions unless a safe reduction is obvious

### Out of scope

- graph feature changes
- graph markup rewrite
- graph control redesign

### Acceptance criteria

- `npm run test:css:rules` passes
- `make test` passes
- Playwright tests pass for:
  - `/full-quality-graph`
  - `/mobile`
- tests verify in at least one desktop and one mobile viewport that:
  - graph controls are visible
  - graph/sidebar controls are usable
  - no horizontal overflow occurs in the chosen mobile viewport
- no new styling IDs are introduced

---

## Sub-issue: Cleanup CSS: clean up content page header/callout hotspots

### Parent

`Cleanup CSS`

### Description

Tighten the content-page CSS hotspots that mix header presentation, taxonomy blocks, and callout-like styling.

This should improve readability and reduce local override pressure without splitting files broadly or restructuring the whole content CSS.

### Scope

- clean up the most repetitive or hard-to-follow content header/callout rules
- keep changes limited to the touched content area
- add or update tests first if the affected detail pages are not already protected

### Out of scope

- full `_content.scss` decomposition
- redesign of content page layouts
- search feature changes

### Acceptance criteria

- `npm run test:css:rules` passes
- `make test` passes
- Playwright tests pass for:
  - `/qualities/accessibility`
  - one representative requirement detail page such as `/requirements/appearance-requirements`
- tests verify on the touched routes that:
  - the main header panel is visible
  - taxonomy/header metadata remains visible
  - related section headings remain visible
- no new ID selectors or new `!important` usages are introduced in touched files

---

## Sub-issue: Cleanup CSS: clean up standards page duplication

### Parent

`Cleanup CSS`

### Description

Reduce unnecessary duplication in standards-related styling while keeping the current standards pages visually stable.

This issue should only be tackled after the earlier cleanup slices are complete, because the standards pages have more local styling and should benefit from the test and lint guardrails already in place.

### Scope

- clean up duplicated standards page rules where the behavior is already covered by tests
- preserve existing standards visual identity
- keep page-local custom properties only where they remain clearly useful

### Out of scope

- standards redesign
- new standards information architecture
- broad extraction of generic components in the same PR

### Acceptance criteria

- `npm run test:css:rules` passes
- `make test` passes
- Playwright tests pass for:
  - `/standards/`
  - `/standards/explorer/`
- no new inline breakpoint values are introduced in touched files
- no new hard-coded standards brand colors are introduced outside the approved token owner files

---

## Ready-to-create GitHub issue titles

- `Improve visual testing`
- `Add CSS linting to make test`
- `Cleanup CSS`
- `Cleanup CSS: stabilize shared tokens in place`
- `Cleanup CSS: consolidate repeated tag/chip/button styles`
- `Cleanup CSS: consolidate graph controls and mobile graph CSS`
- `Cleanup CSS: clean up content page header/callout hotspots`
- `Cleanup CSS: clean up standards page duplication`
