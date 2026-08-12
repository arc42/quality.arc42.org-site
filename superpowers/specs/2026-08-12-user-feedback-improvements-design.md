# User-Feedback Improvements — Design

**Date:** 2026-08-12
**Status:** Approved (brainstorming session)
**Source:** Direct user feedback on quality.arc42.org (five reported issues). Decision: no new site-wide critique; design fixes for the reported issues directly.

## Problem Statement

Users reported five concrete issues:

1. The "Open graph" control on the homepage sits too far from the intro graph itself.
2. Clicks on intro-graph nodes do not navigate anywhere (navigation is double-click only).
3. The "how-to" metamodel image is a static `<img>` — no hover explanations, no links, although the SVG source exists.
4. Searching for "quality" via ⌘K returns zero results — the site has no findable definition of its own core concept.
5. On the full-graph page, the filter panel gets partially or fully clipped at higher browser zoom (reported: Firefox at 120% hid the requirements/standards/approaches switches entirely).

## Grounding (verified in code)

- `_pages/01-home.md:87` — "Open graph" link lives in the section head, visually distant from `#q-graph-container`.
- `src/graphs/HomeGraph.js:95` — node navigation is bound to **double-click**; single click only toggles highlight. A small `fa-expand` icon button (`addFullGraphToggle`, line 64) already sits inside the graph container.
- `_pages/05-how-to-use-this-site.md:71` — metamodel image embedded as plain markdown `<img>` of `images/how2use/how-to-use-this-site.svg` (OmniGraffle export; `.graffle` master exists).
- `_pages/search-data.json` — the search index covers only the four collections (qualities, requirements, standards, approaches). No pages, no articles, no definition of "quality".
- `_articles/01-challenge-with-quality.md` — already discusses definitions of quality (SEBok/ISO citation), but is not indexed and has no crisp definition block.
- `_sass/_mobile-graph.scss:157–159` — desktop sidebar: `height: calc(100dvh - 230px)` + `overflow: hidden`. At 120% zoom, content outgrows the fixed box and is silently clipped. This is a WCAG 1.4.4 (Resize Text) / 1.4.10 (Reflow) failure — the site targets WCAG 2.2 AA.

## Design

### A. Homepage intro graph (items 1 + 2)

Make nodes single-click links; move the "Open graph" affordance onto the graph.

- `HomeGraph.js`: rebind navigation from double-click to **single click** on content nodes; hover keeps the highlight role. Cursor becomes `pointer` over nodes.
- Clicking the background or the root node opens `/full-quality-graph`.
- Remove the distant "Open graph" text link from the section head in `01-home.md`; promote the existing in-container `fa-expand` icon button to a visible, labeled button ("Open full graph →") overlaid in the top-right corner of the graph container, where the icon button sits today. One control, not two.
- Accepted trade-off: no click-to-pin highlighting on the homepage (hover-only). On touch devices, tap = navigate. Right trade for an intro graph whose job is to lead people into the content.

### B. How-to metamodel image (item 3)

Inline the SVG; add links and hover explanations.

- Clean up the OmniGraffle-exported SVG (ids/classes, strip DTD cruft) into a new include under `_includes/svg/`; replace the markdown `<img>` in `05-how-to-use-this-site.md` with the include.
- Wrap each shape group in `<a href>` to its matching section page (qualities, requirements, standards, approaches, dimensions/tags).
- Each linked group gets an SVG `<title>` (native hover tooltip) and `aria-label`; add `:hover` / `:focus-visible` styles (slight lift + outline in existing accent colors) so interactivity is discoverable.
- The `.graffle` file remains the master for geometry only; the include is the styled/linked derivative (one-time manual pass, documented in a comment in the include).

### C. Definition of "quality" + search coverage (item 4)

Extend the search index; sharpen the existing definition. No fake quality entry, no graph node.

- Extend `_pages/search-data.json` to also index `site.articles` and a curated set of `_pages`: `05-how-to-use-this-site`, `10-quality-dimensions`, `20-quality-characteristics`, `30-quality-requirements`, `40-quality-standards`, `70-solution-approaches`, `80-background-on-quality`. (Utility pages — imprint, reports, redirects — stay unindexed.)
- Add a crisp, quotable "What is quality?" definition block near the top of `_articles/01-challenge-with-quality.md` (arc42's working definition + ISO citation), so the top ⌘K hit for "quality" actually answers the question.
- Add search keywords ("quality definition", "what is quality") to that article's indexed entry (aka-style field or equivalent in the index template).

### D. Full-graph filter panel reflow (item 5)

Fix the accessibility bug; light hardening; **no redesign**.

- Replace `overflow: hidden` with `overflow-y: auto` on the desktop sidebar; replace the magic-number `calc(100dvh - 230px)` with a flex-column layout so the filter/legend area scrolls within available height (the code comment itself admits the constant breaks when the header changes).
- Add a **height-based** media query (around `max-height: 700px`) that switches to the compact mobile-sheet behavior earlier, so reduced effective viewports (e.g. 120% zoom on Firefox) get the collapsible panel instead of clipped switches.
- Keep the current panel design.

## Testing

- **D:** Playwright test (repo already has `tests/`) asserting all filter switches are reachable/visible at 120% and 150% zoom equivalents (reduced viewport heights) on the full-graph page.
- **A:** Playwright test: single click on a homepage graph node navigates to the node's page; the labeled "Open full graph" control is present inside/adjacent to the graph container.
- **B:** Link check on the inline SVG anchors (validate-links or a small test); manual hover/focus verification; axe/WCAG pass on the how-to page.
- **C:** Test that the built search index contains the article entry and that a search for "quality" returns ≥1 result; run existing link validator.
- All development and testing via Docker/make (no local Ruby), per project conventions.

## Error handling / graceful degradation

- Graph pages already have `<noscript>` fallbacks; unchanged.
- Inline SVG links are plain `<a>` elements — work without JS.
- Search-index growth is trivial (a few dozen entries); no pagination or perf concern.

## Out of scope

- Any redesign of the filter panel's visual layout.
- A site-wide critique/audit (may happen separately later).
- Adding "quality" as a content entry or graph node.

## Order of work

D (accessibility bug) → A (quick wins) → C → B. Each item is independently shippable; branch/commit granularity decided at planning time.
