---
name: write-approach
description: Use when creating, drafting, or generating a new solution-approach page for quality.arc42.org — a file under `_approaches/<LETTER>/<slug>.md`. Triggers on requests like "write the X approach", "add an approach for X", or working through the approaches backlog in TODO/approaches/.
---

# Write Approach

## Overview

Generate one validated approach page for `quality.arc42.org`, ready to drop into `_approaches/`. The hard part is not the prose — it is making every `supported_qualities`, `tradeoffs`, and `related_requirements` slug resolve against a real content page. A slug that does not match an existing page is **silently dropped** by the layout (no build error): the note vanishes, and the section can render a "No … specified" placeholder. This skill derives the allowed slugs from the content tree and validates against them *before* the file is written.

**Scope:** generate and write the page plus its companion artifacts (diagram, planning-status tick — see step 6). Do **not** restart Docker, do **not** commit — the author reviews the render and commits.

## Rules source — read this first

Everything about *what a good approach page contains* — front-matter schema, length budgets, body structure, voice, words to avoid, and the definition of done — lives in one canonical, self-contained file:

- `reference/approaches-template.md`

Read it before generating. This `SKILL.md` owns the **procedure**; the template owns the **rules**. Where a step below cites a budget or a heading set, the authoritative number lives in the template — do not restate it here.

## Procedure

1. **Resolve inputs.**
   - `APPROACH_NAME` from the request (e.g. `Graceful Degradation`).
   - `APPROACH_SLUG` = kebab-case of the name (e.g. `graceful-degradation`).
   - **Stop if it already exists.** If `_approaches/<LETTER>/<slug>.md` is already present, do not overwrite — report it and ask the author before proceeding.
   - **Stop on a node-ID collision.** The graph node ID is the last permalink segment, and qualities, requirements, and approaches share one node namespace (one `nodes.json`). If `<slug>` already exists as a quality or requirement slug (check the lists from step 2), the two pages collapse into a single graph node and one is silently dropped, conflating their edges. Do not create the approach under that slug — report the clash and ask the author (rename the approach, or treat the term as a quality, not a tactic).
   - **Admission check.** An approach is a structure designed *into* a system — a constructive, design-time decision in the spirit of Circuit Breaker, CQRS, Hexagonal Architecture, or Plugin Architecture. Process, organisational, migration, and measurement practices do not qualify, and neither do no-brainers: the audience is experienced teams. If the candidate fails this test, stop and say why instead of writing it.
   - **Overlap check.** Search the published approaches — including their `## Variants and Related Tactics` sections — for the name and every `aka` candidate: `grep -ril "<term>" _approaches/`. When an existing page already covers the idea as a variant, state in one sentence the mechanism that makes the new page distinct (e.g. Dead Man's Switch: continuation needs an *active, periodic* confirmation, whereas Watchdog Supervision reacts to a *missing* machine heartbeat). If that sentence does not come, propose extending the existing page instead and ask the author. Keep the hits: step 6 links them back.
   - **Branch.** Create `content/<slug>` before writing anything, unless the author names a different base or branch. One branch per approach.
   - Check `TODO/approaches/approaches-planning-and-status.md` — the single planning source — for the approach. Its rows often suggest `tags`, `supported_qualities`, and `tradeoffs` candidates. Treat these as proposals, not truth: every slug is still validated in step 4. Prefer the planning-file `tags` when present and sensible.
   - `tags`: 1–3 of the 9 dimensions only — `suitable usable secure reliable operable efficient flexible safe maintainable`.
   - **Optional `aka:` (index terms).** If the literature names this tactic differently (Bass, POSA, …), harvest those terms into an optional `aka:` list — e.g. `aka: [Throttling]` for Rate Limiting. The "Appendix — Bass et al. tactic index" in `TODO/approaches/approaches-planning-and-status.md` maps literature terms to our approaches; scan it for the matching term(s). Values are plain title-case display strings, not slugs — they are not validated against any list, the same term may sit on several approaches, and they create no redirect or graph node (see `reference/approaches-template.md` for the field rule).

2. **Derive the allowed slug lists** from the actual content tree (do not hand-type them):
   ```bash
   grep -rh "^permalink:" _qualities/    | awk -F/ '{print $NF}' | sort -u   # ALLOWED_QUALITY_SLUGS
   grep -rh "^permalink:" _requirements/ | awk -F/ '{print $NF}' | sort -u   # ALLOWED_REQUIREMENT_SLUGS
   ```
   `supported_qualities` and `tradeoffs` may use only quality slugs. `related_requirements` may use only requirement slugs — use `[]` when none genuinely fit; do not invent one to fill the slot. To find requirement candidates among the 140+, grep titles/permalinks by keyword (`grep -rl "<keyword>" _requirements/`) and read the few that look relevant before including them.

3. **Generate** the page following `reference/approaches-template.md`. Choose the closest-matching *existing* quality slugs for `supported_qualities` / `tradeoffs`. Do not coin new slugs, do not use alias slugs (quality pages with `alias_of:` are redirects — `self-healing` → use `autonomy`; the canonical page lists only approaches that name its own slug), and do not use compound slugs (`reliability-availability` is forbidden — pick `reliability` or `availability`). When a slug's fit is unclear, open its quality page under `_qualities/` and confirm the note you would write is actually true of it. An approach may share its name with a quality (e.g. `graceful-degradation` is also a quality); omit that self-named slug from `supported_qualities` unless it carries a distinct, non-circular note.

   **Describe current practice.** Write `mechanism` and `## How It Works` as teams implement the tactic in today's mainstream stacks, not as the source literature's era framed it. Example: Tolerant Reader today means a subset DTO with the deserializer set to ignore unknown properties; Fowler's 2011 XPath-style extraction is only a document-format variant. Sanity-check every mechanism bullet against how a current enterprise team would build it — the author reviews pages for exactly this.

4. **Validate.** Write the draft, then run the repository's validator and fix every error (`✗`) until it exits green:
   ```bash
   npm run validate:approach -- _approaches/<LETTER>/<slug>.md
   ```
   It parses the front matter with the same YAML parser as the build and mechanically checks: all `supported_qualities` / `tradeoffs` slugs ∈ ALLOWED_QUALITY_SLUGS; all `related_requirements` slugs ∈ ALLOWED_REQUIREMENT_SLUGS; all `related` slugs exist as approach files and are not double-declared on the counterpart page; every `*_notes` key matches a slug in its own array; `tags` ⊆ the 9 dimensions; no node-ID collision; `aka` terms not reused on another approach; body structure (allowed `##` set, no `###`); `layout`, `permalink`, filename, and letter directory; that every local image exists and every SVG is well-formed; and that every `/references/#anchor` link hits an anchor on the References page. It reports the body word count (template counting method) and **warns** — never errors — on length. Treat each warning as a prompt to tighten: a body above the target is fine when the extra words carry trade-offs or failure modes, not when they restate. Pass several files to check a batch (`npm run validate:approach -- _approaches/*/*.md`).

5. **Write** to `_approaches/<LETTER>/<slug>.md`, where `<LETTER>` is the **uppercase first letter** of the slug (`graceful-degradation` → `_approaches/G/graceful-degradation.md`). Create the letter directory if it does not exist.

6. **Companion artifacts** (established site conventions):
   - **Diagram:** hand-authored SVG at `assets/img/approaches/<slug>.svg`, referenced with `![alt](/assets/img/approaches/<slug>.svg)` right after the overview paragraphs (the image line is excluded from the body word count). Site palette — violet `#682d63`, teal `#5fb49c`, blue `#00b8f5`, orange `#e88a55`/`#ffad80`, neutral `#f8f9fa` — with `<title>`/`<desc>` accessibility markup; check well-formedness with `xmllint --noout`. Keep the diagram consistent with the body's example.
   - **Planning status:** in `TODO/approaches/approaches-planning-and-status.md`, mark the approach's row done (`✅` in the status column, `—` in the prio column); add a row in the fitting section if none exists. If an older dated proposal doc in `TODO/approaches/` (e.g. `*-tactics-260610.md`) lists the approach, tick it there too.
   - **Link back:** for every existing approach that mentions the new one in prose (the overlap-check hits from step 1), turn the mention into a link to `/approaches/<slug>`, or add a `related:` entry when the two are genuinely adjacent — on **one** page only (the new page or the counterpart, never both). Re-run the validator on every page you touched.

7. **Report and hand off.** Print:
   - the file paths written (page, SVG, planning file, linked-back pages);
   - the exact slugs used for each list, so the author can eyeball them;
   - the body word count and any remaining validator warnings, with a one-line reason for each one kept; and
   - this manual checklist (the skill does **not** do these):
     1. `docker compose restart` — regenerates graph data.
     2. Open the page; confirm every note renders and no "No … specified" placeholder appears where content was intended. If the page declares `related:`, check the counterpart page shows the reverse relation.
     3. Stage the files explicitly by name (no `git add -A` / globs); commit `content: add <slug> approach`.

## Common mistakes

| Mistake | Consequence | Fix |
|---|---|---|
| Slug not in the allowed list | Silently dropped; note vanishes | Derive lists in step 2; pick only from them |
| `*_notes` key not in its array | Note renders nowhere | Key every note to a slug present in the array |
| Compound slug (`reliability-availability`) | No match → dropped | Use a single existing slug |
| Tag outside the 9 dimensions | Broken tag link / missing tag page | Use only the 9 |
| `###` heading in body | Breaks the document outline | Use `##` only |
| Declaring `related:` on both pages | Relation renders twice; duplicate graph edge | Declare one-sided; check the counterpart first |
| Counting `## Example` / image line into the body budget | False over-budget alarms, needless trimming | Use the validator's count |
| Trimming trade-offs or failure modes to hit the body target | The page loses what makes it worth reading | The body target is soft; cut restatement and overview first |
| Writing a page for a tactic an existing page covers as a variant | Two thin pages instead of one strong one | Run the overlap check in step 1 |
| Link to a `/references/#anchor` that does not exist | Link lands at the top of the References page | Add the entry to `_pages/85-references.md` or cite without the anchor |
| Restarting Docker or committing here | Out of scope; surprises the author | Stop after writing; hand off the checklist |
