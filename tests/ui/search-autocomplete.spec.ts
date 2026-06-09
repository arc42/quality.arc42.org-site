import { expect, test } from "@playwright/test";

// "data" matches many docs across qualities/requirements/approaches/standards,
// so the panel shows the "Show all N results" row and the footer.
const QUERY = "data";

async function openAutocomplete(page) {
  await page.goto("/");
  const input = page.locator("#site-search-input");
  await input.click();
  await input.fill(QUERY);
  // Panel renders after the 100ms input debounce + lookup fetch.
  await expect(page.locator("#site-search-panel")).toBeVisible();
  await expect(page.locator(".site-search__item").first()).toBeVisible();
  return input;
}

test("footer is always visible and advertises the all-results chord", async ({ page }) => {
  await openAutocomplete(page);
  const footer = page.locator(".site-search__footer");
  await expect(footer).toBeVisible();
  await expect(footer).toContainText("all results");
  // Many matches for "data" → the selectable Show-all row is present too.
  await expect(page.locator(".site-search__item--all")).toBeVisible();
});

test("plain Enter opens the highlighted top result (regression guard)", async ({ page }) => {
  const input = await openAutocomplete(page);
  const href = await page.locator(".site-search__item.is-active").getAttribute("data-href");
  expect(href).toBeTruthy();
  await input.press("Enter");
  await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("Shift+Enter jumps to the full /search/ page", async ({ page }) => {
  const input = await openAutocomplete(page);
  await input.press("Shift+Enter");
  await expect(page).toHaveURL(/\/search\/\?q=data/);
});

test("Control+Enter jumps to the full /search/ page", async ({ page }) => {
  const input = await openAutocomplete(page);
  await input.press("Control+Enter");
  await expect(page).toHaveURL(/\/search\/\?q=data/);
});
