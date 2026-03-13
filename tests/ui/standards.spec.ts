import { expect, test } from "@playwright/test";

test("standards overview renders hero modes and category cards", async ({
  page,
}) => {
  await page.goto("/standards/");

  await expect(page.locator(".standards-page.standards-overview")).toBeVisible();
  await expect(page.locator(".standards-hero")).toBeVisible();
  await expect(page.locator(".standards-hero-mode")).toHaveCount(2);

  const cards = page.locator(".standards-category-card");
  const cardCount = await cards.count();
  expect(cardCount).toBeGreaterThan(0);

  await expect(cards.first()).toBeVisible();
  await expect(cards.first().locator(".standards-chip").first()).toBeVisible();
});

test("standards explorer filters and resets results", async ({ page }) => {
  await page.goto("/standards/explorer/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Standards Explorer" })
  ).toBeVisible();

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
