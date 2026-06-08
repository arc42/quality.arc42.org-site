# Approach Alias (`aka`) Concept — Implementation Plan

**Status:** APPROVED design, not yet implemented.
**Branch:** all work on `approach/aka-concept`.
**Build rule:** Docker / `make` only — never run `jekyll`, `ruby`, or `bundle` locally (per CLAUDE.md).

---

## Background — the concept

Solution approaches (`_approaches/<LETTER>/<slug>.md`) gain an optional `aka:` frontmatter field — a YAML list of **plain display strings** (e.g. `aka: [Throttling]` on Rate Limiting).

Semantics: an alias is an **index term** — "if you know this term, you'll find the concept here" — NOT a strict synonym or identity claim. Consequences of that choice:

- The **same alias string may legitimately appear on more than one approach** (e.g. "Monitor" could point at both Watchdog Supervision and a future monitoring approach). No global uniqueness is required.
- Aliases have **no URL / permalink** of their own, create **no redirect stubs**, and create **no graph nodes**. This is the key difference from quality aliases, which are separate `_qualities/` docs with `alias_of:` + a redirect layout.
- There is **no central YAML file** (unlike `_data/quality-synonyms.yml`). Alias terms live directly in each approach's `aka:` frontmatter.
- There is **no source-attribution metadata**. Plain strings only. Where literature context matters (e.g. "Bass et al. call this Throttling"), it goes in the approach **body prose**, not metadata.

Field name is `aka` (same name qualities already use for inline aliases). Values are **title-case display strings**.

Three rendering touchpoints are in scope:

- **(A)** A–Z approaches explorer entries.
- **(B)** On-page "Also known as" block.
- **(C)** Graph search.

Plus one optional/recommended extra (global site search) listed separately as out-of-core-scope.

---

## Key decisions / reconciliations

1. **JSON embed shape = plain strings.** The explorer data embed emits `"aliases": ["Throttling", ...]` (array of plain strings). The explorer JS **synthesizes** the canonical id/title/url for each alias from the parent approach it is iterating — so the JSON must **NOT** repeat canonical fields per alias. (This supersedes any earlier alias-object shape.)

2. **Graph search needs a matcher edit (REQUIRED for touchpoint C).** The force-graph search currently matches **only** `node.label` and `node.id` — it never reads the `node.labels` variants array (used only by the hover tooltip in `GraphRenderer.js:145`). Therefore, populating `labels` alone gives a tooltip but **NOT** working search. To make typing "Throttling" highlight the "Rate Limiting" node, we **MUST** also edit `GraphDataProvider._getFilteredNodeIds` to additionally test `node.labels`. This same edit also fixes quality-synonym search as a side benefit.

3. **No-JS fallback uses nested alias rows** (not full alphabetical interleaving) — simpler, and acceptable for the fallback.

4. **No changes needed** to `build.js` or `validate-links.js` — `aka` values are display strings, not cross-reference links.

5. **Docker restart required** after adding `aka` frontmatter, so `assets/data/nodes.json` and the Liquid-generated explorer JSON regenerate (per CLAUDE.md gotcha). Build is Docker/make only.

---

## Phase 1 — Data model + on-page "Also known as" block

### 1a. Schema

Add the optional `aka:` field to the approach frontmatter as a YAML list of display strings. Example:

```yaml
aka: [Throttling]
```

### 1b. `_layouts/approach.html` — insert the "Also known as" block

Insertion point: immediately **after** the header include on line 10 (`{% include approach-header.liquid page=page link=false share=page.share %}`) and **before** the Intent block (line 12).

Approaches have **no** `alias_of` redirect stubs, so drop that part of the qualities version — iterate `page.aka` directly. Use this block exactly:

```liquid
{% if page.aka and page.aka.size > 0 %}
{% assign aka_sorted = page.aka | uniq | sort_natural %}
<div class="also-known-as">
  <strong>Also known as:</strong>
  {% for alias in aka_sorted %}
    <span class="synonym-badge">{{ alias }}</span>{% unless forloop.last %}, {% endunless %}
  {% endfor %}
</div>
{% endif %}
```

**CSS note:** `.also-known-as` and `.synonym-badge` already exist **globally** in `_sass/_content.scss` (lines ~422–446, nested under `.site-content`, which wraps approach pages too). **No SCSS change needed** for the on-page block.

---

## Phase 2 — A–Z explorer entries

### 2a. JSON embed in `_pages/70-solution-approaches.md`

In the `approaches-explorer-data` block (~lines 131–147), add a trailing `aliases` array of plain strings, and add a comma after the now-non-last `tradeoffsCount`:

```liquid
    "supportedCount": {{ approach.supported_qualities | size }},
    "tradeoffsCount": {{ approach.tradeoffs | size }},
    "aliases": [
      {% if approach.aka %}
        {% for alias in approach.aka %}
          {{ alias | jsonify }}{% unless forloop.last %}, {% endunless %}
        {% endfor %}
      {% endif %}
    ]
```

### 2b. `src/explorers/approaches.js`

Replace `normalize`, `renderItem`, and the inline `resultsSummary` arrow.

The shared engine `src/explorers/letter-explorer.js` needs **no changes** — it groups by each item's `letter` field automatically, so alias entries land under their own first letter just by being separate normalized items. `firstLetter` and `createTagsLine` are imported from it; the prefix constant is `PREFIX` (value `"approaches"`).

Replace `normalize` with:

```js
function normalize(rawItems) {
  const normalized = [];

  rawItems
    .filter((item) => item && item.id && item.title)
    .forEach((item) => {
      const tags = Array.isArray(item.tags) ? item.tags.filter(Boolean) : [];
      const sortedTags = tags.slice().sort((a, b) => a.localeCompare(b));
      const aliases = Array.isArray(item.aliases)
        ? item.aliases.map((a) => String(a || "").trim()).filter(Boolean)
        : [];

      const canonicalId = String(item.id);
      const canonicalTitle = String(item.title);
      const canonicalUrl = String(item.url || "");
      const supportedCount = Number(item.supportedCount || 0);
      const tradeoffsCount = Number(item.tradeoffsCount || 0);

      normalized.push({
        id: canonicalId,
        title: canonicalTitle,
        url: canonicalUrl,
        tags: sortedTags,
        supportedCount,
        tradeoffsCount,
        letter: firstLetter(canonicalTitle),
        kind: "canonical",
        canonicalId,
        canonicalTitle,
        canonicalUrl,
      });

      aliases
        .slice()
        .sort((a, b) => a.localeCompare(b))
        .forEach((aliasTitle) => {
          normalized.push({
            id: canonicalId,
            title: aliasTitle,
            url: canonicalUrl, // alias has no own URL -> points at canonical
            tags: sortedTags,
            supportedCount,
            tradeoffsCount,
            letter: firstLetter(aliasTitle),
            kind: "alias",
            canonicalId,
            canonicalTitle,
            canonicalUrl,
          });
        });
    });

  return normalized.sort((a, b) => a.title.localeCompare(b.title));
}
```

Replace `renderItem` with:

```js
function renderItem(item, { baseUrl, tagUrl }) {
  const li = document.createElement("li");
  li.className = "approaches-item";
  if (item.kind === "alias") li.classList.add("is-alias");

  const title = document.createElement("h4");
  title.className = "approaches-item-title";
  const titleLink = document.createElement("a");
  titleLink.href = item.url || `${baseUrl}/approaches/${encodeURIComponent(item.id)}`;
  const icon = document.createElement("i");
  icon.className = "fa fa-puzzle-piece fa-xs as-bullet";
  icon.setAttribute("aria-hidden", "true");
  titleLink.appendChild(icon);
  titleLink.appendChild(document.createTextNode(" " + item.title));
  title.appendChild(titleLink);
  li.appendChild(title);

  if (item.kind === "alias") {
    const aliasMeta = document.createElement("div");
    aliasMeta.className = "approaches-alias-meta";
    const label = document.createElement("span");
    label.className = "approaches-alias-label";
    label.textContent = "alias";
    aliasMeta.appendChild(label);
    aliasMeta.appendChild(document.createTextNode(" of "));
    const canonicalLink = document.createElement("a");
    canonicalLink.href =
      item.canonicalUrl || `${baseUrl}/approaches/${encodeURIComponent(item.canonicalId)}`;
    canonicalLink.textContent = item.canonicalTitle;
    aliasMeta.appendChild(canonicalLink);
    li.appendChild(aliasMeta);
  } else {
    const meta = document.createElement("div");
    meta.className = "approaches-item-meta";
    const supports = document.createElement("span");
    supports.textContent = `supports: ${item.supportedCount}`;
    const tradeoffs = document.createElement("span");
    tradeoffs.textContent = `trade-offs: ${item.tradeoffsCount}`;
    meta.append(supports, tradeoffs);
    li.appendChild(meta);
  }

  if (item.tags.length > 0) {
    li.appendChild(createTagsLine(PREFIX, item.tags, tagUrl));
  }

  return li;
}
```

Add a named `resultsSummary` (replacing the inline arrow currently at ~line 64, and reference it by name in the `mountExplorer` config):

```js
function resultsSummary(visible, all) {
  const canonicalCount = all.filter((i) => i.kind === "canonical").length;
  const aliasCount = all.filter((i) => i.kind === "alias").length;
  const canonicalVisible = visible.filter((i) => i.kind === "canonical").length;
  const aliasesVisible = visible.filter((i) => i.kind === "alias").length;
  return `${visible.length} of ${all.length} terms visible (${canonicalVisible}/${canonicalCount} approaches, ${aliasesVisible}/${aliasCount} aliases)`;
}
```

### 2c. Explorer CSS (inline `<style>` in `_pages/70-solution-approaches.md`, ~lines 299–360)

The approaches explorer styles live **inline** in that page's `<style>` block (this repo's pattern), **NOT** in `_sass/`. Today `.approaches-item` and `.approaches-item-title` exist, but there is **no** `.approaches-item.is-alias`, `.approaches-alias-meta`, or `.approaches-alias-label`. These must be **added**.

Mirror the qualities equivalents in `_pages/20-quality-characteristics.md`:

- `.qualities-item.is-alias` (~L309)
- `.qualities-item.is-alias .qualities-item-title` (~L332)
- `.qualities-alias-meta` (~L370)
- `.qualities-alias-label` (~L380)
- `.qualities-alias-meta a` (~L392)

Implementer steps: copy those qualities rules, rename selectors `qualities-` → `approaches-`, and **swap the color tokens** to the approaches palette (the approaches block uses `--ax-*` custom properties / green palette, not the qualities `--qx-*` tokens). Visual target for consistency:

- Dimmed background + left border for the alias row.
- A small pill for the "alias" label.
- Muted / dotted-underline canonical link.

### 2d. No-JS fallback list in `_pages/70-solution-approaches.md` (~lines 99–117)

Inside each approach's `.approaches-item` block (after the tags block, before the closing `</div>`), add static alias rows:

```liquid
{% if approach.aka %}
  {% for alias in approach.aka %}
    <div class="approaches-item is-alias">
      <h4 class="approaches-item-title">{{ alias }}</h4>
      <div class="approaches-alias-meta">
        <span class="approaches-alias-label">alias</span>
        of
        <a href="{{ approach.url | prepend: site.baseurl }}">{{ approach.title }}</a>
      </div>
    </div>
  {% endfor %}
{% endif %}
```

---

## Phase 3 — Graph search + tooltip

### 3a. `src/scripts/data.js` — `createApproachData()` (~line 332)

Populate `labels` with `[title, ...aka]`. Currently the node is added with `labels: [data.title]` only.

Read `aka` via the existing `parseList` helper (handles both YAML lists and comma strings) and include it. Inside the per-approach loop, add `const aka = parseList(data.aka, ',');` alongside the existing `parseList` calls, and change the `nodes.add({...})` so `labels` becomes:

```js
        labels: [data.title, ...aka],   // canonical title + alias display strings (verbatim, no resolution)
```

This mirrors how quality nodes carry `labels`, and makes the hover tooltip ("Also known as: …") show approach aliases automatically.

### 3b. `src/graphs/GraphDataProvider.js` — `_getFilteredNodeIds()` (~line 147)

**REQUIRED** for search to actually work (see Key Decision #2). The current matcher tests only `label` and `id`. Add a `labels` test:

```js
const labels = Array.isArray(node.labels) ? node.labels.map((l) => String(l).toLowerCase()) : [];
if (lowerTerms.some((t) => label.includes(t) || id.includes(t) || labels.some((lv) => lv.includes(t)))) {
    filteredNodeIds.add(node.id);
}
```

Adapt to the exact surrounding variable names — `label`, `id`, `lowerTerms`, `filteredNodeIds` are the existing locals. Note this also fixes quality-synonym search across the whole graph.

---

## Phase 4 — Seed initial alias data

Seed `aka:` values for existing approaches from the Bass+ extraction notes.

**Source file:** `TODO/approaches/bass-tactics.md`. Its rows use a convention like "site: X" / "site tracks this as X" / "site tracks the realization as X" to map a Bass term to one of our approaches.

Known examples to seed (re-scan `bass-tactics.md` for the full list, and confirm each target approach exists in `_approaches/`):

- Rate Limiting ← `aka: [Throttling]` (Bass: "Throttling")
- Watchdog Supervision ← `aka: [Monitor]` (Bass tactic "Monitor"; index-term, not strict synonym)
- Heartbeat + Ping/Echo Probes, Load Balancing, Resource Scheduling, Bound Queue Sizes, Condition Monitoring + Sanity Checking, etc. — extract the Bass term(s) for each published approach and add as `aka`.

This phase is per-approach content work and can be **delegated/parallelized one approach per file**.

For genuinely multi-target Bass terms (e.g. "Maintain Multiple Copies of Data" → Caching AND a future Data Replication), the **same `aka` string may be added to multiple approaches** — that is allowed by design.

**Curation rules** — be sparing; an alias earns its place only when it adds a genuinely different search term:

- Add an alias only when its wording genuinely differs from the canonical title.
- Skip singular/plural variants and terms identical (or near-identical) to the title.
- Skip trivial rephrasings and near-identical restatements.
- Do not reuse a term already used as an alias on another approach — duplicate alias terms clutter the A–Z explorer.

---

## Phase 5 — Documentation & propagation

- **Update `CLAUDE.md`:** add `aka:` (optional, list of display-string index terms) to the "Approaches" content schema section, with a one-line note on index-term semantics (same string may appear on multiple approaches; no redirects/nodes).
- **Update the `write-approach` skill** so newly authored approaches know about the optional `aka:` field and the convention of harvesting literature terms (Bass, POSA, …) from extraction notes.

---

## Optional / out of core scope

Listed for the user to opt into — **not** required.

- **Global site search (Lunr).** `src/scripts/index-search.js` currently indexes `aka` **only** for `type === "quality"` (~lines 48–55). To make approach aliases findable in the global search box too, move/extend the `if (item.aka)` indexing so it also applies to approaches. A one-line-ish change, aligned with the concept, but beyond the three agreed touchpoints. Flag for the user to opt in.
- **Central terminology / crosswalk page** (a Bass → approach index table). Could be derived from `aka` frontmatter later if ever wanted. Not planned now.

---

## Build & verification

After edits, rebuild via **Docker / make**:

- esbuild bundles `src/explorers/*.js` → `assets/js/approaches-explorer.js`.
- esbuild bundles `src/scripts/data.js` → graph data.
- **Restart Docker** so the Liquid-generated explorer JSON and `assets/data/nodes.json` regenerate.

Verification checklist:

1. An approach with `aka` shows the "Also known as" badges on its page (touchpoint B).
2. The alias appears as its own dimmed "alias of `<canonical>`" entry under its letter in `/approaches/`, and the results summary counts it (touchpoint A).
3. The no-JS fallback shows the alias row.
4. Hovering the approach's graph node shows the alias in the tooltip.
5. Typing the alias in the graph search highlights the canonical node (touchpoint C).

---

## Files touched

| File | Phase |
|------|-------|
| `_layouts/approach.html` | 1b |
| `_pages/70-solution-approaches.md` | 2a, 2c, 2d |
| `src/explorers/approaches.js` | 2b |
| `src/scripts/data.js` | 3a |
| `src/graphs/GraphDataProvider.js` | 3b |
| `_approaches/<LETTER>/<slug>.md` (multiple) | 4 |
| `CLAUDE.md` | 5 |
| `write-approach` skill | 5 |
| `src/scripts/index-search.js` | Optional (out of core scope) |
