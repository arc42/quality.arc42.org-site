import { expect, test } from "@playwright/test";

// The listing renders each entry as h2 (heading_level="h2" in
// article-header.html) so the document outline stays sound. The compact
// styles used to match h1 only, which left every entry as a display-size
// heading with 1.5em margins inside a bordered panel -- a column of tall,
// near-empty boxes.
test("article listing entries stay compact", async ({ page }) => {
  await page.goto("/articles/");

  const entries = page.locator("#search-results .article-wrapper");
  const count = await entries.count();
  expect(count).toBeGreaterThan(5);

  for (let i = 0; i < count; i += 1) {
    const entry = entries.nth(i);
    const title = entry.locator(".panel.article-header :is(h1, h2)");
    await expect(title).toBeVisible();

    const [entryHeight, fontSize] = await Promise.all([
      entry.evaluate((el) => el.getBoundingClientRect().height),
      title.evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
    ]);

    // A single-line title in a compact row, not a display heading in a box.
    expect(entryHeight).toBeLessThan(90);
    expect(fontSize).toBeLessThan(24);
  }
});

test("article listing titles link to their article", async ({ page }) => {
  await page.goto("/articles/");

  const links = page.locator("#search-results .panel.article-header a.post-link");
  const hrefs = await links.evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("href")),
  );

  expect(hrefs.length).toBeGreaterThan(5);
  expect(hrefs.every((href) => href?.startsWith("/articles/"))).toBe(true);
});
