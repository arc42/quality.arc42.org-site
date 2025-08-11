# Testing Strategy Proposal for quality.arc42.org (Docker Compose-first)

Directive
- All testing is executed via a single docker compose command. No local language toolchains are required on host.
- Canonical entrypoint: docker compose run --rm tests [TARGET]

Goals
- Detect broken links and content issues before deploy
- Catch layout, responsiveness, and accessibility regressions
- Verify data generation outputs are correct, deterministic, and consistent with the content model
- Provide fast, reproducible feedback locally and in CI, without flakiness

Scope
- Site build (Jekyll) correctness and internal integrity
- Link integrity (internal + external)
- HTML/CSS layout and responsive behavior
- Accessibility checks
- Data generation validation (assets/data and assets/q-graph)
- Front matter and content linting
- CI integration and developer workflow

Containerized tooling overview (run only inside tests container)
- Build/Links: html-proofer (Ruby) on the built _site; optional external link check job
- Content lint: markdownlint-cli; YAML/front matter validation via Node script
- Data validation: JSON Schema (AJV) + custom referential integrity checks; unit tests via Vitest (optional)
- Accessibility: axe-core via Playwright (@axe-core/playwright)
- Visual/Responsive: Playwright screenshots + pixel comparison; viewport matrix
- Quality budgets: Lighthouse CI (optional follow-up)

Compose design
- Single tests service that contains Node 22, Ruby/Bundler, and Playwright browsers/deps. It builds the site and runs all checks.
- Optional static-site service for serving _site if needed for some Playwright scenarios; default runs tests directly against file URLs where possible or via an ephemeral HTTP server inside the tests container.

Proposed files to add
- Dockerfile.test (base: mcr.microsoft.com/playwright:jammy or node:22-bullseye + Playwright + Ruby)
  - Installs: git, ca-certificates, ruby-full, build-essential, bundler
  - Node deps: npm ci; Playwright browsers pinned; cache path PLAYWRIGHT_BROWSERS_PATH=/site/playwright
  - Ruby deps: bundle config set path 'vendor/bundle'
- scripts/test-entrypoint.sh (dispatch by TARGET)
  - Targets: all (default), ci, quick, links, links:ext, data, content, a11y, visual, lighthouse
- tests/* (spec files, schemas, configs)

docker-compose.yml additions (plan)
- Add tests service:
  - build: Dockerfile.test
  - volumes: mount repo at /site, cache node_modules, vendor/bundle, Playwright browsers
  - working_dir: /site
  - command: sh -lc "scripts/test-entrypoint.sh ${TARGET:-all}"
  - environment:
    - NODE_ENV=development
    - PLAYWRIGHT_BROWSERS_PATH=/site/playwright

Single command usage (examples)
- All core checks: docker compose run --rm tests
- CI set: docker compose run --rm -e TARGET=ci tests
- Only data validation: docker compose run --rm -e TARGET=data tests
- Only internal link check: docker compose run --rm -e TARGET=links tests
- Accessibility subset: docker compose run --rm -e TARGET=a11y tests
- Visual regression: docker compose run --rm -e TARGET=visual tests

Test categories and container-internal steps
1) Build correctness and internal integrity
- bundle exec jekyll build (inside container)
- Optional: jekyll doctor
- Sanity: confirm expected pages exist

2) Link integrity
- Internal: bundle exec htmlproofer ./_site --disable-external --enforce-https --check-internal-hash
- External (non-blocking by default): run separately with retries, timeouts, and allowlist

3) Accessibility (axe-core via Playwright)
- Run a curated URL list (home, qualities index, representative detail pages, standards, graphs)
- Zero critical violations policy; warn on minors initially

4) Visual and responsive regression (Playwright)
- Deterministic screenshots on CI runner image
- Viewports: 360x640, 768x1024, 1366x768, 1920x1080
- Pages: home, qualities index, requirement detail, standard page, search, graphs
- Baselines under tests/visual/__screenshots__

5) Data generation validation
- JSON Schemas for assets/data/*.json and assets/q-graph/data/*.json
- AJV validation + referential integrity checks:
  - Links reference existing nodes
  - No duplicate IDs/slugs where uniqueness is required
  - Tags must exist in _data/standard_tags.yaml
- Determinism: run generator twice and compare checksums

6) Front matter and content linting
- Validate required front matter keys by collection
- Enforce permalink/slug uniqueness
- markdownlint-cli with minimal ruleset
- Front matter parsed via js-yaml

7) Lighthouse budgets (optional phase)
- Run on small URL set; warn on drops, tighten over time

Directory layout (tests only; all inside repo)
- tests/
  - links/htmlproofer.config.yml
  - a11y/a11y.spec.js
  - visual/visual.spec.js
  - visual/__screenshots__/
  - data/schemas/{nodes.schema.json,edges.schema.json,properties.schema.json}
  - data/validate.js
  - content/frontmatter-validate.js
  - utils/urls.js
- scripts/test-entrypoint.sh
- Dockerfile.test

Targets in scripts/test-entrypoint.sh
- all (default): npm run data && bundle exec jekyll build && run data, content, links, a11y; visual optional
- ci: same as all, but without visual and external links; produces artifacts to /site/.artifacts
- quick: data + content + internal links on a reduced URL set
- data: node tests/data/validate.js
- content: node tests/content/frontmatter-validate.js && npx markdownlint "**/*.md" -i node_modules -i _site -i assets
- links: bundle exec htmlproofer ./_site --disable-external --check-internal-hash --enforce-https
- links:ext: external link checker with retries and allowlist (non-blocking)
- a11y: npx playwright test tests/a11y
- visual: npx playwright test tests/visual
- lighthouse: lhci autorun (optional)

GitHub Actions integration (compose-native)
- In build-deploy workflow, replace direct tool invocations with docker compose:
  1) Setup: checkout, cache compose build layers if desired
  2) Build tests image: docker compose build tests
  3) Core validation (blocking): docker compose run --rm -e TARGET=ci tests
  4) Optional jobs (non-blocking):
     - Visual: docker compose run --rm -e TARGET=visual tests
     - External links: docker compose run --rm -e TARGET=links:ext tests
     - Lighthouse: docker compose run --rm -e TARGET=lighthouse tests
  5) Deploy only if core validation succeeds

Phased rollout plan
- Phase 1 (1-2 days)
  - Add Dockerfile.test, scripts/test-entrypoint.sh, tests for data/content/links
  - Wire docker compose run --rm tests into CI before deploy
- Phase 2 (1-3 days)
  - Add axe-core accessibility via Playwright; fix top violations
- Phase 3 (3-5 days)
  - Add Playwright visual regression; establish baseline update workflow
- Phase 4 (ongoing)
  - Add Lighthouse budgets; expand URL coverage; refine flake handling

Flake mitigation
- External links in separate, non-blocking target with retries/timeouts
- Deterministic rendering: disable animations (prefers-reduced-motion), consistent fonts; mock time
- Run Playwright with pinned browser versions from Playwright base image

Policies and ownership
- Make the CI compose validation step required for PR merge
- Ownership: Docs (content lint + links), Maintainers (data validation + a11y + visual)
- Baselines and schemas stored and reviewed in repo

Immediate next steps (actionable)
1) Create Dockerfile.test with Node 22 + Ruby + Playwright stack
2) Add scripts/test-entrypoint.sh with targets above
3) Add tests directory skeleton (schemas, validators, Playwright specs)
4) Update docker-compose.yml to include tests service
5) Replace CI validation with docker compose run --rm -e TARGET=ci tests in GitHub Actions
6) Document usage in README and CRUSH.md (single command)

Local developer workflow (single command)
- docker compose run --rm tests       # full suite (blocking checks)
- docker compose run --rm -e TARGET=quick tests  # fast pre-push check
- docker compose run --rm -e TARGET=visual tests # review diffs locally

Success criteria
- docker compose run --rm tests fails on internal link breakage, data/schema violations, or content/front matter errors
- Accessibility violations trend to zero; Lighthouse budgets enforced over time
- Visual regressions are caught via Playwright in PRs

Appendix: representative commands executed inside container
- html-proofer:
  bundle exec htmlproofer ./_site \
    --disable-external \
    --check-internal-hash \
    --enforce-https \
    --url-ignore "/#|mailto:|tel:|javascript:;"

- Playwright install and run:
  npx playwright install --with-deps
  npx playwright test tests/a11y
