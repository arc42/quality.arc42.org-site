# Accessibility — working contract and scope decisions

This document is the single source of truth for accessibility decisions on the arc42 Quality Model site. It captures (a) the working contract we hold ourselves to, (b) the routine review checklist, and (c) scope decisions where we have *deliberately* chosen not to pursue a higher bar. Audits should consult this file before re-flagging items listed under "Deliberate scope decisions."

## Working contract

- **Target: WCAG 2.2 Level AA across the site.** This is the legal/professional bar and the bar this project promises.
- **Body typography uses Atkinson Hyperlegible Next** (commissioned by the Braille Institute for low-vision disambiguation) because the audience itself includes architects who design for accessibility. Failing visibly is a credibility issue, not just a compliance one.
- **AAA is not the project target.** Specific AAA criteria may be met opportunistically (e.g., contrast on the violet header is 8.5:1) but the project does not commit to AAA across the board.

## Routine review checklist

Run these before merging UI changes:

- `make wcag-test` — automated WCAG scan via axe-core / Playwright.
- `make lighthouse-test` — performance + accessibility audit per page.
- Manual: tab through new UI from a fresh page load; the skip-link appears top-left and reaches `<main>`.
- Manual: every focusable element has a visible focus ring (use `--focus-ring` or `--focus-ring-on-violet` tokens in `_sass/base/_variables.scss`).
- Manual: every new interactive control has either visible text or `aria-label`.
- Manual: heading hierarchy on the new page goes H1 → H2 → H3 with no skipped levels.

## Deliberate scope decisions

The items below have been reviewed and *intentionally not implemented*. They are not defects; they are scope calls. Do not re-flag in audits, and do not implement without explicit approval.

### Graph keyboard accessibility — out of scope

**Scope:** the D3 force-directed graph in `src/graphs/GraphRenderer.js`.

**Decision:** the graph is treated as a supplementary visualization for accessibility scoring. It does not implement `tabindex`, arrow-key traversal between nodes, or per-node screen-reader announcements.

**Rationale:** the full content (qualities, requirements, standards, approaches) is reachable via the standard top-nav, the index pages, and the search field. The graph adds visual context for sighted mouse/trackpad users but is not the primary access path. Building keyboard accessibility across ~400 force-positioned nodes would require non-trivial design decisions (tab order, Enter behaviour, traversal model, SR announcement strategy) that aren't justified by current audience needs.

**Reopen criteria:** measurable demand from keyboard or AT users, or a strategic shift to make the graph the primary navigation surface. Run `$impeccable shape` first to settle the design questions before implementation.

### Search input touch target (~40 px) — out of scope

**Scope:** the search input and menu-toggle button in `_sass/_header.scss` (search input height `2.35rem` ≈ 40 CSS px on the project's 17 px base).

**Decision:** we do not raise these controls to the 44 × 44 CSS px target recommended by WCAG 2.5.5 (Level AAA) and the Apple HIG.

**Rationale:** WCAG 2.2 AA's minimum (2.5.8) is 24 × 24 CSS px — ~40 px passes comfortably. The 44 px guideline is AAA and best-practice for *primary thumb-on-phone use*. The site's audience per PRODUCT.md is software architects, consultants, and trainers during design reviews — overwhelmingly desktop with mouse or trackpad, where 40 px and 44 px are indistinguishable. Bumping the input alone would visually mismatch the adjacent menu toggle; bumping both would make the sticky violet header ~6 px taller and shift the editorial-handbook proportions toward "consumer app."

**Reopen criteria:** measurable mobile traffic share, or a project decision to formally commit to WCAG 2.2 AAA across the site.

## Pointers

- Brand and audience context: `PRODUCT.md` § Design Context.
- Build, dev, and test commands: `AGENTS.md`.
- Token definitions (focus rings, colors, type scale): `_sass/base/_variables.scss`.
