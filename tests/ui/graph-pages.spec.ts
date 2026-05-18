import { expect, test } from "@playwright/test";

test("full graph page renders desktop controls and legend toggles", async ({
  page,
}) => {
  await page.goto("/full-quality-graph");

  await expect(page.locator("#full-q-graph-container")).toBeVisible();
  await expect(page.locator("#full-q-graph-filter__input")).toBeAttached();
  await expect(page.locator("#full-q-graph-filter__btn")).toBeAttached();
  await expect(page.locator("#full-q-graph-home__btn")).toBeAttached();
  await expect(page.locator(".mobile-quick-filters")).toBeAttached();
  await expect(
    page.locator(".mobile-quick-filter[data-term='secure']")
  ).toBeAttached();
  await expect(page.locator("#legend-toggle-qualities")).toBeAttached();
  await expect(page.locator("#legend-toggle-standards")).toBeAttached();
  await expect(page.locator("#legend-toggle-requirements")).toBeAttached();
});

test("mobile graph view toggles filter sheet without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/full-quality-graph");

  await expect(
    page.getByRole("heading", { level: 1, name: "Quality Graph" })
  ).toBeVisible();

  const toggleButton = page.locator("#mobile-graph-controls-toggle");
  const closeButton = page.locator("#mobile-graph-sheet-close");
  const sidebar = page.locator("#full-q-graph-sidebar");

  await expect(toggleButton).toBeVisible();
  await expect(toggleButton).toHaveAttribute("aria-expanded", "false");

  // GraphPageController defers its mobile defaults by 180 ms after init.
  // Wait for that pass to complete so a click can't be undone by it.
  await page.waitForFunction(() =>
    document.body.classList.contains("graph-compact-header")
  );

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
