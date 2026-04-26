# Asset Optimization Proposal — CSS / SCSS / JS

**Author:** Claude (Opus 4.7)
**Date:** 2026-04-26
**Scope:** `_sass/`, `assets/css/`, `assets/js/`, embedded `<style>` blocks in `_pages/`, `<script>` references in `_layouts` / `_includes` / `_pages`.
**Status:** Proposal only — no code changes.

---

## 0. Executive Summary

The codebase has accumulated **three parallel styling systems** (modern SCSS, legacy CSS, page-embedded `<style>` blocks) and **two parallel JS systems** (jQuery-era globals, modern ES-module bundle). Each was added without retiring the previous one, so the same selectors, variables, and behavior live in 2–3 places at once. The fixes are mostly *deletion* and *consolidation*, not new code.

Highest-impact wins:

| # | Win | Effort | Payload saved |
|---|-----|--------|---------------|
| 1 | Delete `_splash-home.scss` (orphan, 296 lines) | trivial | ~6 KB CSS |
| 2 | Delete dead static JS (`full-graph-page.js`, `mobile-graph-page.js`) — already superseded by bundled `GraphPageController` | trivial | ~7 KB JS |
| 3 | Subset FontAwesome (1493 icon defs → 19 used) | small | ~60 KB CSS + several font files |
| 4 | Move 3 page-embedded `<style>` blocks into `_sass/components/` partials (~900 lines of inline CSS) | medium | maintainability |
| 5 | Single source of truth for `--quality-*` / `--req-*` / `--standard-*` / `--approach-*` / `--dimension-*` tokens (currently in `arc42-doc.css`, can move into `_variables.scss`) | small | one-place edits |
| 6 | Merge `assets/css/q-graph.css` into `_sass/_graph.scss` and deduplicate `_mobile-graph.scss` | medium | ~3 KB + clarity |
| 7 | Migrate `script.js` + `header-link.js` + `search.js` off jQuery, drop jQuery + jquery.sticky | medium | ~93 KB JS |

---

## 1. Inventory of What's There

### 1.1 SCSS partials in `_sass/`

| File | LOC | Status | Notes |
|------|-----|--------|-------|
| `base/_reset.scss` | 428 | keep | Normalize.css 3.0.2, fine. |
| `base/_syntax.scss` | ~120 | keep | Rouge highlight tokens. |
| `base/_variables.scss` | 134 | **consolidate** | Sass + `:root` block. Should become *the* single token home. |
| `base/_fonts.scss` | 50 | keep | `@font-face` declarations. |
| `base/_layout.scss` | 55 | **trim** | Still defines `.site-aside` (no longer rendered) and `.site-header .inner` (legacy). |
| `base/_utilities.scss` | 65 | keep | Add `.sr-only` here (currently lives in `q-graph.css`). |
| `_common.scss` | 147 | keep | Body/links/tags. `.tag-box` overlaps with legacy `a.hov.tags` (see §2.3). |
| `_header.scss` | 319 | keep | Modern violet header. |
| `_footer.scss` | 129 | keep | |
| `_aside.scss` | 71 | **delete** | `.site-aside` is no longer in any layout/include. The block guarded by `.js &` was for a hidden-by-default mobile aside; nothing emits it. |
| `_content.scss` | 405 | **trim** | `.panel.*-header` rules duplicate `arc42-quality.css` (§2.2). |
| `_homenew.scss` | 256 | keep | Active homepage hero/directory/graph. |
| `_standards.scss` | 597 | **split** | Mixes the per-standard page header, the standards landing hero, the explorer card grid, and a tiny legacy rule (`.std-shortname`) — should be 2–3 partials. |
| `_splash-home.scss` | 296 | **delete** | `.splash-home`, `.splash-home__*`, `.page__hero--overlay`, `.feature__wrapper` selectors — no markup uses them; minimal-mistakes splash layout was never adopted. |
| `_mobile-graph.scss` | 287 | **rename + dedupe** | Hard-codes the same blue palette as `q-graph.css` and re-styles the same `#full-q-graph-*` IDs. |
| `_aliases.scss` | 203 | keep | Aliases page; well-tokenised. |

### 1.2 Plain CSS in `assets/css/`

| File | Size | Status | Notes |
|------|------|--------|-------|
| `style.scss` | 0.5 KB | **rewrite** | The Sass entry-point `@import`s 6 plain CSS files at the bottom. Plain CSS imports inside Sass become runtime `@import` URLs in the final bundle, which serialize requests in the browser. Either inline them as Sass partials or remove the legacy ones. |
| `arc42-doc.css` | 4 KB | **migrate** | Defines `:root` `--quality-*` / `--reqs-*` / `--standard-*` / `--dimension-*` / `--approaches-*` / `--tradeoff-*` / `--synonym-*` / `--muted-text-*` tokens; styles `.arc42-help`, `.quality-requirement`, `.subtle-ad`, `.supported-by-innoq`. Tokens belong in `_variables.scss`; component rules belong in component partials. |
| `arc42-quality.css` | 8 KB | **migrate** | Eight `a.hov.tags.*` blocks (only color differs); six `.panel.*-header` blocks with `!important` to override `_content.scss`; `h2.section-heading.*` family; `.approach-impacts-grid` ; `.callout-error` / `.sanity-check` / `.error-box`. Should be tokenised and moved to a `_chips.scss` + `_section-headers.scss` + `_callouts.scss` partials. |
| `q-graph.css` | 4.8 KB | **migrate** | Same selectors as `_mobile-graph.scss` (see §2.4). Should be a single `_graph.scss` partial. |
| `ukraine.css` | 0.5 KB | **migrate** | Used only by `_pages/90-about-this-site.md` (`.ua-text`, `.ua-background`, `.heart`). Move into `_about.scss` or absorb into `_content.scss`. |
| `toggle-switch.css` | 1.5 KB | **migrate** | Needed for graph legend toggles. Move into `_graph.scss`. |
| `all.css` | 72 KB | **subset** | FontAwesome 5.15.4 free, 1 493 icon definitions; only 19 distinct icon classes are used in the site. |
| `arc42-quality.css → :root` (none — but tokens in `arc42-doc.css`) | — | — | See §2.1. |
| `arc42-exclamation.svg` | 2.3 KB | keep | Used by `arc42-help`/`quality-requirement` `::before`. |

### 1.3 JavaScript in `assets/js/`

| File | Size | Loaded by | Status |
|------|------|-----------|--------|
| `script.js` | 2.4 KB | every page (default layout) | **modernize** — jQuery-only; logic split: nav-toggle, `/`-key search focus, external-link target=_blank, image centering wrap, `.site-aside .sticky` (dead). |
| `header-link.js` | 0.7 KB | every page with `id` (default layout) | **rewrite vanilla** — trivial DOM walk. |
| `search.js` | 4.5 KB | `/search/` only | **rewrite vanilla** — uses jQuery for ergonomics; lunr itself is vanilla. |
| `lunr.min.js` | 32 KB | `/search/` | keep (vendor, used). |
| `wcag-score.js` | 1.1 KB | every page (footer) | keep (already vanilla). |
| `qualities-explorer.js` | 10.7 KB | `/quality-characteristics` | **bundle** — already vanilla; should go through esbuild for minify + code split. |
| `standards-explorer.js` | 7.2 KB | `/standards-explorer` | **bundle** — same. |
| `full-graph-page.js` | 1.7 KB | **nobody** | **delete** — superseded by `src/graphs/GraphPageController.js`, included by the bundle in `_pages/60-full-quality-graph.md`. |
| `mobile-graph-page.js` | 3.9 KB | **nobody** | **delete** — same superset. |
| `mermaid.js` | 6.9 MB | only `/q42-for-iso-25010-users` (gated by `page.mermaid`) | keep, but consider Mermaid's CDN ESM build (~600 KB) loaded only on that page. |
| `homepage/main.js` | 660 KB | homepage | bundle ok, but ships its own d3 copy (see §3.4). |
| `fullpage/main.js` | 692 KB | `/full-quality-graph` | same — both bundles share d3 + graphology + JSON data. |
| `jquery/jquery-3.7.1-min.js` | 87 KB | every page | **drop** once `script.js`/`search.js`/`header-link.js` go vanilla. |
| `lib/garand-sticky/jquery.sticky.js` | 5.7 KB | every page | **drop** — only consumer is the dead `.site-aside .sticky` block in `script.js`. |

### 1.4 Embedded `<style>` blocks

| File | Lines of CSS | Selectors |
|------|--------------|-----------|
| `_pages/20-quality-characteristics.md` | ~270 | `.qualities-explorer*`, `.qualities-facet-chip`, `.qualities-letter-*`, `.qualities-item*`, `.qualities-alias-*`, `.qualities-empty`, `.qualities-return-top` |
| `_pages/70-solution-approaches.md` | ~510 | `.approach-entry*`, `.approach-entry-mode-*`, etc. |
| `_pages/search.html` | ~70 | `.search-results-list`, `.search-result-*`, `.cat-quality / -requirement / -standard / -approach` |
| `_includes/about/color-scheme.md` | small | `.color-grid-item:hover` |

These ship inline in HTML on those routes. Page-specific is fine in principle, but at this volume they should live in SCSS so they participate in the same token system, get minified by Sass, and don't drift from the violet palette.

---

## 2. Specific Redundancies & Duplications

### 2.1 Three sources of truth for design tokens

- `_sass/base/_variables.scss` — Sass + `:root { --brand-* }`.
- `assets/css/arc42-doc.css` — `:root { --quality-background-color, --reqs-*, --standard-*, --dimension-*, --approaches-*, --tradeoff-*, --synonym-*, --muted-text-* }`.
- Hard-coded hex literals throughout `_mobile-graph.scss`, `q-graph.css`, the three `_pages/*` `<style>` blocks, and `_standards.scss` (e.g. the standards-page `--std-*` palette is defined locally instead of from `--standard-background-color`).

**Concrete duplications:**

- `--reqs-background-color: #ffb3b3` (arc42-doc.css:6) ↔ hard-coded `background-color: #ffb3b3` in `_pages/60-full-quality-graph.md:82`.
- `--standard-background-color: #ffc95c` (arc42-doc.css:8) ↔ `#FFC95C` literal in `_pages/60-full-quality-graph.md:66` and `#fff3cd` literal default in `_standards.scss:5`.
- `--brand-blue: #00b8f5` (variables.scss) ↔ `--quality-background-color: var(--brand-blue, #00b8f5)` (arc42-doc.css) ↔ `#00B8F5` literal in `_homenew.scss:71`, `_pages/60-full-quality-graph.md:74`.
- `--brand-violet-deep: #52214f` (variables.scss) ↔ `var(--brand-violet-deep, #52214f)` fallback in `arc42-doc.css:25, 40` (defensive duplication that defeats the variable).

**Proposal:** All token declarations move into `_sass/base/_variables.scss`, generated from Sass values via `:root { … }`. `arc42-doc.css`'s `:root` block becomes Sass:

```scss
// _variables.scss
$quality-bg: $brand-blue;
$reqs-bg:    #ffb3b3;
$standard-bg:#ffc95c;
…
:root {
  --quality-bg:  #{$quality-bg};
  --reqs-bg:     #{$reqs-bg};
  --standard-bg: #{$standard-bg};
  …
}
```

Then `_pages/60-full-quality-graph.md` legend swatches read `style="background:var(--quality-bg)"` instead of `#00B8F5` etc.

### 2.2 Panel-header rules defined twice

- `_sass/_content.scss:191–324` — `.site-content article header .panel.{quality,requirements,standard,dimension,approaches}-header` (high specificity; deeply nested).
- `assets/css/arc42-quality.css:281–355` — `.panel.{quality,requirements,standards,dimension,approaches,article}-header`, all marked `!important` to win specificity against the SCSS version.

The two systems also disagree:
- `_content.scss` makes `.panel.quality-header h1` violet (`$brand-violet-deep`).
- `arc42-quality.css` makes `.panel.quality-header h1` blue (`var(--quality-text-color)` = `#003366`).

The CSS load order (`@import 'arc42-quality.css'` is last in `style.scss`) means the !important blue wins — so the SCSS rule is dead code.

**Proposal:** Pick one. Given the brand is "violet-first", keep `_content.scss`'s violet header for `.quality-header`, drop `arc42-quality.css`'s `.panel.*-header` block entirely. Remove `!important` everywhere; the un-nested rules can simply live at root scope.

### 2.3 Tag styling defined twice

`.tag-box a` (in `_sass/_common.scss:120–142`) and `a.hov.tags{,.req,.approach,.standard,.dimension}` (in `arc42-quality.css:25–93`) both render coloured tag pills with rounded corners and hover states; only the markup (`<ul.tag-box><li><a>` vs `<a class="hov tags ...">`) differs.

`a.hov.tags.*` has eight near-identical 11-line blocks differing only in two color variables. A single rule with a CSS variable fallback collapses it:

```scss
.tag-pill {
  display: inline-block;
  padding: 5px 10px;
  margin: 3px 2px;
  border-radius: 11px;
  text-align: center;
  background-color: var(--pill-bg, var(--brand-violet-faint));
  color:            var(--pill-fg, var(--brand-violet-deep));
  &:hover { transform: scale(1.05); text-decoration: none; }

  &.req       { --pill-bg: var(--reqs-bg);       --pill-fg: var(--req-text-color); }
  &.approach  { --pill-bg: var(--approaches-bg); --pill-fg: var(--approaches-text-color); }
  &.standard  { --pill-bg: var(--standard-bg);   --pill-fg: var(--standard-text-color); }
  &.dimension { --pill-bg: var(--dimension-bg);  --pill-fg: var(--dimension-text-color); }
}
```

Backed by an alias rule (`a.hov.tags { @extend .tag-pill }`) until the markup migrates.

### 2.4 Graph styling: `q-graph.css` vs `_mobile-graph.scss`

Both files define rules for the same DOM: `#q-graph-container`, `#full-q-graph-container`, `#full-q-graph-sidebar`, `#full-q-graph-controls-container`, `#full-q-graph-filter__input`, `#full-q-graph-filter__btn`, `#full-q-graph-home__btn`, `#full-q-graph-center__btn`, `#full-q-graph-legend`, `#full-graph-toggle`, `.legend-item`, `.legend-label`, `.color-box`, `.q-chip*`, `.full-quick-filter*`.

`_mobile-graph.scss` then *re-styles* most of those inside `@media (max-width: 900px)`. Both files use the same hard-coded blue palette (`#1f5f82`, `#9ecbe3`, `#eef8ff`, `#73b1d4`, `#cb9fff`, `#414288`, `#003366`) — none of which are tokens.

**Proposal:** Single `_sass/_graph.scss` with sections:
1. base styles (formerly `q-graph.css`),
2. `.graph-compact-header` modifier,
3. `.mobile-graph-page` overrides,
4. `@media (max-width: 900px)` block.

All hard-coded blues replaced by tokenised values (`--brand-blue`, `--brand-blue-dark`, `--brand-blue-soft`). The `--brand-blue-*` set already exists in `_variables.scss`.

### 2.5 `<style>` in `_pages/20-quality-characteristics.md` reinvents palette

Defines `--qx-border`, `--qx-surface`, `--qx-text`, `--qx-muted`, `--qx-accent` (= `#1675b9`), `--qx-accent-2` (= `#00b8f5`), `--qx-chip`, `--qx-heading-bg` — none derived from `_variables.scss`. This means changing the brand blue requires editing two places.

`_pages/70-solution-approaches.md` does the same with `--app-border`, `--app-surface`, `--app-text-soft`. `_pages/search.html` does it with `.cat-quality{ background:#e0f7ff; color:#0089ba }` etc.

`_standards.scss` does it with the `--std-*` family at line 38.

**Proposal:** Per-section accent palettes are fine, but they must be derived from the canonical tokens. E.g. inside `_qualities-explorer.scss`:

```scss
.qualities-explorer {
  --qx-accent:  var(--brand-blue-dark, #0077ad);
  --qx-accent-2:var(--brand-blue,      #00b8f5);
  --qx-chip:    var(--brand-blue-soft, #f2faff);
  …
}
```

### 2.6 `#standard-header` defined three times

- `_sass/_standards.scss:4` — `#standard-header { background-color: var(--standard-background-color, #fff3cd) !important }`
- `assets/css/arc42-quality.css:109–115` — `#standard-header { background-color: var(--standard-background-color); }` and `#standard-header h1 { color: var(--standard-text-color); }`
- `assets/css/arc42-quality.css:320–331` — `.panel.standards-header { background-color: var(--standard-background-color) !important; }` and the `h1` color rule

The `_includes/standards-header.liquid` template emits `<div class="panel standard-header" id="standard-header">` so all three rules apply to the same element. After consolidation only one is needed.

### 2.7 `<noscript><style>` partial overlap

`_pages/20-quality-characteristics.md:59` declares the `qualities-fallback-panel` toggling rule inside `<noscript>` — the rest of the page's style block restates `.qualities-fallback-panel`/`.qualities-fallback-list`. Fine to keep, but document the pattern in the partial header so it doesn't look like dead code.

### 2.8 Dead style: `_splash-home.scss`

The `splash-home`, `page__hero--overlay`, `splash .feature__wrapper`, `splash-home__dimensions-table`, `splash-home__dimension-tag` selectors don't appear in any template:

```
$ rg -l "splash-home|page__hero--overlay|feature__wrapper" _layouts _includes _pages
(no results)
```

The file is a remnant from an evaluated-and-rejected minimal-mistakes splash layout. Deleting it removes 296 lines and ~6 KB from the bundled CSS.

### 2.9 Dead style: `_aside.scss`

Same check:

```
$ rg -l "site-aside" _layouts _includes
(no results)
```

The element is referenced only by `script.js`'s sticky-aside block. With the JS modernization (§3) this whole partial goes away.

### 2.10 Dead JS: `full-graph-page.js`, `mobile-graph-page.js`

`_pages/60-full-quality-graph.md:95` only loads `assets/js/fullpage/main.js`, which already imports `GraphPageController` (`src/graphs/fullpage/main.js:6`). The two static files at `assets/js/full-graph-page.js` and `assets/js/mobile-graph-page.js` reproduce the bundled controller's logic but are never `<script>`-loaded. Pure dead code.

---

## 3. Modularity Issues

### 3.1 Components and pages are not separated

Currently `_sass/` mixes:
- Base (reset, fonts, syntax) — clear.
- Layout (`base/_layout.scss`, partly).
- Site chrome (`_header`, `_footer`, `_aside`).
- Generic content (`_common`, `_content`).
- **Page-scoped:** `_homenew`, `_aliases`, `_standards` (which is *both* per-standard page and the explorer).
- **Variant:** `_mobile-graph` (only meaningful on `/full-quality-graph`).
- Half-orphan: `_splash-home`.

Recommended layout (no re-platforming, just rearrangement):

```
_sass/
  base/        # resets, vars, fonts, syntax, utilities (existing)
  layout/      # _site-chrome.scss (header+footer), _container.scss (the 6 layout rules from base/_layout.scss)
  components/  # _tag-pill.scss, _panel-header.scss, _section-heading.scss,
               # _callout.scss, _arc42-help.scss, _quality-requirement.scss,
               # _toggle-switch.scss
  pages/       # _home.scss (was _homenew.scss), _aliases.scss,
               # _qualities-explorer.scss (extracted from <style>),
               # _standards-overview.scss, _standards-explorer.scss,
               # _solution-approaches.scss (extracted from <style>),
               # _search-results.scss (extracted from <style>),
               # _about.scss (absorbs ukraine.css + about/color-scheme.md)
  graph/       # _graph.scss (was q-graph.css + _mobile-graph.scss merged),
               # _toggle-switch.scss
```

The `style.scss` entry-point becomes a single ordered list of `@use` (or `@import`) — no plain `.css` imports.

### 3.2 Components are not extracted

Several patterns appear ≥3 times across files; each begs for a single component partial:

- **Hero card with violet/teal/standards/approach gradient overlay** appears as `.aliases-hero` (with `::after` rotation), `.standards-hero` (same `::after`), `.approach-entry-hero`, `.qualities-explorer-hero`. Same shape, different palette. Candidate: `_components/_section-hero.scss` with `--hero-accent` token.
- **Stat pill** (`.aliases-stat`, `.standards-hero-stat`, `.splash-home__stat`, the per-collection counters in the home directory). Candidate: `_components/_stat-pill.scss`.
- **Chip / facet button** (`.standards-chip`, `.standards-facet-btn`, `.qualities-facet-chip`, `.full-quick-filter`, `.mobile-quick-filter`, `.q-chip`). Candidate: `_components/_chip.scss` with active-state modifier.
- **Header-link anchor icon** (`#about-author + p img` float, `.header-link` opacity-on-hover) — fine as-is; just keep them together.

### 3.3 Multiple JS entry-points fail to share code

`assets/js/full-graph-page.js` and `assets/js/mobile-graph-page.js` shared `applyToggle`, `applyQuickFilter`, the four `getElementById` calls — and were already collapsed into `GraphPageController` for the bundle. So this is *already* solved; just delete the static copies (§2.10).

But two larger duplications remain:
- `qualities-explorer.js` and `standards-explorer.js` each implement their own facet-chip toggle, search-text normalize, slugify, "X visible / N total" counter, and reset-button wiring. ~120 LOC overlap. Candidate: a small `src/scripts/utils/facets.js` that both import.
- `script.js` external-link logic and `header-link.js` heading-walk logic are both micro-utilities. Move them into `src/scripts/site/main.js` and bundle alongside the graph through esbuild.

### 3.4 Each graph bundle ships its own d3

Both `homepage/main.js` (660 KB) and `fullpage/main.js` (692 KB) include d3 + graphology + the full `nodes.json`/`edges.json`/`property-nodes.json`. The homepage only renders `propertyNodes` + a synthetic root, so it doesn't *need* the full node/edge data:

```
src/graphs/homepage/main.js  →  ships nodes.json + edges.json (~520 KB minified)
                                even though HomeGraph only uses propertyNodes
```

**Proposals (any of):**
1. **Trim the homepage import.** `homepage/main.js` shouldn't `import nodes from '...nodes.json'`; pass an empty array to `GraphDataProvider` instead. Saves ~250 KB on the homepage.
2. **Fetch JSON at runtime** with `fetch('/assets/data/property-nodes.json')`, removing 100 % of the data from the JS bundles. Costs one extra request. Plays well with HTTP/2 and Jekyll's deploy.
3. **Externalize d3 + graphology** as an esbuild `external` and load from a CDN with `<script>` (`d3.v7.min.js` is ~280 KB). Then `homepage/main.js` and `fullpage/main.js` shrink to ~50 KB each.

The first one is the cheapest — single-line change to the entry point.

### 3.5 jQuery on every page for ~50 lines of glue

The remaining jQuery calls in `script.js`, `header-link.js`, and `search.js` are:
- Class toggling on `.nav-toggle`.
- Document-level `keydown`/`click` listeners.
- `closest("p").css("text-align","center")` and `wrap($a)` for image centering.
- Heading walk, append link.
- Lunr search wiring.

All trivial in vanilla DOM. Removing jQuery and `jquery.sticky` saves **~93 KB** off every page load. Concrete migrations:

| Old | New |
|-----|-----|
| `$('.nav-toggle').on('click', …)` | `document.querySelectorAll('.nav-toggle').forEach(el => el.addEventListener('click', …))` |
| `toggle.toggleClass('active')` | `toggle.classList.toggle('active')` |
| `$(target).hasClass('active')` | `target.classList.contains('active')` |
| `$('a[href]').each(…)` | `for (const a of document.querySelectorAll('a[href]')) {…}` |
| `$(this).clone().children().remove().end().text()` | `el.cloneNode(true).querySelectorAll('*').forEach(c=>c.remove())` then `.textContent` |
| `$.fn.sticky` | dead — remove. |
| `searchInput.on('input', …)` | `searchInput.addEventListener('input', …)` |

### 3.6 Inline `<style>` blocks break the token system

A page-embedded `<style>` block in a Markdown file:
- Cannot read Sass variables.
- Is not minified by Sass.
- Is shipped inline on every visit to that page (acceptable) but cannot be cached separately or shared across pages.
- Tends to drift — e.g. the Qualities Explorer uses `--qx-accent: #1675b9` while the rest of the site uses `--brand-blue-dark: #0077ad`.

**Proposal:** Migrate each `<style>` block to a SCSS partial under `_sass/pages/`, leaving the Markdown file with just the layout and a `class="qualities-explorer"` / `class="approach-entry"` / `class="search-results-list"` root. Loading is the same (the partials are already in `style.css`). When the entire site uses CSS variables under `:root`, those page partials inherit the brand palette automatically.

---

## 4. FontAwesome — special case

`assets/css/all.css` is FontAwesome 5.15.4 free, 1 493 icon class definitions, ~72 KB CSS + ~520 KB of font files (in `assets/webfonts/`).

Actual usage across the site (full grep):

```
fa-arrow-up   fa-award         fa-balance-scale   fa-bolt
fa-bullseye   fa-crosshairs    fa-expand          fa-file-lines
fa-fw         fa-gem           fa-heading         fa-heart
fa-home       fa-layer-group   fa-link            fa-puzzle-piece
fa-search     fa-sliders-h     fa-tag             fa-tags
fa-user
```

19 distinct icons → ~1.3 % of FontAwesome.

**Proposals (pick one):**
1. **Inline SVG only.** Replace each `<i class="fa fa-xxx">` with a Liquid `{% include svg/xxx.svg %}` (or a pre-rendered partial). Removes `all.css` + all `.woff/.woff2/.ttf/.eot/.svg` font files, ~600 KB total. Best win, but ~30 markup edits.
2. **FontAwesome subset.** Use the FA "kit" or hand-build a subsetted CSS with only the 19 icons (~3 KB). Keeps existing markup unchanged. Smaller win but zero migration risk.
3. **Status quo + lazy-load.** `<link rel="preload" as="font">` for fa-solid-900.woff2 only; drop the `.eot/.svg/.ttf` mirrors that no modern browser uses. Removes ~1.2 MB of unused fonts; keeps the maintenance burden.

Recommendation: option 2 first (immediate, safe), option 1 in a follow-up.

---

## 5. Risk and Compatibility Notes

- **Permalink / class-name stability.** `.panel.quality-header`, `#standard-header`, `.tag-box`, `a.hov.tags.*` are emitted by Liquid templates that downstream contributors copy. Renaming any of them must come with a search-replace pass over `_includes/`, `_pages/`, `_qualities/`, `_requirements/`, `_articles/` (last three only if they hand-write tag markup — they mostly don't).
- **CSS load order.** Today `arc42-quality.css` wins because it loads last and uses `!important`. Removing `!important` requires confirming the SCSS specificity actually lands the colour we want — easy to verify by visual diff before/after on the homepage, a quality page, a requirement page, the standards page, the approaches page, and a tag page.
- **jQuery removal** changes the order of DOM-ready callbacks slightly. Test the search page (live search, Esc closes), the Quality Graph page (sliders + filters), the homepage (nav-toggle, /-key search focus), and any image-heavy quality page (image centering wrap).
- **All changes are local.** No external API or deploy implications; rebuild produces a new `style.css`/`fullpage/main.js`/`homepage/main.js` and that's it.

---

## 6. Suggested Sequencing

The work splits into three independent, cleanly reversible PRs:

### PR 1 — "Delete dead code" *(low risk, biggest visible win-to-effort ratio)*
- Remove `_sass/_splash-home.scss`.
- Remove `_sass/_aside.scss`, drop the `.site-aside`/`.sticky` block in `script.js`, drop the `<script>` line for `garand-sticky`, delete `assets/lib/garand-sticky/`.
- Remove `assets/js/full-graph-page.js`, `assets/js/mobile-graph-page.js`.
- Remove the corresponding `@import` lines in `style.scss`.
- Verify no markup references the removed selectors.

### PR 2 — "Single source of truth for tokens"
- Move every `:root { --… }` block (currently in `arc42-doc.css`) into `_sass/base/_variables.scss`, generated from Sass values.
- Replace local `--qx-*` / `--app-* `/ `--std-*` palette declarations with `var(--brand-…)` derivations.
- Replace hard-coded hex literals in `_pages/60-full-quality-graph.md` legend swatches with `var(--…)` references.
- Remove the `, #fallback` parts of `var(--token, fallback)` calls — they exist only to defend against the missing `:root` from before consolidation.
- Drop `arc42-doc.css` once its `:root` block has migrated; move the four component rules (`.arc42-help`, `.quality-requirement`, `.subtle-ad`, `.supported-by-innoq`) into `_sass/components/_arc42-help.scss` etc.

### PR 3 — "Componentise and de-duplicate"
- Create `_sass/components/_panel-header.scss` from the merge of `_content.scss`'s `.panel.*` rules + `arc42-quality.css`'s overrides; remove `!important`.
- Create `_sass/components/_tag-pill.scss` collapsing the eight `a.hov.tags.*` rules into one + four modifiers.
- Create `_sass/components/_section-heading.scss` for `h2.section-heading.{requirements, qualities, standards, approaches, tradeoffs, articles}`.
- Create `_sass/graph/_graph.scss` merging `q-graph.css` + the non-mobile parts of `_mobile-graph.scss`; keep the `@media (max-width: 900px)` block as the sole mobile section.
- Move embedded `<style>` blocks from `_pages/20-quality-characteristics.md`, `_pages/70-solution-approaches.md`, `_pages/search.html` into `_sass/pages/_qualities-explorer.scss`, `_sass/pages/_solution-approaches.scss`, `_sass/pages/_search.scss`.
- Move `ukraine.css` into `_sass/pages/_about.scss`.

### PR 4 — "Modernise JS"
- Rewrite `script.js`, `header-link.js`, `search.js` in vanilla; move them under `src/scripts/site/`; bundle with esbuild.
- Remove `<script src=".../jquery-3.7.1-min.js">` and the sticky lib from `_layouts/default.html`.
- Extract a shared `src/scripts/utils/facets.js` used by `qualities-explorer.js` and `standards-explorer.js`; bundle both through esbuild.

### PR 5 — "Trim payload" *(optional)*
- FontAwesome subset (option 2 above).
- Trim `homepage/main.js` import surface (drop full nodes.json/edges.json).
- Optional: externalize d3 + graphology to CDN.

---

## 7. Expected Payoff

| Area | Before | After | Notes |
|------|--------|-------|-------|
| `_sass/` files | 17 | ~22 (smaller, focused) | Higher count, lower LOC per file. |
| Plain CSS files imported | 6 | 0 | All inlined as Sass partials or removed. |
| Embedded `<style>` blocks | 4 (~850 LOC) | 0 (apart from `<noscript>`) | Lives under `_sass/pages/`. |
| Sources of truth for tokens | 3 | 1 | `_variables.scss`. |
| jQuery shipped per page | 87 KB + 5.7 KB sticky | 0 | After PR 4. |
| Homepage JS bundle | 660 KB | ~50 KB (CDN d3) / ~410 KB (trim only) | After PR 5. |
| FontAwesome CSS | 72 KB | ~3 KB | After PR 5 option 2. |
| Dead JS files | 2 | 0 | After PR 1. |
| Dead SCSS partials | 2 | 0 | After PR 1. |
| `!important` count in shipped CSS | ~25 | <5 | After PR 2/3. |

The first three PRs alone cover most of the maintainability win; PR 4 and PR 5 are payload optimizations that can wait if priorities shift.

---

## 8. Open Questions for the Maintainer

1. **Is `splash-home` truly orphan?** I confirmed by grep across `_layouts/`, `_includes/`, `_pages/` — no hits. Worth a final visual smoke test in case a stand-alone HTML file (e.g. a draft) still uses it.
2. **`.subtle-ad` and `.supported-by-innoq`** — defined in `arc42-doc.css`, used in `_includes/about/sponsors.md` and the footer. Keep / restyle / drop in favour of the new violet footer's sponsor zone?
3. **`arc42-exclamation.svg` (`assets/css/arc42-exclamation.svg`)** is the icon for `.arc42-help::before` and `.quality-requirement::before`. It's referenced via a relative path inside `arc42-doc.css`. After the migration, decide whether to keep the file at `assets/css/` (path stays) or move alongside the partial as `assets/img/arc42-exclamation.svg`.
4. **Subset vs inline SVG** for FontAwesome — preferred?
5. **Would you like to also merge `homepage/` and `fullpage/` bundles** into a single chunked bundle (esbuild `splitting: true` outputs `chunks/` shared modules), or keep them as two independent bundles?

---

*Notes:* This proposal restricts itself to assets the build system already touches. It does not propose moving to a different framework (PostCSS, Tailwind, Lightning, Vite) and does not propose changes to the Liquid templating model. All recommended changes are mechanical refactors that the existing Jekyll + esbuild + Sass pipeline handles unchanged.
