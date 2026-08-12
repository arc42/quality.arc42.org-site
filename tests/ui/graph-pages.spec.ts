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

test("short viewport (e.g. zoomed browser) switches to the filter sheet and keeps all controls reachable", async ({
  page,
}) => {
  // 1280x580 approximates a 1280x700 window at ~120% browser zoom.
  await page.setViewportSize({ width: 1280, height: 580 });
  await page.goto("/full-quality-graph");

  const toggleButton = page.locator("#mobile-graph-controls-toggle");
  await expect(toggleButton).toBeVisible();

  await page.waitForFunction(() =>
    document.body.classList.contains("graph-compact-header")
  );

  await toggleButton.click();
  const sidebar = page.locator("#full-q-graph-sidebar");
  await expect(sidebar).toHaveClass(/is-open/);

  // The controls that users reported as hidden must be reachable.
  for (const id of [
    "#legend-toggle-qualities",
    "#legend-toggle-requirements",
    "#legend-toggle-standards",
  ]) {
    const el = page.locator(id);
    await el.scrollIntoViewIfNeeded();
    await expect(el).toBeVisible();
  }
});

test("desktop sidebar scrolls instead of clipping when content overflows", async ({
  page,
}) => {
  // Tall enough for desktop mode (no sheet), short enough that the
  // sidebar content can exceed the container.
  await page.setViewportSize({ width: 1280, height: 760 });
  await page.goto("/full-quality-graph");

  const overflowY = await page
    .locator("#full-q-graph-sidebar")
    .evaluate((el) => getComputedStyle(el).overflowY);
  expect(overflowY).toBe("auto");
});
