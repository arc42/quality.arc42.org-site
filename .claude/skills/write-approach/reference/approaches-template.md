# Approach Template

This file is the canonical schema for pages in `_approaches/`. It defines required front matter, body structure, and the definition of done.

Generating new approaches? Pair this file with `approaches-prompt.md`, which adds voice, length, and output-format rules.

## Required Front Matter

```yaml
---
layout: approach
title: "Circuit Breaker"
tags: [reliable, operable]
supported_qualities: [availability, fault-tolerance, resilience, stability]
supported_qualities_notes:
  availability: "Failing fast preserves availability when a dependency slows or hangs."
  fault-tolerance: "Safe fallbacks let the system degrade in a controlled way under partial failure."
  resilience: "Containing dependency failures prevents cascade across services."
  stability: "Isolating unhealthy dependencies stops errors rippling across boundaries."
tradeoffs: [maintainability, latency]
tradeoff_notes:
  maintainability: "Threshold, fallback, and recovery logic add code that the team owns and tunes."
  latency: "Each protected call carries a small overhead for the state check and timeout handling."
intent: "Fail fast when a dependency is unhealthy, so cascading failures stop at the breaker."
mechanism: "Wrap remote calls in a stateful guard that opens after a failure threshold, blocks calls while open, and probes recovery after a timeout."
applicability: "Use for remote calls that fail transiently or slowly. Skip for local in-process calls where the guard overhead outweighs the benefit."
related_requirements: [available-7-24-99]
related_requirements_notes:
  available-7-24-99: "Failing fast keeps the system inside its uptime objective during a dependency outage."
permalink: /approaches/circuit-breaker
---
```

## Front-Matter Rules

- `tags`:
  - Use 1–3 values from the 9 quality dimensions: `suitable`, `usable`, `secure`, `reliable`, `operable`, `efficient`, `flexible`, `safe`, `maintainable`.
- `supported_qualities`:
  - Array of slugs that exist under `/qualities/<slug>`. Plain slugs, no prefixes.
- `supported_qualities_notes`:
  - Map keyed by each slug in `supported_qualities`. Value: one sentence on how the approach advances that quality. The layout renders each note under its quality link.
- `tradeoffs`:
  - Array of slugs that exist under `/qualities/<slug>`. Plain strings, no objects.
- `tradeoff_notes`:
  - Map keyed by each slug in `tradeoffs`. Value: name a concrete cost (a metric impact, a maintenance task, a class of stale data) *and* its consequence or triggering condition — not a generic warning. Trade-offs are a key differentiator of the site, so favour a substantive note (one or two sentences, ~50 words) over a terse one; length follows substance, don't pad.
- `related_requirements`:
  - Array of slugs that exist under `/requirements/<slug>`. Use `[]` when none apply.
- `related_requirements_notes`:
  - Required whenever `related_requirements` is non-empty. Map keyed by each slug; value: one sentence on how the requirement connects.
- `intent`, `mechanism`, `applicability`:
  - Single paragraphs (not YAML lists). The layout renders them as prose.
- `permalink`:
  - Unique and kebab-case: `/approaches/<slug>`. The last segment is the graph node ID — changing it breaks references.
- `aka` (optional):
  - YAML list of plain display strings (title-case): `aka: [Throttling, Monitor]`. These are **index terms** ("also known as"), not strict synonyms — "if you know this term, you'll find the concept here". The same term may appear on more than one approach; aliases create **no** permalink, redirect, or graph node (unlike quality aliases). They surface in the A–Z explorer, the on-page "Also known as" block, and graph search. Where literature context matters (e.g. "Bass et al. call this Throttling"), put that in the body prose, not in `aka`.
  - **Curation:** add an alias only when its wording genuinely differs from the canonical title. Skip singular/plural variants, near-identical restatements or terms identical to the title, and trivial rephrasings. Do **not** reuse a term already used as an alias on another approach — duplicate alias terms clutter the A–Z explorer. When in doubt, leave it out.

> **Silent-drop warning:** the layout matches each slug against existing pages and omits any it can't resolve, with no error. A typo'd slug disappears from the rendered page rather than failing the build. Verify slugs visually after rebuild.

## Body Structure

- Open with 1–2 short overview paragraphs directly after the front matter.
- At most 4 content `##` headings, drawn from this set:
  1. `## How It Works`
  2. `## Failure Modes`
  3. `## Verification`
  4. `## Variants and Related Tactics` (optional)
- A short illustrative example (`## Example` or `## Mini Example`) is encouraged where a concrete code or notation sketch aids understanding. Like `## References`, it does not count toward the 4. Keep it brief.
- `## References` is optional and does not count toward the 4.
- No `###` headings.

When a source also appears on the site's [References](/references/) page, link to its anchor: `[Title](url) — Author(s) ([full citation](/references/#anchor))`.

**What belongs in `## References`:** durable, authoritative, vendor-neutral sources — standards (ISO, NIST), RFCs, foundational papers, books, and bodies like OWASP. Do **not** add vendor or product documentation links (a specific cloud's or tool's how-to). They rot, the link validator does not check external URLs, and naming one product over another implies endorsement and undercuts the site's neutral, trustworthy voice. Name vendors only as illustrative `e.g.` examples in the body.

## Body Skeleton

```md
Short overview paragraph.
Optional second paragraph with boundary conditions.

## How It Works
- Step or mechanism point 1
- Step or mechanism point 2
- Step or mechanism point 3

## Failure Modes
- Observable failure condition and its effect
- Observable failure condition and its effect

## Verification
- Metric with a threshold or pass/fail signal
- Chaos or failure-injection check with expected state transition
- Production signal to monitor

## Variants and Related Tactics
- Variant or adjacent tactic with a one-line boundary note

## References
- [Title](https://example.com) — Author(s) ([full citation](/references/#anchor))
```

## Voice and Language

Voice rules — active, positive, concrete, AI-slop-free — live in `approaches-prompt.md` under "Voice and Language". Apply them to handwritten pages too.

## Definition of Done (Single Page)

- Front matter validates against this schema, including all `*_notes` blocks and `related_requirements`.
- `supported_qualities` and `tradeoffs` contain only existing quality slugs; `related_requirements` only existing requirement slugs. Bad slugs vanish silently — verify on the rendered page.
- Every `*_notes` key matches a slug present in its corresponding array.
- Tags use only the 9 dimensions listed above.
- Page renders correctly with no broken links.
- `tradeoff_notes` name concrete costs; `## Verification` items name measurable signals.
- Restart Docker after adding the file so graph data regenerates; confirm notes render and no "No … specified" placeholders appear where content was intended.
- Stage the new file explicitly by name (no `git add -A` / `git add .`). Commit message style: `content: add <slug> approach`.
