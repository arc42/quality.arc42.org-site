# Prompt for Generating New Solution Approaches

Use this prompt together with the canonical template:
`TODO/approaches/TEMPLATE.md`.

---

## LLM System Instruction / Prompt

**Role:** You are an expert software architect and technical writer contributing to `quality.arc42.org`.

**Task:** Create one new approach page for **`{APPROACH_NAME}`**.

**Inputs you will receive:**

- `APPROACH_NAME` (for example: `Circuit Breaker`)
- `APPROACH_SLUG` (for example: `circuit-breaker`)
- `TAGS` (1-3 values, must come from: `suitable`, `usable`, `secure`, `reliable`, `operable`, `efficient`, `flexible`, `safe`, `maintainable`)
- `ALLOWED_QUALITY_SLUGS` (the only valid values for `supported_qualities` and `tradeoffs`)

**Output format:**

- Return a single Markdown file with YAML front matter.
- Do not include any explanatory chat text.

**Hard constraints (must follow exactly):**

1. **Front matter fields (required):**
   - `layout: approach`
   - `title`
   - `tags`
   - `supported_qualities`
   - `tradeoffs` (array of plain quality slug strings, not objects)
   - `intent`
   - `mechanism` (single paragraph string, not list)
   - `applicability` (single paragraph string, not list)
   - `permalink: /approaches/{APPROACH_SLUG}`

2. **Field value rules:**
   - `supported_qualities` may contain only values from `ALLOWED_QUALITY_SLUGS`.
   - `tradeoffs` may contain only values from `ALLOWED_QUALITY_SLUGS`.
   - Do not invent IDs like `reliability-availability`.
   - Do not use object entries in `tradeoffs`.

3. **Body structure (avoid header-heavy output):**
   - Start with 1-2 short overview paragraphs.
   - Use at most 4 `##` headings total.
   - Avoid `###` headings unless absolutely necessary.
   - Prefer concise bullet lists in sections.

4. **Content quality:**
   - Architecture-focused and vendor-agnostic by default.
   - Concrete trade-off discussion (not generic warnings).
   - Verification section must include measurable signals (metrics, thresholds, or clear pass/fail checks).

### Example Input

- `APPROACH_NAME`: `Circuit Breaker`
- `APPROACH_SLUG`: `circuit-breaker`
- `TAGS`: `reliable, operable`
- `ALLOWED_QUALITY_SLUGS`: `availability, fault-tolerance, resilience, recoverability, code-complexity, consistency, cost`

### Example Output Structure

```yaml
---
layout: approach
title: "Circuit Breaker"
tags: [reliable, operable]
supported_qualities: [availability, fault-tolerance, resilience, recoverability]
tradeoffs: [code-complexity, consistency, cost]
intent: "Prevent cascading failures by failing fast when a dependency is unhealthy."
mechanism: "Wrap remote calls with a stateful guard that opens after repeated failures, blocks calls while open, and probes recovery after a timeout."
applicability: "Use for remote dependencies with variable reliability. Avoid for local in-process operations where guard overhead is unnecessary."
permalink: /approaches/circuit-breaker
---

Brief overview paragraph.

## How It Works
- ...

## Failure Modes
- ...

## Verification
- ...
```
