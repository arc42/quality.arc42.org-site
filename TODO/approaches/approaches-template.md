# Solution Approach Template

This file is the canonical source of truth for all approach pages in `_approaches/`.
Use it as the definition of done for every new approach.

## Required Front Matter

```yaml
---
layout: approach
title: "Circuit Breaker"
tags: [reliable, operable]
supported_qualities: [availability, fault-tolerance, resilience]
supported_qualities_notes:
  availability: "Protects availability by failing fast rather than hanging on slow dependencies."
  fault-tolerance: "Provides safe fallbacks for controlled degradation under partial failure."
  resilience: "Contains dependency failures and prevents cascade."
tradeoffs: [code-complexity, consistency, cost]
tradeoff_notes:
  code-complexity: "Adds threshold and fallback logic that must be configured and maintained."
  consistency: "Fallback responses may serve stale or partial data while the circuit is open."
  cost: "State tracking and probing add small runtime overhead on protected calls."
intent: "Fail fast when a dependency is unhealthy to prevent cascading failures and preserve overall service availability."
mechanism: "Wrap dependency calls with a stateful guard that opens after a failure threshold, skips calls while open, and probes recovery after a timeout."
applicability: "Use for remote calls that can fail transiently. Avoid for local in-process calls where overhead exceeds benefit."
related_requirements: [available-7-24-99]
related_requirements_notes:
  available-7-24-99: "Fail-fast behavior keeps the system within its uptime objective during dependency outages."
permalink: /approaches/circuit-breaker
---
```

## Front Matter Rules

- `tags`:
  - Must use only these 9 dimensions: `suitable`, `usable`, `secure`, `reliable`, `operable`, `efficient`, `flexible`, `safe`, `maintainable`.
  - Use 1-3 tags per page.
- `supported_qualities`:
  - Array of existing quality slugs from `/qualities/<slug>`.
  - Use plain slugs only, no prefixes like `category-attribute`.
- `supported_qualities_notes`:
  - A map keyed by each slug in `supported_qualities`, value = one short sentence on *how* the approach advances that quality.
  - The layout renders each note as a paragraph under its quality link.
- `tradeoffs`:
  - Array of existing quality slugs from `/qualities/<slug>`.
  - Keep as plain slug strings only (no objects).
- `tradeoff_notes`:
  - A map keyed by each slug in `tradeoffs`, value = one short sentence on the concrete cost.
- `related_requirements`:
  - Array of existing requirement slugs from `/requirements/<slug>`. Use `[]` if none apply.
- `related_requirements_notes`:
  - A map keyed by each slug in `related_requirements`, value = one short sentence on how the requirement connects. Omit only when `related_requirements` is empty.
- `intent`, `mechanism`, `applicability`:
  - Single concise paragraphs (not YAML lists), because the current layout renders them as paragraph text.
- `permalink`:
  - Must be unique and kebab-case: `/approaches/<slug>`.

> **Silent-drop warning:** the layout matches each slug against existing pages and simply omits any slug it can't resolve — no error is raised. A typo'd quality or requirement slug disappears from the rendered page rather than failing the build. Verify slugs visually after rebuild.

## Body Structure (Keep It Lean)

- Start with 1-2 short overview paragraphs directly after front matter.
- Use at most 4 `##` headings.
- Avoid `###` headings unless absolutely necessary.

Recommended sections:

1. `## How It Works`
2. `## Failure Modes`
3. `## Verification`
4. `## Variants and Related Tactics` (optional)

`## References` can be added when needed, but keep pages concise. When a source also appears on the site's [References](/references/) page, link to the anchor there via `([full citation](/references/#anchor))`.

## Body Skeleton

```md
Short overview paragraph.
Optional second overview paragraph with boundary conditions.

## How It Works
- Step/mechanism point 1
- Step/mechanism point 2
- Step/mechanism point 3

## Failure Modes
- Typical misuse/failure 1
- Typical misuse/failure 2

## Verification
- Metric/test idea with measurable signal
- Failure injection/chaos check
- Production signal to monitor

## Variants and Related Tactics
- Variant or adjacent tactic with one-line boundary note

## References
- [Source Title](https://example.com) — Author(s) ([full citation](/references/#anchor))
- [Source Title](https://example.com)
```

## Definition of Done (Single Page)

- Front matter validates against this template, including the four `*_notes` / `related_requirements` blocks.
- `supported_qualities` and `tradeoffs` only contain existing quality slugs; `related_requirements` only existing requirement slugs (bad slugs vanish silently — verify on the rendered page).
- Every `*_notes` key matches a slug present in its corresponding array.
- Tags use only the 9 dimensions listed above.
- Page renders correctly with no broken links.
- Trade-offs and verification are specific, measurable, and non-generic.
