---
name: write-requirement
description: Use when creating, drafting, or generating a quality-requirement example page for quality.arc42.org — a file under `_requirements/<LETTER>/<slug>.md`. Triggers on requests like "write a requirement for X", "add a requirement example", "close the coverage gap for X", or working through the proposals in TODO/requirements/.
---

# Write Requirement

## Overview

Generate one requirement example page for `quality.arc42.org`, ready to drop into `_requirements/`. Requirements are the site's *worked examples*: an architect reads one to see what a testable version of an abstract quality looks like.

Three things make this harder than it looks:

1. **A coverage gap is not automatically a reason to write.** The "Qualities without Requirements" analytics counts qualities with no incoming `related:` reference. Existing requirements frequently already cover the quality at criterion level and need only the missing relation. Writing a second example to move a counter produces duplication, not value.
2. **Unmatched `related:` slugs are silently dropped.** No build error — the link renders nowhere and the graph edge never appears.
3. **The graph node namespace is shared** across qualities, requirements, approaches, and standards. A colliding slug collapses two pages into one node.

**Scope:** write the page, and where the answer is a relation rather than a new page, edit that one front-matter line instead. Do **not** restart Docker, do **not** commit — the author reviews the render and commits.

## Rules source — read this first

Everything about *what a good requirement page contains* — front-matter schema, the two body modes, acceptance-criteria quality, sourcing discipline, voice, and the definition of done — lives in one canonical, self-contained file:

- `reference/requirements-template.md`

Read it before generating. This `SKILL.md` owns the **procedure**; the template owns the **rules**. Where a step below cites a convention, the authoritative wording lives in the template — do not restate it here.

Together the two are self-sufficient: you do not need to open anything else to write a correct page.

`reference/model-prompt.md` is a separate artifact — a copyable prompt for driving an *external* model, or drafting away from the repo. It is not needed here.

## Procedure

1. **Resolve inputs.**
   - `QUALITY` — the primary quality, by slug.
   - `PURPOSE` — **defaults to *illustrative example***, which is what this site publishes. Only treat it as a *project requirement* when the author says so; that changes what you may invent (see the template's Truth and Sources). Do not ask.
   - `MODE` — Quality Gate or Scenario. Defaults to Quality Gate; let the content decide. See the template.
   - **Read the quality's own page** under `_qualities/`. Use its definition, not the everyday meaning of its name. Several qualities on this site carry definitions that differ from the obvious reading, and some are known to be tangled (durability/longevity, intervenability, effectiveness).
   - Check `TODO/requirements/` for an existing proposal covering this quality. Treat any draft you find there as input, not truth.

2. **Confirm the gap is real — before drafting anything.**

   The "Qualities without Requirements" counter is defined in `_includes/about/content-analytics.md`. It is a pure membership test: a quality is flagged when no requirement's `related:` array contains that quality's permalink slug (alias stubs, which carry `alias_of`, are skipped). It is **not** a semantic coverage test, and any gap list you were handed may predate the relation that already closed it.

   ```bash
   grep -rn "^related:" _requirements/ | grep "<quality-slug>"   # already linked?
   grep -rl "<keyword>" _requirements/                           # candidates by topic
   ```

   Read the **acceptance criteria** of every plausible candidate, not just its title. A word in the context section is not coverage; a criterion that decides the quality's outcome is.

   Three outcomes — pick one before going further:

   | Finding | Action |
   |---|---|
   | The slug already appears in some requirement's `related:` | **Change nothing.** The input was stale. Report the file, and tell the author to `docker compose restart` and reload — the counter is computed at build time. |
   | A requirement covers it at criterion level but does not link it | Add the slug to that file's `related:` array. That is the whole change — do not write a second example to move a counter. |
   | No existing requirement decides this quality's outcome | Continue to step 3 and draft. |

3. **Check the slugs you intend to use** against the content tree. Test the specific slugs — do not dump the full lists into the transcript.

   ```bash
   # every slug you plan to put in `related:` must echo back:
   grep -rh "^permalink:" _qualities/ | awk -F/ '{print $NF}' | grep -x "<quality-slug>"

   # the new page's own slug must print NOTHING (any hit is a node-ID collision):
   grep -rh "^permalink:" _qualities/ _requirements/ _approaches/ _standards/ \
     | awk -F/ '{print $NF}' | grep -x "<new-slug>"
   ```

   A `related:` slug that does not echo back is not a quality and will be silently dropped.

4. **Draft the body** per `reference/requirements-template.md`. One primary quality; a second concern only as a boundary against a misleading pass. Criteria as needed, usually 1–3, never padded to a quota. Each one must yield a pass/fail verdict and say how it is observed.

5. **Add front matter and place the file** at `_requirements/<LETTER>/<slug>.md`, `<LETTER>` uppercase. Every `related:` slug must be supported by an actual acceptance criterion — if you cannot point at the criterion, drop the slug.

6. **Validate.** Fix findings until green:
   ```bash
   npm run test:links          # requirement→quality and requirement→tag resolution
   npx prettier --check <file>
   ```
   Then check by hand what the validator does not: `tags` ⊆ the nine dimensions; `###` headings only; no node-ID collision; bullet punctuation consistent within each list; every invented number carries one `Assumption:` line.

7. **Report and hand off.** Print:
   - the file path written (or the file whose `related:` you edited, and why no new page was needed);
   - the exact `related:` slugs used and, for each, the criterion that supports it; and
   - this manual checklist (the skill does **not** do these):
     1. `docker compose restart` — regenerates graph data.
     2. Open the page; confirm the metadata line lists the intended qualities and tags, and that the quality page shows the requirement under "Directly Related Quality Requirements".
     3. Stage files explicitly by name (no `git add -A` / globs); commit `content: add <slug> requirement`.

## Common mistakes

| Mistake | Consequence | Fix |
|---|---|---|
| Trusting a stale coverage report | Redoing finished work; a duplicate example | Step 2: re-check the counter's membership test against the current tree |
| Writing a new example for a gap already covered | Duplicate examples, diluted corpus | Step 2 before drafting; add the relation instead |
| Judging coverage by title | Misses real coverage, invents duplicates | Read the acceptance criteria |
| `related:` slug not a real quality permalink | Silently dropped; link and graph edge vanish | Derive the list in step 3; pick only from it |
| Title-case or compound slug | No match → dropped | Kebab-case, one existing slug |
| `related:` slug no criterion supports | Overstated relation; misleads the reader | Point at the criterion or drop the slug |
| Tag outside the nine dimensions | Broken tag link | Use only the nine |
| `##` or `####` headings in the body | Broken document outline for screen readers | `###` only |
| Padding to three criteria | Overlapping, undecidable criteria | One decisive criterion is better |
| Invented number presented as a benchmark | Fabricated authority | One `Assumption:` line, or retrieve a real source |
| Citing a standard or law from memory | Unverifiable claim on a reference site | Retrieve and verify, or omit |
| Restarting Docker or committing here | Out of scope; surprises the author | Stop after writing; hand off the checklist |
