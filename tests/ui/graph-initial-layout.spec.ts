import { expect, test } from "@playwright/test";

/**
 * The radial layout must place every node before the force simulation runs.
 *
 * Blocking requestAnimationFrame stops d3-timer, so d3-force never ticks and
 * what we measure is purely the initial layout. Without it, a broken layout is
 * invisible in a test: the simulation eventually pushes the pile apart, and
 * only real users on a slow or backgrounded tab see the stack of labels.
 *
 * Positions live on the data bound to the hit-circles; the SVG x/y attributes
 * are written by the tick handler, which cannot run here.
 */
test("initial graph layout spreads nodes before the simulation ticks", async ({ page }) => {
  await page.addInitScript(() => {
    // d3-timer captures requestAnimationFrame at module load, so stub it early.
    window.requestAnimationFrame = () => 0;
  });

  await page.goto("/full-quality-graph");
  await expect(page.locator("#full-q-graph-container svg .nodes circle").first()).toBeAttached();

  const layout = await page.evaluate(() => {
    const circles = [
      ...document.querySelectorAll("#full-q-graph-container svg .nodes circle"),
    ] as (SVGCircleElement & {
      __data__: { id: string; qualityType?: string; x: number; y: number };
    })[];
    const nodes = circles.map((c) => c.__data__);
    const distinct = new Set(nodes.map((n) => `${Math.round(n.x)},${Math.round(n.y)}`));
    const dimensions = nodes.filter((n) => n.qualityType === "dimension");
    return {
      total: nodes.length,
      distinctPositions: distinct.size,
      dimensionCount: dimensions.length,
      distinctDimensionPositions: new Set(
        dimensions.map((n) => `${Math.round(n.x)},${Math.round(n.y)}`),
      ).size,
      unplaced: nodes.filter((n) => !Number.isFinite(n.x) || !Number.isFinite(n.y)).length,
    };
  });

  expect(layout.total).toBeGreaterThan(50);
  expect(layout.unplaced).toBe(0);

  // The nine dimension nodes ring the root, so each sits on its own spot.
  expect(layout.dimensionCount).toBeGreaterThan(0);
  expect(layout.distinctDimensionPositions).toBe(layout.dimensionCount);

  // Guard the whole graph against collapsing onto one point.
  expect(layout.distinctPositions).toBeGreaterThan(layout.total / 2);
});
