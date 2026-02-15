# Improve `/standards/` Landing Page (Proposals)

## Problem Summary

The current `/standards/` page has two usability issues:

1. The top table is dense and assumes readers know standard IDs/numbers.
2. The list below gives titles, but little "at-a-glance" meaning without opening detail pages.

Audience reality: readers have software-engineering background, but many do not know ISO/IEC numbers by heart.

## Design Goals

- Fast scanning: "What is this standard about?"
- Better orientation by domain/category.
- Minimal click cost for first understanding.
- Keep maintainability reasonable (no huge per-page manual work).
- Preserve existing detail pages as source of truth.

## Proposal A: Category Cards + Standard Chips (Lowest Implementation Cost)

### Concept

Replace the top table with a grid of category cards:

- Card title: category name + standard count.
- One-sentence category description.
- Chips/links for standards in that category (shortname).
- Hover on each chip shows 1-sentence tooltip for the standard.

### UX Example

- `Security (8)` card
- Subtitle: "Information/cyber security, governance and controls."
- Chips: `ISO/IEC 27001`, `NIST SP 800-53`, `CRA`, `IEC 62443`, ...
- Hover on `ISO/IEC 27001`: "Information security management system requirements."

### Data/Template Impact

- Keep current category sections below (or collapse them behind toggles).
- Add one short summary field per standard (e.g. `summary:` in front matter), or derive first sentence from intro.
- Use `title` attribute for simple tooltip, or a custom tooltip component.

### Pros

- Fast to implement.
- Big readability improvement vs. table.
- Little risk to existing structure.

### Cons

- Limited storytelling depth.
- Tooltips can be weak on touch devices unless click/focus fallback is added.

## Proposal B: Full Standard Card Grid with Hover/Focus "Quick View" (Best Balance)

### Concept

Make standards the primary unit: one card per standard, grouped by category sections.

Each card shows:

- Shortname (large)
- Human-readable title
- Category tags (existing style with tag icon)
- Optional "type" badge (`ISO`, `IEC`, `EU`, `NIST`, etc.)

On hover/focus:

- Show one-sentence explainer ("slugline") overlay or reveal block.
- Optional links: `Open details`, `Related qualities`.

### UX Example

- Card: `ISO/IEC 25010`
- Title: "Systems and Software Quality"
- Tags: `#general #usability`
- Hover text: "Defines the software product quality model and characteristics."

### Data/Template Impact

- Reuse `standard-item` include but evolve to card variant.
- Add front-matter field to each standard:
  - `summary:` one sentence, manually curated.
- Optional derived fallback: first paragraph if `summary` missing.

### Pros

- Most user-friendly and modern.
- Readers learn standards without leaving page.
- Scales well with growing standard catalog.

### Cons

- Needs moderate CSS/markup work.
- Requires curation of `summary` values for best quality.

## Proposal C: Faceted "Standards Explorer" (Most Powerful, Highest Effort)

### Concept

Turn page into an explorer with filters and search:

- Free-text search (`"security"`, `"medical"`, `"AI"`).
- Facets: category, body (`ISO`, `IEC`, `NIST`, `EU`, ...), domain (`sector`, `coding`, ...).
- Sort: alphabetical, most-linked qualities, recently updated.
- Results as compact cards with hover/focus explanation.

### UX Example

- Filter `#ai + #security` => ETSI EN 304 223, ISO/IEC 42001, ISO/IEC TR 24028 ...
- Hover gives one-liner and "why it matters".

### Data/Template Impact

- Add lightweight client-side JS index for standards.
- Add metadata fields (`summary`, `publisher`, optional `year`).
- Keep server-rendered fallback for no-JS.

### Pros

- Highest discoverability.
- Excellent for growth and maintenance.
- Supports different user intents quickly.

### Cons

- Highest implementation complexity.
- More moving parts (JS + accessibility testing).

## Category Detail Pages (Applicable to Any Proposal)

If needed, add detail pages for categories like:

- `/standards/category/security`
- `/standards/category/ai`
- `/standards/category/data`

Each category page can include:

- 2-3 sentence "why this category matters"
- listed standards with one-line summaries
- top related qualities

This is useful for onboarding and training contexts.

## Recommended Path

1. Start with **Proposal B** (best usability/value ratio).
2. Keep a lightweight version of Proposal A behavior for category overview at top.
3. Add category detail pages incrementally only for high-traffic categories.

## Important Content/IA Fixes to Include

- Add missing `governance` category to `/standards/` landing (currently present in standards metadata but not shown in the page category includes).
- Standardize one-line summaries via a front-matter field (`summary`) instead of relying on ad-hoc first paragraphs.
- Ensure hover info is also accessible via keyboard focus and click/tap.
