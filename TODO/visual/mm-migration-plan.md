# Q42 Homepage Redesign — Implementation Plan

**Target design:** Sketch F (`homepage-sketch-F-final.html`)
**Theme strategy:** Minimal Mistakes as shell; custom layouts for content pages unchanged
**Scope:** Homepage + global navigation only. No changes to `_qualities/`, `_requirements/`, `_standards/`, `_approaches/` layouts or includes.

---

## Current state (relevant to this plan)

| What | Where | Notes |
|---|---|---|
| Base layout | `_layouts/default.html` | TTSCK-based, left sidebar nav |
| Homepage | `_pages/01-home.md` + `_sass/_homenew.scss` | Star graph (9 dim nodes only) |
| Graph entry | `src/graphs/HomeGraph.js` | Renders property nodes + root only; toggle → page nav to `/full-quality-graph` |
| Nav | Procedural from `site.pages` sorted by `order` | Lives in `default.html` sidebar |
| MM | `vendor/bundle/…/minimal-mistakes-jekyll-4.28.0/` | Installed, not activated |
| MM SCSS partial | `_sass/_splash-home.scss` | Already written against MM classes |

---

## 1. Activate Minimal Mistakes

### 1a. `_config.yml` changes

```yaml
remote_theme: mmistakes/minimal-mistakes-jekyll@4.28.0

# Remove or nullify existing theme key if present
# theme:           ← delete this line if it exists

masthead_title: " "          # suppress title text; logo only
logo: /assets/img/arc42logosquare.webp
search: true                 # enable MM's Lunr.js search (see §13 for segmented results)
search_full_content: true    # index full page text, not just excerpts
breadcrumbs: false

minimal_mistakes_skin: "default"
```

Keep all existing `collections:`, `defaults:`, and `plugins:` blocks untouched.

### 1b. `Gemfile`

Replace `gem 'github-pages'` with explicit gems to unlock MM remote theme:

```ruby
gem "jekyll", "~> 4.3"
gem "minimal-mistakes-jekyll", "~> 4.28"
gem "jekyll-remote-theme"
```

Add `jekyll-remote-theme` to the `plugins:` list in `_config.yml`.

> **Why:** `github-pages` pins Jekyll 3.9 and blocks `remote_theme`. Switching to Jekyll 4 + explicit MM gem allows full theme control and faster builds.

---

## 2. Navigation: `_data/navigation.yml`

Create this file (MM reads it for the masthead). The mega-menu and Graph button are **not** in this file — they are injected via masthead override (§3).

```yaml
main:
  - title: "Home"
    url: /
  - title: "Qualities"
    url: /qualities/
  - title: "Profiles"
    url: /profiles/
  - title: "Requirements"
    url: /requirements/
```

Standards, Approaches, Articles, How-to, Aliases are exposed only through the "Explore" mega-menu — they do not appear as top-level nav entries.

---

## 3. Masthead override: `_includes/masthead.html`

Copy MM's `masthead.html` from the gem into `_includes/` (Jekyll resolves local includes first). Modify the nav section to:

1. Render the four main nav links from `site.data.navigation.main`
2. Append the **Explore mega-menu** (static HTML panel, driven by `_data/explore-menu.yml`)
3. Append the **Graph button** (`<button onclick="openGraphOverlay()">`)

**`_data/explore-menu.yml`** — drives the mega-menu without hardcoding HTML:

```yaml
sections:
  - label: Reference
    items:
      - title: Standards
        url: /standards/
        icon: fa-award
        desc: "ISO 25010, GDPR, WCAG, MISRA"
        count_key: standards        # resolved via site.standards | size
      - title: Solution Approaches
        url: /approaches/
        icon: fa-puzzle-piece
        desc: "Tactics and patterns"
        count_key: approaches
  - label: Learn
    items:
      - title: Articles
        url: /articles/
        icon: fa-newspaper
        desc: "Quality insights and deep-dives"
      - title: How to Use Q42
        url: /how-to-use-this-site/
        icon: fa-compass
        desc: "Inside-out, outside-in, by example"
      - title: Synonyms & Aliases
        url: /aliases/
        icon: fa-right-left
        desc: "120+ alternative terms mapped"
```

The masthead include iterates this data to render the mega-panel. This keeps the HTML template free of hardcoded labels and URLs.

**Mega-menu interaction** is ~30 lines of vanilla JS (toggle `open` class, close on outside click, Esc key). Add to a new `assets/js/mega-menu.js`, loaded in the masthead include with `defer`.

---

## 4. Homepage layout: `_layouts/splash-q42.html`

Create this file. It wraps MM's `splash` layout and appends Q42-specific sections below the `feature_row`:

```liquid
---
layout: splash
---

{{ content }}

{% include q42/dimension-pins.html %}
{% include q42/homepage-graph.html %}
{% include q42/graph-overlay.html %}
{% include q42/bottom-row.html %}
```

MM's `splash` layout renders the dark hero (`overlay_color`) and the `feature_row` from frontmatter automatically. Everything below `{{ content }}` is appended after MM's output.

---

## 5. Homepage content: `_pages/01-home.md`

Replace current content entirely:

```yaml
---
layout: splash-q42
title: "Software Quality, Made Navigable"
permalink: /
order: 1
header:
  overlay_color: "#1a2332"
  overlay_filter: "0"
excerpt: "Translate vague quality goals into concrete, measurable requirements."

feature_row:
  - title: "Domain Profiles"
    excerpt: "Curated starting points for 12 system types — e-commerce, SaaS, banking, medical devices, and more."
    url: /profiles/
    btn_label: "Browse Profiles"
    btn_class: "btn--primary"
  - title: "Quality Characteristics"
    excerpt: "217 qualities defined, cross-linked, and mapped to standards. Browse A–Z, filter, or search."
    url: /qualities/
    btn_label: "Explore Qualities"
    btn_class: "btn--info"
  - title: "Example Requirements"
    excerpt: "138 testable quality scenarios with metrics and acceptance criteria for your backlog."
    url: /requirements/
    btn_label: "Browse Examples"
    btn_class: "btn--danger"
---
```

No Liquid logic in the page body — it's all handled by the layout and includes.

---

## 6. Q42-specific includes (new files)

All under `_includes/q42/` to keep them namespaced from MM's includes.

### `_includes/q42/dimension-pins.html`

Renders the 9 theme filter pills. The 9 dimensions and their counts are computed via Liquid:

```liquid
{% assign dims = "reliable,flexible,efficient,usable,secure,safe,maintainable,suitable,operable" | split: "," %}
<div class="q42-dim-bar" role="toolbar" aria-label="Filter by quality theme">
  <span class="q42-dim-label">Themes</span>
  {% for dim in dims %}
    {% assign count = site.qualities | where_exp: "q", "q.tags contains dim" | size %}
    <span class="q42-dim-pin" data-d="{{ dim }}" role="button" tabindex="0">
      #{{ dim }} <span class="q42-dim-cnt">{{ count }}</span>
    </span>
  {% endfor %}
</div>
```

### `_includes/q42/homepage-graph.html`

Renders the graph frame with toolbar. The graph container `id="q-graph-home"` is where `HomeGraph` initialises.

Key elements:
- Layer toggle buttons (`data-layer="q|r|s|a"`, `aria-pressed`)
- "Fullscreen" button calling `openGraphOverlay()`
- `<div id="q-graph-home">` — the D3 mount point
- Hint text and legend

The graph JS is loaded here (not in the layout head) so it only loads on the homepage:

```liquid
<script src="{{ '/assets/js/homepage/main.js' | prepend: site.baseurl }}" defer></script>
```

### `_includes/q42/graph-overlay.html`

The `position:fixed` fullscreen overlay. Structure:

```html
<div id="q42-graph-overlay" role="dialog" aria-modal="true" class="q42-overlay" hidden>
  <div class="q42-overlay-toolbar">
    <!-- layer toggles (mirrored from homepage toolbar) -->
    <!-- close button: onclick="closeGraphOverlay()" -->
  </div>
  <div class="q42-overlay-dims">
    <!-- dimension pins duplicated here for overlay context -->
  </div>
  <div id="q42-graph-overlay-canvas">
    <!-- D3 SVG reparented here on open -->
  </div>
</div>
```

Use `hidden` attribute (not `display:none`) for better accessibility — screen readers skip it correctly, and `removeAttribute('hidden')` triggers the CSS transition.

### `_includes/q42/bottom-row.html`

Two cards for Standards and Approaches. Static HTML, no Liquid needed beyond URL prepending.

---

## 7. JavaScript changes

### 7a. `HomeGraph.js` — what changes

**Current behaviour:**
`buildGraph()` renders a star: one "Quality" root node + 9 property nodes.
`addFullGraphToggle()` adds a button that navigates to `/full-quality-graph`.

**Required behaviour:**
`buildGraph()` renders all 217 quality nodes (no aliases), their `related` edges, and the 9 property nodes as hubs. Requirements, standards, and approaches start hidden; layer toggles add/remove them from the D3 selection without re-fetching data.

**`addFullGraphToggle()` → replace with overlay logic:**

Remove the page-navigation behaviour. Instead, expose two methods on the `HomeGraph` instance:

```js
openOverlay() {
  const overlay = document.getElementById('q42-graph-overlay');
  const overlayCanvas = document.getElementById('q42-graph-overlay-canvas');
  // 1. Move the <svg> from home container into overlay canvas
  overlayCanvas.appendChild(this.renderer.svg.node());
  // 2. Resize SVG to window dimensions
  this.renderer.resize(window.innerWidth, window.innerHeight - OVERLAY_TOOLBAR_HEIGHT);
  // 3. Nudge simulation to re-settle in new space
  this.simulation.alpha(0.15).restart();
  // 4. Show overlay
  overlay.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}

closeOverlay() {
  const homeCanvas = document.getElementById('q-graph-home');
  homeCanvas.appendChild(this.renderer.svg.node());
  this.renderer.resize(homeCanvas.clientWidth, HOME_GRAPH_HEIGHT);
  this.simulation.alpha(0.05).restart();
  document.getElementById('q42-graph-overlay').setAttribute('hidden', '');
  document.body.style.overflow = '';
}
```

Wire these to `window.openGraphOverlay` / `window.closeGraphOverlay` so the inline onclick handlers in the includes can reach them without importing the module.

**Layer toggle logic** — add `setLayerVisible(type, bool)` to `HomeGraph`:

```js
setLayerVisible(nodeType, visible) {
  // nodeType: 'requirement' | 'standard' | 'approach'
  this.renderer.nodes
    .filter(d => d.qualityType === nodeType)
    .style('display', visible ? null : 'none');
  this.renderer.links
    .filter(d => d.source.qualityType === nodeType || d.target.qualityType === nodeType)
    .style('display', visible ? null : 'none');
  this.simulation.alpha(0.1).restart();
}
```

The layer toggle buttons (in both homepage toolbar and overlay toolbar) call this method. Keep the buttons in sync via a shared state object.

### 7b. `mega-menu.js` (new, ~30 lines)

```js
const trigger = document.querySelector('.q42-mega-trigger');
const panel   = document.getElementById('q42-mega-panel');

trigger?.addEventListener('click', () => {
  const isOpen = panel.classList.toggle('open');
  trigger.setAttribute('aria-expanded', isOpen);
});
document.addEventListener('click', e => {
  if (!e.target.closest('.q42-mega-wrap')) {
    panel.classList.remove('open');
    trigger?.setAttribute('aria-expanded', 'false');
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    panel.classList.remove('open');
    trigger?.setAttribute('aria-expanded', 'false');
  }
});
```

Load this with `defer` in the masthead override.

---

## 8. SCSS

### 8a. Main stylesheet

Rename or adapt `assets/css/style.scss` to import MM as the base, then layer Q42 overrides:

```scss
// 1. MM base (handles typography, grid, masthead, page layouts)
@import "minimal-mistakes";

// 2. Q42 colour tokens (override MM variables)
@import "q42/variables";

// 3. Q42-specific components
@import "q42/masthead-override";   // mega-menu, graph button
@import "q42/splash-home";          // existing file, rename import path
@import "q42/dimension-pins";
@import "q42/homepage-graph";
@import "q42/graph-overlay";
@import "q42/bottom-row";

// 4. Existing content-page styles (unchanged)
@import "content";
@import "header";
@import "standards";
@import "aliases";
@import "mobile-graph";
// … etc
```

Move existing `_sass/` files into `_sass/q42/` subdirectory to avoid namespace collisions with MM partials.

### 8b. Key MM variable overrides (`_sass/q42/_variables.scss`)

```scss
// Override MM's masthead background
$masthead-link-color: rgba(255,255,255,0.6) !default;
$masthead-link-color-hover: #ffffff !default;
$navicon-link-color-hover: rgba(255,255,255,0.8) !default;

// MM uses $background-color for page bg — match Q42
$background-color: #ffffff !default;

// Ensure MM's base font size meets WCAG AA
$type-size-5: 1rem !default;      // body (was 0.875rem in some skins)
$type-size-6: 0.875rem !default;  // small text minimum
```

### 8c. Masthead background colour

MM's masthead uses `$masthead-link-color` for links but does not provide a background token in all skins. Override the compiled selector directly:

```scss
// _sass/q42/_masthead-override.scss
.masthead {
  background-color: #1a2332;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.masthead__menu-item a,
.masthead__menu-item button {
  color: rgba(255,255,255,0.6);
  &:hover { color: #ffffff; background: rgba(255,255,255,0.08); }
}
```

---

## 9. WCAG compliance checklist

All new components must meet WCAG 2.1 AA:

| Element | Requirement |
|---|---|
| Body text | Min 16px, contrast ≥ 4.5:1 |
| Dimension pins | Min 14px; colour-on-white contrast ≥ 3:1 (large text rule) — **verify each of the 9 colours** |
| Card text (entry cards on dark hero) | Foreground `rgba(255,255,255,0.52)` on `#1a2332` → check ratio; may need to lighten to `0.65` |
| Mega-menu items | `rgba(255,255,255,0.4)` description text fails AA on dark bg — raise to `0.65` minimum |
| Graph overlay close button | Focus ring must be visible (use `outline: 2px solid #0077cc`) |
| Dimension pins | `role="button"` + `tabindex="0"` + keyboard Enter/Space handler |
| Mega-menu | `aria-expanded`, `role="menu"` / `role="menuitem"` |
| Graph overlay | `role="dialog"`, `aria-modal="true"`, focus trap on open |

Validate with axe-core or Lighthouse after implementation.

---

## 10. Performance: loading strategy

The homepage must reach First Contentful Paint (splash + cards) without waiting for the graph.

```
<head>
  <!-- MM stylesheet (critical) -->
  <link rel="stylesheet" href="/assets/css/main.css">
  <!-- Graph CSS can be inlined or also critical — it's small -->
</head>

<body>
  <!-- Header, splash, dimension pins: static HTML, no JS -->

  <!-- Graph container: rendered immediately as empty box -->
  <div id="q-graph-home" class="q42-graph-canvas q42-graph-loading">
    <!-- Skeleton shimmer via CSS while JS loads -->
  </div>

  <!-- JS: deferred, non-blocking -->
  <script src="/assets/js/homepage/main.js" defer></script>
  <script src="/assets/js/mega-menu.js" defer></script>
</body>
```

`main.js` (compiled by esbuild) fetches `assets/data/nodes.json` + `assets/data/edges.json` asynchronously after DOMContentLoaded. Graph data is ~40KB gzipped; on a 10 Mbps connection this is ~30ms. The D3 bundle is ~80KB gzipped (~60ms). Total time to interactive graph: under 500ms on average connections.

**Overlay = zero additional network cost.** The SVG element is reparented via `appendChild` — no clone, no re-fetch, no re-init. `simulation.alpha(0.15).restart()` resettles the layout in the new container dimensions in ~300ms.

**Layer toggles = zero network cost.** All node types are loaded into memory at init (the data is pre-filtered by `buildGraph()` but the full dataset is available on the `dataProvider`). Adding requirements or standards to the visible graph is a D3 `.style('display', ...)` call plus a simulation nudge.

---

## 11. Files changed / created — summary

| Action | Path |
|---|---|
| Modify | `_config.yml` |
| Modify | `Gemfile` |
| Create | `_data/navigation.yml` |
| Create | `_data/explore-menu.yml` |
| Create | `_layouts/splash-q42.html` |
| Modify | `_pages/01-home.md` |
| Create | `_includes/masthead.html` (override) |
| Create | `_includes/q42/dimension-pins.html` |
| Create | `_includes/q42/homepage-graph.html` |
| Create | `_includes/q42/graph-overlay.html` |
| Create | `_includes/q42/bottom-row.html` |
| Modify | `src/graphs/HomeGraph.js` |
| Create | `assets/js/mega-menu.js` |
| Modify | `assets/css/style.scss` (import order) |
| Reorganise | `_sass/` → `_sass/q42/` (rename subdirectory) |
| Create | `_sass/q42/_variables.scss` |
| Create | `_sass/q42/_masthead-override.scss` |
| Create | `_sass/q42/_dimension-pins.scss` |
| Create | `_sass/q42/_homepage-graph.scss` |
| Create | `_sass/q42/_graph-overlay.scss` |
| Rename | `_sass/_splash-home.scss` → `_sass/q42/_splash-home.scss` |
| **No change** | All `_layouts/qualities.html`, `requirements.html`, `standards.html`, `approach.html` |
| **No change** | All `_includes/directly-related-*.html`, `one-*.liquid`, etc. |
| **No change** | `src/graphs/Graph.js`, `GraphRenderer.js`, `GraphDataProvider.js`, `FullGraph.js` |
| **No change** | `build.js`, `src/scripts/data.js`, all `assets/data/` |

---

## 12. What to validate after implementation

1. `npm run test:links` — all cross-references still valid
2. `npm run build && bundle exec jekyll build` — clean build, no Liquid errors
3. Lighthouse on homepage: Performance ≥ 90, Accessibility ≥ 95
4. axe-core: zero violations on homepage and graph overlay
5. Manual: mega-menu keyboard navigation (Tab, Enter, Esc)
6. Manual: graph overlay opens/closes correctly; SVG returns to homepage on close
7. Manual: layer toggles (qualities/requirements/standards/approaches) show/hide nodes
8. Manual: dimension pin filter highlights correct node cluster in both embedded and overlay views
9. Manual: double-click on graph node navigates to correct quality page
10. Content page smoke-test: one quality, one requirement, one standard page render correctly with no layout regression

---

## 13. Lunr.js Search Integration

MM includes a Lunr.js-powered search engine. The goal here is to enable it for all four Q42 content collections and present search results grouped by content type, so a search for "performance" surfaces the quality, its requirements, relevant standards, and any approaches in separate labelled sections.

### 13a. How MM's Lunr search works (background)

MM generates a JavaScript object store at build time from all Jekyll pages and collection documents. At runtime, Lunr indexes this store client-side and returns ranked result objects. MM's default UI renders results as a flat list. Q42 needs to intercept after Lunr returns results and group them before rendering.

The store entry structure MM produces:

```js
{
  title: "Accessibility",
  excerpt: "The degree to which a product...",
  content: "...",          // full page text (if search_full_content: true)
  url: "/qualities/accessibility",
  type: "qualities",        // ← Jekyll collection name, always present
  categories: [],
  tags: ["usable"]
}
```

The `type` field is the collection name (`qualities`, `requirements`, `standards`, `approaches`). This is what drives segmentation — no custom frontmatter is required on individual files.

### 13b. `_config.yml` changes

Flip the search flag that the current plan disabled:

```yaml
# Change this:
search: false

# To this:
search: true
search_full_content: true   # index full page text, not just excerpt
```

`search_full_content: true` ensures that body text of quality/requirement pages is fully indexed, not just the `excerpt`. This matters for requirements where the acceptance criteria text (not the title) is what users search for.

All four collections must already be declared under `collections:` with `output: true` — this makes their pages discoverable by MM's store generator. No other `_config.yml` change is needed for collection indexing.

> **If `approaches` is a collection but currently undeclared** in `collections:`, add it now alongside `qualities`, `requirements`, `standards`. MM will then include approach pages in the store automatically.

### 13c. Search page: `_pages/search.md`

MM provides a `search` layout. Create the search results page:

```yaml
---
title: Search
layout: search
permalink: /search/
---
```

This page is linked from the masthead search icon (MM renders a search toggle button when `search: true`). No further content needed in the file — the layout renders the search form and results container.

### 13d. Override `_includes/search/lunr-search-scripts.html`

This is the key file. Copy it from the MM gem:

```
vendor/bundle/ruby/<version>/gems/minimal-mistakes-jekyll-4.28.0/
  _includes/search/lunr-search-scripts.html
```

Copy to `_includes/search/lunr-search-scripts.html` (Jekyll resolves local overrides first). Then replace the results-rendering section with the segmented version below.

The original file ends with a `displayResults(store, results)` function that renders a flat list. Replace that function with:

```js
const SEGMENTS = [
  { key: "qualities",     label: "Quality Characteristics", icon: "🔵" },
  { key: "requirements",  label: "Example Requirements",    icon: "🔴" },
  { key: "standards",     label: "Standards",               icon: "🟡" },
  { key: "approaches",    label: "Solution Approaches",     icon: "🟢" },
];

function displayResults(store, results) {
  const container = document.getElementById("search-results");
  if (!results.length) {
    container.innerHTML = '<p class="q42-search-empty">No results found.</p>';
    return;
  }

  // Map Lunr result refs back to store entries
  const hits = results.map(r => store.find(s => s.url === r.ref)).filter(Boolean);

  // Group by collection type
  const grouped = {};
  SEGMENTS.forEach(seg => {
    grouped[seg.key] = hits.filter(h => h.type === seg.key);
  });

  // Build HTML: one section per segment, skip empty segments
  const html = SEGMENTS
    .filter(seg => grouped[seg.key].length > 0)
    .map(seg => {
      const items = grouped[seg.key]
        .map(item => `
          <article class="q42-search-result">
            <h3><a href="${item.url}">${item.title}</a></h3>
            <p>${item.excerpt}</p>
          </article>`)
        .join("");

      return `
        <section class="q42-search-segment">
          <h2 class="q42-search-segment-heading">
            <span aria-hidden="true">${seg.icon}</span>
            ${seg.label}
            <span class="q42-search-count">${grouped[seg.key].length}</span>
          </h2>
          ${items}
        </section>`;
    })
    .join("");

  container.innerHTML = html;
}
```

Everything else in the file (Lunr initialisation, search event binding, store loading) stays unchanged. Only the final rendering function is replaced.

### 13e. SCSS for segmented search results

Add `_sass/q42/_search.scss` and import it in `assets/css/style.scss`:

```scss
// _sass/q42/_search.scss

.q42-search-segment {
  margin-bottom: 2.5rem;
}

.q42-search-segment-heading {
  font-size: 1.1rem;
  font-weight: 600;
  border-bottom: 2px solid var(--q42-primary, #00B8F5);
  padding-bottom: 0.35em;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.q42-search-count {
  font-size: 0.8em;
  font-weight: 400;
  color: rgba(0,0,0,0.5);
  background: #f0f0f0;
  border-radius: 10px;
  padding: 0 0.5em;
  margin-left: auto;
}

.q42-search-result {
  margin-bottom: 1.25rem;

  h3 {
    font-size: 1rem;
    margin-bottom: 0.25em;
  }

  p {
    font-size: 0.9rem;
    color: rgba(0,0,0,0.65);
    margin: 0;
  }
}

.q42-search-empty {
  color: rgba(0,0,0,0.5);
  font-style: italic;
}
```

### 13f. Masthead: search icon and input

When `search: true` is set in `_config.yml`, MM automatically renders a search toggle button in the masthead and a sliding search input form. The custom `_includes/masthead.html` (from §3) must preserve MM's search markup. When copying the masthead, retain these two blocks from the original:

```liquid
{% if site.search == true %}
  <button class="search__toggle" type="button">...</button>
{% endif %}
```

and the search form partial:

```liquid
{% include search/search_form.html %}
```

Both are present in MM's original `masthead.html`. Do not remove them when writing the Q42 masthead override.

### 13g. What gets indexed and what does not

| Content | Indexed? | Notes |
|---|---|---|
| `_qualities/` | ✅ Yes | Full text if `search_full_content: true` |
| `_requirements/` | ✅ Yes | Acceptance criteria text included |
| `_standards/` | ✅ Yes | Standard description and characteristics |
| `_approaches/` | ✅ Yes | Requires `approaches` in `collections:` |
| `_articles/` | ✅ Yes | Indexed as `articles` type |
| `_pages/` | ✅ Yes | Includes tag pages (may add noise) |
| `assets/data/*.json` | ❌ No | Not Jekyll pages; not indexed |
| Graph nodes | ❌ No | Graph navigation is separate from search |

Tag pages (`tag-usable.md` etc.) will appear in results if someone searches a tag name. This is not harmful — they serve as useful landing pages — but if noise becomes an issue, exclude them with `search: false` in their frontmatter defaults:

```yaml
# In _config.yml defaults:
- scope:
    path: "_pages/tag-*.md"
  values:
    search: false
```

### 13h. Files changed / created (additions to §11 manifest)

| Action | Path |
|---|---|
| Modify | `_config.yml` — set `search: true`, add `search_full_content: true` |
| Create | `_pages/search.md` — search results page |
| Create | `_includes/search/lunr-search-scripts.html` — override with segmented rendering |
| Create | `_sass/q42/_search.scss` — segmented results styles |
| Modify | `assets/css/style.scss` — add `@import "q42/search"` |

No changes to collection files. No changes to graph JS. No changes to `assets/data/`.

### 13i. Validation

After implementing search:

1. Build the site and verify `assets/js/lunr/lunr-store.js` (or the equivalent store file MM generates) contains entries from all four collections.
2. Search for a known quality name (e.g. "performance") — confirm results appear in the Qualities segment.
3. Search for a requirement keyword (e.g. "response time") — confirm it surfaces under Example Requirements.
4. Search for a standard name (e.g. "ISO 25010") — confirm it appears under Standards.
5. Search for a term with no results — confirm the "No results found" message appears without JS errors.
6. Lighthouse Accessibility: search input must have a visible label; verify axe-core reports no violations on the `/search/` page.
7. Keyboard navigation: Tab to the search icon, Enter to open, type a query, Tab through results — all interactive without a mouse.
