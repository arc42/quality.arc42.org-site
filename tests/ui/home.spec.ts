import { expect, test } from "@playwright/test";

test("home page renders hero, graph entry point, and dimensions table", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "System and Product Quality, Made Easy",
    })
  ).toBeVisible();

  const modeGrid = page.locator(".home-new-mode-grid");
  await expect(modeGrid).toBeVisible();

  await expect(page.getByRole("link", { name: /small-graph/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /full-graph/i })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /textual-navigation/i })
  ).toBeVisible();

  await expect(page.locator("#q-graph-container")).toBeVisible();

  await expect(
    page.getByRole("heading", { level: 3, name: "Quality Dimensions" })
  ).toBeVisible();

  const dimensionsTable = page.locator(".home-new-dimensions-table");
  await expect(dimensionsTable).toBeVisible();
  await expect(dimensionsTable.locator("tbody tr")).toHaveCount(9);

  await expect(page.getByRole("link", { name: "#reliable" })).toBeVisible();
  await expect(page.getByRole("link", { name: "#maintainable" })).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth + 1;
  });

  expect(hasHorizontalOverflow).toBeFalsy();
});
