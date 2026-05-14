# /impeccable critique — arc42 Quality Model · 2026-05-13

Two independent assessments (qualitative LLM review + deterministic pattern scan) over the live production preview at **https://q42.netlify.app/** and the project sources at `_layouts/`, `_includes/`, `_sass/`.

Audience this critique is written for: software developers, dev-teams, product owners, requirements engineers using the site during workshops, design reviews, and tender writing. Navigation must be **efficient and effective, streamlined for results, not sales**.

---

## Todo list

Ordered by impact on the user's stated mandate. Branch names are suggestions; one branch per item keeps reviews scoped.

- [ ] **(2)** **Autocomplete search dropdown** — branch `autocomplete-search` *(in progress)*
      Client-side Lunr-backed dropdown bound to `Cmd/Ctrl+K` and `/`. Groups results by Quality · Requirement · Standard · Approach with home-directory category colors. Reuses the existing `assets/data/search-index.json` + `search-lookup.json`. `/search/` page kept as the full-results fallback.
- [ ] **(1)** **Graph-as-hero on `/` + mini-graph on detail pages** — branch `graph-as-hero`
      Promote the D3 graph above the directory; add a 1–2 hop neighbourhood mini-graph (current node highlighted) to every quality / requirement / standard detail page.
- [ ] **(3)** **Requirement detail page: breadcrumb + curated siblings** — branch `req-breadcrumb-curated-siblings`
      Add `Qualities › <Parent> › <Requirement>` breadcrumb. Cap sibling list at 8–10 ranked by tag-overlap, or group by parent quality. Add "View all N in this dimension" link.
- [ ] **(4)** **Cross-link symmetry: approaches everywhere they apply** — branch `cross-link-approaches`
      Include `directly-related-approaches` in `_layouts/requirements.html` and `_layouts/page_standard.html`. Add "Back to all standards" / "Back to all requirements" trailing links.
- [ ] **(5)** **Collapse three hero treatments to one** — branch `unify-hero-language`
      Strip the rotated 12° white shine + double radial gradients in `_sass/_standards.scss:60-80`, the qualities-explorer radial hero, the gradient-fill chip backgrounds, and the hover-reveal panel (`_sass/_standards.scss:493-511`). Standardise on the home hero pattern with a single category-colour rule.
- [ ] **(6)** **Promote Dimensions to primary nav; tone the nav typography** — branch `nav-promote-dimensions`
      Swap Dimensions into primary nav, demote How-To. Reduce `letter-spacing` from `0.08em` to `~0.04em` on `.site-header__inner` (or switch to small-caps). Normalise tag-chip border-radius across `_sass/_common.scss`, `_sass/_standards.scss`, `_pages/20-quality-characteristics.md`.
- [ ] **(7)** **Standards explorer: show descriptions inline** — branch `standards-cards-inline`
      Replace the hover-reveal panel with inline descriptions at reduced emphasis. Touch-friendly and keyboard-honest.
- [ ] **(8)** **UX-copy + polish pass** — branch `ux-copy-polish`
      Rename "How-To" to "Start here". Inline `style="margin:0;padding:1rem;"` cleanup in `_includes/one-quality.liquid:11` and `_includes/one-requirement.liquid:6`. `text-wrap: balance` scope, engraved `<hr>`, canonical URL in `_config.yml:8`, `scroll-margin-top` for letter-jump anchors. Explain "Q42" on first contact.

---

## Health score

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 3 | `aria-current` set on nav; no breadcrumbs on detail pages. |
| 2 | Match system / real world | 3 | Domain language is right; "Q42" is unexplained on first contact. |
| 3 | User control & freedom | 2 | No breadcrumbs; no back-link from standard / quality detail pages. |
| 4 | Consistency & standards | 2 | Three competing hero languages; three local palettes (`--qx-*`, `--std-*`, `--home-*`). |
| 5 | Error prevention | 3 | Reasonable; not deeply testable without a 404 walk. |
| 6 | Recognition over recall | 2 | Graph hidden after homepage; tag-chip styles inconsistent; asymmetric cross-links. |
| 7 | Flexibility & efficiency | **1** | No keyboard search, no autocomplete, no recently-viewed. Biggest gap. |
| 8 | Aesthetic & minimal design | 2 | Hero shine, radial gradients, hidden-on-hover cards, gradient-fill chips. |
| 9 | Error recovery | 3 | Adequate. |
| 10 | Help & documentation | 3 | How-To exists; not deep-linked from points of friction. |
| **Total** | | **24 / 40** | **Acceptable** — significant improvements needed for the target persona. |

Cognitive-load checklist: **5 of 8 failures** (single focus, grouping, one-thing-at-a-time on `/qualities/`, ≤4 options at decision points, working memory, progressive disclosure).

---

## Anti-pattern verdict

**Not** AI-slop in the obvious sense. Palette is the documented brand; voice is descriptive, not promotional; no glassmorphism, no gradient text, no testimonials, no "supercharge" copy; no dark-mode bolt-on; no newsletter / waitlist; no arrow-CTA glyphs. 13 of 25 detector rules entirely clean.

Template-finish reflexes that did sneak in:

- Rotated 12° white "shine" pseudo-element on the standards hero — `_sass/_standards.scss:65-80`.
- Double radial-gradient backgrounds in two different colour families — `_sass/_standards.scss:60-62` and the qualities-explorer hero block (CSS injected by `assets/js/qualities-explorer.js`).
- SaaS-style "translate-up gold panel on hover" reveal — `_sass/_standards.scss:493-511`.
- Hero-stat pill row `42 Standards · 13 Categories` — `_includes/standards-hero.liquid:39-48`.
- Gradient-fill on active facet chips — `_pages/20-quality-characteristics.md:271-274` and `_sass/_standards.scss:411-415`.

Borderline / debatable (kept for now, flag if [P0] decisions change):

- 3px side-stripe on `.qualities-item.is-alias` (JS-injected) — semantic indicator, not decoration.
- 36 em-dash occurrences in fetched HTML are all inside canonical ISO/IEC standard titles — false positive.
- 13× repeated `standards-category-card` is a legitimate enumeration, not a marketing card grid.

---

## What's working

- **The information model.** Five connected entity types with explicit cross-references and a measurable acceptance-criteria schema is the product's moat.
- **Editorial typography.** Atkinson Hyperlegible Next + Libre Caslon Text, 17px body, 1.333 modular scale, sensible line lengths. Reads "handbook" before any user clicks.
- **Homepage hero composition.** Violet bleed, typographic h1 left, three-line directory right, 4px colour rails per category — the most editorial surface on the site and the design language to standardise on.
- **Accessibility table-stakes.** Skip link, focus rings, WCAG pill in footer, no-JS fallback on `/qualities/`.

---

## Priority issues (full breakdown)

### [P0] The graph is not actually the hero
On `/`, the graph sits *below* the directory at 42vh behind a cream background labelled "The quality graph" with a small "Open graph" button. The directory already provides full navigation, so most users scroll past. On every other page the graph is absent — including `/qualities/accessibility` where it would be most useful.

**Fix:** Make the graph the primary hero on the homepage with the directory as a secondary tier. Add a mini-graph (1–2 hop neighbourhood, current node highlighted) to every quality / requirement / standard detail page.
**Command:** `$impeccable overdrive`, then `$impeccable shape`.

### [P1] No autocomplete search
`_includes/site-header.html:25-28` posts to `/search/` with no inline autocomplete. The audience is power users. The user's brief explicitly said "streamlined for results, not sales."

**Fix:** Client-side prefix-search dropdown grouped by entity type with home-directory category colours. Bind `Cmd+K` and `/`. Closes Heuristic 7 from 1 → 3.
**Command:** `$impeccable shape`, then `$impeccable optimize`. **← this branch.**

### [P1] Three competing hero treatments fragment the site
Home (violet-flat directory) → `/qualities/` (cyan radial-gradient + chip facets) → `/standards/` (gold-cream radial + rotated shine + stat pills). The site looks like three sites stitched together.

**Fix:** Standardise on the home hero pattern. Kill `_sass/_standards.scss:60-80` (gradients + shine) and the qualities-explorer radial hero. Use a single 2px category-colour rule for section signaling.
**Command:** `$impeccable quieter`, then `$impeccable polish`.

### [P1] Requirement detail pages have no parent breadcrumb and dump 70+ sibling-by-tag requirements
`/requirements/accessible-user-interface` has no breadcrumb to the parent quality, no back-link, and the "Directly Related Quality Requirements" list grows to 70+ when the requirement has multiple tags (e.g. `usable` × 41). Cognitive-load wall.

**Fix:** Breadcrumb `Qualities › Accessibility › Accessible User Interface` at top of `_layouts/requirements.html`. Promote "Related Qualities" to a quiet inline summary above the body. Cap siblings at 8–10 by tag-overlap rank; add "View all N in this dimension" link. Better: group siblings by quality, not by tag.
**Command:** `$impeccable distill`, then `$impeccable clarify`.

### [P1] Approaches don't surface where they're needed
Only 23 approaches exist. `/qualities/accessibility` lists Related Approaches — good. `_layouts/requirements.html` does not. `_layouts/page_standard.html` does not.

**Fix:** Add the `directly-related-approaches` include to `_layouts/requirements.html` and `_layouts/page_standard.html`. Drive by tag-intersection where direct links aren't authored.
**Command:** `$impeccable harden`.

### [P2] Hidden-on-hover panel on standards-explorer cards
`_sass/_standards.scss:493-511` translates a gold gradient overlay up on hover, hiding the description until you mouse-hunt.

**Fix:** Inline at reduced emphasis. Hover reserved for a subtle "see categories" cue only.
**Command:** `$impeccable clarify`.

### [P2] Secondary nav hides first-class entry points
`_data/navigation.yml` puts Dimensions and Aliases under the hamburger. Primary nav is loud uppercase + `letter-spacing: 0.08em` (`_sass/_header.scss:34`).

**Fix:** Promote Dimensions to primary nav; demote How-To. Tone letter-spacing to `~0.04em` or switch to small-caps. Normalise tag-chip border-radius across the three SCSS sites.
**Command:** `$impeccable layout`, then `$impeccable typeset`.

### [P3] Standards detail pages have no return path
`/standards/iso-25010` ends with "Related Qualities (48)" and footer. No "← All standards."

**Fix:** Trailing return link in `_layouts/page_standard.html`.
**Command:** `$impeccable polish`.

---

## Persona red flags

- **Alex (power-user architect, mid-workshop)**: no keyboard shortcut for search, no autocomplete, no recently-viewed, 70-item sibling list defeats time-pressed scanning.
- **Senior architect specifying for a tender** *(project-derived)*: no "copy markdown" on requirements, no anchor links per acceptance criterion, no aggregated `source:` references view per quality.
- **Jordan (first-timer, requirements engineer)**: no "start here" pointer on `/`; "How-To" label is cryptic; tag pages dump 60+ qualities + 40+ requirements with no curation.
- **Sam (a11y-dependent)**: skip link good; hidden-on-hover panel needs end-to-end NVDA verification; sticky header `z-index:1000` over `min-height: 3.85rem` with `scroll-margin-top: 0.8rem` is too tight on letter-jump anchors in `/qualities/`.

---

## Navigation walkthrough

**Task A: "Find a requirement on auditability"** — browse path dead-ends because auditability is a *quality*, not a *dimension*. Search path: ~11 chars + submit + page load + click. **2 clicks + 2 page loads.** The dimension/quality conflation is invisible until you're deep in the requirements index.

**Task B: "Find a standard for accessibility"** — `/` → Standards → scan 13 categories → "Accessibility (3)" → click. **2 clicks + 2 page loads.** 13-category top decision is heavy; the by-category vs by-explorer toggle is a navigation element promoted to the hero.

Both should be 0–1 click via autocomplete. They aren't.

---

## Provocative questions

1. What changes if the graph is the *only* navigation on `/`, with the directory demoted to a sidebar legend?
2. What's the single highest-frequency lookup task? If it's "I need a measurable acceptance criterion for X," then the homepage should be a search field + 3 example requirements.
3. A requirement is conceptually owned by one or two qualities. Why is it presented as a free-floating peer of 70 tag-siblings?
4. What's the case for keeping three hero designs? Handbooks resolve "different sections" with typography, not three palettes.
5. What would the site look like with the standards-hero shine, the radial gradients, the gradient chips, and the hover-reveal cards all deleted in one PR?

---

## Item (2) — autocomplete-search proposal

Branch: `autocomplete-search`

### Why it pays off

- Heuristic 7 (Flexibility & Efficiency) currently scores **1**. Autocomplete pulls the site into the editorial-handbook league (Notion docs, Stripe docs, Linear). Power users expect it.
- The infrastructure is already in place: `src/scripts/index-search.js` already emits a Lunr index of qualities / requirements / standards / approaches; `src/scripts/site/search.js` already runs Lunr in the browser on `/search/`. We're surfacing what's built, not building from scratch.
- The dropdown collapses both walkthrough tasks (auditability requirement; accessibility standard) from "2 clicks + 2 page loads" to "type + Enter".

### Shape

- Header markup change: rename `<input id="search">` → `id="site-search-input"` to avoid a duplicate ID with the `/search/` page. Add a results panel `<div class="site-search__panel" role="listbox">` directly below the input, plus a `<kbd>⌘K</kbd>` (or `Ctrl K`) hint inside the input affordance.
- New module `src/scripts/site/autocomplete.js`:
  - Lazy-loads `assets/data/search-index.json` and `assets/data/search-lookup.json` on first focus (cached for the session).
  - Debounced input (120ms).
  - Multi-term Lunr query mirroring the existing `/search/` behaviour: title boost 10, aliases 5, tags 3, body 1; trailing wildcard for prefix matches.
  - Groups results by `type` (quality / requirement / standard / approach), caps at 4 per group, 10 visible total. "Show all N results →" footer that submits the form to `/search/?q=...`.
  - Keyboard: `Up`/`Down` walk results across groups, `Enter` navigates the focused result, `Esc` closes, `Tab` dismisses, `Enter` with nothing focused submits the form (full-page fallback). ARIA `combobox` + `listbox` + `aria-activedescendant`.
  - Global shortcut: `Cmd/Ctrl+K` and `/` focus the input (skipped when target is itself an input/textarea/contenteditable).
- New stylesheet partial `_sass/components/_search-autocomplete.scss`, imported from `assets/css/style.scss`. Group labels carry the home directory category colours via the existing `--brand-blue` / `--reqs-background-color` / `--approaches-background-color` / `--brand-orange` tokens.
- Result row shape: `[type-pill] [title (mark-highlighted)] [path muted]`. Pill colours match home directory + a fourth colour for `standard`.
- The `/search/` page keeps working unchanged for the "see all results" fallback and for users without JS.

### Out of scope (follow-ups noted, not in this branch)

- Indexing tag pages (`_pages/tag-*.md`) as their own type. Today, tags surface inside aliases on quality entries, so prefix search on "secur" already lands on the Security quality.
- Recently-viewed / session history.
- Article entries — `_articles/` isn't yet in the index; add later.

### Acceptance

- Cmd/Ctrl+K and `/` focus the header input from any page (except while typing in a form field).
- Typing two characters shows a grouped dropdown within ~150ms.
- Up/Down/Enter/Esc behave correctly with screen-reader announcements.
- Enter with no row focused still submits to `/search/?q=...` (full-page fallback).
- WCAG 2.2 AA: focus ring on input, focus indication on the active row, contrast ≥ 4.5:1 on text in the dropdown.
- `npm run test:links:strict` still passes.
- No new permission prompts; no new heavy dependencies (Lunr already present).
