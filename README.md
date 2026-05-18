# arc42 Quality Model

Definitions, examples, and relationships for **software quality**: characteristics,
requirements, standards, and the architectural approaches that help systems achieve them.

**Live site:** https://quality.arc42.org

The site is a static Jekyll build with interactive D3.js force-directed graphs that
visualise how qualities, requirements, standards, and approaches connect. The content
is the product — the build pipeline is intentionally simple so contributors can focus
on writing.

> Working on this codebase with Claude Code or another AI agent? See
> [CLAUDE.md](CLAUDE.md) for the agent-oriented guide (deeper schema notes,
> gotchas, and conventions).

---

## Contents

1. [Metamodel — our domain language](#metamodel--our-domain-language)
2. [Repository at a glance](#repository-at-a-glance)
3. [Quick start](#quick-start)
4. [Adding content](#adding-content)
5. [Why standards use `categories` instead of `tags`](#why-standards-use-categories-instead-of-tags)
6. [Testing & validation](#testing--validation)
7. [How it deploys](#how-it-deploys)
8. [Search (Lunr)](#search-lunr)
9. [Color & design system](#color--design-system)
10. [License & status](#license--status)

---

## Metamodel — our domain language

The site uses a shared domain language to connect dimensions, characteristics,
requirements, standards, and implementation approaches.

![Q42 domain language](images/domain-language/q42-domain-language.webp)

Excerpted from [How to Use this Site](_pages/05-how-to-use-this-site.md):

| Term                       | Explanation                                                                                                                                                    |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dimension**              | Top-level quality dimensions such as `#secure`, `#reliable` or `#maintainable`. They are intentionally broad and overlapping, so they need further refinement. |
| **Quality Characteristic** | A specific quality term such as confidentiality, accessibility or accuracy. Q42 maps each dimension to many concrete characteristics.                          |
| **Requirement Example**    | A specific, measurable expectation for a system, often expressed as a quality scenario or acceptance criterion.                                                |
| **Standard**               | A quality-related standard such as ISO/IEC 27001 or ISO 25010 that prescribes or describes relevant quality concerns.                                          |
| **Approach**               | A concrete way to achieve or improve one or several quality requirements.                                                                                      |
| **Quality Attribute**      | The resulting property of a concrete system once the relevant approaches have been implemented and the requirements are met.                                   |

---

## Repository at a glance

```
quality.arc42.org-site/
├── _qualities/        quality characteristics (~217 entries, ~33 are synonym redirects)
│   └── A/             organised by first letter
├── _requirements/     specific measurable requirements (~141)
│   └── A/
├── _standards/        industry standards (~42)
├── _approaches/       architectural tactics and patterns (~23)
├── _articles/         long-form articles and background reading
├── _pages/            static pages, tag pages, explorer pages
├── _layouts/          Jekyll layout templates
├── _includes/         Liquid partials
├── _sass/             SCSS source (compiled by Jekyll)
├── _data/             site data (synonyms, tag aliases, WCAG totals)
├── src/
│   ├── graphs/        D3.js force-directed graph code
│   └── scripts/       build scripts, link validator, search index generator
├── assets/
│   ├── css/           generated CSS
│   ├── data/          generated graph data (nodes, edges)
│   ├── js/            compiled JavaScript (esbuild output)
│   └── reports/       WCAG and Lighthouse report snapshots
├── tests/ui/          Playwright UI + WCAG specs
├── _config.yml        Jekyll configuration
├── Makefile           docker-based dev / test / build targets
└── docker-compose.yml  development services (esbuild + jekyll)
```

The four content collections — qualities, requirements, standards, approaches —
are the product. Everything else exists to render them and keep their
relationships honest.

---

## Quick start

The project runs entirely in Docker. There is no supported non-Docker workflow.

**Prerequisites:** [Docker](https://docs.docker.com/get-docker/) and
[Docker Compose](https://docs.docker.com/compose/), plus a POSIX shell (`/bin/bash`).

**Build the images once** (installs Node + Ruby dependencies into the dev image —
slow but cached):

```bash
make build
```

**Start the dev stack:**

```bash
make dev
```

The site serves on http://localhost:4000. Content and front-matter changes
are picked up live; rebuild images only when `package-lock.json` or
`Gemfile.lock` change.

**Common Make targets:**

| Command                 | What it does                                                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `make build`            | Build Docker images. Slow path — runs `bundle install` and `npm ci` inside the images.                                                     |
| `make dev`              | Start the prebuilt dev stack (esbuild watcher + Jekyll on port 4000).                                                                      |
| `make doctor`           | Sanity-check the dev stack: Docker up, site reachable, key routes (including alias redirects) responding.                                  |
| `make clean`            | Remove `_site/`.                                                                                                                           |
| `make test`             | Run Playwright UI tests in Docker. Starts the stack first if needed.                                                                       |
| `make wcag-test`        | Run the axe-core WCAG scan; writes `assets/reports/wcag/latest.{json,html}` and `_data/wcag.json` (powers the footer score). Non-blocking. |
| `make wcag-test-strict` | Same scan, exit non-zero on any violation. For CI gating.                                                                                  |
| `make lighthouse-test`  | Lighthouse performance/SEO audits → `assets/reports/lighthouse/`. Non-blocking.                                                            |

If you change a docker-compose file, run `docker compose down` and `make dev`
again so the new compose definition takes effect.

---

## Adding content

Every collection follows the same shape: front matter for metadata + Markdown
for the body. **Tags are always YAML arrays** (`tags: [secure, usable]`, not
space-separated strings).

### Qualities — `_qualities/<LETTER>/<name>.md`

```yaml
---
title: Accessibility
tags: [usable]
related: [usability, inclusivity]
standards: [iso26514, iso25024]
permalink: /qualities/accessibility
---
Definition…
```

Field reference:

- `tags` — dimension tags (must have matching `_pages/tag-<tag>.md` files)
- `related` — quality IDs (the last permalink segment of another quality)
- `standards` — standard IDs (matching `standard_id` in `_standards/*.md`, case-insensitive)
- `permalink` — the last segment becomes the node ID in the graph

### Requirements — `_requirements/<LETTER>/<name>.md`

The `requirements` layout wraps the body in the `.quality-requirement` card —
write the body as plain Markdown, **no `<div>` wrapper**.

Section headings inside the body use `###` (h3). The page H1 comes from the
section hero, so `###` keeps the outline coherent.

**Tier 1** — simple, 1–3 criteria:

```markdown
---
title: Quick unit tests
tags: [efficient]
related: [efficiency]
permalink: /requirements/quick-unit-tests
---

### Requirement

All automated unit tests must execute quickly to enable rapid feedback.

### Acceptance Criteria

- All unit tests complete in less than 180 seconds
- Measured on standard CI/CD infrastructure
```

**Tier 2** — complex, 4+ criteria, compliance/security:

```markdown
---
title: Patient data quality
tags: [reliable, safe]
related: [data-quality]
permalink: /requirements/patient-data-quality
---

### Context

Healthcare system manages patient data where poor quality could lead to medication errors.

### Trigger

Patient data is entered, updated, or accessed throughout care journey.

### Acceptance Criteria

- Patient duplicate detection rate >= 99.9%
- Critical fields 100% complete for active patients
- Lab results available within 5 minutes
- Data validation prevents 100% of impossible values
```

Optional `### Measurement & Verification` section for tooling/calculation details.

**Optional front-matter fields** rendered _outside_ the card:

- `source:` — attribution/citation (rendered as "Source: …" below the card)
- `note:` — meta-commentary (free-form Markdown, rendered below the card)

**Key principles:**

- Use specific, testable metrics with units
- Focus on _what_ must be achieved, not _how_
- Never wrap the body in `<div class="quality-requirement">` — the layout adds it

### Standards — `_standards/<name>.md`

```yaml
---
layout: page_standard
title: "ISO/IEC 25010 - Systems and Software Quality"
standard_id: iso25010
shortname: "ISO/IEC 25010"
categories: [general]
permalink: /standards/iso-25010
---
```

`standard_id` is the cross-reference key used from `_qualities/*.md`
`standards:` lists. See
[Why standards use `categories` instead of `tags`](#why-standards-use-categories-instead-of-tags)
below.

### Approaches — `_approaches/<LETTER>/<name>.md`

```yaml
---
title: Bulkhead
tags: [reliable]
supported_qualities: [availability, resilience]
tradeoffs: [efficiency, latency]
permalink: /approaches/bulkhead
---
Description…
```

Field reference:

- `tags` — dimensions this approach helps with
- `supported_qualities` — quality IDs the approach is intended to improve
- `tradeoffs` — quality IDs the approach may worsen
- See [`_approaches/`](_approaches/) for examples, or run
  `/create-approach` from the `.claude/skills/create-approach/` skill for a
  guided scaffold

### Tag pages — `_pages/tag-<tag>.md`

Every tag used anywhere in front matter needs a tag page, or links 404.

Easiest path: copy an existing tag page (e.g. `_pages/tag-efficient.md`),
rename to `_pages/tag-<yourtag>.md`, update the title and permalink, leave
the include macros alone.

### Synonyms / aliases

Some quality terms are synonymous (e.g. "Performance" and "Performance
Efficiency"). The site keeps one canonical page and lightweight redirect
stubs for the others.

**1.** Add the mapping to `_data/quality-synonyms.yml`:

```yaml
performance:
  - performance-efficiency
```

**2.** Add `aka:` to the canonical quality:

```yaml
---
title: Performance
aka: [Performance Efficiency]
tags: [efficient]
permalink: /qualities/performance
---
```

**3.** Create a redirect stub at the synonym's permalink:

```yaml
---
title: Performance Efficiency
alias_of: performance
redirect_to: /qualities/performance
layout: redirect
permalink: /qualities/performance-efficiency
---
```

**4.** Restart the dev stack (`make dev` if it was down, or
`docker compose restart jekyll` if it was already running) so the graph
data regenerates.

Result: the canonical page shows an "Also known as" badge, the synonym
URL redirects, and the graph collapses to a single node with synonym
labels in the hover tooltip.

---

## Why standards use `categories` instead of `tags`

Qualities, requirements, and approaches are classified by short tag slugs
(`secure`, `safe`, `usable`, `reliable`, …) that double as URL segments for
`/tag-<slug>` pages. Standards deliberately use a different field,
`categories`, with fuller topical names (`security`, `safety`,
`usability`, `reliability`, …).

The split is intentional:

- **Different vocabularies.** A standard's category names a topical area
  (information _security_, functional _safety_), not a quality-model
  dimension. Some categories — `ai`, `governance`, `privacy`, `sector`,
  `data`, `documentation`, `coding`, `general` — describe standards but
  don't correspond to any quality tag.
- **Different lifecycles.** Tags are part of the quality model's
  taxonomy and rarely change. Categories evolve with the standards
  landscape and can grow independently without inflating the tag list.
- **Different granularity.** A single standard often spans multiple
  categories (e.g. `[security, privacy]`); forcing standards into the
  tag vocabulary would either lose nuance or pollute every tag page.

The bridge lives in `_data/tag-aliases.yml`:

```yaml
secure: security
safe: safety
usable: usability
reliable: reliability
```

Includes that need to find standards for a given tag look up the alias and
filter `site.standards` by `categories`. Unmapped tags pass through
unchanged. If you add a new dimension whose category name differs from
the slug, add a line to `tag-aliases.yml` — **don't** duplicate the
mapping inline in templates.

Current consumers: `_includes/dimension-header.liquid` (counts standards on
tag pages) and `_includes/one-standard.liquid` (lists them).

---

## Testing & validation

### Link validation

```bash
npm run test:links          # warnings only
npm run test:links:strict   # exits non-zero if any broken links
```

Checks:

- Quality → Quality (`related` field)
- Quality → Tag (must have a `_pages/tag-<tag>.md` page)
- Quality → Standard (`standards` field must match `standard_id`)
- Requirement → Quality (`related` field)
- Requirement → Tag

Not on the dev-server startup path (kept off so `make dev` stays fast).
Run it before pushing if you changed tags, `related:`, `standards:`, or
permalinks.

### UI tests (Playwright, Docker)

No local Playwright install needed. With the stack running (`make dev`):

```bash
make test
```

Tests run in the bundled Playwright Docker image. After a run, `make test`
optionally launches an HTML report viewer at http://localhost:9323.

**CI behaviour:** Chromium with one retry; on failure stores traces,
screenshots, and videos to `playwright-report/` and `test-results/ui/`.

### WCAG accessibility scan

```bash
make wcag-test           # non-blocking; logs warnings
make wcag-test-strict    # exits non-zero on any violation
```

Uses axe-core with tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`. Outputs:

- `assets/reports/wcag/latest.json` — full per-page findings
- `assets/reports/wcag/latest.html` — graphical report
- `_data/wcag.json` — totals subset, read by `_includes/wcag-score-pill.html`
  to render the footer score at build time (no client-side JS, no fetch)
- Live view: `/about/wcag-report/`

### Lighthouse

```bash
make lighthouse-test
```

Performance + SEO audits to `assets/reports/lighthouse/`. Non-blocking.
Live view: `/about/lighthouse-report/`.

---

## How it deploys

Production deploys to **GitHub Pages** on every push to `main` via
[`.github/workflows/build-deploy-gh-pages.yml`](.github/workflows/build-deploy-gh-pages.yml).
The workflow installs Node + Ruby, runs `npm run data && npm run build`
(esbuild generates graph data + bundles JS), then `bundle exec jekyll build`,
and uploads the result to the Pages environment.

**Netlify** also builds the repo (see `netlify.toml`) for branch
previews — useful when iterating on a PR before merging.

The deployed footer WCAG score reflects whichever `_data/wcag.json` is on
`main` at build time. To refresh it: run `make wcag-test` locally, commit
the updated `_data/wcag.json`, push. A scheduled GitHub Action that
opens a refresh PR automatically is planned.

Dependabot keeps `npm`, `bundler`, and `github-actions` dependencies
current; see [`.github/dependabot.yml`](.github/dependabot.yml).

---

## Search (Lunr)

The site uses a pre-built [Lunr.js](https://lunrjs.com/) index — no external
API calls, fully offline-capable.

- Built at site-build time by `src/scripts/index-search.js` (invoked from
  `src/scripts/build.js`)
- Served as static JSON
- Weighted ranking: Title > Aliases > Tags > Content
- Supports synonym discovery via `aka` / `alias` front-matter fields
- Live search with debounced input and highlighted matches in the dropdown

Any content change regenerates the index on the next `make dev` cycle or
`npm run build`.

---

## Color & design system

Light theme. Editorial reference, not SaaS dashboard. The primary brand
colour is **violet `#682d63`** (header, footer, brand anchor); each content
type gets its own identity colour, used for rails and accents rather than
saturated fills.

| Content type              | Token                           | Hex       | Usage                                 |
| ------------------------- | ------------------------------- | --------- | ------------------------------------- |
| **Brand** (header/footer) | `--brand-violet`                | `#682d63` | Primary brand anchor                  |
| **Dimensions**            | `--dimension-background-color`  | `#1a3a5c` | Top-level navigation, dimension cards |
| **Qualities**             | `--brand-blue`                  | `#00b8f5` | Quality detail pages, graph nodes     |
| **Requirements**          | `--reqs-background-color`       | `#ffb3b3` | Requirement cards                     |
| **Standards**             | `--standard-background-color`   | `#ffc95c` | Standards pages                       |
| **Approaches**            | `--approaches-background-color` | `#92ef80` | Approach detail pages                 |
| **Articles**              | `--article-background-color`    | `#e6daf2` | Long-form / background reading        |
| **Tradeoffs**             | `--tradeoff-background-color`   | `#fbe9e3` | Trade-off rendering on approach pages |

The current design uses a **rail-on-left card pattern** across detail pages
and section headers: paper background, ~10–14% wash of the section colour,
6–10px coloured rail on the left edge. This keeps the colour as a
wayfinding cue rather than a saturated fill.

**Canonical sources:**

- Brand tokens: [`_sass/base/_variables.scss`](_sass/base/_variables.scss)
- Visual reference (on the live site): [`/aboutthissite/#colors`](https://quality.arc42.org/aboutthissite/#colors)
- Include source: [`_includes/about/color-scheme.md`](_includes/about/color-scheme.md)

**Typography:** body in
[Atkinson Hyperlegible Next](https://www.brailleinstitute.org/freefont)
(designed for low-vision disambiguation; scannable under time pressure);
headings in [Libre Caslon Text](https://fonts.google.com/specimen/Libre+Caslon+Text)
(editorial serif).

---

## How to contribute

1. Fork [`arc42/quality.arc42.org-site`](https://github.com/arc42/quality.arc42.org-site)
2. Add or edit content following the schemas above
3. Run `npm run test:links` if you touched tags, `related:`, `standards:`,
   or permalinks
4. Open a pull request

Smaller-than-content help is also welcome: typo fixes, broken links,
out-of-date references, or improvements to existing definitions.

---

## License & status

[![Status](https://uptime.betterstack.com/status-badges/v2/monitor/20tqv.svg)](https://uptime.betterstack.com/?utm_source=status_badge)

Content and code: [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/).

![CC BY-SA 4.0](https://i.creativecommons.org/l/by-sa/4.0/88x31.png)
