import { expect, test } from "@playwright/test";

test("full graph page renders desktop controls and legend toggles", async ({
  page,
}) => {
  await page.goto("/full-quality-graph");

  await expect(page.locator("#full-q-graph-container")).toBeVisible();
  await expect(page.locator("#full-q-graph-filter__input")).toBeVisible();
  await expect(page.locator("#full-q-graph-filter__btn")).toBeVisible();
  await expect(page.locator("#full-q-graph-home__btn")).toBeVisible();
  await expect(page.locator(".full-quick-filters")).toBeVisible();
  await expect(page.getByRole("button", { name: "#secure" })).toBeVisible();
  await expect(page.locator("#legend-toggle-qualities")).toBeVisible();
  await expect(page.locator("#legend-toggle-standards")).toBeVisible();
  await expect(page.locator("#legend-toggle-requirements")).toBeVisible();
});

test("mobile graph page toggles filter sheet without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/mobile");

  await expect(
    page.getByRole("heading", { level: 2, name: "Mobile Graph Explorer" })
  ).toBeVisible();

  const toggleButton = page.locator("#mobile-graph-controls-toggle");
  const closeButton = page.locator("#mobile-graph-sheet-close");
  const sidebar = page.locator("#full-q-graph-sidebar");

  await expect(toggleButton).toBeVisible();
  await expect(toggleButton).toHaveAttribute("aria-expanded", "false");

  await toggleButton.click();
  await expect(toggleButton).toHaveAttribute("aria-expanded", "true");
  await expect(sidebar).toHaveClass(/is-open/);
  await expect(closeButton).toBeVisible();

  await closeButton.click();
  await expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  await expect(sidebar).not.toHaveClass(/is-open/);

  const hasHorizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth + 1;
  });

  expect(hasHorizontalOverflow).toBeFalsy();
});
