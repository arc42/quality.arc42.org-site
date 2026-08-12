# User-Feedback Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix five user-reported issues: clipped full-graph filter panel at browser zoom, non-navigating homepage intro graph, distant "Open graph" control, unfindable definition of "quality" in search, and a static how-to metamodel image.

**Architecture:** Four independent tasks on a Jekyll site. Graph behavior lives in ES-module classes under `src/graphs/` (bundled by esbuild into `assets/js/`), search index generation in `src/scripts/index-search.js` (lunr + lookup JSON consumed by `src/scripts/site/autocomplete.js` and `search.js`), styling in `_sass/` partials, content in `_pages/` and `_articles/`.

**Tech Stack:** Jekyll (via Docker only), Node 22 ESM, esbuild, D3.js, lunr, Playwright (runs in Docker), Prettier.

**Spec:** `docs/superpowers/specs/2026-08-12-user-feedback-improvements-design.md`

## Global Constraints

- **No local Ruby/Jekyll.** All builds/tests via `make` / `docker compose`. Site dev server: `make dev` (serves http://localhost:4000). UI tests: `make test` (ensures site is up, runs Playwright in Docker). Single spec file: `docker compose --profile test run --rm playwright npx playwright test --config _docker/playwright/playwright.config.ts tests/ui/<file>.spec.ts`.
- **Restart Docker** (`make dev` again or `docker compose restart jekyll esbuild`) after adding/changing content frontmatter or generated data so the graph/search data regenerates.
- **Git staging:** stage files explicitly by name. Never `git add -A`, `git add .`, `git commit -am`, or globs.
- **Commits:** imperative mood with area prefix, e.g. `graph: navigate on single click`, `content: add quality definition`, `build: index articles in search`.
- **SCSS must pass Prettier:** run `npm run test:css` before committing any `_sass/` change (2 spaces, semicolons, 100 cols).
- **JS conventions:** ES modules, include `.js` extension in imports, Prettier-formatted.
- **Accessibility:** WCAG 2.2 AA is non-negotiable. Interactive elements need visible focus styles (`:focus-visible` with `var(--focus-ring)` — see existing patterns in `_sass/_mobile-graph.scss`).
- **Liquid URLs:** all internal hrefs in templates/content must be prefixed with `{{ site.baseurl }}` (or use `| prepend: site.baseurl` / `relative_url`), matching existing code.
- **Working branch already exists** — do not create branches; commit to the current branch. Unrelated uncommitted changes exist in `_includes/footer.html` and `_sass/_footer.scss`; do NOT stage or touch them.

---

### Task 1: Full-graph filter panel — reflow fix (spec section D)

The desktop sidebar (`#full-q-graph-sidebar`) is absolutely positioned inside `#full-q-graph-container`, which has a fixed height and `overflow: hidden` (`_sass/_mobile-graph.scss:154-160`). At 120% browser zoom the effective viewport height shrinks, the sidebar outgrows the container, and its lower controls (legend toggles for requirements/standards/approaches) are clipped and unreachable — a WCAG 1.4.4/1.4.10 failure.

Two-part fix: (1) let the desktop sidebar scroll within the container; (2) switch to the existing mobile-sheet UI on *short* viewports, not just narrow ones, by extending one JS breakpoint constant and the matching SCSS media queries.

**Files:**
- Modify: `src/graphs/GraphPageController.js:11` (breakpoint constant)
- Modify: `_sass/_mobile-graph.scss` (media queries of the sheet block, ~lines 252–420)
- Modify: `_sass/_q-graph.scss:19-32` (desktop sidebar scroll)
- Test: `tests/ui/graph-pages.spec.ts`

**Interfaces:**
- Consumes: existing DOM ids `#full-q-graph-sidebar`, `#mobile-graph-controls-toggle`, `#mobile-graph-sheet-close`, `#legend-toggle-requirements` etc. (see `_pages/60-full-quality-graph.md`).
- Produces: nothing consumed by other tasks. Breakpoint string `"(max-width: 900px), (max-height: 700px)"` must be IDENTICAL in `GraphPageController.js` and in every SCSS media query it mirrors.

- [ ] **Step 1: Write the failing tests**

Append to `tests/ui/graph-pages.spec.ts` (match the file's existing idioms — it already waits for `graph-compact-header` before clicking):

```ts
test("short viewport (e.g. zoomed browser) switches to the filter sheet and keeps all controls reachable", async ({
  page,
}) => {
  // 1280x580 approximates a 1280x700 window at ~120% browser zoom.
  await page.setViewportSize({ width: 1280, height: 580 });
  await page.goto("/full-quality-graph");

  const toggleButton = page.locator("#mobile-graph-controls-toggle");
  await expect(toggleButton).toBeVisible();

  await page.waitForFunction(() =>
    document.body.classList.contains("graph-compact-header")
  );

  await toggleButton.click();
  const sidebar = page.locator("#full-q-graph-sidebar");
  await expect(sidebar).toHaveClass(/is-open/);

  // The controls that users reported as hidden must be reachable.
  for (const id of [
    "#legend-toggle-qualities",
    "#legend-toggle-requirements",
    "#legend-toggle-standards",
  ]) {
    const el = page.locator(id);
    await el.scrollIntoViewIfNeeded();
    await expect(el).toBeVisible();
  }
});

test("desktop sidebar scrolls instead of clipping when content overflows", async ({
  page,
}) => {
  // Tall enough for desktop mode (no sheet), short enough that the
  // sidebar content can exceed the container.
  await page.setViewportSize({ width: 1280, height: 760 });
  await page.goto("/full-quality-graph");

  const overflowY = await page
    .locator("#full-q-graph-sidebar")
    .evaluate((el) => getComputedStyle(el).overflowY);
  expect(overflowY).toBe("auto");
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `make dev` (if not already running), then
`docker compose --profile test run --rm playwright npx playwright test --config _docker/playwright/playwright.config.ts tests/ui/graph-pages.spec.ts`

Expected: the two new tests FAIL (toggle button not visible at 1280x580; `overflowY` is `"visible"`). The two pre-existing tests in the file must still PASS.

- [ ] **Step 3: Extend the JS breakpoint**

In `src/graphs/GraphPageController.js` change line 11:

```js
static #MOBILE_BREAKPOINT = "(max-width: 900px), (max-height: 700px)";
```

- [ ] **Step 4: Extend the SCSS media queries for the sheet UI**

In `_sass/_mobile-graph.scss`, the sheet UI lives in `@media (max-width: 900px)` blocks inside the `.mobile-graph-page` scope (the block starting ~line 252 that contains `#mobile-graph-controls-toggle { display: inline-flex; ... }` and the `#full-q-graph-sidebar { position: fixed; ... }` sheet styles). Change **those** media queries to:

```scss
@media (max-width: 900px), (max-height: 700px) {
```

Do NOT touch the unrelated `@media (max-width: 900px)` / `(max-width: 800px)` queries near the top of the file (~lines 24, 62) — those adjust the intro header layout for narrow screens only.

- [ ] **Step 5: Make the desktop sidebar scrollable**

In `_sass/_q-graph.scss`, `#full-q-graph-sidebar` (line 19): replace `overflow: visible;` with:

```scss
  max-height: calc(100% - 40px); /* container height minus top offset + margin */
  overflow-y: auto;
```

(The sidebar is `position: absolute; top: 20px;` inside `#full-q-graph-container`, so `100%` refers to the container.)

- [ ] **Step 6: Run CSS checks and the spec file**

Run: `npm run test:css`
Expected: PASS (fix Prettier formatting if not).

Run: `docker compose --profile test run --rm playwright npx playwright test --config _docker/playwright/playwright.config.ts tests/ui/graph-pages.spec.ts`
Expected: all tests in the file PASS. If the pre-existing mobile test broke, the media-query edit hit the wrong block — recheck Step 4.

- [ ] **Step 7: Commit**

```bash
git add tests/ui/graph-pages.spec.ts src/graphs/GraphPageController.js _sass/_mobile-graph.scss _sass/_q-graph.scss
git commit -m "graph: keep filter panel reachable on short viewports (WCAG reflow)"
```

---

### Task 2: Homepage intro graph — single-click navigation + visible "Open full graph" button (spec section A)

Today homepage graph nodes navigate only on **double-click** (`src/graphs/HomeGraph.js:95-100`); single click toggles a highlight. The "Open graph" text link sits far away in the section head (`_pages/01-home.md:87`), while a small icon-only expand button lives in the graph container. Change: single click navigates (root node and background → full graph), hover keeps the highlight role, and the icon button becomes a permanently visible labeled button; the distant link is removed.

**Files:**
- Modify: `src/graphs/HomeGraph.js` (event handlers, toggle button label, background click)
- Modify: `_pages/01-home.md` (~line 87: remove the `home-violet-graph__link` anchor)
- Modify: `_sass/_q-graph.scss:262-290` (`#full-graph-toggle` styling: labeled, always visible)
- Test: `tests/ui/home.spec.ts`

**Interfaces:**
- Consumes: `Graph.registerEventHandlers(handlers)` supports keys `nodeHover`, `nodeDoubleClick`, `nodeClick` (see `src/graphs/Graph.js:595-611`, `src/graphs/GraphRenderer.js:693-696`). Node pages come from `this.graph.getNodeAttribute(d.id, "page")`; root detection via `isRootId(d.id)` (already imported). Baseurl pattern: `const baseurl = (window.baseurl || "").replace(/\/$/, "");`.
- Produces: nothing consumed by other tasks. Button keeps id `#full-graph-toggle` (styles + tests reference it).

- [ ] **Step 1: Write the failing tests**

Append to `tests/ui/home.spec.ts` (read the file first and follow its idioms; the homepage graph container is `#q-graph-container`, and property-node labels are the nine dimension names like `secure`, `reliable`):

```ts
test("clicking an intro graph node navigates to its page", async ({ page }) => {
  await page.goto("/");
  const container = page.locator("#q-graph-container");
  await expect(container.locator("svg")).toBeVisible();

  // Property nodes render a text label; "secure" links to its dimension page.
  const label = container.locator("svg text", { hasText: "secure" }).first();
  await label.click();
  await page.waitForURL(/tag-secure/);
});

test("intro graph has a visible labeled button to the full graph", async ({
  page,
}) => {
  await page.goto("/");
  const button = page.locator("#full-graph-toggle");
  await expect(button).toBeVisible();
  await expect(button).toContainText(/open full graph/i);
  await button.click();
  await page.waitForURL(/full-quality-graph/);
});

test("section head no longer has the distant open-graph link", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".home-violet-graph__link")).toHaveCount(0);
});
```

Note for the first test: verify the actual target URL of the `secure` node before finalizing the assertion — check what `page` attribute `GraphDataProvider.prepareHomeGraphData()` assigns to property nodes (grep for `page` in `src/graphs/GraphDataProvider.js`). If property nodes link to `/tag-secure/`-style pages, the regex above is right; if they link elsewhere, adjust the regex to that URL. If clicking the `<text>` element doesn't hit the node's click target, click the sibling `circle` instead (inspect the node markup in `GraphRenderer.js`).

- [ ] **Step 2: Run tests to verify they fail**

Run: `docker compose --profile test run --rm playwright npx playwright test --config _docker/playwright/playwright.config.ts tests/ui/home.spec.ts`
Expected: the three new tests FAIL (click only highlights; button has no text; link still present). Pre-existing home tests still PASS.

- [ ] **Step 3: Rewire HomeGraph event handlers**

In `src/graphs/HomeGraph.js`, replace `registerDefaultEventHandlers()` body: keep the existing `nodeHover` highlight function unchanged, replace the double-click navigation with single-click, and send the root node to the full graph:

```js
  registerDefaultEventHandlers() {
    // Single click navigates: content nodes to their page, the root
    // node to the full graph. Hover keeps the highlight role.
    const nodeClick = (event, d) => {
      const baseurl = (window.baseurl || "").replace(/\/$/, "");
      if (isRootId(d.id)) {
        window.location.href = `${baseurl}/full-quality-graph`;
        return;
      }
      window.location.href = this.graph.getNodeAttribute(d.id, "page");
    };

    const nodeHover = (event, d) => {
      /* ... existing body unchanged ... */
    };

    return this.registerEventHandlers({
      nodeHover,
      nodeClick,
    });
  }
```

(Remove `nodeDoubleClick` — single click supersedes it.)

- [ ] **Step 4: Background click + pointer cursor**

Still in `HomeGraph.js`, in `initialize()` after `super.initialize()`, add a background click handler and cursor affordance:

```js
    // Background click (not on a node) also opens the full graph.
    const svg = this.container.querySelector("svg");
    svg?.addEventListener("click", (event) => {
      if (event.target === svg) {
        const baseurl = (window.baseurl || "").replace(/\/$/, "");
        window.location.href = `${baseurl}/full-quality-graph`;
      }
    });
```

For the cursor, add to `_sass/_q-graph.scss` (near the `#q-graph-container` rule at the top):

```scss
#q-graph-container svg {
  cursor: pointer;
}
```

- [ ] **Step 5: Label the toggle button**

In `HomeGraph.js` `addFullGraphToggle()` (line 64), after appending the icon, add a text label:

```js
    const label = document.createElement("span");
    label.textContent = "Open full graph";
    this.fullGraphToggle.appendChild(label);
```

In `_sass/_q-graph.scss` `#full-graph-toggle` (lines 262–290): restyle as an always-visible labeled pill in the container's top-right corner. Keep the existing position, raise specificity only as needed. Requirements: `display: inline-flex; align-items: center; gap: 0.4rem;`, readable padding (e.g. `0.4rem 0.8rem`), pill radius, brand colors consistent with existing buttons (`var(--brand-blue-soft)` background, `var(--brand-blue)` border, `var(--brand-blue-text)` text; hover inverts like `.mobile-quick-filter:hover`), and a `:focus-visible` rule with `box-shadow: var(--focus-ring); outline: none;`. **Delete any rule that hides the button until container hover** (see `#q-graph-container:hover #full-graph-toggle` at line 287) — the button must always be visible.

- [ ] **Step 6: Remove the distant link**

In `_pages/01-home.md` (~line 87), delete the whole anchor:

```html
<a class="home-violet-graph__link" href="{{ '/full-quality-graph' | prepend: site.baseurl }}">Open graph</a>
```

Check `_sass/` for now-orphaned `.home-violet-graph__link` styles (grep) and remove them.

- [ ] **Step 7: Run checks and tests**

Run: `npm run test:css` — PASS.
Run: `docker compose --profile test run --rm playwright npx playwright test --config _docker/playwright/playwright.config.ts tests/ui/home.spec.ts`
Expected: all PASS.

- [ ] **Step 8: Commit**

```bash
git add tests/ui/home.spec.ts src/graphs/HomeGraph.js _pages/01-home.md _sass/_q-graph.scss
git commit -m "graph: navigate intro graph on single click, surface full-graph button"
```

---

### Task 3: Search finds "quality" — index articles and key pages, sharpen the definition (spec section C)

⌘K search and the /search page both consume `assets/data/search-index.json` + `search-lookup.json`, generated by `src/scripts/index-search.js` from the four collection directories only. Articles and pages are invisible to search, so "quality" returns nothing. Extend the generator, teach the autocomplete about the new types, and give the existing definitions article a crisp definition block + index keywords.

**Files:**
- Modify: `src/scripts/index-search.js` (add `_articles` + curated `_pages`)
- Modify: `src/scripts/site/autocomplete.js` (GROUPS at lines 22-25, TYPE_RANK at line 46)
- Modify: `src/scripts/site/search.js` (verify/extend any type-label mapping for results display)
- Modify: `_sass/components/_search-autocomplete.scss` (only if group styling is per-type and new types render unstyled)
- Modify: `_articles/01-challenge-with-quality.md` (definition block + `aka` keywords)
- Test: `tests/ui/search-autocomplete.spec.ts`

**Interfaces:**
- Consumes: `getFilePaths(dir)`, `parseFrontmatter(files)`, `parseList(value, sep)` from `src/scripts/data.js` (already imported in `index-search.js`). Lookup entry shape: `{ title, type, url, aliases, tags }`.
- Produces: two new `type` values in the index/lookup: `"article"` and `"page"`. Autocomplete group labels: `Articles`, `Pages`. Other tasks don't depend on this.

- [ ] **Step 1: Write the failing test**

Append to `tests/ui/search-autocomplete.spec.ts` (read the file first; reuse its open-search/typing helpers and selectors — groups render as `.site-search__group[data-type="..."]`):

```ts
test('searching "quality" surfaces the definition article', async ({ page }) => {
  await page.goto("/");
  // Reuse the file's existing pattern for opening the header search and typing.
  // Type the query:
  //   await openSearch(page);  <- or whatever the existing tests do
  //   await page.keyboard.type("quality");
  const articleGroup = page.locator('.site-search__group[data-type="article"]');
  await expect(articleGroup).toBeVisible();
  await expect(articleGroup).toContainText("Challenges with Quality");
});
```

(Adapt the open/type mechanics to the file's existing helpers — do not invent new ones.)

- [ ] **Step 2: Run test to verify it fails**

Run: `docker compose --profile test run --rm playwright npx playwright test --config _docker/playwright/playwright.config.ts tests/ui/search-autocomplete.spec.ts`
Expected: new test FAILS (no article group). Existing tests PASS.

- [ ] **Step 3: Extend the index generator**

In `src/scripts/index-search.js`:

```js
    const articlesDir = path.join(projectRoot, "_articles");
    const pagesDir = path.join(projectRoot, "_pages");

    // Curated pages worth finding via search. Utility pages (imprint,
    // reports, redirects, tag stubs) stay unindexed.
    const PAGE_ALLOWLIST = new Set([
        "05-how-to-use-this-site.md",
        "10-quality-dimensions.md",
        "20-quality-characteristics.md",
        "30-quality-requirements.md",
        "40-quality-standards.md",
        "70-solution-approaches.md",
        "80-background-on-quality.md"
    ]);
```

Add to the `collections` array:

```js
        { dir: articlesDir, type: "article" },
        { dir: pagesDir, type: "page", allowlist: PAGE_ALLOWLIST }
```

In the loop, honor the allowlist and strip Liquid noise from page/article bodies before indexing:

```js
    for (const { dir, type, allowlist } of collections) {
        const files = await getFilePaths(dir);
        const selected = allowlist
            ? files.filter(f => allowlist.has(path.basename(f)))
            : files;
        const data = await parseFrontmatter(selected);
        // ...
```

and where `body` is set:

```js
                // Liquid tags/includes are markup noise, not content.
                body: (item.body || "").replace(/\{%[\s\S]*?%\}|\{\{[\s\S]*?\}\}/g, " ")
```

(Applying the strip to all types is fine — collection bodies contain no meaningful Liquid.)
Items without a `permalink` in frontmatter: skip with `if (!item.permalink) continue;` so a stray file can't produce an undefined ref.

- [ ] **Step 4: Teach the UI the new types**

`src/scripts/site/autocomplete.js`:

```js
const GROUPS = [
  { type: "quality", label: "Qualities" },
  { type: "requirement", label: "Requirements" },
  { type: "approach", label: "Approaches" },
  { type: "standard", label: "Standards" },
  { type: "article", label: "Articles" },
  { type: "page", label: "Pages" },
];
```

```js
const TYPE_RANK = { quality: 0, requirement: 1, approach: 2, standard: 3, article: 4, page: 5 };
```

Then check `src/scripts/site/search.js` and `_sass/components/_search-autocomplete.scss` for any per-type mapping (labels, colors, icons) keyed on the four old types; extend each such mapping with `article` and `page` using neutral styling consistent with the existing groups. If styling is type-agnostic, change nothing.

- [ ] **Step 5: Sharpen the definitions article**

In `_articles/01-challenge-with-quality.md`: add to the frontmatter:

```yaml
aka: ["Quality Definition", "What is Quality", "Definition of Quality"]
```

and insert directly after the existing intro `<div class="arc42-help">…</div>` block:

```markdown
### What is Quality? A Working Definition

> Software quality is the degree to which a system satisfies the stated and
> implied needs of its various stakeholders. *(based on ISO/IEC 25010 and the
> SEBoK glossary)*

In practice that means: quality is never a single property, but a **set of
specific, measurable characteristics** — performance, security,
maintainability, usability and friends. The rest of this article explains why
the abstract definition alone doesn't help, and what to do instead.
```

Verify `index-search.js` picks up `aka` for articles (it already indexes `item.aka` for every type — line 56).

- [ ] **Step 6: Regenerate data, run tests**

Run: `npm run data` (regenerates `assets/data/`, including the search index; if this script requires Docker, use the corresponding `make` target — check `make help`). Restart the dev stack if running: `docker compose restart jekyll esbuild`.

Run: `docker compose --profile test run --rm playwright npx playwright test --config _docker/playwright/playwright.config.ts tests/ui/search-autocomplete.spec.ts`
Expected: all PASS.

Also run: `npm run test:links` — PASS (article edit must not break links).

- [ ] **Step 7: Commit**

```bash
git add tests/ui/search-autocomplete.spec.ts src/scripts/index-search.js src/scripts/site/autocomplete.js _articles/01-challenge-with-quality.md
git commit -m "search: index articles and key pages so 'quality' is findable"
```

(Also stage `src/scripts/site/search.js` and `_sass/components/_search-autocomplete.scss` if Step 4 changed them; also stage regenerated `assets/data/*.json` only if the repo tracks them — check `git status` for whether `assets/data` is committed or generated.)

---

### Task 4: Interactive how-to metamodel SVG (spec section B)

`_pages/05-how-to-use-this-site.md:71` embeds `images/how2use/how-to-use-this-site.svg` as a static markdown image. Replace it with a cleaned-up inline SVG include whose shapes are links with native tooltips and visible hover/focus affordances. The OmniGraffle `.graffle` file stays the master for geometry; the include is the styled/linked derivative.

**Files:**
- Create: `_includes/svg/how-to-use-this-site.svg` (cleaned, linked inline SVG)
- Modify: `_pages/05-how-to-use-this-site.md:71` (swap `<img>` for include)
- Modify: `_sass/_pages.scss` or the partial that styles the how-to page (locate via `grep -rn "how-to\|arc42-help" _sass/`) — hover/focus styles
- Test: `tests/ui/how-to.spec.ts` (new file)

**Interfaces:**
- Consumes: section page permalinks — verify each in the target file's frontmatter before linking: `/qualities/` (`20-quality-characteristics.md`), `/requirements/` (`30-quality-requirements.md`), `/standards/` (`40-quality-standards.md`), `/approaches/` (`70-solution-approaches.md`), dimensions page (`10-quality-dimensions.md`). Do not guess: read the `permalink:` lines.
- Produces: nothing consumed by other tasks.

- [ ] **Step 1: Write the failing test**

Create `tests/ui/how-to.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("metamodel graphic is an inline SVG with working links", async ({
  page,
}) => {
  await page.goto("/how-to-use-this-site/");

  const svg = page.locator("figure.how2use-figure svg");
  await expect(svg).toBeVisible();

  const links = svg.locator("a");
  expect(await links.count()).toBeGreaterThanOrEqual(4);

  // Every link must have an accessible name and resolve without a 404.
  const hrefs: string[] = [];
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute("aria-label", /.+/);
    hrefs.push((await link.getAttribute("href")) ?? "");
  }
  for (const href of hrefs) {
    const response = await page.request.get(href);
    expect(response.status(), `broken svg link: ${href}`).toBe(200);
  }
});

test("clicking a metamodel shape navigates", async ({ page }) => {
  await page.goto("/how-to-use-this-site/");
  const firstLink = page.locator("figure.how2use-figure svg a").first();
  const href = await firstLink.getAttribute("href");
  await firstLink.click();
  await page.waitForURL((url) => url.pathname.startsWith(href ?? "/"));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `docker compose --profile test run --rm playwright npx playwright test --config _docker/playwright/playwright.config.ts tests/ui/how-to.spec.ts`
Expected: FAIL (no `figure.how2use-figure svg`).

- [ ] **Step 3: Build the cleaned inline SVG include**

Read `images/how2use/how-to-use-this-site.svg` (OmniGraffle export, 769x696 viewBox). Create `_includes/svg/how-to-use-this-site.svg`:

1. Strip the XML prolog and DOCTYPE (inline SVG needs neither), the `xmlns:xl`/`dc` metadata attributes, and any `<metadata>` block.
2. Root element: `<svg viewBox="-36 -2 769 696" role="img" aria-labelledby="how2use-svg-title" class="how2use-svg">` with `<title id="how2use-svg-title">How the quality model fits together: dimensions, qualities, requirements, standards, and approaches</title>`. Remove fixed `width`/`height` so it scales responsively.
3. Identify each labeled shape group by its visible `<text>` content (the concept names: qualities/characteristics, requirements, standards, approaches, dimensions/tags — inspect the actual text to see which concepts the diagram shows).
4. Wrap each such group in a link with tooltip and accessible name, e.g.:

```xml
<a href="{{ '/qualities/' | prepend: site.baseurl }}" aria-label="Quality characteristics — definitions, aliases, related qualities" class="how2use-link">
  <title>Quality characteristics: definitions, aliases, related qualities, linked standards</title>
  <g><!-- original shape + text elements, unmodified geometry --></g>
</a>
```

  Note: the include is processed by Liquid because it's included from a page — the `{{ ... }}` href works. One `<a>` per concept; a concept drawn as several shapes gets them all inside one `<a>`.
5. Give shapes no inline `cursor` styles — the CSS handles affordances.

- [ ] **Step 4: Swap the embed and add styles**

In `_pages/05-how-to-use-this-site.md`, replace line 71 (`![inside-out vs outside-in graphic](/images/how2use/how-to-use-this-site.svg)`) with:

```html
<figure class="how2use-figure">
  {% include svg/how-to-use-this-site.svg %}
  <figcaption>Click any element to jump to its section. (Diagram of the arc42 quality metamodel.)</figcaption>
</figure>
```

In the how-to page's SCSS partial (or `_sass/_pages.scss` — wherever the page's styles live; grep first), add:

```scss
.how2use-figure {
  margin: 1.5rem 0;

  svg {
    display: block;
    width: 100%;
    height: auto;
    max-width: 769px;
    margin: 0 auto;
  }

  figcaption {
    margin-top: 0.5rem;
    text-align: center;
    font-size: 0.85rem;
    color: var(--brand-blue-text);
  }
}

.how2use-link {
  cursor: pointer;

  &:hover g,
  &:focus-visible g {
    opacity: 0.75;
  }

  &:focus-visible {
    outline: 2px solid var(--brand-blue-dark);
    outline-offset: 2px;
  }
}
```

Register the partial in the main stylesheet only if you created a new file (follow how existing partials are imported — check `assets/css/` or the main `.scss` entry).

- [ ] **Step 5: Run checks and tests**

Restart the dev stack so the include is picked up: `docker compose restart jekyll`.
Run: `npm run test:css` — PASS.
Run: `docker compose --profile test run --rm playwright npx playwright test --config _docker/playwright/playwright.config.ts tests/ui/how-to.spec.ts`
Expected: PASS.
Visual sanity check: `curl -s http://localhost:4000/how-to-use-this-site/ | grep -c "how2use-link"` returns ≥ 4.

- [ ] **Step 6: Commit**

```bash
git add tests/ui/how-to.spec.ts _includes/svg/how-to-use-this-site.svg _pages/05-how-to-use-this-site.md <the-scss-file-you-edited>
git commit -m "content: make how-to metamodel SVG interactive with links and tooltips"
```

---

## Final verification (after all four tasks)

- [ ] Run the full UI suite: `make test` — all green.
- [ ] Run `make wcag-test` — no NEW violations versus main (the scan is informative; compare, don't just pass/fail).
- [ ] Run `npm run test:links` and `npm run test:css` — PASS.
