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
  await expect(dialog.locator("[data-share-status]")).toHaveText("Copied");
  expect(await page.evaluate(() => (window as any).__copied)).toBe(await input.inputValue());
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
  await expect(dialog.locator("[data-share-status]")).toContainText("Ctrl+C");
  const selected = await page.evaluate(() => {
    const input = document.getElementById("map-export-url") as HTMLInputElement;
    return input.selectionEnd! - input.selectionStart! === input.value.length;
  });
  expect(selected).toBe(true);
  await dialog.getByRole("button", { name: "Copy Markdown" }).click();
  await expect(dialog.locator("[data-md-status]")).toContainText("Ctrl+C");
  expect(await page.evaluate(() => document.getSelection()!.toString())).toContain(
    "## 1.2 Quality goals",
  );
  await page.mouse.click(4, 4);
  await expect(dialog).toBeHidden();
  await expect(open).toBeFocused();
});

test("rating a quality sets its size and header, survives reload, and clears on a second press", async ({
  page,
}) => {
  await page.addInitScript((seed) => {
    if (!localStorage.getItem("q42.map.v1")) {
      localStorage.setItem("q42.map.v1", JSON.stringify(seed));
    }
  }, SEED);
  await page.goto("/map/");
  const circle = page.locator('#map-canvas svg .map-node[data-id="availability"] circle');
  const header = page.locator("#map-table thead th", { hasText: "Availability" });
  await circle.click();

  const panel = page.locator("#map-panel");
  const group = panel.getByRole("group", { name: "My priority" });
  await expect(group).toBeVisible();
  await expect(panel).toContainText("Not rated yet. Your choice sets size and colour on the map.");
  const high = group.getByRole("button", { name: "High" });
  await high.click();

  await expect(high).toHaveAttribute("aria-pressed", "true");
  await expect(high).toBeFocused();
  await expect(circle).toHaveAttribute("r", "58");
  await expect(header).toContainText("high");

  await page.reload();
  await page.locator('#map-canvas svg .map-node[data-id="availability"] circle').click();
  await expect(panel.getByRole("button", { name: "High" })).toHaveAttribute("aria-pressed", "true");
  await expect(header).toContainText("high");

  await panel.getByRole("button", { name: "High" }).click();
  await expect(panel.getByRole("button", { name: "High" })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  await expect(circle).toHaveAttribute("r", "34");
  await expect(header).toContainText("not rated");
});

test("markdown preview follows the section checkboxes; copy and download work", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: async (text) => ((window as any).__copied = text) },
    });
  });
  await seedAndOpen(page);
  await page.locator("#map-export-open").click();
  const dialog = page.locator("#map-export-dialog");
  const preview = dialog.getByRole("region", { name: /Preview/ }).locator("pre");
  await expect(preview).toContainText("## 1.2 Quality goals");
  await expect(preview).toContainText("## 10 Quality tree");
  await expect(preview).toContainText("## Approaches serving two or more quality goals");
  const links = dialog.getByRole("checkbox", { name: "Links back to quality.arc42.org" });
  await expect(links).not.toBeChecked();

  await dialog.getByRole("checkbox", { name: /Quality tree/ }).uncheck();
  await expect(preview).not.toContainText("## 10 Quality tree");
  await expect(preview).toContainText("## 1.2 Quality goals");
  await links.check();
  await expect(preview).toContainText(
    "[Availability](https://quality.arc42.org/qualities/availability)",
  );

  await dialog.getByRole("button", { name: "Copy Markdown" }).click();
  await expect(dialog.locator("[data-md-status]")).toHaveText("Copied");
  expect(await page.evaluate(() => (window as any).__copied)).toBe(await preview.textContent());

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    dialog.getByRole("button", { name: "Download .md" }).click(),
  ]);
  expect(download.suggestedFilename()).toBe("quality-map.md");
});

test("a share link that cannot be encoded shows a warning instead of an empty field", async ({
  page,
}) => {
  await page.addInitScript(() => {
    delete (window as any).CompressionStream;
  });
  await seedAndOpen(page);
  await page.locator("#map-export-open").click();
  const dialog = page.locator("#map-export-dialog");
  await expect(dialog.locator("[data-share-failed]")).toHaveText(
    "The share link could not be created in this browser. Use the JSON export instead.",
  );
  await expect(dialog.locator("[data-share-row]")).toBeHidden();
  // The rest of the dialog keeps working.
  await expect(dialog.getByRole("region", { name: /Preview/ })).toContainText(
    "## 1.2 Quality goals",
  );
});

test.describe("add to map search", () => {
  async function seedThree(page) {
    await page.addInitScript((seed) => {
      if (localStorage.getItem("q42.map.v1") === null) {
        localStorage.setItem("q42.map.v1", JSON.stringify(seed));
      }
    }, SEED);
    await page.goto("/map/");
    await expect(page.locator("#map-summary")).toContainText("3 qualities");
  }

  test("typing finds a quality and its Add button puts it on the map", async ({ page }) => {
    await seedThree(page);
    const input = page.locator("#map-add-input");
    await input.fill("recover");
    await expect(input).toHaveAttribute("aria-expanded", "true");
    const add = page.locator('#map-add-results [data-map-add="recoverability"]');
    await expect(add).toBeVisible();
    await add.click();
    await expect(page.locator("#map-summary")).toContainText("4 qualities");
    await expect(page.locator('svg .map-node[data-id="recoverability"]')).toHaveCount(1);
    // The list stays open and the row now reads as added.
    await expect(add).toHaveAttribute("aria-pressed", "true");
    await expect(add).toContainText("Added");
  });

  test("arrow keys and Enter add the first result; Escape closes", async ({ page }) => {
    await seedThree(page);
    const input = page.locator("#map-add-input");
    await input.fill("recover");
    await expect(page.locator("#map-add-results [role=option]").first()).toBeVisible();
    await input.press("ArrowDown");
    const first = page.locator("#map-add-results [role=option]").first();
    await expect(input).toHaveAttribute("aria-activedescendant", (await first.getAttribute("id"))!);
    await input.press("Enter");
    await expect(page.locator("#map-summary")).toContainText("4 qualities");
    await input.press("Escape");
    await expect(page.locator("#map-add-results")).toBeHidden();
    await expect(input).toHaveAttribute("aria-expanded", "false");
  });

  test("an alias hit names the alias and a miss says so", async ({ page }) => {
    await seedThree(page);
    const input = page.locator("#map-add-input");
    await input.fill("exactn");
    await expect(page.locator("#map-add-results")).toContainText("via exactness");
    await input.fill("zzzzqq");
    await expect(page.locator("#map-add-status")).toHaveText("No results");
  });

  test("works with an empty selection", async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem("q42.map.v1"));
    await page.goto("/map/");
    await page.locator("#map-add-input").fill("recover");
    await page.locator('#map-add-results [data-map-add="recoverability"]').click();
    await expect(page.locator("#map-summary")).toContainText("1 quality");
  });
});

test.describe("own requirements", () => {
  test("add, propose, edit and remove an own requirement", async ({ page }) => {
    const svg = await seedAndOpen(page);
    const open = page.locator("#map-custom-open");
    await open.click();
    const dialog = page.locator("#map-custom-dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { level: 2 })).toHaveText("Add your own requirement");
    await expect(
      dialog.getByRole("link", { name: "How to specify quality requirements" }),
    ).toHaveAttribute("href", /\/requirements\/$/);

    // An empty title is reported inline; the dialog stays open.
    const title = dialog.getByLabel("Title");
    await dialog.getByRole("button", { name: "Add to map" }).click();
    await expect(title).toHaveAttribute("aria-invalid", "true");
    await expect(title).toBeFocused();
    await expect(dialog.locator("#map-custom-title-error")).toBeVisible();
    await expect(dialog).toBeVisible();

    await title.fill("Checkout keeps working");
    await dialog.getByLabel(/Scenario/).fill("- Checkout stays up during a zone outage");
    const chip = (name: string) => dialog.getByRole("button", { name, exact: true });
    await expect(chip("Availability")).toHaveAttribute("aria-pressed", "false");
    await chip("Availability").click();
    await chip("Resilience").click();
    await expect(chip("Resilience")).toHaveAttribute("aria-pressed", "true");
    await dialog
      .getByRole("group", { name: "My priority" })
      .getByRole("button", { name: "High" })
      .click();
    await dialog.getByRole("button", { name: "Add to map" }).click();
    await expect(dialog).toBeHidden();

    const node = svg.locator('.map-node[data-type="custom"]');
    await expect(node).toHaveCount(1);
    await expect(node.locator(".map-node__shape")).toHaveAttribute("stroke-dasharray", /\d/);
    await expect(svg.locator(".map-edge")).not.toHaveCount(0);

    const panel = page.locator("#map-panel");
    await expect(panel.getByRole("heading", { level: 2 })).toHaveText("Checkout keeps working");
    await expect(panel.locator('[data-priority="high"]')).toHaveAttribute("aria-pressed", "true");
    const propose = panel.getByRole("link", { name: /Propose as contribution/ });
    await expect(propose).toHaveAttribute("target", "_blank");
    await expect(propose).toHaveAttribute("rel", "noopener");
    const href = (await propose.getAttribute("href"))!;
    expect(href.startsWith("https://github.com/arc42/quality.arc42.org-site/issues/new?")).toBe(
      true,
    );
    const params = new URL(href).searchParams;
    expect(params.get("title")).toBe("Checkout keeps working");
    expect(params.get("body")).toContain("related: [availability, resilience]");
    await expect(panel).toContainText(
      "Shares title, scenario and linked qualities. Not shared: your priorities, selection and map.",
    );

    // Edit pre-fills the form and renames the node and the table row.
    const edit = panel.getByRole("button", { name: "Edit" });
    await edit.click();
    await expect(dialog.getByRole("heading", { level: 2 })).toHaveText("Edit your requirement");
    await expect(title).toHaveValue("Checkout keeps working");
    await expect(chip("Availability")).toHaveAttribute("aria-pressed", "true");
    await title.fill("Checkout survives outages");
    await dialog.getByRole("button", { name: "Save" }).click();
    await expect(dialog).toBeHidden();
    await expect(node).toContainText("Checkout survives outages");
    await expect(page.locator("#map-table")).toContainText("Checkout survives outages");
    await expect(panel.getByRole("heading", { level: 2 })).toHaveText("Checkout survives outages");
    await expect(panel.getByRole("button", { name: "Edit" })).toBeFocused();

    await panel.getByRole("button", { name: "Remove" }).click();
    await expect(node).toHaveCount(0);
    await expect(page.locator("#map-notice")).toHaveText("Checkout survives outages removed");
    await expect(panel).toHaveText("Select a node on the map to see details.");
    await page.reload();
    await expect(svg.locator(".map-node").first()).toBeVisible();
    await expect(node).toHaveCount(0);
  });

  test("cancel and Escape close the form without adding; focus returns", async ({ page }) => {
    const svg = await seedAndOpen(page);
    const open = page.locator("#map-custom-open");
    const dialog = page.locator("#map-custom-dialog");
    await open.click();
    await dialog.getByLabel("Title").fill("Not this one");
    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).toBeHidden();
    await expect(open).toBeFocused();
    await open.click();
    await expect(dialog.getByLabel("Title")).toHaveValue("");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(open).toBeFocused();
    await expect(svg.locator('.map-node[data-type="custom"]')).toHaveCount(0);
  });

  test("the own-requirement button is hidden in the empty state", async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem("q42.map.v1"));
    await page.goto("/map/");
    await expect(page.locator("#map-empty")).toBeVisible();
    await expect(page.locator("#map-custom-open")).toBeHidden();
  });

  test("open form and own-requirement panel pass an axe scan", async ({ page }) => {
    await seedAndOpen(page);
    await page.locator("#map-custom-open").click();
    const dialog = page.locator("#map-custom-dialog");
    await dialog.getByRole("button", { name: "Add to map" }).click();
    await expect(dialog.getByLabel("Title")).toHaveAttribute("aria-invalid", "true");
    const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
    let results = await new AxeBuilder({ page }).withTags(tags).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
    await dialog.getByLabel("Title").fill("Checkout keeps working");
    await dialog.getByRole("button", { name: "Add to map" }).click();
    await expect(page.locator("#map-panel").getByRole("link", { name: /Propose/ })).toBeVisible();
    results = await new AxeBuilder({ page }).withTags(tags).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});
