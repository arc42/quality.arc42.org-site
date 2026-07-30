---
name: quality.arc42.org
description: The arc42 quality model — an annotated atlas of software qualities, requirements, standards, and approaches
colors:
  arc42-violet: "#682d63"
  violet-deep: "#52214f"
  violet-soft: "#e9d9e8"
  violet-faint: "#f5eef4"
  ink: "#241823"
  muted: "#746671"
  text-gray: "#383838"
  cream: "#fbf6ef"
  paper: "#f8f7f2"
  page-white: "#ffffff"
  quality-blue: "#00b8f5"
  quality-blue-dark: "#0077ad"
  quality-blue-text: "#003366"
  quality-blue-accent-dark: "#1f5f82"
  requirement-rose: "#ffb3b3"
  requirement-rose-soft: "#ffe0e0"
  requirement-text: "#8b0000"
  standard-gold: "#ffc95c"
  standard-gold-soft: "#ffefc8"
  standard-text: "#2c3e50"
  approach-green: "#92ef80"
  approach-green-soft: "#d9f7d3"
  approach-text: "#1b5e20"
  arc42-teal: "#5fb49c"
  dimension-navy: "#1a3a5c"
typography:
  display:
    fontFamily: "Libre Caslon Text, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "3.15rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.005em"
  headline:
    fontFamily: "Libre Caslon Text, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "2.37rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Libre Caslon Text, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "1.78rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Atkinson Hyperlegible Next, Atkinson Hyperlegible, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Atkinson Hyperlegible Next, Atkinson Hyperlegible, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.08em"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace"
    fontSize: "0.9em"
rounded:
  xs: "4px"
  sm: "8px"
  md: "10px"
  lg: "14px"
  pill: "999px"
components:
  tag-chip:
    textColor: "{colors.quality-blue-text}"
    rounded: "{rounded.pill}"
    padding: "0.22rem 0.7rem"
  hero-chip:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.12rem 0.55rem"
  facet-pill:
    backgroundColor: "{colors.page-white}"
    textColor: "#655c4a"
    rounded: "{rounded.pill}"
    padding: "0.23rem 0.56rem"
  facet-pill-active:
    backgroundColor: "{colors.standard-gold}"
    textColor: "#4a3a0a"
    rounded: "{rounded.pill}"
    padding: "0.23rem 0.56rem"
  section-hero:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.4rem 0.7rem 2rem"
  input:
    backgroundColor: "{colors.page-white}"
    textColor: "{colors.text-gray}"
    rounded: "0.3em"
    padding: "0.5em 0.75em"
---

# Design System: quality.arc42.org

## 1. Overview

**Creative North Star: "The Annotated Atlas"**

quality.arc42.org is a reference atlas of software quality. The interactive force-directed graph is the map; the homepage rails are the legend; every content page is a labeled plate. Each of the four content types owns exactly one identity color — Quality Blue, Requirement Rose, Standard Gold, Approach Green — and that color travels with its type everywhere: as a graph node fill, as a hero rail, as a chip wash. A reader who has seen the homepage can identify any page's territory at a glance, the way a map reader uses a legend.

The system is a working document, not a showpiece. Surfaces are paper-flat; color arrives as thin washes and solid rails, never as saturated fills (a deliberate 2026 refactor removed the old full-saturation pills and panels). Typography does the heavy lifting: a pre-trend English reference serif (Libre Caslon Text) announces, and a low-vision-optimized sans (Atkinson Hyperlegible Next) carries the dense body content that architects scan under time pressure. The register is product: design serves lookup, comprehension, and navigation. It explicitly rejects the generic SaaS landing page, the startup pitch deck, and the AI-generated dashboard — and it should never feel like a blog or a wiki.

**Key Characteristics:**
- Semantic color: every hue means a content type; decoration-only color is prohibited
- Paper-flat surfaces with color-mix washes (8–14%) and solid left rails as section identity
- Serif/sans two-voice typography on a 1.333 modular scale, 17px body base
- Light-only theme (`color-scheme: light`), WCAG 2.2 AA non-negotiable
- Motion is micro and stateful: 120–250ms ease-out, full `prefers-reduced-motion` coverage
- Professional density: dense, scannable, tabular-nums for data, no over-spacing

## 2. Colors

A domain-functional palette: brand violet frames the site, four section colors code the content, and everything sits on warm paper neutrals.

### Primary
- **arc42 Violet** (#682d63): The brand frame — site header, links, markers, article/meta rails. Deepens to **Violet Deep** (#52214f) for hovers and high-contrast borders; recedes to **Violet Soft** (#e9d9e8) and **Violet Faint** (#f5eef4) for tinted surfaces. Violet means "the site itself", not a content type.

### Secondary
The four section identity colors. Each codes one content type in the graph, in hero rails, and in chip washes:
- **Quality Blue** (#00b8f5): qualities — the largest content family. Darkens to #0077ad (tag-page rails), reads as text via **Quality Blue Text** (#003366); **Quality Blue Accent Dark** (#1f5f82) exists solely to keep AA contrast on the lightest blue surfaces.
- **Requirement Rose** (#ffb3b3): requirements; soft wash #ffe0e0, text #8b0000.
- **Standard Gold** (#ffc95c): standards; soft wash #ffefc8, text #2c3e50. The /standards/ explorer extends this into its own warm 18-token sub-palette (`--std-*`).
- **Approach Green** (#92ef80): approaches; soft wash #d9f7d3, text #1b5e20.

### Tertiary
- **arc42 Teal** (#5fb49c): secondary brand accent, used sparingly.
- **Dimension Navy** (#1a3a5c): reserved for the /dimensions/ index.

### Neutral
- **Ink** (#241823): headings and emphasis — a violet-cast near-black, not pure black.
- **Text Gray** (#383838): body text on white.
- **Muted** (#746671): ledes, eyebrows, metadata — violet-cast to stay in family.
- **Paper** (#f8f7f2) / **Cream** (#fbf6ef): card and surface tints; the "page" of the atlas.
- **Page White** (#ffffff): the document background.

### Named Rules
**The Legend Rule.** Every content type owns exactly one color, and that color must match everywhere the type appears — graph node, homepage rail, hero rail, chip. The homepage is the legend; never let a rail color contradict its destination.

**The Wash Rule.** Section color reaches a surface only as a `color-mix(in oklab, …)` wash into Paper — 8% for calm sections, 14% for dialed-up sections (qualities, requirements, approaches; chips too), 25% at chip hover — plus a solid rail. Full-saturation fills are reserved for graph nodes. Saturated background panels are the pattern the 2026 refactor removed; do not reintroduce them.

## 3. Typography

**Display Font:** Libre Caslon Text (with Iowan Old Style / Palatino / Georgia fallback)
**Body Font:** Atkinson Hyperlegible Next (with Atkinson Hyperlegible / system-ui fallback)
**Mono Font:** ui-monospace stack (SF Mono / Menlo / Consolas)

**Character:** The pre-trend English reference serif — chosen before the editorial-revival crop made serifs fashionable — over a sans commissioned by the Braille Institute for low-vision disambiguation. A handbook typeset for reading under time pressure: authority in the headings, maximum legibility in the dense parts.

### Hierarchy
1.333 modular scale (perfect fourth) from a 17px body base.

- **Display** (700, 3.15rem, 1.15): page H1 on content pages. Hero display may reach 4.2rem with clamp.
- **Headline** (700, 2.37rem, 1.15): h2 section breaks.
- **Title** (700, 1.78rem, 1.15): h3; 1.45rem for h4. All headings: letter-spacing -0.005em, `text-wrap: balance`.
- **Body** (400, 1rem, 1.55): `text-wrap: pretty` on prose; ledes max 78ch.
- **Label** (600, 0.78rem, 0.08em tracking, uppercase): eyebrows ("QUALITY", "REQUIREMENT") and group labels — one deliberate system, always in the sans.

### Named Rules
**The Two Voices Rule.** Libre Caslon Text speaks only in headings (and the search dropdown's group labels). Atkinson Hyperlegible Next speaks everything else — body, chips, buttons, navigation, data. Never a serif in a UI control; never a third face.

**The Tabular Data Rule.** Counts, thresholds, and quality-requirement figures always set `font-variant-numeric: tabular-nums`.

## 4. Elevation

Flat by default. Depth on this site is conveyed by hairline borders (1px, usually a violet-alpha or a paper/section color-mix), tinted washes, and colored rails — not by shadows. Where shadows exist, they are ink-tinted (rgba of #241823 or a warm ink in the standards section), never pure black at high opacity.

### Shadow Vocabulary
- **Popover** (`box-shadow: 0 1px 2px rgba(36,24,35,0.06), 0 14px 36px rgba(36,24,35,0.22)`): the search autocomplete panel — the strongest float on the site.
- **Sheet** (`box-shadow: 0 12px 36px rgba(0,0,0,0.2)`): the mobile graph bottom-sheet.
- **Graph controls / tooltip** (`0 2px 10px rgba(0,0,0,0.1)` / `0 2px 5px rgba(0,0,0,0.2)`): floating UI over the graph canvas.
- **Standards cards** (`0 1px 2px rgba(44,31,5,0.05)` rest, `0 10px 20px rgba(38,27,4,0.15)` hover-lift): the one documented exception — explorer cards cast a whisper of warm ink, and lift on hover.
- **Focus rings** (`--focus-ring`, `--focus-ring-on-violet`): two-tone box-shadows (2px + 4px) guaranteeing ≥3:1 on both paper and violet surfaces. These are state indicators, not elevation.
- **Pinned-note callout shadow** (`3px 3px 0 0 var(--brand-violet-deep)`): the family's tactile signature (meta.arc42.org ADR-0002), hardened 2026-07-30 from the old 4px-blurred legacy form to docs' canonical zero-blur offset. Reserved for annotation boxes pinned onto the page (`.arc42-help`, error callouts in their danger-deep tone) — never headings, cards, or containers at rest. The requirement box deliberately carries **no** shadow, mirroring docs' help/example weighting.

### Named Rules
**The Overlay Rule.** A shadow means the element floats above the page: popover, sheet, tooltip. If it doesn't float, it doesn't cast. (Standards explorer cards are the sole sanctioned exception.)

## 5. Components

Calm, color-coded, papered. Components recede into the paper; section identity comes from rails and washes, never saturated fills. Micro-transitions run 120ms ease-out (background, border-color, color); larger moves use `cubic-bezier(0.16, 1, 0.3, 1)` at 150–250ms.

### Buttons
- **Shape:** full pill (999px radius) for facet/filter buttons; no rectangular button vocabulary exists.
- **Facet pill (standards explorer):** white surface, 1px `--std-border`, 0.78rem/600 sans, padding 0.23rem 0.56rem. **Active:** Standard Gold fill (#ffc95c), inset 1px black-alpha keyline, dark amber text (#4a3a0a).
- **Reset button:** pill, warm cream fill (#fff4d3), strong border.
- **Focus:** two-tone focus ring via box-shadow; native outline suppressed only where the ring is applied.

### Chips
- **Tag chip** (`a.hov`): pill, paper washed 14% toward the section color (`color-mix(in oklab, paper 86%, cat 14%)`), border at 35% mix, section text color, 0.85rem/500. **Hover/focus:** wash deepens to 25%, border to 50%. Trailing count in a faint 0.78rem/400 span at 70% opacity.
- **Hero chip** (section-hero chips row): quieter — violet 6% alpha wash, 18% alpha border, Ink text, 0.78rem/500. Identity stays in the hero's rail; the chip row is a calm navigation aid.

### Cards / Containers
- **Section hero** (the signature container): Paper washed 8% toward the section color (14% for qualities/requirements/approaches), 10px radius, 1px violet-alpha border, and a 10px solid rail in the section color inset on the left (3px radius, 0.55rem vertical inset). Carries eyebrow → serif title (clamp 1.6–1.95rem, 500) → muted lede → chips row. Narrow screens: 8px rail, 8px radius.
- **Panel dividers** (tag pages): the mini-hero — same language at 6px rail, 8px radius, 20% wash.
- **Standards explorer card:** near-white warm surface (#fffef9), 14px radius, whisper shadow, hover-lift.

### Inputs / Fields
- **Content inputs:** white, 1px black-alpha border, 0.3em radius, 0.5em 0.75em padding.
- **Header search:** lives on violet; paired with a mono `⌘K`-style kbd hint chip (cream-alpha, 0.68rem) that fades out on focus/typing.
- **Search popover:** Paper panel, violet-alpha border, 8px radius, Popover shadow, grouped results with serif uppercase group labels and section-colored rails per group.

### Navigation
- **Header:** solid arc42 Violet bar, sticky (`--z-sticky`). Links 0.875rem/600 sans in a muted on-violet tone, brightening to full on-violet white on hover/active (color-only transition, 0.25s expo-out). Focus: `--focus-ring-on-violet`.
- **Z-scale:** sticky 1000 → popover 1100 → sheet 1201 → sheet-top 1300 → skip-link 2000. Never an arbitrary z-index.

### The Graph (signature component)
D3 force-directed graph of the whole model. Node fills are the legend incarnate: Property #f8f9fa (size 35), Quality #00b8f5 (25), Requirement #ffb3b3 (15), Standard #ffc95c (45). The graph is the one place full-saturation color is the point. Honors `prefers-reduced-motion` in `GraphRenderer.js`.

## 6. Do's and Don'ts

### Do:
- **Do** route every section color through The Wash Rule (8/14/25% color-mix into Paper) and The Rail Rule (solid rail, 10px hero / 6px panel).
- **Do** hold WCAG 2.2 AA everywhere: body text ≥4.5:1, and use Quality Blue Accent Dark (#1f5f82) instead of lighter blues on tinted surfaces. Accessibility failures are a credibility issue on a site about quality.
- **Do** apply the two-tone focus rings (`--focus-ring` / `--focus-ring-on-violet`) whenever a native outline is suppressed.
- **Do** ship a `prefers-reduced-motion: reduce` alternative for every animation — the header, icons, search, layout, and graph already do.
- **Do** stay on the scales: radii 4/8/10/14/999px, the 1.333 type scale, the named z-index tiers, `tabular-nums` for data.
- **Do** keep micro-transitions at 120ms ease-out and reserve `cubic-bezier(0.16, 1, 0.3, 1)` for larger moves.

### Don't:
- **Don't** look like "a generic SaaS landing page, a startup pitch deck, or an AI-generated dashboard" (PRODUCT.md, verbatim). No hero-metric templates, no gradient text, no glassmorphism.
- **Don't** feel like "a blog or a wiki" (PRODUCT.md, verbatim). This is an atlas with an information architecture, not a stream of posts.
- **Don't** reintroduce saturated-fill pills or full-color background panels — the exact pattern the 2026 chip/panel refactor removed.
- **Don't** use section colors decoratively. A color that doesn't identify its content type is wrong (The Legend Rule).
- **Don't** add dark mode. `color-scheme: light` is doctrine; the light theme is the brand.
- **Don't** set Libre Caslon in UI labels, buttons, chips, or data (The Two Voices Rule).
- **Don't** add shadows to resting page-flow elements (The Overlay Rule), use the pinned-note shadow outside annotation boxes, or invent z-index values outside the named tiers.
- **Don't** add new ad-hoc muted grays — three legacy ones (#6f6f6f, #6b6b6b, #5e5e5e) are already quarantined in the tokens; use Muted (#746671) or Text Gray (#383838).

## 7. Family

quality.arc42.org is a satellite of the arc42 site family. The normative
family documents live in **meta.arc42.org** (`BRAND.md`, `DESIGN.md`,
`adr/`):

- **Signature hue** (owned by this site, ADR-0013): arc42 Violet `#682d63`
  (deep `#52214f`). No other family site may use it; this site uses no other
  site's signature hue.
- **Inherited constants**: the Caslon/Atkinson type pair (self-hosted), the
  saturated masthead band, paper-flat surfaces, light-only, WCAG 2.2 AA with
  measured contrast recorded at the declaration site (ADR-0005), the
  hard-offset pinned-note shadow (ADR-0002), and the shared accents amber
  `#ffc95c` (= Standard Gold, this site's visible job for it), coral
  `#ff5c7c`, coral-deep `#c22b47` (the error fill), emerald `#2e9e67`.
- **Site-local, never exported**: the four-colour semantic legend
  (Quality Blue / Requirement Rose / Standard Gold / Approach Green), the
  `--std-*` sub-palette, the D3 graph palette. The `--cat` one-attribute
  colour mechanism is this site's *export* to the family — the mechanism
  travels, the hues do not.

Changing a shared token or family constant is an ecosystem decision (ADR in
meta), not a site edit.
