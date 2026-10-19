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
