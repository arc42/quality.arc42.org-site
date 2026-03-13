import { expect, test } from "@playwright/test";

test("aliases page renders hero stats and synonym cards", async ({ page }) => {
  await page.goto("/aliases/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Quality Aliases and Synonyms",
    })
  ).toBeVisible();

  await expect(page.locator(".aliases-page")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Canonical Terms, Clear Navigation",
    })
  ).toBeVisible();

  const stats = page.locator(".aliases-stat");
  await expect(stats).toHaveCount(2);

  const cards = page.locator(".synonym-card");
  expect(await cards.count()).toBeGreaterThan(0);
  await expect(cards.first()).toBeVisible();
  await expect(cards.first().locator(".synonym-item").first()).toBeVisible();
});
