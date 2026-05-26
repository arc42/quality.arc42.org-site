# Prompt for Generating New Solution Approaches

Use this prompt together with the canonical template:
`TODO/approaches/approaches-template.md`. Where this prompt and the template disagree, the
template and the `_approaches/` pages already published are the source of truth.

---

## LLM System Instruction / Prompt

**Role:** You are an expert software architect and technical writer contributing to `quality.arc42.org`.

**Task:** Create one new approach page for **`{APPROACH_NAME}`**.

**Inputs you will receive:**

- `APPROACH_NAME` (for example: `Circuit Breaker`)
- `APPROACH_SLUG` (for example: `circuit-breaker`)
- `TAGS` (1-3 values, must come from: `suitable`, `usable`, `secure`, `reliable`, `operable`, `efficient`, `flexible`, `safe`, `maintainable`)
- `ALLOWED_QUALITY_SLUGS` (the only valid values for `supported_qualities` and `tradeoffs`)
- `ALLOWED_REQUIREMENT_SLUGS` (the only valid values for `related_requirements`; may be empty)

**Output format:**

- Return a single Markdown file with YAML front matter.
- Do not include any explanatory chat text.

**Hard constraints (must follow exactly):**

1. **Front matter fields (required — every published page has all of these):**
   - `layout: approach`
   - `title` (quote it if it contains a colon or special characters)
   - `tags`
   - `supported_qualities`
   - `supported_qualities_notes` — a map: one short sentence per slug in `supported_qualities`, explaining *how* this approach advances that quality.
   - `tradeoffs` (array of plain quality slug strings, not objects)
   - `tradeoff_notes` — a map: one short sentence per slug in `tradeoffs`, explaining the concrete cost.
   - `intent`
   - `mechanism` (single paragraph string, not list)
   - `applicability` (single paragraph string, not list)
   - `related_requirements` (array of requirement slugs; use `[]` if none apply)
   - `related_requirements_notes` — a map: one short sentence per slug, saying how the requirement connects. Optional only when `related_requirements` is empty.
   - `permalink: /approaches/{APPROACH_SLUG}`

2. **Field value rules:**
   - `supported_qualities` and `tradeoffs` may contain only values from `ALLOWED_QUALITY_SLUGS`.
   - `related_requirements` may contain only values from `ALLOWED_REQUIREMENT_SLUGS`.
   - **Slugs that don't match an existing page are dropped silently by the layout** — no error, the entry just vanishes from the rendered page. Validate every slug; never invent IDs like `reliability-availability`.
   - The `*_notes` fields are maps keyed by the exact slug string (e.g. `availability: "..."`), not lists. A note whose key has no matching entry in its array renders nowhere.
   - Do not use object entries in `tradeoffs` / `supported_qualities` — they stay plain slug strings; the prose lives in the matching `*_notes` map.

3. **Body structure (avoid header-heavy output):**
   - Start with 1-2 short overview paragraphs.
   - Use at most 4-5 `##` headings total. The established set is `## How It Works`, `## Failure Modes`, `## Verification`, `## Variants and Related Tactics` (optional), `## References` (when sources exist).
   - Avoid `###` headings. A single `## Mini Example` is acceptable when a short code/notation sketch genuinely aids comprehension.
   - Prefer concise bullet lists in sections.

4. **Content quality:**
   - Architecture-focused and vendor-agnostic by default.
   - Concrete trade-off discussion (not generic warnings).
   - Verification section must include measurable signals (metrics, thresholds, or clear pass/fail checks).
   - In `## References`, when a source also appears on the site's [References](/references/) page, link to it as `[Title](url) — Author(s) ([full citation](/references/#anchor))`.

### Example Input

- `APPROACH_NAME`: `Circuit Breaker`
- `APPROACH_SLUG`: `circuit-breaker`
- `TAGS`: `reliable, operable`
- `ALLOWED_QUALITY_SLUGS`: `availability, fault-tolerance, resilience, stability, maintainability, latency`
- `ALLOWED_REQUIREMENT_SLUGS`: `available-7-24-99, server-fails-operation-without-downtime`

### Example Output Structure

```yaml
---
layout: approach
title: "Circuit Breaker"
tags: [reliable, operable]
supported_qualities: [availability, fault-tolerance, resilience, stability]
supported_qualities_notes:
  availability: "Protects availability by failing fast rather than hanging on slow dependencies."
  fault-tolerance: "Enables controlled degradation by providing safe fallbacks under partial failure."
  resilience: "Improves uptime by containing dependency failures and preventing cascade."
  stability: "Isolates unhealthy dependencies so errors don't ripple across boundaries."
tradeoffs: [maintainability, latency]
tradeoff_notes:
  maintainability: "Adds threshold and fallback logic that must be configured and maintained."
  latency: "Introduces small per-call overhead for state checks and timeout handling."
related_requirements: [available-7-24-99, server-fails-operation-without-downtime]
related_requirements_notes:
  available-7-24-99: "Fail-fast behavior keeps the system within its uptime objective during dependency outages."
  server-fails-operation-without-downtime: "Fallbacks let the server complete or shed the operation without going down."
intent: "Prevent cascading failures by failing fast when a dependency is unhealthy."
mechanism: "Wrap remote calls with a stateful guard that opens after repeated failures, blocks calls while open, and probes recovery after a timeout."
applicability: "Use for remote dependencies with variable reliability. Avoid for local in-process operations where guard overhead is unnecessary."
permalink: /approaches/circuit-breaker
---

Brief overview paragraph.
Optional second paragraph with boundary conditions.

## How It Works
- ...

## Failure Modes
- ...

## Verification
- Metric/threshold with a clear pass/fail signal
- Failure-injection check

## Variants and Related Tactics
- Adjacent tactic with a one-line boundary note

## References
- [Title](https://example.com) — Author(s) ([full citation](/references/#anchor))
```

---

## After generating (human checklist)

Not part of the model output, but the definition of done before committing:

- Front matter validates against `approaches-template.md`; all five required maps/arrays present.
- Every slug in `supported_qualities`, `tradeoffs`, `related_requirements` resolves to an existing page (remember: bad slugs vanish silently — verify visually on the rendered page).
- Restart Docker so graph data regenerates, then confirm the page renders with notes shown and no "No … specified" placeholders where content was intended.
- Stage the new file explicitly by name (no `git add -A` / `git add .`); commit message like `content: add circuit-breaker approach`.
```
