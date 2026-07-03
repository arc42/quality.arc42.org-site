# Approach Template

This file is the **canonical, self-contained spec** for pages in `_approaches/`: front-matter schema, length budgets, body structure, voice, words to avoid, and the definition of done. The `write-approach` skill's `SKILL.md` drives the *procedure*; everything about *what a good approach page contains* lives here. Apply these rules to generated and handwritten pages alike.

## Output

One Markdown file: YAML front matter delimited by `---`, then the body. The first character is `-` (start of front matter); the last line is the last line of the body. No preamble, no postscript, no "Here is the file:".

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
related: [timeout]                              # optional — approach↔approach, declared one-sided
related_notes:
  timeout: "A timeout turns a hanging call into a countable failure that the breaker's threshold can act on."
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
  - Array of slugs that exist under `/qualities/<slug>`. Plain slugs, no prefixes. Use single slugs only — no compound slugs (`reliability-availability` is forbidden; pick `reliability` or `availability`).
- `supported_qualities_notes`:
  - Map keyed by each slug in `supported_qualities`. Value: one sentence on how the approach advances that quality. The layout renders each note under its quality link.
- `tradeoffs`:
  - Array of slugs that exist under `/qualities/<slug>`. Plain strings, no objects. Single slugs only, as above.
- `tradeoff_notes`:
  - Map keyed by each slug in `tradeoffs`. Value: name a concrete cost (a metric impact, a maintenance task, a class of stale data) *and* its consequence or triggering condition — not a generic warning. Trade-offs are a key differentiator of the site, so favour a substantive note (one or two sentences, ~50 words) over a terse one; length follows substance, don't pad.
- `related` (optional):
  - Array of approach slugs that exist as `_approaches/<LETTER>/<slug>.md`. Approach↔approach relations are declared **one-sided**: exactly one of the two pages carries the entry; `_layouts/approach.html` renders the relation on both pages and `src/scripts/data.js` emits one graph edge. Never declare the same relation on both pages. The link validator does **not** check these slugs — confirm each target file exists, or the entry vanishes silently.
- `related_notes`:
  - Map keyed by each slug in `related`. One sentence. The note renders on **both** pages, so write it symmetrically — it must read correctly from either page's point of view.
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
  - **Curation:** add an alias only when its wording genuinely differs from the canonical title. Skip singular/plural variants, near-identical restatements or terms identical to the title, and trivial rephrasings. Skip umbrella terms that name a whole problem space rather than this tactic (e.g. *Schema Evolution* is not an alias for Tolerant Reader, even where planning docs pair the two in a row title). Do **not** reuse a term already used as an alias on another approach — duplicate alias terms clutter the A–Z explorer. When in doubt, leave it out.

> **Silent-drop warning:** the layout matches each slug against existing pages and omits any it can't resolve, with no error. A typo'd slug — or a `*_notes` key that matches no slug in its array — disappears from the rendered page rather than failing the build. Verify slugs visually after rebuild.

## Length Budgets

Count words mechanically with `wc -w` — do not eyeball. Nothing in the build enforces these.

- `intent`: one sentence, ≤ 25 words.
- `mechanism`: one sentence or short paragraph, ≤ 50 words.
- `applicability`: ≤ 50 words. Cover both "use when" and "skip when".
- `supported_qualities_notes` / `related_notes` / `related_requirements_notes` value: one sentence, ≤ 25 words.
- `tradeoff_notes` value: name the concrete cost *and* its consequence or the condition under which it bites; one or two sentences, ~50 words as a soft ceiling. Length follows substance — don't pad a simple cost, don't truncate a real one.
- Body: ≤ 350 words across the overview paragraphs and the (max 4) content sections. The image line (`![…]`), `## Example` / `## Mini Example`, and `## References` are **excluded** from the count. Count with exactly this pipeline — `wc -w` counts bullet dashes, em-dashes, and table pipes as words, and the budget is calibrated to that, so do not hand-adjust:

  ```bash
  awk 'BEGIN{fm=0} /^---$/{fm++; next} fm>=2{print}' <file> \
    | awk '/^## (References|Example|Mini Example)/{skip=1; next} /^## /{skip=0} !skip && !/^!\[/' \
    | wc -w
  ```

## Body Structure

- Open with 1–2 short overview paragraphs directly after the front matter.
- At most 4 content `##` headings, drawn from this set:
  1. `## How It Works`
  2. `## Failure Modes` — describe observable failure conditions and their effects, not prohibitions.
  3. `## Verification` — each item names a measurable signal: a metric with a threshold, a chaos check with an expected state transition, or a clear pass/fail assertion.
  4. `## Variants and Related Tactics` (optional)
- A short illustrative example (`## Example` or `## Mini Example`) is encouraged where a concrete code or notation sketch aids understanding. Like `## References`, it does not count toward the 4. Keep it brief.
- `## References` is optional and does not count toward the 4.
- No `###` headings.

Stay vendor-neutral. Name vendors only as illustrative `e.g.` examples in the body, and prefer generic terms ("chaos-injection tool", "message broker", "identity provider").

When a source also appears on the site's [References](/references/) page, link to its anchor: `[Title](url) — Author(s) ([full citation](/references/#anchor))`.

**What belongs in `## References`:** durable, authoritative, vendor-neutral sources — standards (ISO, NIST), RFCs, foundational papers, books, and bodies like OWASP. Do **not** add vendor or product documentation links (a specific cloud's or tool's how-to). They rot, the link validator does not check external URLs, and naming one product over another implies endorsement and undercuts the site's neutral, trustworthy voice.

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

Voice: precise, pragmatic, trustworthy — a technical handbook for software architects, consultants, and trainers during design reviews and workshops, not a vendor blog.

- **Active voice.** Subject acts: "The breaker trips after N failures." Replace passive constructions.
- **Positive framing.** State what happens, not what to avoid. "Thresholds set too low cause flapping" beats "Don't set thresholds too low."
- **Negations sparingly.** Use "no", "not", "never" only when absence is the point (e.g. "never retries on 4xx"). Replace "doesn't X" with the affirmative form.
- **Concrete over abstract.** Name the metric, the threshold, the failure class. "Reduces p99 latency by skipping the slow dependency" beats "improves performance".
- **Confidence calibrated to evidence.** Use "may", "can", "often" only when outcomes genuinely vary. Default to direct statements.
- **Plain English.** Short sentences. One idea per sentence. Cut filler.

### Words and Phrases to Avoid

- Filler verbs: *leverage, utilize, employ, facilitate, enable* — prefer *use, let, help*.
- Marketing adjectives: *robust, seamless, powerful, cutting-edge, world-class, comprehensive, holistic*.
- AI tics: *delve, navigate, embark, unleash, unlock, harness; in today's [X] landscape; it's worth noting that; at its core; in essence*.
- Connective bloat: *moreover, furthermore, additionally, that said* — start a new sentence instead.
- Hedging filler: *somewhat, rather, quite, very, really*.
- Emoji and decorative formatting.

## Definition of Done (Single Page)

- Front matter validates against this schema, including all `*_notes` blocks and `related_requirements`.
- `supported_qualities` and `tradeoffs` contain only existing quality slugs; `related_requirements` only existing requirement slugs. Bad slugs vanish silently — verify on the rendered page.
- `related` contains only existing approach slugs, each relation declared on **one** page only (check the counterpart's front matter), and every note reads correctly from both pages.
- Every `*_notes` key matches a slug present in its corresponding array.
- Tags use only the 9 dimensions listed above.
- Length budgets hold (see "Length Budgets").
- Page renders correctly with no broken links.
- `tradeoff_notes` name concrete costs; `## Verification` items name measurable signals.
- Restart Docker after adding the file so graph data regenerates; confirm notes render and no "No … specified" placeholders appear where content was intended.
- Stage the new file explicitly by name (no `git add -A` / `git add .`). Commit message style: `content: add <slug> approach`.
