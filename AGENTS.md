# Repository Guidelines

## Project Structure & Module Organization
- Content: `_qualities/`, `_requirements/`, `_standards/`, `_articles/`, `_pages/`.
- Theme/layout: `_layouts/`, `_includes/`, `_sass/`.
- Client code: `src/graphs/**`, `src/scripts/data.js` (generates graph JSON).
- Assets: `assets/js` (bundled), `assets/data` (generated), `images/`, `assets/img/`.
- Config: `_config.yml`, `docker-compose.yml`, `Gemfile`, `package.json`.

## Build, Test, and Development Commands
- `docker compose up`: Builds graph data, bundles JS, and serves Jekyll at `http://localhost:4000` with watch.
- `docker compose down`: Stops services; use when changing Docker config or after adding many files.
- `npm run data`: Regenerates `assets/data/*.json` from front matter (normally run by Docker).
- `npm run build`: Bundles JS (also runs data first via `build.js`).
- `npm run watch`: Watches and rebuilds JS; use only for local Node workflows.

## Coding Style & Naming Conventions
- JavaScript: ESM, format with Prettier (print width 100). Prefer 2‑space indentation.
- Markdown/Front matter:
  - `tags`: space‑separated (e.g., `usable secure`).
  - `related`: comma‑separated IDs/titles (e.g., `reliability, resilience`).
  - `permalink`: stable, kebab‑case (e.g., `/qualities/availability`).
- File placement: `_qualities/<LETTER>/name.md`, `_requirements/<LETTER>/name.md`, `_standards/name.md`.

## Testing Guidelines
- No unit tests; validate locally:
  - Site serves without errors at `http://localhost:4000`.
  - Graph renders; `assets/data/nodes.json`, `edges.json`, `property-nodes.json` exist and include your entries.
  - New tags have a corresponding `_pages/tag-<tag>.md` page to avoid 404s.

## Commit & Pull Request Guidelines
- Commits: Prefer Conventional Commits when possible (`feat:`, `fix:`, `docs:`). Keep messages concise and scoped.
- PRs: Include a clear description, linked issue (if any), and screenshots/GIFs of affected pages or graphs. Note added tags/links. Ensure `docker compose up` runs cleanly and data is regenerated.

## Architecture Overview (Quick)
- Jekyll collections drive content; defaults in `_config.yml` assign layouts for `qualities`, `requirements`, and `standards`.
- `src/scripts/data.js` parses front matter to create graph JSON consumed by D3 visualizations in `src/graphs/**` and emitted to `assets/data/`.

## Security & Configuration Tips
- Use the provided Docker workflow; local Ruby/Node versions can vary. Volta pins Node 22 in `package.json`.
- Do not commit secrets; this is a static site. Check links and permalinks for stability before publishing.

