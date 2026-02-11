# Project Plan: Add `#maintainable` as Top-Level Dimension

## Goal
Introduce **`#maintainable`** as a ninth top-level Q42 dimension, while keeping model clarity and minimizing disruption for existing links and navigation.

## Context
- Current model promotes 8 top-level dimensions and treats maintainability under `#flexible`.
- This change affects:
  - content taxonomy (`tags` in qualities/requirements/approaches),
  - top-level dimension pages and highlights,
  - graph/data generation and derived assets,
  - explanatory text that explicitly says "8 dimensions".
- Some image updates will be done manually by Gernot.

## Scope
- Add and integrate new top-level dimension `#maintainable`.
- Keep old links working where possible (redirects/aliases where needed).
- Retag selected qualities/requirements/approaches from `#flexible` to include `#maintainable` (not blind global replacement).
- Update user-facing copy from "8" to "9" where it describes top-level dimensions.
- Regenerate graph/data assets.

## Out of Scope
- Manual image editing/replacement (handled separately).
- Deep conceptual rewrite of all articles beyond targeted wording updates.

## Working Assumptions
- We keep `#flexible` (do not remove it), but narrow overlap by moving maintainability-focused content to include `#maintainable`.
- For transition, some items may remain tagged with both `flexible` and `maintainable`.
- Primary compatibility target: existing public permalinks should not break.
- Confirmed taxonomy decisions from #335:
  - `_qualities/M/maintainability.md` target state is only `#maintainable`.
  - `_qualities/V/verifiability.md` target state is `reliable + maintainable` (remove `flexible`).
  - `_qualities/U/updateability.md` and `_qualities/U/upgradeability.md` target state is `operable + maintainable` (remove `flexible`).

---

## Proposed GitHub Issue Structure

### Top-Level Issue (Epic)
**Title**: Add `#maintainable` as 9th top-level quality dimension

**Description**
- Introduce `#maintainable` into the Q42 top-level model.
- Update pages, tagging, graph/data, and navigation to make it first-class.
- Preserve backward compatibility for existing links and references.

**Acceptance Criteria**
- `#maintainable` appears alongside existing top-level dimensions in core pages.
- A dedicated `/tag-maintainable/` page exists and is discoverable.
- Relevant content is retagged based on defined mapping rules.
- Graph/data includes `maintainable` as top-level property node.
- All checks/build steps pass and no obvious broken links/navigation regressions remain.

---

### Sub-Issue 1
**Title**: Define taxonomy and retagging rules for `#maintainable`

**Purpose**
- Create explicit mapping rules to decide what gets `maintainable` vs. `flexible` vs. both.

**Deliverables**
- Short decision table in issue body (or ADR-style note):
  - "maintainability-centric" qualities (e.g., modifiability, analysability, testability, code-readability, debuggability, traceability, etc.)
  - "adaptation/context/runtime-centric" qualities remain primarily in `flexible`
  - overlap rules for dual-tagging.

**Acceptance Criteria**
- List of files to retag is explicit and reviewable before edits.
- No bulk/automatic replacement without semantic review.

---

### Sub-Issue 2
**Title**: Add dedicated dimension page `/tag-maintainable/`

**Purpose**
- Provide first-class definition page for new top-level dimension.

**Deliverables**
- New file `_pages/tag-maintainable.md` with:
  - intro and concise definition,
  - acceptance criteria prompts,
  - stakeholder table,
  - includes for related qualities/requirements/approaches/standards.

**Acceptance Criteria**
- Page renders and includes populated lists based on tags.
- Internal linking style mirrors existing top-level tag pages.

---

### Sub-Issue 3
**Title**: Update top-level dimension listings and highlighting logic

**Purpose**
- Integrate `maintainable` into all "top-level dimension" UI sections.

**Deliverables**
- Update hard-coded top-level sets in the files listed below.

**Concrete file checklist** (every file with a hard-coded dimension list or "8"/"eight" count):

| File | What to change |
|------|----------------|
| `_data/standard_tags.yaml` | **Single source of truth.** Add `- maintainable` to the `tags` list (lines 5-13). The graph data generator reads from this file. |
| `_pages/10-quality-dimensions.md` | Add `or tag == "maintainable"` to the three `{% if tag == ... %}` conditionals (lines 40, 75, 111) that highlight top-level dimensions for qualities, requirements, and approaches. |
| `_pages/01-home.md` | (1) Add a Liquid counting block for `maintainable` (follow the pattern at lines 62-92). (2) Add a row for `#maintainable` to the dimension table (lines 94-103). (3) Change "8 important system dimensions" to "9" (line 35). |
| `_articles/05-arc42-quality-model.md` | (1) Line 13: "just 8 key system dimensions" → 9. (2) Line 30: "only 8 adjectives" → 9. (3) Line 39: "8 key dimensions" → 9. (4) Line 50: "eight fundamental" → "nine fundamental". (5) Line 75: rename section heading "Just Eight, not 35" → "Just Nine, not 35". (6) Lines 79-88: add a 9th row to the tag table for `#maintainable`. |
| `_articles/03-iso-25010-shortcomings.md` | Line 173: "just eight key dimensions" → "just nine key dimensions". |
| `_pages/05-how-to-use-this-site.md` | Line 31: dimension example list mentions `#flexible, #efficient, #reliable etc.` — add `#maintainable` to the examples. |
| `CLAUDE.md` | Update dimension counts and lists (multiple occurrences of "8" and the dimension table). |
| `README.md` | Update any references to dimension count if present. |

**Acceptance Criteria**
- `#maintainable` appears in highlighted top-level dimensions.
- Counts are shown consistently.
- No stale "8 dimensions" text remains in core explanatory pages.

---

### Sub-Issue 4
**Title**: Retag qualities/requirements/approaches for maintainability

**Purpose**
- Apply agreed taxonomy to content front matter.

**Deliverables**
- Update `tags` fields across selected:
  - `_qualities/**/*.md`
  - `_requirements/**/*.md`
  - (and `_approaches/**/*.md` if applicable)
- Ensure maintainability page itself has `tags: [maintainable]` (and optional transitional `flexible` only if agreed).

**Acceptance Criteria**
- Retagged set matches rules from Sub-Issue 1.
- No malformed front matter.
- Tag pages reflect new grouping after data regeneration.

---

### Sub-Issue 5
**Title**: Update graph/data generation and regenerated assets

**Purpose**
- Ensure `maintainable` is represented in generated JSON/JS graph artifacts.

**Deliverables**
- Run `npm run data` and `npm run build` as needed.
- Commit updated generated files under `assets/data` and bundled JS where changed.

**Acceptance Criteria**
- Full/home graph shows `maintainable` node with expected links.
- No missing node/link errors in browser console (smoke test).

---

### Sub-Issue 6
**Title**: Narrow `#flexible` definition and ensure compatibility

**Purpose**
- After the split, `#flexible` should focus on product adaptability/runtime concerns and no longer cover developer/maintenance concerns.
- Avoid regressions for current navigation and external links.

**Deliverables**
- **Update `_pages/tag-flexible.md`**: Narrow the definition text, "Typical Acceptance Criteria" section, and stakeholder table to focus on adaptation, scalability, portability, and runtime configurability. Remove or de-emphasize references to developer-facing maintainability concerns (modifiability, testability, analysability) that now belong under `#maintainable`.
- Keep `/tag-flexible/` functional and meaningful post-split.
- Add alias/redirect if any renamed paths are introduced.
- Quick scan for links to old assumptions.

**Acceptance Criteria**
- `/tag-flexible/` definition no longer implies maintainability concerns.
- No 404s for existing top-level dimension pages.
- Internal links from updated pages resolve correctly.

---

### Sub-Issue 7
**Title**: Manual image and diagram updates (owner: Gernot)

**Purpose**
- Update diagrams that visually encode 8 top-level dimensions.

**Deliverables**
- Replace/update relevant static images.
- Confirm captions and nearby explanatory text match 9-dimension model.

**Acceptance Criteria**
- Diagrams no longer contradict text/model.
- Visual assets are consistent with new taxonomy.

---

### Sub-Issue 8
**Title**: QA sweep and content consistency

**Purpose**
- Final pass for terminology and functional correctness.

**Deliverables**
- Targeted scans for phrases:
  - "8 top-level dimensions", "eight dimensions", "just 8", "just eight",
  - hard-coded top-level tag lists missing `maintainable`,
  - outdated explanations around `flexible`.
- **Include non-content files in sweep**: `CLAUDE.md`, `README.md`, `TODO/refactor-metamodel.md` (which hardcodes "8 dimensions" in lines 5, 19, 82, 95, 103).
- Local smoke test with Docker and key pages.

**Acceptance Criteria**
- No major inconsistencies in main navigation and key landing pages.
- Graphs and tag pages render correctly.
- Developer-facing docs (`CLAUDE.md`, `README.md`) reflect the 9-dimension model.

---

## Step-by-Step Execution Plan

1. **Lock taxonomy first**
   - Finalize which content is `maintainable`, `flexible`, or both.
   - Produce file list before edits.

2. **Create `tag-maintainable` page**
   - Add `_pages/tag-maintainable.md` using existing top-level tag page structure.

3. **Integrate into top-level logic**
   - Update home counters/table and dimensions-page highlight conditions.
   - Update textual references from 8 -> 9 where this model is described.

4. **Retag content**
   - Apply curated front-matter edits in qualities/requirements/(approaches).
   - Keep commits reviewable (logical chunks).
   - Execute as two passes:
     - Pass A: add `maintainable` where defined by taxonomy.
     - Pass B: apply target-state cleanup and remove `flexible` from explicitly decided files.

5. **Regenerate data and bundles**
   - Run generation/build scripts.
   - Review diffs in generated assets for expected `maintainable` node/edges.

6. **Manual image pass (Gernot)**
   - Update diagrams and static visuals as needed.

7. **QA and cleanup**
   - Run local smoke test, verify key paths and graph behavior.
   - Final scan for stale "8-dimension" claims and missing `maintainable` in hard-coded top-level sets.

8. **Prepare GH issue creation**
   - Create Epic and sub-issues from this plan.
   - Link dependencies/order and attach checklist.

---

## Suggested Issue Dependencies
- Sub-Issue 1 is a prerequisite for Sub-Issue 4.
- Sub-Issue 2 and Sub-Issue 3 can run in parallel after taxonomy is agreed.
- Sub-Issue 5 depends on Sub-Issue 4.
- Sub-Issue 6 and Sub-Issue 8 depend on Sub-Issue 5.
- Sub-Issue 7 can run anytime after Sub-Issue 3 clarifies final wording/model.

## Risk Register
- **Overlapping semantics**: maintainable vs flexible boundary stays fuzzy.
  - Mitigation: explicit mapping rules + allow dual-tagging where justified.
- **Message inconsistency**: text says 9 dimensions while images still show 8.
  - Mitigation: dedicated manual-image sub-issue and release gating check.
- **Generated artifact drift**: stale built assets committed.
  - Mitigation: regenerate at end and review diffs focused on new node/edges.
- **Conflict with metamodel refactor plan** (`TODO/refactor-metamodel.md`): That plan hardcodes "8 dimensions" throughout and plans path renames (`/properties/` → `/dimensions/`, `tag-<abc>` → new scheme). If both plans execute independently, they will create merge conflicts and duplicate work.
  - Mitigation: decide sequencing — either complete the maintainable addition first (simpler, fewer moving parts) and then run the metamodel refactor against the 9-dimension model, or combine both into a single coordinated effort.

## Definition of Done (Project)
- Epic + sub-issues created and linked.
- `#maintainable` fully integrated as top-level dimension in content, navigation, and graphs.
- Manual visuals updated.
- Local smoke checks pass with no major regressions.
