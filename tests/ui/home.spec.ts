import { expect, test } from "@playwright/test";

test("home page renders hero, directory entries, and graph section", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Quality drives Architecture",
    }),
  ).toBeVisible();

  const directory = page.locator(".home-violet-directory");
  await expect(directory).toBeVisible();
  await expect(directory.locator("li")).toHaveCount(4);

  await expect(page.getByRole("link", { name: /Quality Characteristics/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Example Requirements/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Solution Approaches/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Standards & Regulations/ })).toBeVisible();

  await expect(page.getByRole("heading", { level: 2, name: "The quality graph" })).toBeVisible();

  await expect(page.locator("#q-graph-container")).toBeVisible();

  await expect(page.locator("#full-graph-toggle")).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth + 1;
  });

  expect(hasHorizontalOverflow).toBeFalsy();
});

test("clicking an intro graph node navigates to its page", async ({ page }) => {
  await page.goto("/");
  const container = page.locator("#q-graph-container");
  await expect(container.locator("svg")).toBeVisible();

  // Property nodes render a text label; "secure" links to its dimension page.
  const label = container.locator("svg text", { hasText: "secure" }).first();
  await label.click();
  await page.waitForURL(/tag-secure/);
});

test("intro graph has a visible labeled link to the full graph", async ({
  page,
}) => {
  await page.goto("/");
  const link = page.locator("#full-graph-toggle");
  await expect(link).toBeVisible();
  // A real <a>, not a JS-only button: works with no JS, middle-click, and
  // "open in new tab", and has a resolvable href for no-JS users.
  await expect(link).toHaveAttribute("href", /\/full-quality-graph$/);
  await expect(link).toHaveAccessibleName(/open full graph/i);
  await expect(link).toContainText(/open full graph/i);
  await link.click();
  await page.waitForURL(/full-quality-graph/);
});

test("section head no longer has the distant open-graph link", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".home-violet-graph__link")).toHaveCount(0);
});
