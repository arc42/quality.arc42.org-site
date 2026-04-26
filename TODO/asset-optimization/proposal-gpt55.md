# Asset Optimization Proposal

Date: 2026-04-26
Scope: CSS, SCSS, and frontend JavaScript asset cleanup proposals only. No implementation has been made.

## Executive Summary

The strongest opportunities are not small selector tweaks. The asset tree has several parallel generations of frontend code:

- current Sass entry point: `assets/css/style.scss`
- current graph source and bundles: `src/graphs/**` -> `assets/js/homepage/main.js`, `assets/js/fullpage/main.js`
- legacy graph assets: `assets/q-graph/**`
- unused graph helper scripts: `assets/js/mobile-graph-page.js`, `assets/js/full-graph-page.js`
- page-local CSS in Markdown/HTML files
- authored CSS files imported into Sass as plain CSS

Recommended order: remove confirmed-dead assets first, then move inline styles into Sass, then consolidate repeated component patterns and tokens, then optimize graph bundle output.

## Findings And Proposals

### 1. Retire `_sass/_splash-home.scss`

`_sass/_splash-home.scss` is not imported by `assets/css/style.scss`, yet it contains a full older home-page styling system.

Evidence:

- CSS validation reports it as an unreferenced sheet.
- It also introduces ID selectors, one `!important`, hardcoded colors, and a non-approved breakpoint.
- The active home page uses `home-violet` classes from `_sass/_homenew.scss`, not `splash-home` classes.

Proposal:

- Confirm there is no planned return to the Minimal Mistakes splash layout.
- Delete `_sass/_splash-home.scss` rather than adding it to validation allowlists.
- Re-run `npm run test:css:rules` after deletion; most current CSS rule noise should disappear.

Priority: P1

### 2. Remove Or Archive Legacy `assets/q-graph/**`

`assets/q-graph/**` appears to be an older standalone graph implementation. Current graph pages use `src/graphs/**` bundled into `assets/js/homepage/main.js` and `assets/js/fullpage/main.js`.

Evidence:

- No page/layout references were found for `assets/q-graph/graph.js`, `legend.js`, `dataLoader.js`, or their CSS files.
- It duplicates graph concepts now implemented in `src/graphs/**`.
- It keeps stale global scripts, global CSS, and old D3 assumptions in the repo.

Proposal:

- If it is no longer needed, delete `assets/q-graph/**`.
- If it has historical value, move it to an explicitly non-shipped archive such as `docs/archive/q-graph-legacy/`.
- Do not leave it under `assets/`, because that implies it is a live shipped asset.

Priority: P2

### 3. Delete Unused Graph Page Helper Scripts

`assets/js/mobile-graph-page.js` and `assets/js/full-graph-page.js` duplicate behavior now handled by `src/graphs/GraphPageController.js`.

Evidence:

- I found no layout/page references to either script.
- `GraphPageController` is imported by `src/graphs/fullpage/main.js` and included in the generated full graph bundle.
- `mobile-graph-page.js` repeats quick-filter, reset, and mobile sheet behavior.

Proposal:

- Delete both files after a full graph smoke test.
- Keep all full graph page-controller behavior in `src/graphs/GraphPageController.js`.

Priority: P2

### 4. Split Shared Graph Bundle Code

The build currently emits two separate bundles:

- `assets/js/homepage/main.js`
- `assets/js/fullpage/main.js`

Each bundle is about 704K and includes shared graph/D3/runtime code.

Proposal:

- After dead asset cleanup, evaluate esbuild code splitting with ESM output.
- Expected shape: one shared graph/vendor chunk plus small homepage/fullpage entry chunks.
- This likely requires loading graph scripts with `type="module"` and updating `q-graph-config.html` / graph page script tags.
- Keep this after structural cleanup, because bundle-splitting changes delivery semantics and deserves a focused smoke test.

Priority: P2

### 5. Move Inline Component CSS Into Sass Partials

The qualities explorer has a large inline stylesheet in `_pages/20-quality-characteristics.md`. Search results also define inline page CSS in `_pages/search.html`.

Impact:

- Page-local CSS bypasses the main Sass module structure.
- The CSS validation script only scans `_sass` and `assets/css`, so these styles are largely outside guardrails.
- Color and component patterns are harder to reuse or compare.

Proposal:

- Extract qualities explorer styles into `_sass/_qualities-explorer.scss`.
- Extract search result styles into `_sass/_search.scss`.
- Import both from `assets/css/style.scss`.
- Keep only data/bootstrap script tags in the pages.

Priority: P2

### 6. Consolidate Repeated Tag-Chip Styles

`assets/css/arc42-quality.css` repeats most chip declarations across `a.hov.tags`, `a.hov.tags.req`, `a.hov.tags.approach`, `a.hov.tags.standard`, and `a.hov.tags.dimension`.

Proposal:

- Create one base chip style for spacing, layout, radius, display, and text behavior.
- Keep category variants limited to semantic color variables.
- Prefer class names that describe purpose, such as `.tag-chip`, `.tag-chip--requirement`, `.tag-chip--standard`, over continuing to grow `a.hov.tags.*`.

Priority: P3

### 7. Centralize Graph Control Styling

Graph control styles are split between `assets/css/q-graph.css` and `_sass/_mobile-graph.scss`. Quick-filter button declarations are duplicated almost exactly.

Proposal:

- Move authored graph CSS into Sass partials, for example:
  - `_sass/graph/_base.scss`
  - `_sass/graph/_controls.scss`
  - `_sass/graph/_mobile.scss`
- Use shared classes for quick filters and control buttons.
- Keep page-specific modifiers for full graph vs mobile sheet behavior.

Priority: P3

## Broader Modularity Recommendations

### Convert Authored CSS Imports To Sass Partials

`assets/css/style.scss` imports several plain CSS files:

- `arc42-doc.css`
- `arc42-quality.css`
- `ukraine.css`
- `q-graph.css`
- `toggle-switch.css`

Proposal:

- Keep vendor CSS such as `all.css` clearly separate.
- Convert authored CSS files into Sass partials under `_sass/`.
- This makes ownership clearer and allows shared variables, nesting, and validation to work consistently.

### Centralize Semantic Tokens

Semantic colors currently appear in multiple places:

- `_sass/base/_variables.scss`
- `assets/css/arc42-doc.css`
- `src/scripts/data.js`
- `_pages/60-full-quality-graph.md`
- graph CSS/JS tooltip and legend styling

Proposal:

- Define semantic tokens once for qualities, requirements, standards, dimensions, approaches, articles, tradeoffs, graph root, and graph property nodes.
- Use CSS custom properties for shipped styling.
- Use one JavaScript-side token source or generated JSON for graph data colors.
- Replace hardcoded legend colors in `_pages/60-full-quality-graph.md` with classes or data-driven rendering.

### Reduce Site-Wide jQuery Dependency Later

The current default layout loads jQuery and the sticky plugin site-wide for small scripts in `assets/js/script.js`, `search.js`, and `header-link.js`.

Proposal:

- Treat this as a later cleanup after dead asset removal.
- Convert these scripts to vanilla DOM APIs.
- Only keep `jquery.sticky.js` if `.site-aside .sticky` still exists on live pages.
- Once removed, delete the site-wide jQuery script tags from layouts.

## Suggested Implementation Order

1. Dead asset cleanup:
   - Remove `_sass/_splash-home.scss`.
   - Remove or archive `assets/q-graph/**`.
   - Remove `assets/js/mobile-graph-page.js` and `assets/js/full-graph-page.js`.

2. Validation baseline:
   - Run `npm run test:css:rules`.
   - Run `npm run test:css:format`.
   - Format only after deciding whether deleted files should disappear from the check.

3. Sass modularity:
   - Extract `_qualities-explorer.scss`.
   - Extract `_search.scss`.
   - Convert authored CSS imports to Sass partials.

4. Component consolidation:
   - Consolidate tag-chip styles.
   - Consolidate graph control styles.
   - Move repeated color literals to semantic tokens.

5. JavaScript asset optimization:
   - Evaluate graph bundle splitting.
   - Convert small jQuery scripts to vanilla JS.
   - Keep generated bundles under `assets/js/homepage` and `assets/js/fullpage` clearly documented as generated output.

## Verification Checklist

After implementation, verify:

- `npm run test:css`
- `npm run build`
- `docker compose up`
- home graph renders
- full graph renders
- full graph filtering, quick filters, reset, center view, and mobile bottom sheet work
- qualities explorer filters and A-Z navigation work
- search page still loads Lunr results
- no 404s for removed assets

## Current Validation Snapshot

Observed during the proposal review:

- `npm run test:css` fails because Prettier reports formatting issues in:
  - `_sass/_common.scss`
  - `_sass/_content.scss`
  - `_sass/_splash-home.scss`
  - `_sass/base/_fonts.scss`
- `npm run test:css:rules` reports 48 CSS rule violations, mostly caused by `_sass/_splash-home.scss`.

No code changes are proposed before the dead asset decisions are confirmed.
