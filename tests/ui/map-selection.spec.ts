import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Init scripts run on every navigation; clear the store only on the first
  // one so the selection can persist across pages within a test.
  await page.addInitScript(() => {
    if (sessionStorage.getItem("q42.test.cleared")) return;
    localStorage.removeItem("q42.map.v1");
    localStorage.removeItem("q42.map.banner-dismissed");
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

test("tray hit area reaches 44px above the visible pill", async ({ page }) => {
  await page.goto("/qualities/");
  await page.locator('[data-map-add="availability"]').click();
  const box = await page.locator("[data-map-tray]").boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.click(box!.x + box!.width / 2, box!.y - 3);
  await expect(page).toHaveURL(/\/map\/?$/);
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
  await expect(page.getByRole("status")).toContainText("Availability removed again");
  await expect(page.getByRole("status").getByRole("button", { name: "Undo" })).toHaveCount(0);
});

test("undo keeps a change made in another tab meanwhile", async ({ page }) => {
  await page.goto("/qualities/");
  await page.locator('[data-map-add="availability"]').click();
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem("q42.map.v1")!);
    state.qualities.push({ id: "security", priority: null, hidden: false });
    localStorage.setItem("q42.map.v1", JSON.stringify(state));
  });
  await page.getByRole("status").getByRole("button", { name: "Undo" }).click();
  const ids = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("q42.map.v1")!).qualities.map((q) => q.id),
  );
  expect(ids).toEqual(["security"]);
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

test("the qualities index shows a dismissible map banner that stays dismissed", async ({
  page,
}) => {
  await page.goto("/qualities/");
  const banner = page.locator("[data-map-banner]");
  await expect(banner).toBeVisible();
  await expect(banner).toContainText("Build your own map.");
  await expect(banner).toContainText("add your own requirements");
  await expect(banner.getByRole("link", { name: "Open the map" })).toHaveAttribute(
    "href",
    /\/map\/$/,
  );
  const dismiss = banner.getByRole("button", { name: "Dismiss" });
  const box = await dismiss.boundingBox();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
  await dismiss.click();
  await expect(banner).toBeHidden();
  await page.reload();
  await expect(page.locator("#qualities-explorer")).toBeVisible();
  await expect(page.locator("[data-map-banner]")).toBeHidden();
});
