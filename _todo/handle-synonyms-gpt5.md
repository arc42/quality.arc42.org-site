# Handling synonyms between qualities: 4 options

You observed that several qualities are essentially synonyms where splitting hairs adds little value. Below are four pragmatic options you can adopt (individually or combined). Each option includes when to use it and a lightweight implementation sketch for this site.

## Option 1 — Canonicalize one term; make others aliases (redirects)
- When to use: You want one authoritative article per concept; synonyms should land on the same page.
- What it means: Pick a canonical label (slug and title). Other terms become aliases that redirect to the canonical page and are listed as "Also known as" there.
- Implementation sketch
  - Canonical page front matter:
    - `title: <Canonical term>`
    - `synonyms: [<alt1>, <alt2>, ...]`
  - For each synonym, create a thin stub under `_qualities/<LETTER>/` with front matter only:
    - `title: <Synonym>`
    - `alias_of: <canonical-slug>` (custom field)
    - `redirect_to: /qualities/<canonical-slug>/` (via jekyll-redirect-from or manual layout link)
  - On the canonical page, render an "Also known as" section from `synonyms`.
  - Optional: maintain `_data/quality-synonyms.yml` mapping `<canonical>: [synonyms...]` to use in build scripts and graphs.

## Option 2 — Consolidate content; keep discoverability via index and search
- When to use: You prefer fewer pages and rely on search/navigation rather than redirects.
- What it means: Only the canonical page exists; synonyms are not separate pages. They are captured as tags and within body text for search.
- Implementation sketch
  - Canonical page front matter:
    - `title: <Canonical term>`
    - `tags: [<synonym1>, <synonym2>, ...]`
    - `aka: [<synonym1>, <synonym2>, ...]` (custom field used for rendering an "Also known as" list)
  - Ensure `aka` and `tags` are included in `search.json` generation so queries for synonyms hit the canonical page.
  - Add a dedicated glossary/index page that lists synonyms and points to the canonical page.

## Option 3 — Model synonyms explicitly in data and visuals (merge in graphs)
- When to use: You need a single node per concept in graphs/data, but still want separate terms visible in UI.
- What it means: Treat synonyms as edges to a canonical node; merge them in data generation so the force-directed graph and links reference one node.
- Implementation sketch
  - Introduce `_data/quality-synonyms.yml`:
    - Example:
      ```yaml
      debuggability:
        - troubleshootability
        - diagnosability
      ```
  - In the data build (`src/scripts/data.js` → `assets/data/*`), collapse synonym terms to the canonical key when emitting nodes/links. Preserve an array of `labels` for display.
  - In the UI, show canonical label prominently and list `labels` (synonyms) in tooltips/legends.
  - Keep only the canonical page under `_qualities/`; add small `_pages` or glossary entries to aid SEO if needed.

## Option 4 — Group as umbrella concept with sub-terms (curated taxonomy)
- When to use: Some “synonyms” are actually nuanced sub-aspects worth mentioning without full articles.
- What it means: Create one umbrella quality page that defines scope and includes a section "Related terms" where near-synonyms/sub-terms are briefly explained.
- Implementation sketch
  - Canonical umbrella page front matter:
    - `title: <Umbrella quality>`
    - `related_terms:` list of objects: `{ term: <name>, note: <1‑line differentiation> }`
  - Render a table/section from `related_terms` with succinct distinctions to avoid nitpicking.
  - Only create separate pages for sub-terms if they justify standalone content; otherwise keep them summarized here.

---

Decision tips
- Prefer Option 1 if inbound links/SEO for multiple terms are important.
- Prefer Option 2 for the leanest content footprint and simple maintenance.
- Prefer Option 3 if graph/data consistency is paramount and you control the build pipeline.
- Prefer Option 4 when you want to acknowledge nuance without multiplying pages.

Minimal fields you can standardize now (safe across options)
```yaml
aka: [synonym1, synonym2]
alias_of: canonical-slug  # only on synonym stubs
synonyms: [synonym1, synonym2]  # only on canonical page if you prefer
```
