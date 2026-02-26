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
tradeoffs: [code-complexity, consistency, cost]
intent: "Fail fast when a dependency is unhealthy to prevent cascading failures and preserve overall service availability."
mechanism: "Wrap dependency calls with a stateful guard that opens after a failure threshold, skips calls while open, and probes recovery after a timeout."
applicability: "Use for remote calls that can fail transiently. Avoid for local in-process calls where overhead exceeds benefit."
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
- `tradeoffs`:
  - Array of existing quality slugs from `/qualities/<slug>`.
  - Keep as plain slug strings only (no objects).
- `intent`, `mechanism`, `applicability`:
  - Single concise paragraphs (not YAML lists), because the current layout renders them as paragraph text.
- `permalink`:
  - Must be unique and kebab-case: `/approaches/<slug>`.

## Body Structure (Keep It Lean)

- Start with 1-2 short overview paragraphs directly after front matter.
- Use at most 4 `##` headings.
- Avoid `###` headings unless absolutely necessary.

Recommended sections:

1. `## How It Works`
2. `## Failure Modes`
3. `## Verification`
4. `## Variants and Related Tactics` (optional)

`## References` can be added when needed, but keep pages concise.

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
- Authoritative source 1
- Authoritative source 2
```

## Definition of Done (Single Page)

- Front matter validates against this template.
- `supported_qualities` and `tradeoffs` only contain existing quality slugs.
- Tags use only the 9 dimensions listed above.
- Page renders correctly with no broken links.
- Trade-offs and verification are specific, measurable, and non-generic.
