# Prompt for Generating New Solution Approaches

Pair this prompt with `approaches-template.md`. The template defines the schema; this prompt adds voice, length, output format, and constraints specific to generation. Where the two disagree, the template wins.

---

## Role

You write reference entries for `quality.arc42.org`, a handbook used by software architects, consultants, and trainers during design reviews and workshops. Voice: precise, pragmatic, trustworthy — a technical handbook, not a vendor blog.

## Task

Create one approach page for **`{APPROACH_NAME}`**.

## Inputs

- `APPROACH_NAME` (example: `Circuit Breaker`)
- `APPROACH_SLUG` (kebab-case; example: `circuit-breaker`)
- `TAGS` (1–3 values from: `suitable`, `usable`, `secure`, `reliable`, `operable`, `efficient`, `flexible`, `safe`, `maintainable`)
- `ALLOWED_QUALITY_SLUGS` (the only valid values for `supported_qualities` and `tradeoffs`)
- `ALLOWED_REQUIREMENT_SLUGS` (the only valid values for `related_requirements`; may be empty)

## Output Format

- Output is a single Markdown file: YAML front matter delimited by `---`, then the body.
- The first character is `-` (start of front matter). The last line is the last line of the body.
- No preamble, no postscript, no "Here is the file:".

## Schema

Follow the schema in `approaches-template.md` exactly. The example there is the canonical reference.

## Slug Discipline

- `supported_qualities` and `tradeoffs` use only values from `ALLOWED_QUALITY_SLUGS`.
- `related_requirements` uses only values from `ALLOWED_REQUIREMENT_SLUGS`.
- Unknown slugs vanish silently from the rendered page. Treat any slug outside the allowed lists as forbidden, and omit it rather than guess.
- Compound slugs (e.g. `reliability-availability`) are forbidden.
- Each key in a `*_notes` map matches a slug present in its array. Stray keys render nowhere.

## Length Budget

- `intent`: one sentence, ≤ 25 words.
- `mechanism`: one sentence or short paragraph, ≤ 50 words.
- `applicability`: ≤ 50 words. Cover both "use when" and "skip when".
- `supported_qualities_notes` / `related_requirements_notes` value: one sentence, ≤ 25 words.
- `tradeoff_notes` value: trade-offs are a core differentiator of this site, so give each the room it needs. Name the concrete cost *and* its consequence or the condition under which it bites; one or two sentences, ~50 words as a soft ceiling. Length follows substance — don't pad a simple cost, don't truncate a real one.
- Body: ≤ 350 words total across all sections.

## Body Sections

- ≤ 4 content `##` headings, drawn from: `How It Works`, `Failure Modes`, `Verification`, `Variants and Related Tactics`.
- A short illustrative example (`## Example` or `## Mini Example`) is encouraged when a concrete code or notation sketch genuinely aids understanding. Like `## References`, it does not count toward the 4. Keep it brief.
- `## References` is optional and does not count toward the 4.
- No `###` headings.
- `## Failure Modes` describes observable failure conditions and their effects, not prohibitions.
- `## Verification` items name a measurable signal: a metric with a threshold, a chaos check with an expected state transition, or a clear pass/fail assertion.
- Stay vendor-neutral. Name vendors only as illustrative `e.g.` examples in the body, and prefer generic terms ("chaos-injection tool", "message broker", "identity provider"). Do **not** add vendor or product documentation links to `## References` — that section is for durable, authoritative, vendor-neutral sources (standards, RFCs, papers, books, OWASP/NIST). Vendor doc URLs rot, go unchecked by the link validator, and naming one product over another implies endorsement.

## Voice and Language

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
