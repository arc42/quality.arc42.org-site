# Action Plan: Integrating Solution Approaches into quality.arc42.org

This plan defines how to scale the approaches section to 100+ entries with stable quality and low editorial drift.

## Foundation Decisions (Locked)

1. **Entity definition**
   - An approach is an architectural tactic or pattern.
   - It is not a product, library, or vendor tutorial.

2. **Scope**
   - Approaches are tagged against **9 top-level dimensions**:
     - `suitable`, `usable`, `secure`, `reliable`, `operable`, `efficient`, `flexible`, `safe`, `maintainable`

3. **Canonical template**
   - Single source of truth: `TODO/approaches/TEMPLATE.md`.
   - Every new approach page must conform to that template.

4. **Schema constraints**
   - `supported_qualities` uses existing quality slugs only.
   - `tradeoffs` stays an array of simple quality slug strings.
   - Required page-level metadata includes `tags` and `permalink`.

## Content Model (Required Fields)

Each approach page in `_approaches/` must contain:

- `layout: approach`
- `title`
- `tags` (1-3 values from the 9 dimensions)
- `supported_qualities` (array of existing quality slugs)
- `tradeoffs` (array of existing quality slugs)
- `intent` (single sentence)
- `mechanism` (single paragraph)
- `applicability` (single paragraph)
- `permalink` (unique, kebab-case)

Body expectations:

- 1-2 short overview paragraphs.
- Max 4 `##` headings to avoid header-heavy pages.
- Verification content must include measurable checks.

## Phased Delivery

### Phase 1: Baseline Alignment

- Create and lock the canonical template.
- Align generation prompt and backlog documents to the same schema.
- Confirm all contributors use the same field rules.

Exit criteria:

- `TEMPLATE.md`, `approaches-prompt.md`, and `approaches-todo.md` are schema-consistent.

### Phase 2: Pilot Set

- Implement 6-10 approaches across high-impact areas (for example reliability and efficiency).
- Validate rendering quality and cross-link usefulness.

Exit criteria:

- Pilot pages pass maintainer review for clarity, trade-offs, and verification depth.

### Phase 3: Scale-Out

- Expand incrementally to all 9 dimensions.
- Keep pages concise and consistent with the template.
- Review in small PR batches (max 3 approaches per PR).

Exit criteria:

- Stable quality across batches; no schema drift.

## Technical Integration

- Keep `_approaches` collection and `_layouts/approach.html` as rendering baseline.
- Ensure `supported_qualities` and `tradeoffs` values resolve to existing `/qualities/<slug>`.
- Maintain bidirectional navigation:
  - quality pages -> related approaches
  - approach pages -> supported qualities and trade-offs

## Quality Gates

For every new approach page:

- Conforms to `TODO/approaches/TEMPLATE.md`.
- Uses only valid quality slugs in `supported_qualities` and `tradeoffs`.
- Uses only the 9 allowed dimension tags.
- Provides non-generic trade-offs.
- Provides at least 3 measurable verification ideas.
- Contains no broken internal links.

Repository-level checks:

- `npm run build` succeeds.
- `npm run test:links` reports no approach link errors.
- No permalink collisions.

## Risks and Mitigations

- Risk: inconsistent metadata at scale.
  - Mitigation: enforce single canonical template.
- Risk: header-heavy, hard-to-scan pages.
  - Mitigation: cap heading count and use concise section structure.
- Risk: generic, low-value content.
  - Mitigation: verification/trade-off quality gate and maintainer review.
- Risk: too-large PRs reduce review quality.
  - Mitigation: small batched PRs.

## Definition of Done

The initiative is successful when:

- Approach pages are consistent, concise, and practically useful for architecture decisions.
- Cross-linking from qualities to approaches is reliable.
- The workflow can sustain 100+ entries without schema drift.
