# Design Critique: quality.arc42.org

Evaluated against the design context: **precise, pragmatic, trustworthy** for software architects and consultants.

---

## Typography: C+

**What works:** Body text at 16px with 1.5 line-height is readable. Code font choice (Consolas/Monaco) is solid.

**Problems:**

- **Helvetica/Arial is invisible.** For a site that wants to feel authoritative and designed, the system default sans-serif is the non-choice. It says "nobody thought about this." A reference-quality site about *quality* should have typography that demonstrates care. This is the single biggest gap between the site's content ambition and its visual execution.

- **Flat type hierarchy.** `h1: 2.3em`, `h2: 1.8em` — that's a ratio of ~1.28, barely distinguishable at a glance. The header uses `font-size: 2.7em` for the site header, which creates an awkward jump. The heading scale needs wider contrast between levels.

- **No font pairing.** One family (Helvetica) does everything — headings, body, navigation, stats. A distinctive display face for headings paired with a clean body font would immediately elevate the entire site.

- **Line length uncapped on content pages.** The `.site-content` at 70% width on a 1200px max container gives ~840px for text — well past the 75ch comfort zone. Body paragraphs need a `max-width`.

---

## Color & Palette: B-

**What works:** The palette has genuine identity. Teal header (#357360), blue accents (#00b8f5), purple contrast (#682d63), warm orange (#ffad80) — these are real choices, not defaults. The color-coded node types in the graph (blue qualities, pink requirements, yellow standards) create a functional visual language.

**Problems:**

- **Pure white background (#fff) and near-black text (#383838).** These miss the principle of tinted neutrals. The background should carry a whisper of the brand teal or blue. The text should be slightly warmer or cooler than raw dark gray.

- **Color inconsistency across pages.** The aliases page defines `--aliases-blue`, the home page defines `--home-blue`, the splash page defines its own stat colors — all slightly different blues. There's no shared token system. Five blues that are almost-but-not-quite the same reads as careless, not intentional.

- **The header green (#357360) feels disconnected** from the content area's blue (#00b8f5) palette. The brand color `$brand-color: #5fb49c` (a minty teal) appears in variables but barely shows up in the actual UI. The site can't decide if it's green or blue.

- **Gray text on light backgrounds.** Several places use raw grays (#6f6f6f, #6b6b6b, #49697f) that wash out rather than using tinted versions of the background color.

---

## Layout & Space: B-

**What works:** The 70/30 content/sidebar split is a classic reference layout. The grid on the homepage (`repeat(auto-fit, minmax(220px, 1fr))`) is well-executed. The dimensions table is clean and scannable.

**Problems:**

- **Uniform spacing.** `$margin: 50px` is used everywhere — article wrapper margin, sidebar padding, footer margin. Everything breathes the same amount. There's no rhythm. Headings, section breaks, and content blocks all get identical treatment.

- **The sidebar is structurally dated.** Float-based layout with `clearfix` hacks. More importantly, the sidebar is a flat list of links with no visual hierarchy or grouping. For a site with 220+ qualities, 140+ requirements, and 29 standards, the navigation needs to work harder.

- **`$side-padding: 10px` is too tight.** Content butts against the container edges with only 10px of breathing room. On a reference site consumed on desktop monitors, this reads as cramped.

- **Homepage has too many visual containers.** The hero section, mode grid, stats row, graph, and dimensions table each introduce their own bordered/rounded container. Cards inside the hero, pills inside the stats, tags inside the table — it's nesting upon nesting.

---

## Visual Details: C+

**Problems (most impactful first):**

- **`border-left: 4px solid` on synonym cards** (`_aliases.scss:91`) and **`border-left: 4px solid #00b8f5` on the "Also known as" callout** (`_content.scss:349`). These are the classic AI-slop side-stripe pattern. They appear on two of the most visible components on quality detail pages.

- **`border-left: 5px solid #ddd` on blockquotes** (`_content.scss:33`). Same pattern, just in gray.

- **Rounded pill shapes everywhere.** The stat badges, filter chips, synonym items, quick filters, dimension tags, and category links all use `border-radius: 999px`. When every interactive element is a pill, none of them stand out.

- **Excessive `translateY(-1px)` hover effects.** Nearly every interactive element — stat pills, mode cards, dimension tags, category links — uses the same 1-2px upward lift on hover. It's the same micro-interaction repeated 8+ times on the homepage alone. When everything lifts, nothing lifts.

- **The radial gradient backgrounds** on hero sections (`_homenew.scss`, `_aliases.scss`) are decorative without being distinctive. Two overlapping radial gradients with low-opacity brand colors is a common AI-generated pattern.

---

## Interaction & Motion: B

**What works:** The graph interaction is genuinely excellent — force-directed layout, zoom/pan, double-click navigation. This IS the memorable feature.

**Problems:**

- **Every transition is the same.** `transition: transform 0.15s ease, box-shadow 0.15s ease` appears on cards, pills, buttons, and links. Uniform timing/easing makes the UI feel mechanical rather than responsive.

- **The mobile graph bottom sheet** is well-structured but heavy — `box-shadow: 0 12px 36px rgba(0,0,0,0.2)` with `transform: translateY` transitions. The implementation is thorough, but the sheet itself packs too many controls without enough grouping.

- **The sidebar navigation toggle** (hamburger → aside) uses a binary show/hide with no transition. On a site that otherwise invests in subtle motion, this feels abrupt.

---

## Responsive: B

**What works:** The mobile graph page gets serious attention — bottom sheet controls, touch-friendly filter chips, responsive graph container using `100dvh`. The dimensions table wraps cleanly.

**Problems:**

- **The breakpoint at 800px is a cliff.** The sidebar goes from 30% width to 100% width hidden behind a toggle. There's no intermediate state for tablets.

- **The header at mobile widths** centers everything and drops the avatar, but the text sizing (`2.7em` base) creates a very large header that pushes content down significantly.

---

## UX Writing: B+

**What works:** The homepage copy is strong — "Quality requirements are often broad and hard to operationalize" is a precise problem statement. "Explore Quality Three Ways" is clear. The dimension descriptions are concise and accurate.

**Problems:**

- **"small-graph" and "full-graph" as navigation labels** use developer nomenclature, not user language. "Overview" and "Full Map" would communicate the same thing without the hyphenated-technical-term feel.

- **"Directly Related Quality Requirements"** as a section heading on requirement pages is wordy. "Related Requirements" suffices — the "directly" and "quality" are implied by context.

---

## Summary: Strongest and Weakest

**Strongest asset:** The graph visualization system. It's genuinely distinctive, well-implemented, and the right hero for this site. The color-coded node types create a visual language that works.

**Weakest link:** Typography. Helvetica/Arial with a flat scale on a site about *quality* undermines the brand promise. This is the highest-impact, lowest-effort improvement available.

**Second priority:** Eliminate the duplicated color tokens and establish a single set of design tokens. Five different blues across five different SCSS files is the source of most visual inconsistency.

**Third priority:** Remove the side-stripe borders and uniform pill shapes. Replace with patterns that don't immediately read as template-generated.
