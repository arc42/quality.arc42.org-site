import { expect, test } from "@playwright/test";

test("standards search ranks names, searches prose and combines issuer filters", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/standards/explorer/");
  const search = page.locator("#standards-search");
  const visible = page.locator(".standards-explorer-card:not(.is-hidden)");
  const c3a = page.locator('[data-standard-id="c3a"]');

  await search.fill("C3A");
  await expect(visible.first()).toHaveAttribute("data-standard-id", "c3a");
  await search.fill("cloud sovereignty");
  await expect(c3a).toBeVisible();
  await expect(visible.first()).toHaveAttribute("data-standard-id", "eucsf");
  await search.fill("cloud auton");
  await expect(c3a).toBeVisible();
  await page.locator('.standards-org-facet-btn[data-organization="bsi"]').click();
  await expect(visible).toHaveCount(1);
  await expect(c3a).toBeVisible();
  await expect(page.locator('[data-category="data"] .standards-facet-count')).toHaveText("1");
  await search.fill("BSI");
  await expect(c3a).toBeVisible();
  await page.locator("#standards-reset-filters").click();
  await search.fill("ISO 25010");
  await expect(visible.first()).toHaveAttribute("data-standard-id", "iso25010");
  await search.fill("zzzz");
  await page.locator("#standards-reset-filters").click();
  await expect(search).toHaveValue("");
  await expect.poll(async () => visible.count()).toBeGreaterThan(1);
  const names = await visible.evaluateAll((cards) =>
    cards.map((card) => (card as HTMLElement).dataset.shortname!),
  );
  expect(names).toEqual(names.slice().sort((a, b) => a.localeCompare(b)));
  expect(errors).toEqual([]);
});

test("standards search omits reference sections but searches the full body", async ({ page }) => {
  // Exercise the same extraction and indexing path with a distinctive word in
  // prose and a separate word only in a reference, independent of content edits.
  await page.route("**/standards/explorer/", async (route) => {
    const response = await route.fetch();
    const html = (await response.text()).replace(
      /(<template class="standards-search-body">)[\s\S]*?(<\/template>)/,
      "$1<p>searchableprosemarker</p><h2>References and Resources</h2><p>excludedreferencemarker</p>$2",
    );
    await route.fulfill({ response, body: html });
  });
  await page.goto("/standards/explorer/");
  const search = page.locator("#standards-search");
  const visible = page.locator(".standards-explorer-card:not(.is-hidden)");
  await search.fill("searchableprosemarker");
  await expect(visible).toHaveCount(1);
  await search.fill("excludedreferencemarker");
  await expect(visible).toHaveCount(0);
});

test("standards overview renders hero modes and category cards", async ({ page }) => {
  await page.goto("/standards/");

  await expect(page.locator(".standards-page.standards-overview")).toBeVisible();
  await expect(page.locator('.section-hero[data-section="standards"]')).toBeVisible();
  await expect(page.locator(".standards-mode-switch__link")).toHaveCount(2);

  const cards = page.locator(".standards-category-card");
  const cardCount = await cards.count();
  expect(cardCount).toBeGreaterThan(0);

  await expect(cards.first()).toBeVisible();
  await expect(cards.first().locator(".standards-chip").first()).toBeVisible();
});

test("standards explorer filters and resets results", async ({ page }) => {
  await page.goto("/standards/explorer/");

  await expect(page.locator(".standards-page.standards-explorer-view")).toBeVisible();

  const searchInput = page.locator("#standards-search");
  const resetButton = page.locator("#standards-reset-filters");
  const resultCounter = page.locator("#standards-result-counter");

  await expect(searchInput).toBeVisible();
  await expect(resetButton).toBeVisible();

  const visibleCards = page.locator(".standards-explorer-card:not(.is-hidden)");
  expect(await visibleCards.count()).toBeGreaterThan(0);

  await searchInput.fill("zzzz-not-found");
  await expect(resultCounter).toHaveText("0 standards visible");
  await expect(visibleCards).toHaveCount(0);

  await resetButton.click();
  await expect(resultCounter).toHaveText(/[1-9]\d* standards visible/);
  expect(await visibleCards.count()).toBeGreaterThan(0);
});
