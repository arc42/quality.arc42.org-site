import { expect, test } from "@playwright/test";

test("full graph page renders desktop controls and legend toggles", async ({ page }) => {
  await page.goto("/full-quality-graph");

  const homeLink = page.getByRole("link", { name: "Back to home" });
  await expect(page.locator("#full-q-graph-container")).toBeVisible();
  await expect(page.locator("#full-q-graph-filter__input")).toBeAttached();
  await expect(page.locator("#full-q-graph-filter__btn")).toBeAttached();
  await expect(homeLink).toBeVisible();
  await expect(homeLink).toHaveAttribute("href", /\/$/);
  await expect(page.locator("#full-q-graph-home__btn i.fa-home")).toBeAttached();
  await expect(page.locator(".mobile-quick-filters")).toBeAttached();
  await expect(page.locator(".mobile-quick-filter[data-term='secure']")).toBeAttached();
  await expect(page.locator("#legend-toggle-qualities")).toBeAttached();
  await expect(page.locator("#legend-toggle-standards")).toBeAttached();
  await expect(page.locator("#legend-toggle-requirements")).toBeAttached();
});

test("back-to-home control is keyboard-activatable", async ({ page }) => {
  await page.goto("/full-quality-graph");

  const homeLink = page.getByRole("link", { name: "Back to home" });
  await homeLink.focus();
  await expect(homeLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/$/);
});

test("mobile graph view toggles filter sheet without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/full-quality-graph");

  await expect(page.getByRole("heading", { level: 1, name: "Quality Graph" })).toBeVisible();

  const toggleButton = page.locator("#mobile-graph-controls-toggle");
  const closeButton = page.locator("#mobile-graph-sheet-close");
  const sidebar = page.locator("#full-q-graph-sidebar");

  await expect(toggleButton).toBeVisible();
  await expect(toggleButton).toHaveAttribute("aria-expanded", "false");

  // GraphPageController defers its mobile defaults by 180 ms after init.
  // Wait for that pass to complete so a click can't be undone by it.
  await page.waitForFunction(() => document.body.classList.contains("graph-compact-header"));

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
  // 1280x580 approximates a 1280x700 window at ~120% browser zoom: short
  // (height < 700) but desktop-wide (width > 900). Load with
  // requirements/standards/approaches already enabled via URL state, as a
  // shared/bookmarked graph link would — the state the height-only part of
  // the breakpoint must not silently discard.
  await page.setViewportSize({ width: 1280, height: 580 });
  await page.goto("/full-quality-graph?showRequirements=1&showStandards=1&showApproaches=1");

  const toggleButton = page.locator("#mobile-graph-controls-toggle");
  await expect(toggleButton).toBeVisible();

  // GraphPageController defers its mobile defaults by 180 ms after init;
  // wait for that pass to complete before asserting anything it could affect.
  await page.waitForFunction(() => document.body.classList.contains("graph-compact-header"));

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

  // Regression this fix prevents: this viewport is short but NOT narrow
  // (1280px > the 900px width breakpoint), so the legend-toggle defaults
  // must not be forced off even though the sheet UI is active. Only the
  // width-gated narrow breakpoint may reset these to the simplified set.
  await expect(page.locator("#legend-toggle-requirements")).toBeChecked();
  await expect(page.locator("#legend-toggle-standards")).toBeChecked();
  await expect(page.locator("#legend-toggle-approaches")).toBeChecked();
});

test("desktop sidebar scrolls instead of clipping when content overflows", async ({ page }) => {
  // Tall enough for desktop mode (no sheet), short enough that the
  // sidebar content can exceed the container.
  await page.setViewportSize({ width: 1280, height: 760 });
  await page.goto("/full-quality-graph");

  const overflowY = await page
    .locator("#full-q-graph-sidebar")
    .evaluate((el) => getComputedStyle(el).overflowY);
  expect(overflowY).toBe("auto");
});

test("sidebar grows by visible scrollbar width when filters cause overflow", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 760 });
  await page.goto("/full-quality-graph");

  const sidebar = page.locator("#full-q-graph-sidebar");
  await expect(sidebar).toBeVisible();

  const before = await sidebar.boundingBox();
  expect(before).not.toBeNull();

  const filterInput = page.locator("#full-q-graph-filter__input");
  const filterBtn = page.locator("#full-q-graph-filter__btn");
  await filterInput.fill("t1, t2, t3, t4, t5, t6, t7, t8, t9");
  await filterBtn.click();
  await expect(page.locator("#full-q-graph-filter__chips .q-chip")).toHaveCount(9);

  const after = await sidebar.boundingBox();
  expect(after).not.toBeNull();

  const metrics = await sidebar.evaluate((el) => {
    const hasVerticalOverflow = el.scrollHeight > el.clientHeight + 1;
    const scrollbarWidth = Math.max(0, el.offsetWidth - el.clientWidth);
    return { hasVerticalOverflow, scrollbarWidth };
  });

  if (metrics.hasVerticalOverflow && metrics.scrollbarWidth > 0) {
    expect(Math.abs(after.width - (before.width + metrics.scrollbarWidth))).toBeLessThan(3);
  } else {
    expect(Math.abs(after.width - before.width)).toBeLessThan(3);
  }
  expect(Math.abs(after.height - before.height)).toBeLessThan(1);
});

test("quick filter disappears when selected and reappears when removed", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 760 });
  await page.goto("/full-quality-graph");

  const secureQuickFilter = page.locator(".mobile-quick-filter[data-term='secure']");
  await expect(secureQuickFilter).toBeVisible();

  // Click quick filter
  await secureQuickFilter.click();

  // Quick filter disappears from the list
  await expect(secureQuickFilter).toBeHidden();

  // Active filter chip is displayed
  const chips = page.locator("#full-q-graph-filter__chips .q-chip");
  await expect(chips).toHaveCount(1);
  await expect(chips.first()).toContainText("secure");

  // Remove the active filter chip
  await chips.first().locator(".q-chip__close").click();

  // Quick filter reappears in the list
  await expect(secureQuickFilter).toBeVisible();
  await expect(chips).toHaveCount(0);
});

test("shows muted all-applied hint when all quick filters are active", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 760 });
  await page.goto("/full-quality-graph");

  await expect(page.locator(".mobile-quick-filter[data-term='secure']")).toBeVisible();
  const allAppliedHint = page.locator("#mobile-quick-filter-state");
  await expect(allAppliedHint).toBeAttached();
  await expect(allAppliedHint).toBeHidden();

  const quickFilters = page.locator(".mobile-quick-filter");
  const quickFilterCount = await quickFilters.count();
  for (let i = 0; i < quickFilterCount; i++) {
    await quickFilters.nth(i).click();
  }

  await expect(allAppliedHint).toBeVisible();
  await expect(allAppliedHint).toHaveText("all applied");

  const chips = page.locator("#full-q-graph-filter__chips .q-chip");
  await chips.first().locator(".q-chip__close").click();
  await expect(allAppliedHint).toBeHidden();
});

test("allows up to 10 filters and disables filtering when cap is reached", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 760 });
  await page.goto("/full-quality-graph");

  const filterInput = page.locator("#full-q-graph-filter__input");
  const filterBtn = page.locator("#full-q-graph-filter__btn");
  const chips = page.locator("#full-q-graph-filter__chips .q-chip");

  // Add 9 comma-separated terms
  await filterInput.fill("t1, t2, t3, t4, t5, t6, t7, t8, t9");
  await filterBtn.click();

  await expect(chips).toHaveCount(9);
  await expect(filterInput).toBeEnabled();
  await expect(filterBtn).toBeEnabled();

  // Click a quick filter to reach 10
  const secureQuickFilter = page.locator(".mobile-quick-filter[data-term='secure']");
  await expect(secureQuickFilter).toBeVisible();
  await expect(secureQuickFilter).toBeEnabled();
  await secureQuickFilter.click();

  // 10 filters active
  await expect(chips).toHaveCount(10);
  await expect(secureQuickFilter).toBeHidden();

  // No further filtering is enabled: input, button, and all quick filters are disabled
  await expect(filterInput).toBeDisabled();
  await expect(filterBtn).toBeDisabled();

  const remainingQuickFilters = page.locator(".mobile-quick-filter:visible");
  const count = await remainingQuickFilters.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    await expect(remainingQuickFilters.nth(i)).toBeDisabled();
  }

  // Removing one chip re-enables filtering
  await chips.first().locator(".q-chip__close").click();
  await expect(chips).toHaveCount(9);
  await expect(filterInput).toBeEnabled();
  await expect(filterBtn).toBeEnabled();
  for (let i = 0; i < count; i++) {
    await expect(remainingQuickFilters.nth(i)).toBeEnabled();
  }

  // Reset clears all filters and restores controls
  const resetBtn = page.locator("#mobile-graph-reset__btn");
  await expect(resetBtn).toHaveAttribute("aria-label", "Clear all filters");
  await expect(resetBtn).toBeVisible();
  await resetBtn.focus();
  await expect(resetBtn).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(chips).toHaveCount(0);
  await expect(resetBtn).toBeHidden();
  await expect(filterInput).toBeEnabled();
  await expect(filterBtn).toBeEnabled();
  await expect(secureQuickFilter).toBeVisible();
  await expect(secureQuickFilter).toBeEnabled();
});

test("clear-all filter button stays hidden until filters exist and has an accessible label", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 760 });
  await page.goto("/full-quality-graph");

  const resetBtn = page.locator("#mobile-graph-reset__btn");
  await expect(resetBtn).toHaveAttribute("aria-label", "Clear all filters");
  await expect(resetBtn).toBeHidden();

  const secureQuickFilter = page.locator(".mobile-quick-filter[data-term='secure']");
  await secureQuickFilter.click();

  await expect(resetBtn).toBeVisible();
});
