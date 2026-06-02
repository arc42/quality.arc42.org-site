---
name: write-approach
description: Use when creating, drafting, or generating a new solution-approach page for quality.arc42.org — a file under `_approaches/<LETTER>/<slug>.md`. Triggers on requests like "write the X approach", "add an approach for X", or working through the approaches backlog in TODO/approaches/.
---

# Write Approach

## Overview

Generate one validated approach page for `quality.arc42.org`, ready to drop into `_approaches/`. The hard part is not the prose — it is making every `supported_qualities`, `tradeoffs`, and `related_requirements` slug resolve against a real content page. A slug that does not match an existing page is **silently dropped** by the layout (no build error): the note vanishes, and the section can render a "No … specified" placeholder. This skill derives the allowed slugs from the content tree and validates against them *before* the file is written.

**Scope:** generate and write the file. Do **not** restart Docker, do **not** commit — the author reviews the render and commits.

## Rules source — read these first

Voice, length budgets, output format, and the full schema live in two reference files alongside this skill. Read both before generating:

- `reference/approaches-prompt.md` — voice, length budgets, body-section rules, words to avoid.
- `reference/approaches-template.md` — canonical front-matter schema, body skeleton, definition of done.

Where they disagree, **the template wins**.

## Procedure

1. **Resolve inputs.**
   - `APPROACH_NAME` from the request (e.g. `Graceful Degradation`).
   - `APPROACH_SLUG` = kebab-case of the name (e.g. `graceful-degradation`).
   - **Stop if it already exists.** If `_approaches/<LETTER>/<slug>.md` is already present, do not overwrite — report it and ask the author before proceeding.
   - **Stop on a node-ID collision.** The graph node ID is the last permalink segment, and qualities, requirements, and approaches share one node namespace (one `nodes.json`). If `<slug>` already exists as a quality or requirement slug (check the lists from step 2), the two pages collapse into a single graph node and one is silently dropped, conflating their edges. Do not create the approach under that slug — report the clash and ask the author (rename the approach, or treat the term as a quality, not a tactic).
   - Check `TODO/approaches/approaches-planning-and-status.md` and `approaches-todo.md` for the approach — they often list suggested `tags`, `supported_qualities`, and `tradeoffs` candidates. Treat these as proposals, not truth: every slug is still validated in step 4. Prefer the planning-file `tags` when present and sensible.
   - `tags`: 1–3 of the 9 dimensions only — `suitable usable secure reliable operable efficient flexible safe maintainable`.

2. **Derive the allowed slug lists** from the actual content tree (do not hand-type them):
   ```bash
   grep -rh "^permalink:" _qualities/    | awk -F/ '{print $NF}' | sort -u   # ALLOWED_QUALITY_SLUGS
   grep -rh "^permalink:" _requirements/ | awk -F/ '{print $NF}' | sort -u   # ALLOWED_REQUIREMENT_SLUGS
   ```
   `supported_qualities` and `tradeoffs` may use only quality slugs. `related_requirements` may use only requirement slugs — use `[]` when none genuinely fit; do not invent one to fill the slot. To find requirement candidates among the 140+, grep titles/permalinks by keyword (`grep -rl "<keyword>" _requirements/`) and read the few that look relevant before including them.

3. **Generate** the page following the two reference files. Choose the closest-matching *existing* quality slugs for `supported_qualities` / `tradeoffs`. Do not coin new slugs, and do not use compound slugs (`reliability-availability` is forbidden — pick `reliability` or `availability`). When a slug's fit is unclear, open its quality page under `_qualities/` and confirm the note you would write is actually true of it. An approach may share its name with a quality (e.g. `graceful-degradation` is also a quality); omit that self-named slug from `supported_qualities` unless it carries a distinct, non-circular note.

4. **Validate before writing.** Every check must pass:
   - Every `supported_qualities` / `tradeoffs` slug ∈ ALLOWED_QUALITY_SLUGS.
   - Every `related_requirements` slug ∈ ALLOWED_REQUIREMENT_SLUGS.
   - Every key in each `*_notes` map matches a slug present in its own array (no stray keys, no missing keys).
   - `tags` ⊆ the 9 dimensions.
   - Length budgets — count words mechanically with `wc -w` (paste each field through it), do not eyeball; nothing in the build enforces these: `intent` ≤ 25 words; `mechanism` ≤ 50; `applicability` ≤ 50; each support/requirement note ≤ 25 words; tradeoff notes ~50 (substance over padding); body ≤ 350 words total.
   - Body: ≤ 4 content `##` headings drawn from {`How It Works`, `Failure Modes`, `Verification`, `Variants and Related Tactics`}. An optional `## Example`/`## Mini Example` and `## References` do not count toward the 4. No `###` headings.
   - Front matter has `layout: approach` and `permalink: /approaches/<slug>`.

5. **Write** to `_approaches/<LETTER>/<slug>.md`, where `<LETTER>` is the **uppercase first letter** of the slug (`graceful-degradation` → `_approaches/G/graceful-degradation.md`). Create the letter directory if it does not exist.

6. **Report and hand off.** Print:
   - the file path written;
   - the exact slugs used for each of the three lists, so the author can eyeball them; and
   - this manual checklist (the skill does **not** do these):
     1. `docker compose restart` — regenerates graph data.
     2. Open the page; confirm every note renders and no "No … specified" placeholder appears where content was intended.
     3. Stage the file explicitly by name (no `git add -A` / globs); commit `content: add <slug> approach`.

## Common mistakes

| Mistake | Consequence | Fix |
|---|---|---|
| Slug not in the allowed list | Silently dropped; note vanishes | Derive lists in step 2; pick only from them |
| `*_notes` key not in its array | Note renders nowhere | Key every note to a slug present in the array |
| Compound slug (`reliability-availability`) | No match → dropped | Use a single existing slug |
| Tag outside the 9 dimensions | Broken tag link / missing tag page | Use only the 9 |
| `###` heading in body | Breaks the document outline | Use `##` only |
| Restarting Docker or committing here | Out of scope; surprises the author | Stop after writing; hand off the checklist |
