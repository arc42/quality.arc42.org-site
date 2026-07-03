---
name: write-standards
description: Use when creating, drafting, or generating a new standard page for quality.arc42.org — a file under `_standards/<group>/<name>.md`. Triggers on requests like "add the X standard", "write a standards page for X", or turning source notes in TODO/standards/ into a standard page.
---

# Write Standards

## Overview

Generate one factually verified standard page for `quality.arc42.org`, ready to drop into `_standards/`, **plus** the quality-page front-matter updates that wire it into the graph. The hard parts are (1) accuracy — every version, year, and clause must trace to a retrieved source — and (2) bidirectionality: the quality-attributes table on the standard page is prose, while the graph node, its edges, and the page's "Related Qualities" list all derive from the `standards:` arrays in `_qualities/` front matter. A standard no quality references has **no graph node at all**, and a table row without its front-matter backlink silently renders nowhere except the table.

**Scope:** write the standard file and update the referencing quality pages. Do **not** restart Docker, do **not** commit — the author reviews the render and commits.

## Rules source — read this first

Everything about _what a good standard page contains_ — front-matter schema, directory placement, body structure, table and references format, sourcing rules, and the definition of done — lives in one canonical, self-contained file:

- `reference/standards-template.md`

Read it before generating. This `SKILL.md` owns the **procedure**; the template owns the **rules**. Where a step below touches a convention, the authoritative wording lives in the template — do not restate it here.

## Procedure

1. **Resolve inputs.**

   - `STANDARD_NAME` and `SHORTNAME` from the request (e.g. `IHE`, `ISO/IEC 24028`).
   - `STANDARD_ID` and permalink slug per the template's front-matter rules.
   - Check `TODO/standards/` for author-supplied source notes (e.g. `<NAME>_Beschreibung.md`) and use them as input material — structure and emphasis, not verification.
   - **Stop if it already exists:** `grep -ri "^standard_id: <id>" _standards/` and check the permalink. Some standards are covered as a section of a sibling page instead of their own (e.g. FHIR inside `hl7.md`) — search body text for the name before concluding it is absent.
   - **Stop on a node-ID collision.** The `standard_id` becomes the graph node ID, and qualities, requirements, approaches, and standards share one node namespace. Check it against the slug lists from step 2 and against existing approach slugs.

2. **Derive the allowed lists** from the actual content tree (do not hand-type them):

   ```bash
   grep -rh "^permalink:" _qualities/    | awk -F/ '{print $NF}' | sort -u   # ALLOWED_QUALITY_SLUGS
   grep -rh "^permalink:" _approaches/ _requirements/ | awk -F/ '{print $NF}' | sort -u  # collision check only
   grep -m1 "category_order" _pages/40-quality-standards.md                   # canonical categories
   ```

   The quality-attributes table may link only `ALLOWED_QUALITY_SLUGS`; `categories` may use only the canonical category list.

3. **Research.** Fetch authoritative sources per the template's sourcing rules; collect every URL used — the References section may cite only sources actually retrieved and verified (topic **and** version — see the iso.org gotcha in the template).

4. **Write** the page to `_standards/<group>/<slug>.md` following the template (directory table decides `<group>`). Then run `npx prettier --write` on the file.

5. **Sync quality pages (creates the graph edges).** For every quality linked in the table, add `STANDARD_ID` to that quality's `standards:` front-matter array (append at the end) unless already present. Skipping a quality here is the classic failure: the table looks complete while the graph and the "Related Qualities" list stay silent.

6. **Validate before hand-off.** Every check must pass:

   - Bidirectionality, mechanically:

     ```bash
     grep -o "(/qualities/[a-z-]*)" _standards/<group>/<slug>.md | sort -u        # table side
     grep -rlw "<standard_id>" _qualities/                                         # front-matter side
     ```

     Every slug from the first list must have its quality file in the second.

   - Every table slug ∈ ALLOWED_QUALITY_SLUGS; `categories` ⊆ canonical list.
   - `npx prettier --check` passes on the new file.
   - `npm run test:links` reports zero errors.

7. **Report and hand off.** Print:
   - the file path written and every quality file touched;
   - the quality slugs linked in the table, so the author can eyeball them;
   - any fact that could not be verified (flag it — do not silently keep it); and
   - this manual checklist (the skill does **not** do these):
     1. `docker compose restart` — regenerates graph data.
     2. Open the page; confirm the "Related Qualities" list matches the table and the category chips render.
     3. Stage the standard file **and** each touched quality file explicitly by name (no `git add -A` / globs); commit `content: add <shortname> standard`.

## Common mistakes

| Mistake                                                            | Consequence                                                        | Fix                                                  |
| ------------------------------------------------------------------ | ------------------------------------------------------------------ | ---------------------------------------------------- |
| Quality linked in table but `standards:` array not updated         | No graph edge; missing from "Related Qualities"; no error anywhere | Step 5 + the mechanical check in step 6              |
| No quality references the new `standard_id`                        | Standard has no graph node at all                                  | Step 5 is not optional                               |
| Category outside the canonical list                                | Chip renders, but no section on `/standards/` overview             | Derive the list in step 2; pick only from it         |
| `standard_id` styled after the shortname (`iso-25010`, `ISO25010`) | Quality references never match                                     | Follow the template's convention; check existing IDs |
| Renaming an existing `standard_id`                                 | Every referencing quality silently loses its edge                  | Never rename; IDs are permanent                      |
| iso.org link cited unopened                                        | Wrong topic or withdrawn edition (it has happened)                 | Open every URL; confirm title + year                 |
| Hand-padded table                                                  | Drifts from Prettier style; noisy future diffs                     | `npx prettier --write` in step 4                     |
