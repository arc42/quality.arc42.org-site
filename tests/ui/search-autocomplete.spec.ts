import { expect, test } from "@playwright/test";

// "data" matches many docs across qualities/requirements/approaches/standards,
// so the panel shows the "Show all N results" row and the footer.
const QUERY = "data";

async function openAutocomplete(page, query = QUERY) {
  await page.goto("/");
  const input = page.locator("#site-search-input");
  await input.click();
  await input.fill(query);
  // Panel renders after the 100ms input debounce + lookup fetch.
  await expect(page.locator("#site-search-panel")).toBeVisible();
  await expect(page.locator(".site-search__item").first()).toBeVisible();
  return input;
}

test("footer is always visible and advertises the all-results chord", async ({ page }) => {
  await openAutocomplete(page);
  const footer = page.locator(".site-search__footer");
  await expect(footer).toBeVisible();
  await expect(footer).toContainText("all results");
  // Many matches for "data" → the selectable Show-all row is present too.
  await expect(page.locator(".site-search__item--all")).toBeVisible();
});

test("plain Enter opens the highlighted top result (regression guard)", async ({ page }) => {
  const input = await openAutocomplete(page);
  const href = await page.locator(".site-search__item.is-active").getAttribute("data-href");
  expect(href).toBeTruthy();
  await input.press("Enter");
  await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("Shift+Enter jumps to the full /search/ page", async ({ page }) => {
  const input = await openAutocomplete(page);
  await input.press("Shift+Enter");
  await expect(page).toHaveURL(/\/search\/\?q=data/);
});

test("Control+Enter jumps to the full /search/ page", async ({ page }) => {
  const input = await openAutocomplete(page);
  await input.press("Control+Enter");
  await expect(page).toHaveURL(/\/search\/\?q=data/);
});

test('searching "quality" surfaces the definition article near the top of its group', async ({
  page,
}) => {
  await openAutocomplete(page, "quality");
  const articleGroup = page.locator('.site-search__group[data-type="article"]');
  await expect(articleGroup).toBeVisible();
  await expect(articleGroup).toContainText("What is Quality?");

  // Not strictly first: per src/scripts/site/autocomplete.js's scorer, a
  // literal TITLE_PREFIX match (a title that *starts with* "quality", e.g.
  // "Quality Models") outscores an ALIAS_EXACT match (our `aka: Quality`
  // entry), since "What is Quality?" doesn't start with the query term.
  // What IS deterministic — and what this regression actually needs — is
  // that the definition article now outranks the old article it took its
  // "Quality Definition" / "What is Quality" aka terms from.
  const titles = await articleGroup
    .locator(".site-search__item .site-search__title")
    .allTextContents();
  const definitionIndex = titles.findIndex((t) => t.includes("What is Quality?"));
  const challengeIndex = titles.findIndex((t) => t.includes("Challenges with Quality"));
  expect(definitionIndex).toBeGreaterThanOrEqual(0);
  expect(challengeIndex).toBeGreaterThanOrEqual(0);
  expect(definitionIndex).toBeLessThan(challengeIndex);
  // And it should sit right at the top of the group (rank 0 or 1).
  expect(definitionIndex).toBeLessThanOrEqual(1);
});

test("full-graph toggle never paints over the open search dropdown", async ({ page }) => {
  await page.goto("/");
  const toggle = page.locator("#full-graph-toggle");
  await expect(toggle).toBeVisible();

  // Reproduce the reported scroll state: the sticky header (and its search
  // input) stays pinned at the top of the viewport while the page scrolls,
  // so scrolling until the graph section sits just below the header puts
  // #full-graph-toggle near the top of the visible viewport — right where
  // the autocomplete dropdown, anchored to the header, extends down to.
  const headerHeight = await page
    .locator(".site-header")
    .evaluate((el) => el.getBoundingClientRect().height);
  const containerTop = await page
    .locator("#q-graph-container")
    .evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  await page.evaluate((y) => window.scrollTo(0, y), Math.max(containerTop - headerHeight, 0));

  const input = page.locator("#site-search-input");
  await input.click();
  await input.fill(QUERY);
  await expect(page.locator("#site-search-panel")).toBeVisible();
  await expect(page.locator(".site-search__item").first()).toBeVisible();

  // Find an actual result row whose bounding box overlaps the toggle's — the
  // panel has several groups of rows at different heights, so "the first
  // item" isn't necessarily the one sitting over the toggle; walk all rows
  // to find one that does. This also doubles as confirming the bug's
  // precondition (the dropdown really does extend down over the toggle in
  // this scroll state, the way the user's report showed).
  const overlapCenter = await page.evaluate(() => {
    const toggleEl = document.querySelector("#full-graph-toggle");
    if (!toggleEl) return null;
    const toggleRect = toggleEl.getBoundingClientRect();
    const items = Array.from(document.querySelectorAll(".site-search__item"));
    for (const el of items) {
      const r = el.getBoundingClientRect();
      const left = Math.max(r.left, toggleRect.left);
      const right = Math.min(r.right, toggleRect.right);
      const top = Math.max(r.top, toggleRect.top);
      const bottom = Math.min(r.bottom, toggleRect.bottom);
      if (right > left && bottom > top) {
        // Point inside the actual intersection of the row and the toggle —
        // not just the row's own center, which can sit outside the overlap
        // when the row spans the full panel width but the toggle only
        // covers part of it.
        return { x: (left + right) / 2, y: (top + bottom) / 2 };
      }
    }
    return null;
  });
  expect(
    overlapCenter,
    "expected at least one dropdown result row to visually overlap #full-graph-toggle in this scroll state",
  ).toBeTruthy();

  // The real regression check: whatever DOM node is actually painted at the
  // center of that overlapping result row must live inside the search
  // dropdown, not be (or be inside) the full-graph-toggle pill.
  const hit = await page.evaluate(({ x, y }) => {
    const el = document.elementFromPoint(x, y);
    const panel = document.querySelector("#site-search-panel");
    const toggleEl = document.querySelector("#full-graph-toggle");
    return {
      insidePanel: !!(el && panel && panel.contains(el)),
      insideToggle: !!(el && toggleEl && toggleEl.contains(el)),
    };
  }, overlapCenter!);
  expect(hit.insidePanel).toBe(true);
  expect(hit.insideToggle).toBe(false);
});
