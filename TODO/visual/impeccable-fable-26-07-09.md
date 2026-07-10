# Impeccable Critique — quality.arc42.org

**Date:** 2026-07-09 · **Model:** Fable 5 · **Command:** `/impeccable critique` (site-wide, homepage anchor)
**Method:** dual-agent (A: design-review subagent · B: deterministic-detector subagent). Browser overlay/screenshot evidence unavailable (Chrome extension not connected); both assessments used rendered-HTML capture of 11 pages plus source and computed-contrast analysis. Detector CLI ran successfully.
**Snapshot:** `.impeccable/critique/2026-07-09T19-29-20Z__pages-01-home-md.md` (first run for this target, no trend yet).

---

## Design Health Score — 31/40 (Good)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | aria-live counters and `aria-pressed` facets are solid; but facet counts never update after filtering, and zero results leaves a blank grid |
| 2 | Match System / Real World | 3 | Domain language excellent; marred by a button literally labeled "reset-filters", non-parallel "By explorer", "Three Axis of Quality" |
| 3 | User Control and Freedom | 3 | Double-Esc search, reset, escape hatches; but explorer filter state isn't in the URL (the full graph *does* support URL filters — inconsistent) |
| 4 | Consistency and Standards | 3 | Hero/chip/rail system strong; but two icon systems coexist (Font Awesome vs inline SVG), inline styles on 404 & /search/ |
| 5 | Error Prevention | 2 | Standards facets AND across near-disjoint categories → guaranteed dead-end combos; nothing dims or prevents them |
| 6 | Recognition Rather Than Recall | 4 | Color legend, honest counts, alias search, explained sibling links — genuinely excellent |
| 7 | Flexibility and Efficiency | 4 | `/` + Cmd/Ctrl+K, arrow keys, letter jump, real no-JS fallbacks; capped by the mouse-only graph |
| 8 | Aesthetic and Minimalist Design | 4 | Editorial, dense, calm; homepage has zero filler; 404 off-brand |
| 9 | Error Recovery | 2 | 404: duplicate H1, off-palette pink, mouseover-only mailto unusable by keyboard/touch/screen reader; explorer zero-state has no recovery hint |
| 10 | Help and Documentation | 3 | How-To holds nav position 1, per-section intros; copy errors, no AND/OR explanation on facets |
| **Total** | | **31/40** | **Good — solid foundation, address weak areas** |

## Anti-Patterns Verdict

**Not AI slop — this reads as deliberately designed.** The full-bleed violet homepage with oldstyle-figure serif counts is a move no template produces; the eyebrow system is a taxonomy (one kicker per page), not reflex scaffolding; rails are semantic (the Legend Rule), not decorative side-stripes; zero gradient text, glassmorphism, or hero-metric rows (grep-verified).

**Deterministic scan: 93 findings — heavily concentrated.** 74 are a *single* template literal (`style="color: #999"` in `_includes/standard-item.liquid:16`) repeated per standard card — one real issue, not 74. The qualities A–Z explorer's embedded style block accounts for 16 more (8 off-scale font sizes, 5 undocumented colors, off-scale radius, flat-hierarchy warning) — its local `--qx-*` tokens drift from DESIGN.md. The homepage and requirement detail scanned **clean (0 findings)**.

**Detector false positives:** "numbered section markers" on /qualities/ matched count labels ("related: 10 · standards: 16"), not scaffolding. Most of the 37 em-dashes on /standards/ are ISO's own nomenclature ("…Engineering — Software Life Cycle Processes"). The 7 on /qualities/reliability and 14 on /approaches/tolerant-reader are genuinely authored.

**Where both assessments converge:** the newer explorer surfaces were built *beside* the design system rather than inside it.

## Overall Impression

A committed, self-documenting editorial system that mostly practices what it preaches — the core lookup journey (search → quality → related standards) is genuinely excellent and fast. The weakness is uneven enforcement at the edges: the standards explorer, the qualities A–Z explorer, and the 404 page drift from the system; the facet logic dead-ends silently; and the homepage "legend" is missing its fourth color. Biggest opportunity: bring the standards surfaces up to the standard the rest of the site sets.

## What's Working

1. **Explainable cross-linking** — "Related requirements — top 8 by overlap · shares 2 qualities · via #secure" turns a link dump into visible editorial judgment, with a "View all 18" escape hatch.
2. **Search built for the stated job** — deterministic prefix ranking deliberately chosen over Lunr stemming (documented in code comments), qualities ranked first for workshop lookup, full keyboard path, live-region status, real no-JS fallbacks.
3. **A committed identity that resists slop** — the named rules (Legend/Wash/Overlay/Two-Voices) are visible in the tokens, and computed contrast clears AA everywhere checked (gold-on-gold 7.24:1, cream-on-violet 5.79:1, muted-on-paper 5.04:1).

## Priority Issues

1. **[P1] The 404 page is broken and off-brand.** Duplicate H1, inline pink `#fe5a83` at 3.00:1, eyebrow mislabels it "Article", and the email link de-obfuscates only `onmouseover` — inoperable by keyboard, touch, and screen reader, on a site with a WCAG badge in its footer.
   *Fix:* one H1, palette colors, plain contact link, add the search box. → `/impeccable harden`
2. **[P1] Run-on generated summaries across standards surfaces.** `excerpt | strip_html | strip_newlines` (`_includes/standards-category-card.liquid:16` and the explorer card build) concatenates heading+paragraph with no separator — "(CRA)With the CRA…" on every explorer card and chip tooltip (~45 cards). User-visible mangled text is the site's one strong AI-generated tell.
   *Fix:* require `summary:` frontmatter, or replace `</h1>` with `. ` before stripping. → `/impeccable clarify`
3. **[P1] Standards explorer facets create silent dead ends.** AND-combination across near-disjoint categories (`src/explorers/standards.js:50`) makes #AI + #Security ≈ guaranteed empty; the grid goes blank, counts never update, `role="toolbar"` promises arrow keys that don't exist, reset button labeled "reset-filters".
   *Fix:* OR within group / AND across groups, empty state with reset CTA, live counts, humanize the label, drop the toolbar role. → `/impeccable harden`
4. **[P2] The homepage legend is missing Standard Gold.** The directory shows Qualities/Requirements/Approaches rails — Standards, the *largest* node type in the graph, has no row. The system's own doctrine: "The homepage is the legend."
   *Fix:* fourth row, gold rail, "45 standards, 13 categories". → `/impeccable polish`
5. **[P2] Explorer surfaces drift from the design system.** `#999` literal ×74, `--qx-*` off-scale sizes/colors, H1→H3 heading skips on both standards views, 45 decorative `tabindex="0"` stops on explorer cards.
   *Fix:* map literals to tokens (or document them), fix heading levels, remove card tabindex. → `/impeccable polish`

## Persona Red Flags

**Alex (impatient power user):** served well — search-to-page in under 3 s. Flags: 24 related standards on /qualities/reliability with zero prioritization; explorer filters not bookmarkable/shareable via URL; the kbd hint teaches `/` but never Cmd+K.

**Sam (accessibility-dependent):** strong foundation (skip link, landmarks, combobox pattern, focus restoration, two-tone rings). Flags: the 404 mailto is unusable; heading skips on standards views; `role="toolbar"` without roving tabindex; the D3 graph — the site's signature — has no role, title, or keyboard access. Parallel lists mitigate, but the signature feature is invisible to him.

**Petra (workshop trainer on a beamer):** finds and shows a quality in <10 s. Flags: content-page H1 caps at 1.95rem/weight 500 — modest at projection distance (and DESIGN.md promises 3.15rem Display for content H1s: spec and component contradict); graph leaf labels are fixed at 10px (`src/graphs/GraphRenderer.js:177`) — illegible projected; standards chip descriptions are hover-only tooltips, truncated mid-word.

**Open design ruling (needs an owner decision, not a fix):** are the 10px graph labels and the 1.95rem hero H1 accepted density trade-offs, or bugs against the beamer persona? Either fix for projection, or record as intentional and reconcile DESIGN.md's Display spec.

## Minor Observations (backlog)

- Eyebrow "Article" leaks onto utility pages (/search/, 404); utility pages need a neutral register.
- Two icon vocabularies (Font Awesome vs inline stroke SVG) for the same job in section headings.
- 404 uses `#1f5f84` where the token is `#1f5f82` — one-character typo of the token.
- Header collapses to stacked layout already at 1180px; 1024–1180px laptops get the tall header.
- /qualities/reliability body is three quotations + ~60 flat outbound links — a switchboard, not a definition; consider grouping the 27+24 link lists.
- Em-dash density in authored copy (7–14/page) is itself an AI-voice tell worth an editorial pass.
- The tolerant-reader SVG alt text (full narrative description) is exemplary — name it as the pattern.
- Repeated inline SVG icon markup per `<li>` bloats pages (qualities index ≈ 253 KB); a `<use>` sprite would halve it.
- Dev og: metadata renders `http://0.0.0.0:4000` — verify prod config.
- Requirement source line "created with help from ChatGPT by using the prompt…" is honest but reads as a shrug on a precision-selling page; consider reframing as reviewed provenance.

## Questions to Consider

1. If the homepage is "the legend," why is Standard Gold — the biggest node type in the graph — absent from it? Is Standards a first-class territory or an appendix?
2. Is a quality page a *definition* or a *switchboard* — and which one does Petra project to a room?
3. Two parallel presentations of 45 standards ("By category" and "By explorer") must stay consistent forever. Would one view with honest facets and a working empty state beat maintaining both?
