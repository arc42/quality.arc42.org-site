# Improve README: contributor onboarding and content authoring

## Issues found in current README
- Build/run focuses on Docker only; missing local dev workflow (Node + Ruby/Bundler) and commands.
- Collections section has minor inaccuracies/typos:
  - `_requirements_` has a trailing underscore; should be `_requirements`.
  - Contribution hint mentions `_todo-qualities` and moving to `qualities/<letter>/_posts` — actual structure is `_qualities/<LETTER>/*.md` (no `_posts`).
- Missing guidance for adding new content (qualities, requirements, standards): required front matter, naming, and permalinks.
- Missing graph data regeneration instructions (assets/data), and when to run it.
- Tags: pages link to `/tag-<tag>`; adding new tags requires adding a matching `_pages/tag-<tag>.md` page to avoid 404s.
- Formatting/tooling not documented (Prettier usage; no tests; no type checking).

## Proposed additions
- Local development (without Docker):
  - Prerequisites: Node 22.x + npm 11, Ruby + Bundler.
  - Install: `npm install`; `bundle install`.
  - Generate graph data: `npm run data` (writes assets/data/*).
  - Dev servers:
    - Shell 1: `npm run watch` (bundles JS via esbuild)
    - Shell 2: `bundle exec jekyll serve --incremental --watch`
  - Production build: `npm run build`; `bundle exec jekyll build`.
- Formatting/tooling:
  - Formatter: Prettier 3; check with `npx prettier --check .`; fix with `npx prettier --write .`.
  - Type checking: none (plain JS). Tests: none configured.
- Content authoring
  - Qualities: add a file under `_qualities/<LETTER>/your-quality.md` with front matter:
    ```yaml
    ---
    title: Availability
    tags: reliable
    related: reliability, resilience
    permalink: /qualities/availability
    ---
    ```
  - Requirements: add a file under `_requirements/<LETTER>/your-requirement.md`:
    ```yaml
    ---
    title: Unavailable for max 2 minutes
    tags: reliable suitable
    related: availability
    permalink: /requirements/unavailable-for-max-2-minutes
    ---
    ```
  - Standards: add a file under `_standards/your-standard.md` (defaults set layout automatically). Include a stable `standard_id` used for cross-links:
    ```yaml
    ---
    title: "MISRA C:2023"
    permalink: /standards/misra-c-2023
    standard_id: misra-c-2023
    ---
    ```
  - Permalinks: choose stable, kebab-cased slugs; the graph generator derives node IDs from the permalink tail.
  - After adding/editing content: run `npm run data` to regenerate graph data; commit `assets/data` changes.
- Tags
  - Tag links are rendered to `/tag-<tag>`; if you introduce a new tag, add a page `_pages/tag-<tag>.md` (copy an existing tag page and adjust title/permalink and included macros) to avoid 404s.
- Pull requests
  - Create a feature branch; run Prettier; ensure site builds locally (Docker or local dev) and graph data is updated if content changed.
  - Open a PR with a brief summary of changes and screenshots if styling/content structure changed.

## Optional clarifications
- Collections defaults are configured in `_config.yml` (qualities, requirements, standards) so specifying `layout` in front matter is usually unnecessary.
- `article-header.html` is a generic fallback; collection layouts include dedicated headers automatically.
