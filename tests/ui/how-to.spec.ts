import { expect, test } from "@playwright/test";

test("metamodel graphic is an inline SVG with working links", async ({
  page,
}) => {
  await page.goto("/how-to-use-this-site/");

  const svg = page.locator("figure.how2use-figure svg");
  await expect(svg).toBeVisible();

  const links = svg.locator("a");
  expect(await links.count()).toBeGreaterThanOrEqual(4);

  // Every link must have an accessible name and resolve without a 404.
  const hrefs: string[] = [];
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute("aria-label", /.+/);
    hrefs.push((await link.getAttribute("href")) ?? "");
  }
  for (const href of hrefs) {
    const response = await page.request.get(href);
    expect(response.status(), `broken svg link: ${href}`).toBe(200);
  }
});

test("clicking a metamodel shape navigates", async ({ page }) => {
  await page.goto("/how-to-use-this-site/");
  const firstLink = page.locator("figure.how2use-figure svg a").first();
  const href = await firstLink.getAttribute("href");
  await firstLink.click();
  await page.waitForURL((url) => url.pathname.startsWith(href ?? "/"));
});
