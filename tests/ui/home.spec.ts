import { expect, test } from "@playwright/test";

test("home page renders splash hero, graph preview, and theme links", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Software Quality, Made Navigable",
    })
  ).toBeVisible();

  await expect(page.getByRole("link", { name: /Quality Characteristics/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Example Requirements/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Quality Dimensions/i })).toBeVisible();

  await expect(page.getByRole("link", { name: /Dimensions/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Graph/i })).toBeVisible();

  await expect(page.locator("#q-graph-container")).toBeVisible();

  await expect(page.getByText("9 themes in preview")).toBeVisible();
  await expect(page.getByRole("link", { name: /\d+\s+qualities/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /\d+\s+requirements/i })).toBeVisible();

  const themeBar = page.locator(".q42-dim-bar");
  await expect(themeBar).toBeVisible();
  await expect(themeBar.getByRole("link", { name: /#reliable/i })).toBeVisible();
  await expect(themeBar.getByRole("link", { name: /#maintainable/i })).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth + 1;
  });

  expect(hasHorizontalOverflow).toBeFalsy();
});
