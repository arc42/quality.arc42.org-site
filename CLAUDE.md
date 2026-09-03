# CLAUDE.md — arc42 Quality Model

Jekyll site for software quality attributes, requirements, and standards. Visualizes relationships with D3.js force-directed graphs. Live at https://quality.arc42.org.

**Stack**: make (for development) · Jekyll (Ruby) · Node 22 (ESM) · esbuild · D3.js · Graphology · Docker Compose · GitHub Pages.

---

## Design Context

**Users**: Software architects, consultants, trainers using this during design reviews, workshops, and when specifying quality requirements. Secondary: students. Users have domain knowledge but need fast lookup and clear structure.

**Brand**: Authoritative & clear meets approachable & pragmatic. Three words: *precise, pragmatic, trustworthy*.

**Aesthetic**: Light theme. Editorial reference (technical handbook, not SaaS dashboard). Palette: violet header `#682d63`, teal/green `#5fb49c`, blue accents `#00b8f5`, warm orange `#ffad80`. Typography: Atkinson Hyperlegible Next (body), Libre Caslon Text (headings). 

**Principles**:
1. Clarity over decoration — every visual must aid comprehension or navigation.
2. Structure is the design — strong typographic hierarchy, consistent patterns.
3. Professional density — dense, scannable content with clear entry points.
4. Accessibility is non-negotiable — target WCAG 2.2 AA.

---

## Content Schemas

### Qualities — `_qualities/<LETTER>/<name>.md`

```yaml
---
title: Accessibility
tags: [usable]                                  # must have matching _pages/tag-<tag>.md
related: [usability, inclusivity]               # IDs = last permalink segment
standards: [iso26514, iso25024]                 # must match standard_id (case-insensitive)
permalink: /qualities/accessibility             # last segment = graph node ID
---
```

### Requirements — `_requirements/<LETTER>/<name>.md`

```yaml
---
title: Access control is enforced
tags: [secure, suitable]
related: [access-control, auditability]
permalink: /requirements/access-control-is-enforced
# optional:
source: "Attribution / citation (rendered outside the card as 'Source: ...')"
note: "Meta-commentary (free-form Markdown, rendered outside the card)"
---
```

Body is **pure Markdown** — the `requirements` layout wraps it in `.quality-requirement`. Do **not** add a `<div class="quality-requirement">` wrapper.

Section headings inside the body are `###` (h3). The page H1 is the requirement title (rendered by the section-hero), so `###` keeps the document outline coherent — `####` left a two-level skip from H1 that screen readers reported as broken structure.

**Tier 1** (simple, 1–3 criteria):
```markdown
### Requirement
[One clear statement]

### Acceptance Criteria
- [Specific, measurable, with units]
```

**Tier 2** (complex, 4+ criteria, compliance/security):
```markdown
### Context
[Why this matters — 1–3 sentences]

### Trigger
[Who/what initiates]

### Acceptance Criteria
- [Specific, measurable, with units]
```

Optional `### Measurement & Verification` section for tooling/calculation details.

All criteria must be specific, measurable, testable. Focus on *what*, not *how*.

### Standards — `_standards/<group>/<name>.md`

Standard/regulation pages (ISO, NIST, EU, …). Full schema and authoring guardrails live in the `write-standards` skill (`.claude/skills/write-standards/reference/standards-template.md`). The load-bearing field is `standard_id`: qualities reference it in their `standards:` arrays, and those arrays — not the standard's own body — generate the graph node, its edges, and the "Related Qualities" list on the standard page.

### Tag pages — `_pages/tag-<tag>.md`

Every tag used anywhere requires a tag page. Copy an existing one (e.g. `tag-efficient.md`), update title + permalink, leave the include macros alone.

### Approaches — `_approaches/<LETTER>/<slug>.md`

Solution approaches (tactics). Full schema lives in the `write-approach` skill (`.claude/skills/write-approach/reference/approaches-template.md`). One optional field worth noting here:

```yaml
aka: [Throttling]                               # optional: index terms ("also known as")
```

`aka:` is an optional YAML list of plain display strings (title-case) — **index terms**, not strict synonyms. The same term may appear on multiple approaches; aliases create **no** redirects and **no** graph nodes (unlike quality aliases). They surface in the A–Z explorer, the on-page "Also known as" block, and graph search.

---

## Graph Node Types

| Type        | Source              | Color     | Size |
|-------------|---------------------|-----------|------|
| Property    | `tags:` values      | `#f8f9fa` | 35   |
| Quality     | `_qualities/`       | `#00B8F5` | 25   |
| Requirement | `_requirements/`    | `#ffb3b3` | 15   |
| Standard    | `_standards/`       | `#FFC95C` | 45   |

Edges derive from `tags`, `related`, and `standards` fields.

---

## Critical Gotchas

- **Permalink stability**: the last permalink segment is the graph node ID. Changing it breaks all references.
- **Tag pages required**: every tag in any frontmatter must have `_pages/tag-<tag>.md`, or links 404.
- **Standard matching**: standards reference by `standard_id` (case-insensitive), not filename or title.
- **Case sensitivity elsewhere**: `related: [Accessibility]` will NOT match `accessibility`. Use kebab-case throughout.
- **Restart Docker** after adding/removing content or changing frontmatter (tags/related/permalinks) so graph data regenerates.
- **no local jekyll or ruby**: all development and testing over docker and/or make
---

## Commands


Link validator checks: quality→quality `related`, quality→tag, quality→standard, requirement→quality, requirement→tag.

---

## Conventions

- **JS**: ES Modules, include `.js` in imports, kebab-case for entry files, PascalCase for class files, Prettier-formatted (2 spaces, semicolons, 100 cols).
- **Content**: kebab-case permalinks, alphabetical subdirectories, filename ≈ permalink.
- **Bullet punctuation**: a list item that is a complete sentence ends with a full stop; a fragment (term, label, criterion, reference entry) does not. Whichever applies, **every item in the same list is punctuated the same way**. Two exceptions, both already in use: one sentence split across bullets keeps its commas and its closing full stop, and a stop belongs inside a closing quote only when the quoted material is itself a complete sentence.
- **Commits**: imperative mood with area prefix — `content: add ISO-42010`, `graph: fix edges for missing node`, `build: bump esbuild`.
- **Git staging**: stage files explicitly by name. Do not use `git add -A`, `git add .`, `git commit -am`, or globs.

---

## Repository Layout

```
_qualities/    _requirements/    _standards/    _articles/    _pages/      # content
_layouts/      _includes/        _sass/                                    # templates
src/graphs/    src/scripts/                                                # JS source
assets/data/   assets/js/                                                  # generated
_config.yml    package.json      Gemfile        docker-compose.yml
```

Build details and graph class internals live in the code — read `src/scripts/build.js`, `src/scripts/data.js`, and `src/graphs/*.js` directly when needed.
