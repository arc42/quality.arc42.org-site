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

test("legend explains the encoding; the singles chip mirrors the toggle", async ({ page }) => {
  await page.addInitScript(
    (seed) => localStorage.setItem("q42.map.v1", JSON.stringify(seed)),
    SEED,
  );
  await page.goto("/map/");
  await expect(page.locator("#map-legend")).toBeVisible();
  await expect(page.locator("#map-legend")).toContainText("my priority");
  const chip = page.locator("#map-singles-chip");
  await expect(chip).toHaveText(/\d+ (approaches|items) with one link/);
  await chip.click();
  await expect(page.locator("#map-singles")).toHaveAttribute("aria-pressed", "true");
  await expect(chip).toHaveText("Single-link items shown · Hide");
  await expect(chip).toHaveAttribute("aria-pressed", "true");
});

test("the legend lets pointer events through to the canvas", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
  await page.setViewportSize({ width: 1280, height: 900 });
  await seedAndOpen(page);
  const legend = page.locator("#map-legend");
  const box = (await legend.boundingBox())!;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  const hitsLegend = await page.evaluate(
    ([px, py]) => !!document.elementFromPoint(px, py)?.closest("#map-legend"),
    [x, y],
  );
  expect(hitsLegend).toBe(false);
  await page.mouse.click(x, y);
  await expect(legend).toBeVisible();
  expect(errors).toEqual([]);
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

// Screen position of a node's origin (its translate), from the live SVG matrix.
async function nodeOrigin(locator) {
  return locator.evaluate((el) => {
    const m = el.getScreenCTM();
    return { x: m.e, y: m.f };
  });
}

async function seedAndOpen(page) {
  await page.addInitScript(
    (seed) => localStorage.setItem("q42.map.v1", JSON.stringify(seed)),
    SEED,
  );
  await page.goto("/map/");
  return page.locator("#map-canvas svg");
}

test("selecting highlights node and edges; clicking empty canvas clears the panel", async ({
  page,
}) => {
  const svg = await seedAndOpen(page);
  const item = svg.locator('.map-node[data-type="approach"]').first();
  await item.click();
  await expect(item).toHaveClass(/is-selected/);
  const badge = await item.locator(".map-node__badge-text").textContent();
  await expect(svg.locator(".map-edge.is-highlighted")).toHaveCount(Number(badge));
  await svg.click({ position: { x: 4, y: 4 } });
  await expect(page.locator("#map-panel")).toHaveText("Select a node on the map to see details.");
  await expect(svg.locator(".map-node.is-selected")).toHaveCount(0);
  await expect(svg.locator(".map-edge.is-highlighted")).toHaveCount(0);
});

test("a slow drag keeps the node under the pointer and pins it across re-renders", async ({
  page,
}) => {
  test.setTimeout(30_000);
  const svg = await seedAndOpen(page);
  const node = svg.locator('.map-node[data-id="timeout"]');
  const start = await nodeOrigin(node);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  // Spread the drag over more than the 300-tick cap (~5 s at 60 fps).
  let target = { x: start.x + 60, y: start.y + 40 };
  await page.mouse.move(target.x, target.y, { steps: 10 });
  await page.waitForTimeout(3500);
  target = { x: start.x - 50, y: start.y + 70 };
  await page.mouse.move(target.x, target.y, { steps: 10 });
  await page.waitForTimeout(3500);
  target = { x: start.x + 30, y: start.y - 60 };
  await page.mouse.move(target.x, target.y, { steps: 10 });
  const during = await nodeOrigin(node);
  expect(Math.abs(during.x - target.x)).toBeLessThan(3);
  expect(Math.abs(during.y - target.y)).toBeLessThan(3);
  await page.mouse.up();

  // Pinned: hiding and restoring an unrelated item re-renders without moving it.
  const pinned = await node.getAttribute("transform");
  await svg.locator('.map-node[data-id="bulkheads"]').click();
  await page.locator("#map-panel").getByRole("button", { name: "Hide from map" }).click();
  await expect(svg.locator('.map-node[data-id="bulkheads"]')).toHaveCount(0);
  await page.locator("#map-panel").getByRole("button", { name: "Show on map" }).click();
  await expect(svg.locator('.map-node[data-id="bulkheads"]')).toHaveCount(1);
  await expect(node).toHaveAttribute("transform", pinned);
});

// ── Share link, export and import ───────────────────────────

const SHARED = {
  ...SEED,
  qualities: [
    { id: "availability", priority: "high", hidden: false },
    { id: "resilience", priority: null, hidden: false },
  ],
};

async function mintToken(page, state) {
  await page.goto("/map/");
  await page.waitForFunction(() => "q42Map" in window);
  return page.evaluate((s) => (window as any).q42Map.encodeShare(s), state);
}

test("opening a share link offers replace; replace loads it and clears the hash", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.removeItem("q42.map.v1"));
  const token = await mintToken(page, SHARED);
  await page.goto("about:blank");
  await page.goto(`/map/#s=${token}`);
  const notice = page.locator("#map-notice");
  await expect(notice).toContainText("A shared map was opened.");
  await expect(notice.getByRole("button", { name: "Merge" })).toBeVisible();
  await expect(notice.getByRole("button", { name: "Ignore" })).toBeVisible();
  await notice.getByRole("button", { name: "Replace my selection" }).click();
  await expect(page.locator("#map-summary")).toContainText("2 qualities");
  await expect(notice.getByRole("button")).toHaveCount(0);
  expect(await page.evaluate(() => location.hash)).toBe("");
});

test("merging a share link keeps the current selection and adds the new one", async ({ page }) => {
  await page.addInitScript(
    (seed) => localStorage.setItem("q42.map.v1", JSON.stringify(seed)),
    SEED,
  );
  const token = await mintToken(page, {
    ...SEED,
    qualities: [{ id: "security", priority: null, hidden: false }],
  });
  await page.goto("about:blank");
  await page.goto(`/map/#s=${token}`);
  await page.locator("#map-notice").getByRole("button", { name: "Merge" }).click();
  await expect(page.locator("#map-summary")).toContainText("4 qualities");
  expect(await page.evaluate(() => location.hash)).toBe("");
});

test("a damaged share link shows a notice and clears the hash", async ({ page }) => {
  await page.goto("/map/#s=v1.not-a-valid-token");
  await expect(page.locator("#map-notice")).toHaveText("This share link is invalid or damaged.");
  expect(await page.evaluate(() => location.hash)).toBe("");
});

test("export dialog shows a share URL and copies it", async ({ page }) => {
  // The test server is plain http (no secure context, no Clipboard API): record writes.
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: async (text) => ((window as any).__copied = text) },
    });
  });
  await seedAndOpen(page);
  const open = page.locator("#map-export-open");
  await open.click();
  const dialog = page.locator("#map-export-dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleName("Export & share");
  await expect(dialog.getByRole("heading", { level: 2, name: "Export & share" })).toBeVisible();
  const input = dialog.getByRole("textbox", { name: "Share URL" });
  await expect(input).toHaveAttribute("readonly", "");
  await dialog.getByRole("button", { name: "Copy", exact: true }).click();
  await expect(input).toHaveValue(/\/map\/#s=v1\./);
  await expect(dialog.locator(".map-export__status")).toHaveText("Copied");
  expect(await page.evaluate(() => (window as any).__copied)).toBe(await input.inputValue());
  await expect(dialog.getByRole("button", { name: /Markdown/ })).toBeDisabled();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(open).toBeFocused();
});

test("export dialog downloads q42-map.json and imports a file", async ({ page }) => {
  await seedAndOpen(page);
  await page.locator("#map-export-open").click();
  const dialog = page.locator("#map-export-dialog");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    dialog.getByRole("button", { name: "Download q42-map.json" }).click(),
  ]);
  expect(download.suggestedFilename()).toBe("q42-map.json");

  const file = dialog.locator('input[type="file"]');
  await file.setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from("{}"),
  });
  await expect(dialog.locator(".map-export__error")).toHaveText(/Not a Q42 map file/);

  await file.setInputFiles({
    name: "map.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({ ...SEED, qualities: [SEED.qualities[0]] })),
  });
  await expect(dialog).toBeHidden();
  await expect(page.locator("#map-summary")).toContainText("1 quality");
});

test("open export dialog passes an axe scan", async ({ page }) => {
  await seedAndOpen(page);
  await page.locator("#map-export-open").click();
  await expect(page.locator("#map-export-dialog")).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});

test("copy falls back to selecting the URL; a backdrop click closes the dialog", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("denied")) },
    });
  });
  await seedAndOpen(page);
  const open = page.locator("#map-export-open");
  await open.click();
  const dialog = page.locator("#map-export-dialog");
  await dialog.getByRole("button", { name: "Copy", exact: true }).click();
  await expect(dialog.locator(".map-export__status")).toContainText("Ctrl+C");
  const selected = await page.evaluate(() => {
    const input = document.getElementById("map-export-url") as HTMLInputElement;
    return input.selectionEnd! - input.selectionStart! === input.value.length;
  });
  expect(selected).toBe(true);
  await page.mouse.click(4, 4);
  await expect(dialog).toBeHidden();
  await expect(open).toBeFocused();
});
