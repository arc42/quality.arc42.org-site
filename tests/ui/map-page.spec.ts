import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const SEED = {
  v: 1,
  qualities: [
    { id: "availability", priority: null, hidden: false },
    { id: "resilience", priority: null, hidden: false },
    { id: "fault-tolerance", priority: null, hidden: false },
  ],
  custom: [],
  hiddenItems: [],
  layers: ["approaches"],
  showSingles: false,
  updated: "2026-10-19T00:00:00.000Z",
};

test("empty selection shows the empty state and a link to qualities", async ({ page }) => {
  await page.addInitScript(() => localStorage.removeItem("q42.map.v1"));
  await page.goto("/map/");
  await expect(page.locator("#map-empty")).toBeVisible();
  await expect(page.locator("#map-empty a[href$='/qualities/']")).toBeVisible();
});

test("seeded selection renders summary, layer toggles and the table", async ({ page }) => {
  // Init scripts re-run on reload: seed only once so the reload checks persistence.
  await page.addInitScript((seed) => {
    if (localStorage.getItem("q42.map.v1") === null) {
      localStorage.setItem("q42.map.v1", JSON.stringify(seed));
    }
  }, SEED);
  await page.goto("/map/");
  await expect(page.locator("#map-summary")).toContainText("3 qualities");
  const table = page.locator("#map-table table");
  await expect(table.locator("thead th")).toContainText([
    "Availability",
    "Resilience",
    "Fault tolerance",
  ]);
  await expect(table.locator("tbody th[scope=row]").first()).toBeVisible();
  const req = page.locator('#map-layers [data-layer="requirements"]');
  await expect(req).toHaveAttribute("aria-pressed", "false");
  await req.click();
  await expect(req).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#map-summary")).toContainText("requirement");
  await page.reload();
  await expect(page.locator('#map-layers [data-layer="requirements"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("show singles toggle changes the row count", async ({ page }) => {
  await page.addInitScript(
    (seed) => localStorage.setItem("q42.map.v1", JSON.stringify(seed)),
    SEED,
  );
  await page.goto("/map/");
  const rows = page.locator("#map-table tbody tr");
  const before = await rows.count();
  await page.locator("#map-singles").click();
  await expect.poll(() => rows.count()).toBeGreaterThan(before);
});

test("canvas draws one node per quality and shared item; clicking an item opens the panel", async ({
  page,
}) => {
  await page.addInitScript(
    (seed) => localStorage.setItem("q42.map.v1", JSON.stringify(seed)),
    SEED,
  );
  await page.goto("/map/");
  const svg = page.locator("#map-canvas svg");
  await expect(svg).toHaveAttribute("aria-hidden", "true");
  await expect(svg.locator('.map-node[data-type="quality"]')).toHaveCount(3);
  const item = svg.locator('.map-node[data-type="approach"]').first();
  const id = await item.getAttribute("data-id");
  await item.click();
  const panel = page.locator("#map-panel");
  await expect(panel.getByRole("heading", { level: 2 })).toBeVisible();
  await expect(panel.getByRole("link", { name: /Open on Q42/ })).toHaveAttribute(
    "href",
    new RegExp(`/approaches/${id}$`),
  );
  await panel.getByRole("button", { name: /Hide from map/ }).click();
  await expect(svg.locator(`.map-node[data-id="${id}"]`)).toHaveCount(0);
  await expect(panel.getByRole("button", { name: "Show on map" })).toBeFocused();
  await expect(page.locator("#map-hidden-toggle")).toContainText("1");
  await page.locator("#map-hidden-toggle").click();
  await page
    .locator("#map-hidden-list")
    .getByRole("button", { name: /Restore/ })
    .first()
    .click();
  await expect(svg.locator(`.map-node[data-id="${id}"]`)).toHaveCount(1);
});

test("hidden list reports unknown ids and restores hidden qualities and items", async ({
  page,
}) => {
  const seed = {
    ...SEED,
    qualities: [
      ...SEED.qualities.map((q) => (q.id === "resilience" ? { ...q, hidden: true } : q)),
      { id: "no-such-quality", priority: null, hidden: false },
    ],
    hiddenItems: ["circuit-breaker"],
  };
  await page.addInitScript((s) => localStorage.setItem("q42.map.v1", JSON.stringify(s)), seed);
  await page.goto("/map/");
  await expect(page.locator("#map-notice")).toHaveText(
    "1 quality in your selection no longer exists on Q42 and was ignored",
  );
  const svg = page.locator("#map-canvas svg");
  await expect(svg.locator('.map-node[data-id="resilience"]')).toHaveCount(0);
  await expect(svg.locator('.map-node[data-id="circuit-breaker"]')).toHaveCount(0);
  const toggle = page.locator("#map-hidden-toggle");
  await expect(page.locator("#map-hidden-count")).toHaveText("2");
  await toggle.click();
  const list = page.locator("#map-hidden-list");
  await list.getByRole("button", { name: "Restore Resilience" }).click();
  await expect(page.locator("#map-hidden-count")).toHaveText("1");
  await expect(svg.locator('.map-node[data-id="resilience"]')).toHaveCount(1);
  await expect(list.getByRole("button", { name: "Restore all" })).toHaveCount(0);
  await list.getByRole("button", { name: /^Restore / }).click();
  await expect(toggle).toBeHidden();
  await expect(svg.locator('.map-node[data-id="circuit-breaker"]')).toHaveCount(1);
});

test("restore all brings back every hidden node at once", async ({ page }) => {
  const seed = {
    ...SEED,
    qualities: SEED.qualities.map((q) => (q.id === "resilience" ? { ...q, hidden: true } : q)),
    hiddenItems: ["circuit-breaker"],
  };
  await page.addInitScript((s) => localStorage.setItem("q42.map.v1", JSON.stringify(s)), seed);
  await page.goto("/map/");
  await page.locator("#map-hidden-toggle").click();
  await page.locator("#map-hidden-list").getByRole("button", { name: "Restore all" }).click();
  await expect(page.locator("#map-hidden-toggle")).toBeHidden();
  const svg = page.locator("#map-canvas svg");
  await expect(svg.locator('.map-node[data-type="quality"]')).toHaveCount(3);
  await expect(svg.locator('.map-node[data-id="circuit-breaker"]')).toHaveCount(1);
});

test("selected item panel passes an axe scan", async ({ page }) => {
  await page.addInitScript(
    (seed) => localStorage.setItem("q42.map.v1", JSON.stringify(seed)),
    SEED,
  );
  await page.goto("/map/");
  await page.locator('#map-canvas .map-node[data-type="approach"]').first().click();
  await expect(page.locator("#map-panel h2")).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});
