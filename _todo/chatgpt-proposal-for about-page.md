# Proposal: Modularize "About this Site" into separate, concern-focused pages/partials

Goals
- Separate concerns: sponsorship, author bio, meta/stats, data quality dashboards
- Improve navigation and findability: each topic gets a stable permalink
- Enable reuse: extract Liquid logic (orphan/unreferenced lists) into includes used elsewhere
- Keep the main About page short and focused on purpose + links to details

Suggested structure

1) Keep a lean About page
- Path: `_pages/80-about-this-site.md` (keep)
- Purpose: mission of the site, what it contains, how to use it, and pointers to subpages below
- Content blocks: short intro + cards/links to Sponsor, Author, Data Health, Tooling, Stats

2) Move sponsor to a dedicated page
- New: `_pages/82-sponsor.md`
- Title: "Sponsor"
- Permalink: `/sponsor/`
- Content: INNOQ blurb, logo, link(s), thanks; optionally a note on how sponsorship works and how others could support
- Benefit: clean separation, future-proof if sponsors change/expand

3) Move author bio to a dedicated page
- New: `_pages/84-author.md`
- Title: "About the Author"
- Permalink: `/author/`
- Content: avatar, bio bullets, selected links (books, talks, articles)
- Benefit: re-usable link from across the site; easier to maintain

4) Extract data quality dashboards (orphan/unreferenced) to focused pages
- New: `_pages/86-orphan-qualities.md`
  - Title: "Orphan Qualities"
  - Permalink: `/orphan-qualities/`
  - Move the existing Liquid snippet that finds qualities with no `related`
- New: `_pages/88-qualities-without-requirements.md`
  - Title: "Qualities without Requirements"
  - Permalink: `/qualities-without-requirements/`
  - Move the Liquid that lists qualities not referenced by any requirement `related`
- Benefit: standalone, linkable "data health" pages; can be indexed and surfaced from navigation and contribution docs

5) Keep tooling and build notes concise on About; add a full contributor/dev guide elsewhere
- Keep: 2-3 bullets on About with links
- New: `_pages/90-contributing.md` (or enrich README)
  - Local dev, tooling, how to add content, run data generation, formatting
  - Link from About

6) Keep stats on a separate page to avoid heavy embeds on About
- New: `_pages/92-stats.md`
- Title: "Site Stats"
- Permalink: `/stats/`
- Move the Plausible embed here
- Link from About

7) Add a small navigation section on About to link to these pages
- Use list with brief 1-liners

Implementation details

- Create Liquid includes for data-dashboards to DRY the logic
  - `_includes/orphan-qualities.html` (existing snippet from About)
  - `_includes/qualities-without-reqs.html` (existing snippet from About)
  - Then in the dedicated pages, just `{% include orphan-qualities.html %}` etc.
- Add minimal front matter for each page using `layout: page`
- Update header or footer nav (if desired) to include these new pages, or add a small "Meta" section to `/60-background` page linking to them
- Consider adding a small "Meta" or "Contribute" sidebar card on About that links to Sponsor/Author/Stats/Contributing

Optional enhancements

- Add a new collection `_meta` for these maintenance/info pages if you want them separated from user-facing content; or keep under `_pages` with clear order (82, 84, 86, ...)
- Add tags to these pages (e.g., `tags: meta`) if you plan to list them together
- Add a top-level "About" menu entry that expands to sub-items: About, Sponsor, Author, Data Health, Stats, Contributing

Proposed file moves/creations (summary)
- Keep: `_pages/80-about-this-site.md` (trim + link out)
- New: `_pages/82-sponsor.md`
- New: `_pages/84-author.md`
- New: `_pages/86-orphan-qualities.md`
- New: `_pages/88-qualities-without-requirements.md`
- New: `_pages/92-stats.md`
- New includes: `_includes/orphan-qualities.html`, `_includes/qualities-without-reqs.html`

Migration steps
- Create new pages with front matter and move existing sections from About
- Extract Liquid snippets to includes and use them in the new pages
- Trim About page to: intro + links
- Optionally update navigation or background page to reference the new pages

Rationale
- Improves separation of concerns and long-term maintainability
- Makes heavy/expensive embeds (stats) opt-in for the reader
- Gives each topic a clean URL, making it easier to share and discover
- Enables reuse of data quality logic (includes) on other pages (e.g., a contributor dashboard)
