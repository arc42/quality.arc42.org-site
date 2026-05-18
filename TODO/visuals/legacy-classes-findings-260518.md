# Legacy-class findings — 2026-05-18

Survey of pages/includes still using the pre-modernisation CSS vocabulary
after the senior-dev callout against `/requirements/`. The `/requirements/`
page itself was modernised on branch `requirements-page-modernize`
(see commit `71b901e`); this report tracks what's still on the legacy
pattern, ordered by visible impact.

## Legacy classes in scope

| Class | Origin | What it produces |
|-------|--------|------------------|
| `.tag-box.inline` + `a.hov.tags.*` | `_sass/_common.scss`, `_sass/components/_tag-chips.scss` | Saturated-fill chip rows that scale on hover (e.g. pink reqs pills, green approach pills) |
| `a.reqs` | `_sass/components/_tag-chips.scss` | Dark-red link text (`var(--req-text-color)` = `#8b0000`) — combined with global `a:hover { text-decoration: underline }` produces the "red-on-red underlined" look |
| `ul.posts.no-bullets` | `_sass/_common.scss` | Loose flat list, no panel/border, no row affordance |
| `<i class="fa fa-bullseye … as-bullet">` | inline in templates | Saturated-colour bullseye icon used as a list bullet |

The modern replacement vocabulary now lives at `_sass/pages/_requirements.scss`
(`.req-explorer-*` classes — paper background, color-mix wash, calm
brand-ink links, quiet bullet).

---

## Findings by impact

### 1. High impact — quality detail pages (~217 pages)

**`_layouts/qualities.html`** + 5 includes power the "Related …" sections
on every quality detail page (`/qualities/X`). Section headers already use
the modern rail-on-left pattern, but the LIST under each header is the
legacy loose-bullet style, so the mismatch is particularly visible.

Affected includes:
- `_includes/directly-related-requirements.html` — uses `a.reqs` + `fa-bullseye` + `ul.posts`
- `_includes/directly-related-qualities.html` — `ul.posts` + legacy link styling
- `_includes/directly-related-approaches.html` — same pattern
- `_includes/directly-related-standards.html` — same pattern
- `_includes/directly-related-tradeoffs.html` — same pattern

Estimated effort: **30–45 min**. One modernised per-item partial
(reusing `.req-explorer-item__link`-style + bordered panel) covers all
five includes if extracted as a shared component.

### 2. High impact — all 9 tag pages

**`_pages/tag-*.md`** (`tag-secure`, `tag-reliable`, `tag-maintainable`,
`tag-usable`, `tag-efficient`, `tag-safe`, `tag-flexible`, `tag-operable`,
`tag-suitable`) — each tag page renders 3 sections (qualities, requirements,
approaches) via shared includes:
- `_includes/one-quality.liquid` — `ul.posts` + legacy link styling
- `_includes/one-requirement.liquid` — `a.reqs` + `fa-bullseye` + `ul.posts`
- `_includes/one-approach.liquid` — `ul.posts` + legacy link styling

Estimated effort: **~20 min** if finding #1 already produced the shared
per-item partial — same component, plug into the three `one-*` includes.

### 3. Medium impact — `/dimensions/` index

**`_pages/10-quality-dimensions.md`** — primary nav page. Contains 3
separate `<ul class="tag-box inline">` chip rows (for qualities,
requirements, approaches) and includes `dimension-buttons.liquid`.

Estimated effort: **~15 min** — convert chip rows to the same facet-pill
pattern used on `/requirements/`.

### 4. Low impact / probably dead

- **`_includes/dimension-buttons.liquid`** — grep finds **zero**
  `{% include dimension-buttons %}` references anywhere in `_pages`,
  `_layouts`, or `_includes`. Likely dead code; confirm before modernising
  vs. just `git rm`.
- **`_includes/about/content-analytics.md`** — uses `fa-bullseye as-bullet`
  once in admin/about analytics content. Not user-facing UI polish target.
- **`_pages/70-solution-approaches.md`** — uses `as-bullet` only in the
  `<noscript>` fallback. The JS-rendered main path is already modern.
  Low priority unless JS-off polish matters.

---

## Suggested sequence

1. **Quality detail pages** — `_layouts/qualities.html` + `directly-related-*`
   includes. Highest reach (~217 pages × multiple sections). Extract a
   reusable per-item partial here so step 2 inherits it cheaply.
2. **Tag pages** — three `one-*.liquid` includes, drives all 9 tag pages.
3. **`/dimensions/` page** — chip rows + dead-code cleanup of
   `dimension-buttons.liquid`.
4. **Decision**: leave the low-impact items (analytics, noscript fallback)
   alone unless they come up in another pass.

## CSS cleanup after the above

Once findings 1–3 are done, the legacy rules in `_sass/_common.scss`
(`.tag-box`, `.posts`) and `_sass/components/_tag-chips.scss` (`a.hov.*`,
`a.reqs`) have no more callers in the repo. They can be removed in a
final commit alongside any pruning of `_includes/dimension-buttons.liquid`.
