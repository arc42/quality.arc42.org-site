import { expect, test } from "@playwright/test";

/**
 * Selecting a standard dims everything unrelated, but the dimensions behind the
 * standard's qualities are meant to stay lit: the graph reads standard ->
 * qualities -> dimensions. While a standard is selected the renderer hides
 * dimension nodes that are dimmed, so an empty connected set makes all nine of
 * them disappear instead of just the unrelated ones.
 *
 * ISO 5055 reaches three of the nine dimensions, which pins both halves of the
 * behaviour: the related ones stay lit, the other six still dim.
 *
 * Node state lives on the data bound to the hit-circles, since the nodes
 * themselves are painted on canvas.
 */
test("selecting a standard keeps the dimensions of its qualities lit", async ({ page }) => {
  await page.goto("/full-quality-graph?showStandards=true&selectedStandard=iso5055");

  const dimensions = async () =>
    await page.evaluate(() => {
      const circles = [
        ...document.querySelectorAll("#full-q-graph-container svg .nodes circle"),
      ] as (SVGCircleElement & {
        __data__: { id: string; qualityType?: string; _dimmed?: boolean };
      })[];
      const nodes = circles
        .map((c) => c.__data__)
        .filter((d) => d.qualityType === "dimension" || d.qualityType === "property");
      return {
        total: nodes.length,
        lit: nodes
          .filter((d) => !d._dimmed)
          .map((d) => d.id)
          .sort(),
      };
    });

  // The selection is applied once the render settles, so poll rather than race it.
  await expect
    .poll(async () => (await dimensions()).lit.join(","), { timeout: 15000 })
    .toBe("maintainable,reliable,secure");

  expect((await dimensions()).total).toBe(9);
});
