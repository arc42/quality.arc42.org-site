# CSS & JS Nitpick Review — Verdict

**Reviewer:** Claude (opus-4-8) · **Date:** 2026-05-29
**Scope:** `src/graphs/**`, `src/scripts/site/**`, `assets/js/*-explorer.js`, `_sass/**`, `assets/css/**`
**Method:** Manual read of all hand-written JS source + SCSS audit. No files changed.

## TL;DR verdict

The codebase is **above average for a Jekyll site** — there's a real design-token
system (`_variables.scss`), reduced-motion handling in both JS and CSS, careful ARIA
in the autocomplete/navigation, and the D3 renderer is thoughtfully structured. The
violations that remain are mostly **consistency and hygiene** issues, plus a few
**genuine bugs / dead code**. Nothing here is on fire. The two things I'd actually
prioritize: (1) a committed build artifact + an inconsistent module strategy, and
(2) the duplicated/conflicting global `/` key handler with dead code behind it.

Priorities: **P0** = correctness/bug or maintenance hazard · **P1** = clear best-practice
violation worth fixing soon · **P2** = nitpick / consistency · **P3** = optional polish.

---

## P0 — Correctness, dead code, build hazards

### J1. `assets/js/site.js` is a committed minified build artifact
- `assets/js/site.js` (44 KB, minified, `(()=>{var ue=...`) is **tracked in git**, but
  `assets/js/fullpage/*.js` and `assets/js/homepage/*.js` are `.gitignore`d as
  "Build artifacts". `build.js` emits `site.js` from `src/scripts/site/main.js` into
  `assets/js/`, so this file *is* generated output — committing it invites
  source/bundle drift (someone edits `src/scripts/site/*` but ships a stale `site.js`).
- **Fix:** either gitignore `assets/js/site.js` too (and build in CI/at deploy), or
  document deliberately why it's vendored. Be consistent with the other two bundles.

### J2. Hand-written source lives inside the esbuild `outdir`
- `assets/js/{qualities,approaches,standards}-explorer.js` are **hand-authored** (IIFE,
  ES5-ish) and loaded directly via `<script>`. They sit in `assets/js/`, which is
  esbuild's `outdir` (`build.js:111`). A future `rimraf assets/js` or added entrypoint
  would clobber real source. Source and generated output should not share a directory.

### J3. Dead + conflicting global `/` key handler
- `src/scripts/site/navigation.js:80-92` adds a `keyup` listener that focuses
  `#search` on `/`. **No element with `id="search"` exists** in `_includes`/`_layouts`
  (grep confirms) — this is dead code. The live header search is `#site-search-input`,
  handled separately in `autocomplete.js:461`.
- So there are **two** global `/` listeners (`navigation.js` keyup + `autocomplete.js`
  keydown). The navigation one is a no-op only because its target is gone; restore the
  element and they'd fight.
- Also: `e.preventDefault()` inside a **`keyup`** handler (line 84) does nothing to stop
  the `/` character — it's already committed on keydown. And it uses the deprecated
  `e.keyCode === 191`.
- **Fix:** delete `navigation.js` step 4 entirely; `autocomplete.js` already owns `/`.

### J4. `approaches-explorer.js` loaded without `defer` (inconsistent)
- `_pages/70-solution-approaches.md:150` → `<script src=...approaches-explorer.js>` with
  **no `defer`**, while `qualities-explorer.js` and `standards-explorer.js` use `defer`.
  Inconsistent; make all three `defer` (or all consistent).

### J5. Internal navigation hardcodes path, ignoring `baseurl`
- `src/graphs/HomeGraph.js:77` → `window.location.href = "/full-quality-graph";`
  hardcodes a root-absolute path. Everywhere else the code carefully uses
  `window.baseurl` (search.js, autocomplete.js). If the site is ever served under a
  subpath this link breaks. Use the baseurl prefix.

---

## P1 — Best-practice violations

### J6. Inconsistent HTML-escaping before `innerHTML`
- `src/scripts/site/autocomplete.js` does this right: dedicated `escapeHtml()` /
  `escapeRegex()` and escapes every interpolated value.
- `src/scripts/site/search.js:84-120` does **not**: `highlightText()` injects
  `item.title` (and `item.url` at line 114) into an `innerHTML` template **unescaped**.
  Data is build-controlled (low real-world risk), but it's an inconsistent pattern and
  a latent XSS footgun if titles ever include user/markdown content. Mirror the
  autocomplete's escaping.
- The explorers use `meta.innerHTML = \`<span>related: ${item.relatedCount}</span>...\``
  (`qualities-explorer.js:282`, `approaches-explorer.js:232`) — values are `Number()`-
  coerced so safe, but they build DOM with `createElement` everywhere *else*; the lone
  `innerHTML` is a stylistic inconsistency. Use `textContent`/elements for uniformity.

### J7. Retry-storm / polling instead of event-driven sync (FullGraph)
- `src/graphs/FullGraph.js:_reapplySelectedStandardIfAny()` re-applies the URL-selected
  standard on a hardcoded ladder of `setTimeout`s `[300, 800, 1500, 2500]` (lines 87-99),
  on top of `_waitForRenderThen()` which **polls every 50 ms up to 100 times**
  (lines 955-962). This is racing the D3 simulation rather than reacting to a
  settle/`end` event. Fragile, timing-dependent, and runs timers even when nothing
  changed. Prefer hooking `simulation.on("end", …)` or a single post-render callback.

### J8. Debug logging shipped to production
- `src/graphs/FullGraph.js:211` → `console.warn("Centering view...");` (fires on every
  center click).
- `FullGraph.js:244` → `console.error("Filter input or button element not found")`.
- `src/graphs/Graph.js:134` `console.warn("Skipped invalid edge", …)` in a hot path.
  Gate these behind a debug flag or remove.

### J9. Brand colors hardcoded in JS, duplicated and drifting from tokens
- `_variables.scss` is the single source of truth, but the canvas renderer can't read
  CSS vars, so hex values are duplicated in JS:
  `GraphRenderer.js` uses `#F97316` (orange) **5×** (1165, 1191, 1208, 1228, 1237, 988),
  `#00B8F5` (1147 inline `style="color:#00B8F5"`), `#2C3E50`, `#0F172A`, `#E0E0E0`,
  `#cb9fff`; `data.js:132` defines node `color: '#00B8F5'`.
- Worse: `#F97316` **isn't even in the palette** — the brand orange is `#ffad80`
  (`CLAUDE.md`). The graph accent has silently diverged from the design system.
- **Fix:** centralize graph colors in one JS constants module (e.g. extend
  `src/graphs/constants.js`) and reconcile against `_variables.scss` so they can't drift.

### J10. Tooltip styled entirely from JS instead of its CSS class
- `GraphRenderer._createTooltip()` (lines 116-130) sets ~12 inline `.style()` calls
  (`background-color: rgba(0,0,0,0.85)`, `color:#fff`, padding, radius, shadow, z-index
  `1000`…). It even `.remove()`s a `.graph-tooltip` class element, implying a CSS class
  is expected. Move presentation to `.graph-tooltip` in SCSS; keep only dynamic
  `left/top/visibility` in JS.

### J11. Fragile external-link detection
- `navigation.js:155-161` classifies "external" by `href.includes('//')` and
  `!href.includes(host)`. Substring matching misclassifies protocol-relative URLs,
  fragments/queries containing `//`, and internal links whose path contains the host
  string. Use `new URL(href, location.href).host !== location.host`. Also: this runtime
  DOM rewrite (adding `target`/`rel`) could be done at build time in the layout.

### C1. SCSS still uses deprecated `@import` everywhere (no `@use`/`@forward`)
- `assets/css/style.scss` has **33 `@import` statements**; **zero `@use`/`@forward`**.
  Dart Sass has deprecated `@import` (slated for removal) — every partial shares one
  global namespace, and `@import` re-evaluates partials per import. This is the single
  biggest CSS-modernization debt. Migrate to the module system (`@use "base/variables"
  as *` etc.). Note `@import "all.css"` (FontAwesome, line 35) should become a plain CSS
  `@import url(...)` or a `<link>` — it's vendored and shouldn't go through the module
  graph.

### C2. Breakpoints are magic numbers, not tokenized, and inconsistent
- Layout width tokens exist and several media queries *do* use them
  (`$mobile-width: 800`, `$nav-collapse-width: 1180`, `$nav-compact-width: 720`,
  `$home-graph-wide-width: 900`…) — good. But raw-px breakpoints still slip through and
  **duplicate existing tokens**: `_mobile-graph.scss:24` hardcodes `900px` (=
  `$home-graph-wide-width`), `_mobile-graph.scss:62` hardcodes `800px` (= `$mobile-width`),
  plus a stray `30rem` and a `56.25em` (= 900px) that match no scale.
- **Cross-stack mismatch:** the "mobile" breakpoint is `720px` in JS
  (`navigation.js:7`) but `900px` in JS (`GraphPageController.js:11`) and various px in
  CSS. There's no shared definition, so "mobile" means three different widths.
- **Fix:** route every query through the existing tokens (or a mixin) and add a matching
  JS constant.

### C7. ~70+ hardcoded colors bypass the token system (HIGH)
- Despite the strong `_variables.scss`/`:root` palette, the agent counted **186+
  hex/rgb literals**, ~70 of which duplicate or *should* map to existing tokens.
  Worst offenders:
  - `_sass/_q-graph.scss` — **44+** raw colors: `#ffffff` (2,14), `#e0e0e0` (25),
    `#333` (47, ≈ `$brand-ink`), `#ccc` (54, ×2), `#e6daf2`/`#cb9fff` (66,74),
    `#566f84` (88), and ~10 ad-hoc blues `#9ecbe3 #eef8ff #dff1ff #73b1d4 #b7d9ed
    #ecf8ff #def2ff #8fc4e5` (98–135).
  - `_sass/_standards.scss` — **30+** raw browns/oranges/grays: `#555f66` (22),
    `#776232` (142), `#5c646a` (149), `#4f5960` (191), `#655329 #6d4f13 #705924
    #6b5523 #655c4a #4a3a0a` (264–326). (Note: `_variables.scss` already has a full
    `--std-*` set these could use.)
  - `_sass/_content.scss:401,404` (`#a9d7f3`, `#eef8ff`), `_sass/_toggle-switch.scss`
    (`#ccc`, `#fff`, `#eee`).
- This is the same disease as **J9** (graph JS colors) on the CSS side — the design
  system exists but large areas don't consume it, so theming/contrast tweaks can't be
  made in one place.

### C8. ~10+ transitions/animations lack `prefers-reduced-motion` (HIGH, WCAG 2.3.3)
- Reduced-motion *is* handled in 4 places (`base/_layout.scss:65`, `_header.scss:294`,
  `components/_icons.scss:52`, `components/_search-autocomplete.scss:258`) — but many
  animated rules are **unguarded**: `_common.scss:49` (`transition: all .2s` on all
  links), `_header.scss:90,193-196`, `_standards.scss:64,198`, `_footer.scss:34,58,107`,
  `_mobile-graph.scss:305` (sheet transform), `_q-graph.scss:31,147,266`,
  `components/_section-hero.scss:98,152`, `components/_dimension-graph-link.scss:32,104`,
  `components/_tag-chips.scss`, `pages/_requirements.scss:52,109`,
  `_toggle-switch.scss:16,34`. The JS renderer respects reduced-motion; the CSS layer is
  inconsistent. Best handled with one global guarded rule
  (`@media (prefers-reduced-motion: reduce){ *{transition:none!important;animation:none!important} }`)
  plus the existing targeted ones.

---

## P2 — Nitpicks & consistency

### J12. The two explorers are ~95% duplicated code
- `qualities-explorer.js` and `approaches-explorer.js` are nearly identical
  (facets/letters/results render, `letterAnchorId`, `createTagsLine`, `renderFacets`,
  etc.). Root cause: they're standalone IIFE scripts, **not** part of the esbuild
  bundle, so they can't `import` a shared module. Bringing them into the build (J2)
  would let them share one parametrized module and delete ~250 duplicated lines.

### J13. Module-strategy split-brain
- `src/**` is modern ESM bundled by esbuild; `assets/js/*-explorer.js` are ES5-style
  IIFEs loaded raw. Two coding styles, two delivery mechanisms, in one project. Pick one.

### J14. Manually-synced parallel state in FullGraph
- `finalizedTerms`, `currentFilterTerms`, `currentFilterTerm` are three representations
  of the same data kept in sync by hand across ~8 methods (e.g. lines 340-341, 433-435,
  440-442). Easy to desync. Derive the string/array forms from one source of truth.

### J15. `prepareGraphData()` filters on a non-existent attribute
- `Graph.js:566,578` skip nodes/edges where `attrs.hidden` is truthy, but no code ever
  sets a `hidden` node attribute (legend hiding uses `_legendHidden` at the render
  layer). Dead/misleading guard — remove or wire up.

### J16. `requestAnimationFrame` inside every simulation tick
- `GraphRenderer.handleTick()` (line 800) wraps the whole tick body in `rAF`. D3 already
  ticks per frame; this can queue overlapping rAF callbacks and `drawCanvas` is also
  invoked from many other paths. Likely redundant double-buffering / extra redraws.
  Verify it's needed; if not, draw synchronously in the tick.

### J17. Deprecated APIs / `keyCode`
- `e.keyCode === 13` (`FullGraph.js:232`) and `=== 191` (`navigation.js:84`) — use
  `e.key`. `mql.addListener` fallbacks (`navigation.js:149`, `GraphPageController.js:194`)
  are for Safari < 14; fine to keep but dated.

### J18. `getQuery()` assignment-in-condition
- `search.js:131` `if (matched = window.location.search.match(regex))` — assignment in a
  conditional, classic lint smell. Split into assign + test.

### J19. `runQuery` recomputes `terms`
- `autocomplete.js:343` computes `terms` and `rank(q)` (line 344) re-trims/splits/
  lowercases the same query internally (`rank`, lines 108-112). Minor double work per
  keystroke.

### C3. `!important` — mostly legit, a couple worth a look
- Only **7** occurrences. Most are defensible: `base/_reset.scss:318` (a comment),
  `base/_utilities.scss:16/19/22` (margin helper utilities — acceptable for utilities).
  Worth revisiting: `_q-graph.scss:8-9` (`margin:0 !important; width:100% !important`)
  and `_mobile-graph.scss:16` (`display:none !important`) — these read like specificity
  band-aids. Low priority but candidates for removal once selectors are cleaned up.

### C4. `outline: none` (10×) — mostly paired, two to verify/fix
- `outline: none/0` appears 10×. Most **are** correctly paired with `var(--focus-ring)`
  / `--focus-ring-on-violet` (`_header.scss:103,220,279`, `_homenew.scss:207`,
  `base/_layout.scss:40,61`) — good. To verify: `_mobile-graph.scss:216,240,287,375`
  (focus ring not confirmed in context). To fix: **`base/_reset.scss:99`**
  `a:active, a:hover { outline: 0; }` — a legacy normalize pattern that strips the
  outline from *all* links on interaction with no replacement. Remove it.
- Prefer `:focus-visible` over `:focus` everywhere to avoid rings on mouse click.

### C9. No centralized z-index scale
- z-index values are ad-hoc: `1, 2, 30, 40, 1000, 1100, 1201, 1300, 2000` across header,
  standards, search panel, mobile graph, skip-link. The jump from `40` → `1000` and the
  one-off `1201/1300` are unexplained and fragile. Define a small named scale
  (e.g. `--z-base/-dropdown/-sticky/-overlay/-modal/-skiplink`).

### C10. Deprecated Dart Sass color functions
- `_common.scss:52` uses `darken($link-color, 12%)`; `_variables.scss:131` uses
  `red()/green()/blue()`. Both are deprecated in favour of the `sass:color` module
  (`color.adjust`, `color.channel`). Will start warning, then break, on Sass upgrades.
  (Goes hand-in-hand with the `@use` migration in **C1**.)

### C11. Hardcoded px font-sizes break the rem scale
- The type scale is rem-based (`$text-*`), but several sizes are raw px:
  `_variables.scss:21` `$font-size: 17px` (root), `_common.scss:122,145` (`14px`,`12px`),
  `_ukraine.scss:4,11` (`22px`,`14px`), `_q-graph.scss:261` (`24px`). px font-sizes don't
  scale with user font-size preferences. Move to rem / the `$text-*` tokens.

### C12. Stale vendor prefixes & minor duplicate selectors
- Removable prefixes: `_header.scss:148-149` `-moz-/-webkit-box-sizing` (universally
  unprefixed since IE8); `_mobile-graph.scss:310` `-ms-overflow-style` (IE10-11 only).
- Duplicate rules: `_standards.scss` defines `.standards-mode-switch__link.is-active`
  (~77-79) and `.standards-facet-btn.is-active` (~322-326) twice; `_content.scss:326-333`
  `.panel.standard-header` largely repeats the approaches/quality header block at 306-311.

---

## P3 — Optional polish

- **J20.** Explorers re-render the entire facets container on every chip toggle
  (`renderFacets` → `innerHTML=""`), which **drops keyboard focus** off the just-clicked
  chip. Re-render results only, or restore focus, for better a11y/UX.
- **J21.** `search.js` builds each result by setting `div.innerHTML` then appending
  `div.firstElementChild` and discarding the wrapper — works, but `createElement` would
  be cleaner and dovetails with the escaping fix (J6).
- **J22.** Magic numbers throughout the layout math (`Graph.js`: `250`, `30`, `18`, `0.7`,
  `0.8`, `2.2`; timeouts `120`/`180`/`300`) and `SIDEBAR_WIDTH = 200` in
  `GraphRenderer.js` vs `GraphPageController` mobile logic — fine for layout heuristics
  but undocumented; named constants would help the next reader.
- **C5.** `prefers-color-scheme` is absent (no dark mode). The brand is explicitly a
  light theme (per `CLAUDE.md`), so this is *intentional* — noting only for completeness.
- **C6.** `assets/css/all.css` (73 KB, FontAwesome 5.15.4, ~6,135 lines) is a vendored,
  unmodified third-party bundle committed to the repo and pulled in via
  `@import "all.css"`. Acceptable as a dependency, but: it's large for an icon set
  (consider SVG sprites / subsetting to the few icons actually used — `fa-tags`,
  `fa-link`, `fa-arrow-up`, `fa-expand`, `fa-puzzle-piece`…), confirm it's minified in
  the published output, and it should be a plain `@import url()`/`<link>` rather than
  routed through the Sass module graph (ties into C1).

---

## What's genuinely good (so it doesn't get "fixed")

- `_variables.scss`: mature token system — modular type scale, radius scale, RGBA
  ramps, **two-tone `--focus-ring` tokens with documented WCAG-AA contrast rationale**.
- Reduced-motion is handled well in JS (`GraphRenderer._prefersReducedMotion` settles
  the simulation synchronously) and *started* in SCSS (4 files) — though the CSS side is
  incomplete (see C8).
- Autocomplete: solid ARIA (`aria-activedescendant`, `role=option`, `aria-expanded`),
  proper escaping, debounce, deliberate non-Lunr scoring with a documented reason.
- D3 renderer split into small private helpers; submodule d3 imports to trim bundle.
- Navigation drawer manages focus in/out deliberately (documented non-modal choice).
- Skip-link present and properly styled (`base/_layout.scss:44-62`); border-radius and
  modular type scales are tokenized with documented rationale.
