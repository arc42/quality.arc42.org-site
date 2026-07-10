import { expect, test } from "@playwright/test";

test("requirements entry page layout and dimension facets", async ({ page }) => {
  await page.goto("/requirements/");

  const headerPanel = page.locator('.section-hero[data-section="requirements"]').first();
  await expect(headerPanel).toBeVisible();

  await expect(page.getByRole("heading", { level: 1, name: "Example Requirements" })).toBeVisible();

  // The shared index-explorer renders dimension facet chips as buttons.
  const explorer = page.locator("#requirements-explorer");
  await expect(explorer).toBeVisible();

  const efficientFacet = explorer.locator('.ix-facet-chip:has-text("#efficient")');
  const reliableFacet = explorer.locator('.ix-facet-chip:has-text("#reliable")');
  await expect(efficientFacet).toBeVisible();
  await expect(reliableFacet).toBeVisible();
  await expect(efficientFacet.locator(".ix-count")).toContainText(/^\d+$/);
  await expect(reliableFacet.locator(".ix-count")).toContainText(/^\d+$/);

  // Unfiltered, every requirement is listed.
  const summary = page.locator("#requirements-results-summary");
  await expect(summary).toContainText(/^\d+ of \d+ requirements visible$/);

  // Activating a facet narrows the result list and marks the chip pressed.
  await efficientFacet.click();
  await expect(explorer.locator('.ix-facet-chip:has-text("#efficient")')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  const summaryText = (await summary.textContent()) ?? "";
  const match = summaryText.match(/^(\d+) of (\d+)/);
  expect(match).not.toBeNull();
  const visible = Number(match![1]);
  const total = Number(match![2]);
  expect(visible).toBeGreaterThan(0);
  expect(visible).toBeLessThan(total);

  // Result items use the shared item grammar.
  await expect(explorer.locator(".ix-item .ix-item-title a").first()).toBeVisible();
});
