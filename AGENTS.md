# Repository Guidelines

## Project Structure & Modules
- Content: `_qualities/`, `_requirements/`, `_standards/`, `_articles/`, `_pages/`.
- Theme/templates: `_layouts/`, `_includes/`, `_sass/`.
- Assets: `assets/` (compiled JS under `assets/js`, generated data under `assets/data`).
- Source JS: `src/graphs/**`, data generator in `src/scripts/data.js`, build entry in `build.js`.
- Config: `_config.yml`, `Gemfile`, `docker-compose.yml`, `package.json`.

## Build, Test, and Development
- `docker compose up`: builds the Jekyll site and serves on `http://localhost:4000/`.
- `docker compose down`: stops stack so compose changes take effect on next start.
- `npm run build`: generate graph data and bundle JS to `assets/js` once.
- `npm run watch`: build and watch for JS changes.
- `npm run data`: regenerate JSON under `assets/data` from content front matter.
Notes: The Docker stack runs `npm run data` on startup. If you change tags/related/permalinks, restart the stack so data is refreshed.

## Coding Style & Naming
- JavaScript: ES modules, Node `22.x` (Volta pins versions). Use 2‑space indentation.
- Formatting: Prettier is configured (`.prettierrc`). Example: `npx prettier --write src _pages`.
- Content files: kebab‑case permalinks (e.g., `/qualities/availability`). Tag pages live in `_pages/tag-<tag>.md`.

## Testing Guidelines
- Smoke check locally: `docker compose up`, click through pages, verify graphs render and no 404s for new tags.
- Data generation: after adding/changing front matter, run `npm run data` (or restart Docker) and ensure files appear in `assets/data/`.
- Optional link check: verify new `_pages/tag-<tag>.md` exists for any new tag values.

## Commit & Pull Requests
- Commits: concise, imperative, scope where helpful (e.g., `graph: fix edges for missing node`). Group related changes.
- PRs: include a clear description, before/after screenshots for UI changes, and reference related issues. Confirm local build (`docker compose up`) passes.

## Security & Configuration Tips
- No secrets required. Do not commit local caches (`.sass-cache/`) or large generated assets except those in `assets/data` that are intentionally versioned.
- Keep permalinks stable; the graph uses the last path segment as node IDs.
