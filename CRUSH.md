CRUSH.md — quickguide for agents

Build/run
- Node 22.x + npm 11 (Volta pinned), Ruby/Bundler for Jekyll; or use Docker Compose
- Install: npm install; bundle install (or use docker compose up)
- Dev (Docker, recommended): docker compose up
- Dev (local): npm run data; npm run watch in one shell; bundle exec jekyll serve --incremental --watch in another
- Prod build: npm run build; bundle exec jekyll build
- Data only: npm run data (generates assets/data)

Lint/format/typecheck/tests
- Formatter: Prettier 3 (config: .prettierrc printWidth 100)
- Check formatting: npx prettier --check .
- Fix formatting: npx prettier --write .
- Type checking: none (plain JS, ESM)
- Tests: no test framework configured; single-test execution not applicable

Code style
- Modules: ESM (package.json "type":"module"); include .js extension for local imports
- Imports: external first, then internal; group and sort alphabetically within groups; prefer named exports
- Formatting: rely on Prettier; 2-space indent; semicolons; keep quote style consistent
- Files/dirs: JS under src/, generated JS under assets/js, generated data under assets/data; do not hand-edit generated assets
- Naming: camelCase for vars/functions, PascalCase for classes; UPPER_SNAKE_CASE for constants; follow existing file naming (PascalCase for graph classes like GraphRenderer.js, kebab-case for entrypoints like homepage/main.js)
- Types/Docs: plain JS; add JSDoc for non-trivial functions and data structures
- Error handling: fail fast in build scripts; wrap async entrypoints in try/catch; log concise errors and process.exit(1)
- Accessibility/content: Markdown lives in _qualities, _requirements, _articles; favor meaningful permalinks and tags

Notes
- No Cursor (.cursor/rules, .cursorrules) or Copilot instruction files found
- Serving paths excluded from Jekyll watch are assets/js/* (handled by esbuild); do not rely on Jekyll to bundle JS