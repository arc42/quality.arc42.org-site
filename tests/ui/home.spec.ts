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

  // Property nodes render a centered text label directly on top of an
  // invisible hit-circle (same index, same position) — the circle carries
  // the click handler, so clicking through the label's own bounding box
  // would hit the label instead. Find "secure" among the labels, then
  // dispatch the click on its sibling circle by index.
  const labels = container.locator("svg text");
  const labelCount = await labels.count();
  let secureIndex = -1;
  for (let i = 0; i < labelCount; i += 1) {
    const text = (await labels.nth(i).textContent())?.trim().toLowerCase();
    if (text === "secure") {
      secureIndex = i;
      break;
    }
  }
  expect(secureIndex).toBeGreaterThanOrEqual(0);

  const circle = container.locator("svg circle").nth(secureIndex);
  await circle.dispatchEvent("click");
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
