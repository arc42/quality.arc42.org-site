# CSS & JS Nitpick Review — Verdict

**Reviewer:** Claude (opus-4-8) · **Date:** 2026-05-29 · **Last updated:** 2026-05-29 (post-fix)
**Scope:** `src/graphs/**`, `src/scripts/site/**`, `assets/js/*-explorer.js`, `_sass/**`, `assets/css/**`
**Method:** Manual read of all hand-written JS source + SCSS audit.
**Branch:** `claude/youthful-planck-FHpek`. See the **Resolution status** section below for what
has been fixed; the detailed findings further down are preserved as the original review.

## TL;DR verdict

The codebase is **above average for a Jekyll site** — there's a real design-token
system (`_variables.scss`), reduced-motion handling in both JS and CSS, careful ARIA
in the autocomplete/navigation, and the D3 renderer is thoughtfully structured. The
violations that remain are mostly **consistency and hygiene** issues, plus a few
**genuine bugs / dead code**. Nothing here is on fire. The two things I'd actually
prioritize: (1) a committed build artifact + an inconsistent module strategy, and
(2) the duplicated/conflicting global `/` key handler with dead code behind it.

> **Post-fix note:** most of the JS findings and the safe CSS subset are now fixed on
> `claude/youthful-planck-FHpek` — including (2) and the module-strategy half of (1). The
> remaining open/deferred items (the `@use` migration, colour normalization, the build-
> artifact deploy decision) are tracked in **Resolution status** below.

Priorities: **P0** = correctness/bug or maintenance hazard · **P1** = clear best-practice
violation worth fixing soon · **P2** = nitpick / consistency · **P3** = optional polish.

---

## Resolution status (2026-05-29)

Legend: ✅ fixed · 🟡 partially fixed · ⏭️ deferred (deliberate, with rationale) · ⬜ open.

All fixes are on `claude/youthful-planck-FHpek`, one finding-group per commit so they
cherry-pick cleanly. JS bundles rebuilt via `npm run build`; CSS changes verified by
diffing a full dart-sass compile of the stylesheet against a saved baseline (no browser
needed for the value-preserving ones).

### JavaScript

| ID | Status | Commit / note |
|----|--------|---------------|
| J2  | ✅ | `b57b5d2` — explorers moved to `src/explorers/`, built by esbuild (no longer source-in-outdir) |
| J3  | ✅ | `a4e2d07` — dead `/` keyup handler removed |
| J4  | ✅ | `7f1b09b` — `defer` added to approaches-explorer |
| J5  | ✅ | `5b450a3` — HomeGraph uses `window.baseurl` |
| J6  | ✅ | `266cb87` (search.js escaping) + `b57b5d2` (explorers now build DOM with elements, no `innerHTML`) |
| J7  | ✅ | `0021648` — re-assert on simulation `end` + single fallback, replacing the timer ladder |
| J8  | ✅ | `5966e20` — removed the `Centering view…` debug log; genuine `console.error`/edge-skip `warn` kept by design |
| J9  | ✅ | `04ea112` — `src/graphs/colors.js` single source; off-palette `#F97316` consolidated |
| J11 | ✅ | `a4e2d07` — external-link detection via `new URL(...).host` |
| J12 | ✅ | `b57b5d2` — shared `letter-explorer.js`; ~250 duplicated lines removed |
| J13 | ✅ | `b57b5d2` — all three explorers now ESM-bundled (one strategy) |
| J15 | ✅ | `5966e20` — dead `attrs.hidden` guards removed |
| J16 | ✅ | `f681c5b` — redundant rAF wrapper dropped from the tick |
| J17 | ✅ | `5966e20` (`keyCode===13`) + `a4e2d07` (`keyCode===191` removed with J3); `mql.addListener` fallbacks intentionally kept |
| J18 | ✅ | `266cb87` — assignment hoisted out of the `if` |
| J19 | ✅ | `7f1b09b` — `rank()` takes pre-tokenized terms |
| J20 | ✅ | `b57b5d2` — focus restored to the toggled facet chip |
| J1  | ⏭️ | Committing build artifacts vs. gitignoring is a **deploy-policy** call (GitHub Pages doesn't run esbuild; CI does). Left for a deliberate decision, not a code cleanup. |
| J10 | ⏭️ | Tooltip inline styles → `.graph-tooltip` CSS. Couples JS+CSS and is value-changing; not done. |
| J14 | ⬜ | FullGraph parallel filter-term state not refactored. |
| J21 | ⬜ | search.js still uses the `innerHTML`-wrapper pattern (now *escaped*, so safe); not converted to `createElement`. |
| J22 | ⬜ | Layout magic numbers / `SIDEBAR_WIDTH` not named. |

### CSS

| ID | Status | Commit / note |
|----|--------|---------------|
| C8  | ✅ | `6174bf3` — site-wide `prefers-reduced-motion` (global near-zero-duration block) |
| C9  | ✅ | `c5a962c` — global-layer z-index tokens (`--z-sticky/popover/sheet/sheet-top/skip-link`), values unchanged |
| C4  | 🟡 | `65756f3` — removed the legacy `a:active/a:hover{outline:0}` reset (the real fix). The `_mobile-graph.scss` `outline:none` spots still want a focus-ring **verification** pass. |
| C5  | ✅ | `722b5c9` — added `color-scheme: light` to `:root` (prevents forced-dark garbling; not dark-mode support) |
| C7  | ⏭️ | **Reclassified.** Grep proved **zero** brand-colour literals exist outside `_variables.scss` — the palette is fully adopted. The remaining literals are *bespoke* one-offs with no token equivalent, so replacing them is value-*changing* (normalization), not a refactor. Deferred. |
| C1  | ⏭️ | `@use`/`@forward` migration. Attempted via `sass-migrator`; **not byte-identical achievable** here (cross-module `@extend .clearfix` changes selector grouping) and the tool didn't compile cleanly in the Jekyll-partial/load-path setup. Warnings-only today. Needs a dedicated, locally-run + browser-reviewed effort — see follow-up below. |
| C10 | ⏭️ | `darken()` / `red/green/blue()` → `sass:color`. Tied to C1 (`@use "sass:color"`); deferred with it. |
| C2  | ⏭️ | Breakpoint tokenizing **skipped**: only 5 literal media queries, and the matching tokens would *falsely couple* independent breakpoints (changing the home-graph breakpoint would move the standards one). Net-negative. |
| C11 | ⏭️ | `px`→`rem` fonts is value-changing (root is 17px, so naive conversion resizes text). Normalization, deferred. |
| C3  | ⬜ | `!important` (7×, mostly legit) — not touched. |
| C12 | ⬜ | Stale vendor prefixes / minor duplicate selectors — not touched. |
| C6  | ⬜ | FontAwesome size / `@import "all.css"` → `<link>` / subsetting — not touched (perf task). |

### Follow-up worth scheduling: the `@use` migration (C1 + C10)

This is the one real *deadline* item (Dart Sass will eventually remove `@import`). It was
deferred here because a clean, verifiable migration needs:
1. `sass-migrator module --migrate-deps` run against the **real Jekyll** Sass environment
   (the throwaway dart-sass + `--load-path` setup didn't resolve the `_partial`/`all.css`
   graph cleanly), and
2. resolving the cross-module `@extend .clearfix` (in `_aside`/`_content`/`_layout`) —
   under modules this either needs the extendable selector co-located or a switch to a
   mixin, which **changes compiled output** (selector grouping → duplicated rules), so it
   can't be a silent byte-identical refactor and must be eyeballed in a browser.
   It touches all ~30 partials. Recommend its own PR with visual review.

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
> **Update (post-fix): reclassified, deferred.** A targeted grep found **zero** *brand*-colour
> literals outside `_variables.scss` — the palette is already fully adopted. The literals below
> are **bespoke** values with no token equivalent, so "fixing" them means inventing tokens or
> snapping to the nearest colour — a value-*changing* normalization (Option C), not a safe
> refactor. Left for a deliberate design pass.

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
> **Update (post-fix): RESOLVED** in `6174bf3` via a single global `prefers-reduced-motion`
> block (`*,*::before,*::after { …-duration: 0.01ms !important }`), which neutralizes every
> current and future transition/animation. The pre-existing targeted blocks were left in place.

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
  the simulation synchronously) and, as of `6174bf3`, site-wide in CSS via a global guard
  (was the partial state noted in C8).
- Autocomplete: solid ARIA (`aria-activedescendant`, `role=option`, `aria-expanded`),
  proper escaping, debounce, deliberate non-Lunr scoring with a documented reason.
- D3 renderer split into small private helpers; submodule d3 imports to trim bundle.
- Navigation drawer manages focus in/out deliberately (documented non-modal choice).
- Skip-link present and properly styled (`base/_layout.scss:44-62`); border-radius and
  modular type scales are tokenized with documented rationale.
