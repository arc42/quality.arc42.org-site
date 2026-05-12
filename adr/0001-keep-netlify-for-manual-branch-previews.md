# 1. Keep `netlify.toml` for manual branch previews

Date: 2026-05-12

## Status

Accepted

## Context

Production deployment is GitHub Pages via the `build-deploy-gh-pages.yml`
workflow on push to `main`. A `netlify.toml` also exists at the repo root,
pinning `NODE_VERSION = "22.13.1"` and declaring the same build command
the Pages workflow runs.

A May 2026 technical review (item A6) flagged the file as potentially
stale and suggested deletion. On inspection the file is not stale — the
maintainer uses Netlify to manually preview pre-release branches before
merging them to `main` (current example: `418-violet-redesign`). Netlify's
branch-deploy feature lets reviewers click through real rendered output
without setting up a local Docker stack, which is particularly valuable
for visual changes (layout, typography, the D3 graph) where a text diff
under-represents the impact.

GitHub Pages does not offer per-branch preview URLs in this project's
setup, so removing Netlify would eliminate the only pre-merge visual
review channel.

## Decision

Keep `netlify.toml` at the repo root. Treat it as load-bearing
configuration for the manual branch-preview workflow on Netlify, not as
abandoned tooling.

Keep Node and (where applicable) Ruby versions in `netlify.toml` in sync
with `_docker/esbuild/Dockerfile`, `_docker/jekyll/Dockerfile`, the
GitHub Pages workflow, and the `volta` block in `package.json` — see
ADR-0001 footnote on version-pin sync below.

## Consequences

- Two deploy paths coexist: GitHub Pages (automated, production) and
  Netlify (manual, preview-only). Future contributors must understand
  this is intentional and not consolidate.
- Version pins now have a fifth sync site (`netlify.toml`). The April
  2026 alignment commit (see `de7ae07`) already covered this, but any
  future bump must touch `netlify.toml` as well.
- If Netlify ever changes pricing or removes the branch-preview feature,
  this decision should be revisited.

## Alternatives Considered

- **Delete `netlify.toml`.** Rejected — would silently break the
  branch-preview workflow.
- **Add GitHub Pages branch previews via a third-party action.**
  Rejected for now — adds complexity, costs maintenance, and the Netlify
  path already works.
- **Switch primary deployment to Netlify.** Out of scope. Would consolidate
  to one provider but trades a custom-domain Pages setup for a Netlify
  one, with non-trivial migration cost and no clear benefit.

## Notes

This is the first ADR in the project. The format is intentionally light;
adjust as the practice settles.
