import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Init scripts run on every navigation; clear the store only on the first
  // one so the selection can persist across pages within a test.
  await page.addInitScript(() => {
    if (sessionStorage.getItem("q42.test.cleared")) return;
    localStorage.removeItem("q42.map.v1");
    sessionStorage.setItem("q42.test.cleared", "1");
  });
});

test("tray is hidden until a quality is added from the index", async ({ page }) => {
  await page.goto("/qualities/");
  const tray = page.locator("[data-map-tray]");
  await expect(tray).toBeHidden();
  const add = page.locator('[data-map-add="availability"]');
  await add.click();
  await expect(add).toHaveAttribute("aria-pressed", "true");
  await expect(add).toHaveText(/Added/);
  await expect(tray).toBeVisible();
  await expect(page.locator("[data-map-tray-count]")).toHaveText("1");
  await expect(page.getByRole("status")).toContainText("Availability added");
});

test("undo in the toast removes the quality again", async ({ page }) => {
  await page.goto("/qualities/");
  await page.locator('[data-map-add="availability"]').click();
  await page.getByRole("status").getByRole("button", { name: "Undo" }).click();
  await expect(page.locator('[data-map-add="availability"]')).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  await expect(page.locator("[data-map-tray]")).toBeHidden();
});

test("selection persists across pages and the detail hero button reflects it", async ({ page }) => {
  await page.goto("/qualities/");
  await page.locator('[data-map-add="availability"]').click();
  await page.goto("/qualities/availability");
  const hero = page.locator('.section-hero [data-map-add="availability"]');
  await expect(hero).toHaveAttribute("aria-pressed", "true");
  await hero.click();
  await expect(hero).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("[data-map-tray]")).toBeHidden();
});

test("tag pages carry add buttons too", async ({ page }) => {
  await page.goto("/tag-reliable/");
  await expect(page.locator('[data-map-add="availability"]')).toBeVisible();
});

test("add buttons are keyboard operable and announce state", async ({ page }) => {
  await page.goto("/qualities/availability");
  const hero = page.locator('.section-hero [data-map-add="availability"]');
  await hero.focus();
  await page.keyboard.press("Enter");
  await expect(hero).toHaveAttribute("aria-pressed", "true");
});
