# WCAG Contrast Proposals (Keep Current Brand Palette)

Context: based on current `make wcag-test` scan (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`) on key pages.

## 1) What currently fails (color-wise)

Most repeated color-contrast failures are from a few pairs:

- Header text on green hero: `#deefb7` on `#5fb49c` (ratio `2.02`, needs `>=3.0` for large text).
- Quality tag text on bright cyan chips: `#1675b9` on `#00b8f5` (ratio `2.14`, needs `>=4.5`).
- Synonym badge text: `#00b8f5` on `#c7f0fd` (ratio `1.89`, needs `>=4.5`).
- Secondary gray text on white is too light:
  - `#858585` on white (`3.69`),
  - `#9c9c9c` on white (`2.75`),
  - `#8a8986` on white (`3.50`),
  - `#6f90a5` on white (`3.38`),
  - `#777777` on white (`4.48`, just below threshold).

Page-level impact in the current key-page scan:

- `/standards/`: highest impact (`color-contrast` dominates, especially category/meta labels).
- `/requirements/`: lower impact, but still has contrast issues from shared header/meta styling.
- `/approaches/`: currently not in the scanned route set; add it next to validate directly.

So we can keep the core hues. The fix is mainly luminance + better token separation for small text.

---

## Proposal A (Recommended): Text-First Hardening, Keep All Main Backgrounds

Goal: preserve existing background colors (`quality/requirements/standards/approaches`) and make text colors WCAG-safe.

### Token updates

- Header title/description color:
  - from `#deefb7` to `#123f4e` (ratio on `#5fb49c`: `4.60`).
- Quality-on-cyan text:
  - use `#003366` on `#00b8f5` (ratio `5.51`).
- Synonym badge text:
  - from `#00b8f5` to `#005987` on `#c7f0fd` (ratio `6.23`).
- Requirements tokens (keep hue, split by use):
  - strong: `bg #ffb3b3 / text #8b0000` (ratio `5.89`)
  - soft: `bg #ffe0e0 / text #8b0000` (ratio `8.10`)
- Standards tokens (keep hue, split by use):
  - strong: `bg #ffc95c / text #2c3e50` (ratio `7.20`)
  - soft: `bg #ffefc8 / text #2c3e50` (ratio `9.64`)
- Approaches tokens (keep hue, split by use):
  - strong: `bg #92ef80 / text #1b5e20` (ratio `5.58`)
  - soft: `bg #d9f7d3 / text #1b5e20` (ratio `6.82`)
- Neutral text ramp on white:
  - `--text-muted-1: #6f6f6f` (for blockquotes, ratio `5.02`),
  - `--text-muted-2: #6b6b6b` (footer/meta, ratio `5.33`),
  - `--text-muted-3: #5e5e5e` (icons/secondary links, ratio `6.48`),
  - `--text-muted-blue: #4d6f84` (dimension counts, ratio `5.35`).

### Typical UI mappings

- Footer text (`.site-footer`) -> `--text-muted-2`.
- Return-to-top links: stop using 50% opacity for text; use fixed muted color (`--text-muted-3`).
- Standards category labels (`.category-name`) -> `--text-muted-2`.
- Blockquotes -> `--text-muted-1`.
- Home dimension counts -> `--text-muted-blue`.
- Requirements:
  - keep section headers/buttons on `strong` tokens,
  - move badges, helper labels, small counters to `soft` tokens.
- Standards:
  - keep section banners/major chips on `strong`,
  - move `.category-name` and small metadata to `soft` + muted text.
- Approaches:
  - keep hero/section bars on `strong`,
  - use `soft` for small badges/tags/chips.

### Why this is best

- Lowest visual churn.
- Preserves your current palette identity.
- Should remove most contrast failures without redesigning components.

---

## Proposal B: Keep Light Header Text, Darken Only Header Surface + Split Chip Surfaces

Goal: keep the current “light text on green” aesthetic in the top header while fixing ratios.

### Token updates

- Header background only:
  - from `#5fb49c` to `#357360`.
  - keep header text `#deefb7` (new ratio `4.54`).
- Introduce chip-specific soft surfaces for small text:
  - `--quality-chip-bg: #dff4fd`, `--quality-chip-text: #0f6ba8` (ratio `5.01`).
  - `--synonym-chip-bg: #c7f0fd`, `--synonym-chip-text: #005987` (ratio `6.23`).
- Mirror the same pattern for all other types:
  - `--req-chip-bg: #ffe0e0`, `--req-chip-text: #8b0000`.
  - `--std-chip-bg: #ffefc8`, `--std-chip-text: #2c3e50`.
  - `--approach-chip-bg: #d9f7d3`, `--approach-chip-text: #1b5e20`.
- Keep existing vivid fills for large panels/headers.
- Same neutral text ramp as in Proposal A.

### Why this is useful

- Preserves the current top-brand look almost exactly.
- Improves readability of small labels by using a dedicated chip pair.
- Slightly more CSS complexity than Proposal A (surface split by component size).

---

## Proposal C: Two-Level Semantic Palette (Strong vs Soft) for All Domains

Goal: future-proof schema as pages grow, while staying visually consistent.

### Add semantic pairs per domain

- Quality:
  - strong: `bg #00b8f5 / text #003366`
  - soft: `bg #dff4fd / text #0f6ba8`
- Requirement:
  - strong: `bg #ffb3b3 / text #8b0000`
  - soft: `bg #ffe0e0 / text #8b0000`
- Standard:
  - strong: `bg #ffc95c / text #2c3e50`
  - soft: `bg #ffefc8 / text #2c3e50`
- Approach:
  - strong: `bg #92ef80 / text #1b5e20`
  - soft: `bg #d9f7d3 / text #1b5e20`

Rule:
- Large areas (headers, section banners) use `*-strong-*` tokens.
- Small text UI (chips, badges, counters, metadata) use `*-soft-*` tokens.

### Why this is useful

- Most maintainable long-term schema.
- Prevents repeated “small text on saturated background” regressions.
- Slightly bigger refactor than A/B but cleaner architecture.

---

## Recommendation

Start with **Proposal A** first (quickest and safest), then optionally evolve to **Proposal C** once you want stricter token governance.

If you want, I can next provide a minimal patch plan (exact files/selectors) to implement Proposal A in one small PR.
