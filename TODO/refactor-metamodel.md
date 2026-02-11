# Metamodel Terminology Refactor Plan

## Goal
Rename the Q42 terminology to:
- **Dimensions** = the 9 top-level tags/pillars (formerly “properties”).
- **Quality characteristics** (short: characteristics) = the 189+ specific qualities.
- **Facets** = the former “three dimensions of quality” model.

Additionally:
- Rename the `/properties/` path and related pages to the new wording.
- Rename `tag-<abc>` pages to match the new wording (exact naming scheme TBD).

Graphics will be updated manually by Gernot (no file changes for images).

## Ground Rules
- **Permalinks will change** where we rename `/properties/` and `tag-<abc>` pages. Provide redirects where possible.
- Avoid global search/replace. Change only when “property/properties” refers to the 9 pillars.
- Use “quality characteristics” on first mention, then “characteristics” where clear.
- The nine **Dimensions** overlap; explicitly avoid implying orthogonality.

## Change Plan (Detailed)
1. **Core vocabulary + meta model pages**
   - Update terminology in:
     - `/Users/gernotstarke/projects/arc42/quality.arc42.org-site/_pages/10-how-to-use-this-site.md`
     - `/Users/gernotstarke/projects/arc42/quality.arc42.org-site/_pages/1-home.md`
     - `/Users/gernotstarke/projects/arc42/quality.arc42.org-site/_pages/22-properties.md` (title + body; **permalink will change**)
   - Replace “Property/Properties” (9 pillars) → “Dimension/Dimensions (tags)”.
   - Replace “qualities” (189 list) → “quality characteristics” where it refers to the list.
   - Rename “Three Dimensions of Quality” → “Three Facets of Quality”.
   - Add a short note near metamodel diagram: “In the diagram, ‘property’ corresponds to what we now call a dimension (tag).”

2. **Qualities list & requirement pages**
   - Update:
     - `/Users/gernotstarke/projects/arc42/quality.arc42.org-site/_pages/20-qualities.md` (title/intro to “Quality Characteristics”)
     - `/Users/gernotstarke/projects/arc42/quality.arc42.org-site/_pages/30-quality-requirements.md` (properties/tags → dimensions/tags)
   - Decide whether navigation labels should change (see step 4).

3. **Articles and long-form explanations**
   - Update terminology in:
     - `/Users/gernotstarke/projects/arc42/quality.arc42.org-site/_articles/05-arc42-quality-model.md`
     - `/Users/gernotstarke/projects/arc42/quality.arc42.org-site/_articles/01-challenge-with-quality.md`
     - `/Users/gernotstarke/projects/arc42/quality.arc42.org-site/_articles/03-iso-25010-shortcomings.md`
   - Be careful with ISO quotes: keep “characteristics” when quoting ISO; only reword Q42-specific language.

4. **Navigation & UI labels**
   - Search for nav labels in `_data`, layouts, includes, and the search UI for:
     - “Quality Properties”
     - “Qualities by Name”
     - “properties/tags” in menus
   - Update to:
     - “Quality Dimensions”
     - “Quality Characteristics by Name” (keep permalink `/qualities/`)

5. **Path and page renames**
   - Rename `/properties/` page path to `/dimensions/` (or agreed target).
   - Update all internal links pointing to `/properties/`.
   - Provide redirects (or alias front matter) for `/properties/` if we want backward compatibility.
   - Rename `tag-<abc>` pages to the new terminology:
     - Decide naming scheme: `dimension-<abc>` or `dimension-<abc>` with `/dimension-<abc>/` permalinks.
   - Update all internal links referencing `/tag-<abc>/`.
   - Ensure includes that generate tag links use the new path.

6. **CSS/JS text usage and UI labels**
   - Search `assets/css/**`, `assets/js/**`, `src/**`, `_includes/**`, `_layouts/**` for:
     - user-facing strings like “property”, “properties”, “qualities”, “tags”
   - Update visible labels to “dimensions” / “characteristics” as appropriate.
   - **Keep class names unless user-facing** (e.g., `.tag-box`, `.tags` can stay unless they show as labels).

7. **Graphs/data outputs (if any labels exist)**
   - Search in `src/graphs/**`, `assets/data/**`, `assets/js/**` for “properties”/“qualities” labels.
   - Update labels if they are user-visible strings.
   - Regenerate data only if source strings change.

8. **Content scan & cleanup**
   - Use targeted `rg` scans for:
     - “top-level properties”
     - “properties (tags)”
     - “qualities” where it actually means the 189 characteristics
   - Update only where it aligns with the new taxonomy.

9. **QA checklist**
   - Verify that the 9 dimensions are still shown as tags in `/properties` (renamed to “dimensions”).
   - Verify that “Three Facets of Quality” reads consistently.
   - Spot-check a few pages for mixed usage (e.g., “property” in old sense).
   - No broken links due to title changes.
   - Verify redirects/aliases for old paths.

---

# GitHub Issue Draft (Main)

**Title**: Refactor metamodel terminology: Dimensions + Quality Characteristics + Facets

**Context**
We will rename the nine top-level “properties/tags” to **Dimensions**, the 189+ “qualities” to **Quality Characteristics**, and the old “Three Dimensions of Quality” model to **Three Facets of Quality**. Graphics will be updated separately by Gernot.

**Why**
- Reduce confusion about “property” vs. quality attribute.
- Align with ISO terminology for “quality characteristics”.
- Make stakeholder communication clearer and more consistent.

**Decisions**
- 9 pillars = **Dimensions** (tags, overlapping, not orthogonal).
- 189+ items = **Quality Characteristics** (short: characteristics).
- “Three Dimensions of Quality” → **Three Facets of Quality**.
- Rename `/properties/` path to `/dimensions/` (or agreed final path).
- Rename `tag-<abc>` pages to new dimension pages (naming scheme to be chosen).

**Acceptance Criteria**
- No “property/properties” refers to the 9 pillars in user-facing text.
- “Quality characteristics” is used for the 189+ list where appropriate.
- “Facets” replaces “dimensions” in the 3‑facet model.
- Navigation labels align with new terminology.
- Old `/properties/` and `/tag-<abc>` paths redirect or alias to new locations.
- Graphics are updated manually (out of scope for this PR).

**Out of scope**
- Replacing ISO quotations.
- Editing graphics (handled by Gernot).

**Implementation checklist**
- Update core pages: home, how-to-use, properties/dimensions.
- Update qualities list + requirements page terminology.
- Update articles with Q42 language (avoid ISO quotes).
- Update nav/UI labels.
- Sweep for residual wording conflicts.

## Sub-Issues (proposed)

1. **Rename core pages terminology**
   - Update `/1-home`, `/10-how-to-use-this-site`, `/22-properties`.
   - Rename headings/labels to Dimensions / Quality Characteristics / Facets.

2. **Qualities list + requirements page terminology**
   - Update `/20-qualities` and `/30-quality-requirements`.
   - Ensure the intro text matches new terms.

3. **Article updates (Q42-specific)**
   - Update `/articles/arc42-quality-model` and `/articles/challenge-with-quality`.
   - Update `/articles/iso-25010-shortcomings` only for Q42 terms.

4. **Navigation + UI labels**
   - Update nav labels (data/layouts/includes) to “Quality Dimensions” and “Quality Characteristics”.

5. **Path renames + redirects**
   - Rename `/properties/` → `/dimensions/` and update internal links.
   - Rename `tag-<abc>` → new scheme and update internal links.
   - Add redirects/aliases for the old paths.

6. **CSS/JS visible strings**
   - Update user-facing strings in CSS/JS/templates (leave class names unless necessary).

7. **String sweep + QA**
   - Targeted `rg` sweep for “top‑level properties”, “properties (tags)”, “qualities” (when meaning characteristics).
   - Spot check pages and confirm no mixed usage remains.

---

## Notes / Risks
- “Dimensions” can imply orthogonality. We should add a short note in the terminology table to clarify they can overlap.
- Ensure “characteristics” doesn’t conflict with specific ISO‑related statements or citations.
