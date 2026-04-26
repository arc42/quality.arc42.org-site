# Asset Optimization — Consolidated Proposal

**Sources:** `proposal-claude.md`, `proposal-gemini.md`, `proposal-gpt55.md`
**Date:** 2026-04-26
**Scope:** `_sass/`, `assets/css/`, `assets/js/`, embedded `<style>`/`<script>` in pages.

Each item is tagged with which reviews proposed it: **[C]** Claude, **[G]** Gemini, **[X]** GPT-5.5.

---

## Priority Legend

- **P0 — Consensus, do first.** All three reviews agree.
- **P1 — Strong consensus.** Two reviews agree.
- **CHECK-AGAIN** — Only one review raised it; verify before acting.

---

## P0 — Triple-consensus items (do first)

- [ ] **Delete `_sass/_splash-home.scss`** — orphan partial (~296 LOC, ~6 KB CSS), no markup uses `splash-home*` selectors. Also removes most `npm run test:css:rules` noise. **[C][G][X]**
- [ ] **Delete dead static JS `assets/js/full-graph-page.js` and `assets/js/mobile-graph-page.js`** — superseded by the bundled `src/graphs/GraphPageController.js`. Smoke-test full graph page after. **[C][G][X]**
- [ ] **Decommission legacy CSS (`arc42-doc.css`, `arc42-quality.css`)** — migrate rules into modular SCSS components, then drop the `@import` lines from `assets/css/style.scss`. Removes the "double system" and the `!important` chain used to win specificity. **[C][G][X]**
- [ ] **Single source of truth for design tokens** — move every `:root { --… }` block (currently in `arc42-doc.css`, `_variables.scss`, plus local `--qx-*`/`--app-*`/`--std-*` declarations) into `_sass/base/_variables.scss`, generated from Sass values. Replace hard-coded hex literals (notably in `_pages/60-full-quality-graph.md` legend swatches and `_mobile-graph.scss`) with `var(--…)`. **[C][G][X]**
- [ ] **Consolidate repeated tag-chip / `a.hov.tags.*` styles** — collapse the 8 near-identical color-only blocks into a single base + modifiers driven by CSS variables. Rename toward semantic classes (`.tag-chip--requirement` etc.). **[C][G][X]**
- [ ] **Modernize JS / drop jQuery** — rewrite `script.js`, `header-link.js`, `search.js` in vanilla DOM, move under `src/scripts/site/`, bundle via esbuild. Drop `<script src=".../jquery-3.7.1-min.js">` and the sticky plugin. Saves ~93 KB on every page load. **[C][G][X]**
- [ ] **Share graph-page code across bundles** — homepage and fullpage bundles each ship ~660–700 KB with overlapping graph/D3 code. Extract shared chunks (esbuild `splitting: true` with ESM output) or share via a controller module. **[C][G][X]**

---

## P1 — Two-review consensus

- [ ] **Merge `assets/css/q-graph.css` + `_sass/_mobile-graph.scss`** into a single `_sass/graph/` set (`_base.scss`, `_controls.scss`, `_mobile.scss`). Same selectors are styled in both files today. Tokenize the hard-coded blue palette. **[C][X]**
- [ ] **Move embedded `<style>` blocks into SCSS partials** — extract from `_pages/20-quality-characteristics.md` (~270 LOC) and `_pages/search.html` (~70 LOC) into `_sass/pages/_qualities-explorer.scss` and `_sass/pages/_search.scss`. **[C][X]**
- [ ] **Convert remaining authored CSS imports to Sass partials** — `ukraine.css`, `toggle-switch.css`, plus the migrated `arc42-*.css`. Keep only true vendor CSS (e.g. `all.css`) as plain CSS. Removes runtime `@import` waterfalls in the bundled stylesheet. **[C][X]**
- [ ] **Bundle `search.js` and `header-link.js` through esbuild** — fold them into `src/scripts/site/` so they get the same minify/sourcemap pipeline as the graph code. **[C][G]**
- [ ] **Componentize recurring patterns** — extract `_components/_panel-header.scss`, `_components/_section-heading.scss`, `_components/_section-hero.scss`, `_components/_stat-pill.scss`, `_components/_chip.scss`. Removes duplicated rules across `_content.scss`, `arc42-quality.css`, `_standards.scss`, and the page-embedded styles. **[C][G]**
- [ ] **Replace hard-coded legend colors in `_pages/60-full-quality-graph.md`** with class- or token-driven rendering (uses the unified token system above). **[C][X]**

---

## CHECK-AGAIN — Single-review items (verify before acting)

- [ ] **Subset FontAwesome `assets/css/all.css`** — only ~19 of 1493 icon definitions are used (~60 KB CSS + several font files saved). Option A: subset CSS; Option B: replace with inline SVG includes. *Source: [C] only.*
- [ ] **Delete `_sass/_aside.scss` and the `.site-aside .sticky` block in `script.js`** — confirm `.site-aside` is not emitted by any layout/include before deleting; also drop `assets/lib/garand-sticky/`. *Source: [C] only.*
- [ ] **Remove or archive `assets/q-graph/**`** — described as a legacy standalone graph implementation no longer referenced by any page/layout. Verify no page actually loads `assets/q-graph/graph.js`, `legend.js`, `dataLoader.js` before deleting; otherwise move to `docs/archive/q-graph-legacy/`. *Source: [X] only.*
- [ ] **Migrate the embedded `<style>` block in `_pages/70-solution-approaches.md`** (~510 LOC, `.approach-entry*`) into `_sass/pages/_solution-approaches.scss`. *Source: [C] only — but consistent with the P1 inline-style migration item.*
- [ ] **Migrate the small `<style>` block in `_includes/about/color-scheme.md`** into a partial. *Source: [C] only.*
- [ ] **Trim homepage JS import surface** — `homepage/main.js` ships full `nodes.json`/`edges.json` (~520 KB) that `HomeGraph` does not actually use; pass empty arrays to `GraphDataProvider` to save ~250 KB on the homepage. *Source: [C] only.*
- [ ] **Externalize `d3` + `graphology` via CDN `<script>`** as esbuild `external`s — would shrink each bundle to ~50 KB but changes delivery semantics. *Source: [C] only.*
- [ ] **Extract a shared `src/scripts/utils/facets.js`** for `qualities-explorer.js` and `standards-explorer.js` (~120 LOC overlap on facet-chip toggle, normalize, slugify, counters, reset). *Source: [C] only.*
- [ ] **Adopt a "Violet-First" structural hierarchy** — push residual blue/teal markers to a "Data-Only" role across the site. *Source: [G] only — design-direction call, needs sign-off.*
- [ ] **Remove `, #fallback` defaults from `var(--token, #fallback)` calls** once token consolidation lands — they only existed to defend against the missing `:root`. *Source: [C] only — easy follow-up to P0 token work.*
- [ ] **Audit `.subtle-ad` / `.supported-by-innoq`** before/after migrating `arc42-doc.css` — confirm whether to keep, restyle, or drop in favor of the new violet footer's sponsor zone. *Source: [C] only.*
- [ ] **Audit `.innoq-text` and other legacy bits** before deleting legacy CSS files. *Source: [G] only.*
- [ ] **Decide final location for `arc42-exclamation.svg`** (currently under `assets/css/`) once `arc42-doc.css` is gone. *Source: [C] only.*

---

## Suggested sequencing

1. **Dead-code sweep (P0 deletions).** Splash-home, `full-graph-page.js`, `mobile-graph-page.js`. Also resolve the CHECK-AGAIN deletions (`_aside.scss`, `assets/q-graph/**`) in the same PR if confirmed orphan. Re-run `npm run test:css:rules` and `npm run test:css:format` after.
2. **Token consolidation (P0).** Single `:root` block in `_variables.scss`, derive all per-section accents from brand tokens, replace literals.
3. **Componentization & inline-style migration (P0/P1).** Tag chips, panel/section headers, hero cards; move embedded `<style>` blocks into `_sass/pages/`; merge graph CSS into `_sass/graph/`; convert remaining authored CSS to Sass partials.
4. **Decommission legacy CSS (P0).** Once components/tokens are in place, drop `arc42-doc.css` and `arc42-quality.css` from `style.scss`.
5. **JS modernization (P0).** Vanilla rewrite of site scripts, drop jQuery + sticky plugin, bundle through esbuild.
6. **Bundle optimization (P0/CHECK-AGAIN).** esbuild code splitting; trim homepage data import; optionally externalize d3; FontAwesome subset.

---

## Verification checklist (per PR)

- `npm run test:css` (Prettier + rules)
- `npm run test:links`
- `npm run build` and `docker compose up`
- Smoke-test: homepage graph, full quality graph (filters / quick filters / reset / center / mobile sheet), qualities explorer (filters + A–Z), search page (Lunr + Esc), tag pages, a quality page, a requirement page, a standard page.
- No 404s for removed assets.
