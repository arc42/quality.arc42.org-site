import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("domain-language diagram exposes the requested destinations", async ({ page }) => {
  await page.goto("/how-to-use-this-site/");

  const figure = page.locator("figure.domain-language-figure");
  const svg = figure.locator("svg.domain-language-svg");
  await expect(svg).toBeVisible();

  const links = svg.locator("a.domain-language-link");
  await expect(links).toHaveCount(15);

  const hrefs = await links.evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("href")),
  );
  expect(new Set(hrefs)).toEqual(
    new Set([
      "/tag-efficient/",
      "/tag-flexible/",
      "/tag-maintainable/",
      "/tag-operable/",
      "/tag-reliable/",
      "/tag-safe/",
      "/tag-secure/",
      "/tag-suitable/",
      "/tag-usable/",
      "/approaches/",
      "/qualities/",
      "/requirements/",
      "/standards/",
      "/dimensions/",
      "/articles/what-is-quality",
    ]),
  );

  for (const link of await links.all()) {
    await expect(link).toHaveAttribute("aria-label", /.+/);
  }
  for (const href of hrefs) {
    const response = await page.request.get(href ?? "");
    expect(response.status(), `broken domain-language link: ${href}`).toBe(200);
  }
});

test("domain-language links navigate by keyboard", async ({ page }) => {
  await page.goto("/how-to-use-this-site/");

  const secureLink = page.locator('figure.domain-language-figure a[href="/tag-secure/"]');
  await secureLink.focus();
  await expect(secureLink).toBeFocused();
  await expect(secureLink.locator(".domain-language-link__focus")).toHaveCSS(
    "stroke",
    "rgb(104, 45, 99)",
  );
  await page.keyboard.press("Enter");
  await page.waitForURL("**/tag-secure/");
});

test("domain-language diagram remains readable on narrow screens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/how-to-use-this-site/");

  const viewport = page.locator(".domain-language-figure__viewport");
  const overflow = await viewport.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));

  expect(overflow.scrollWidth).toBeGreaterThan(overflow.clientWidth);
  expect(
    await viewport.evaluate((element) => element.getBoundingClientRect().right),
  ).toBeLessThanOrEqual(390);
});

test("domain-language diagram has no automated accessibility violations", async ({ page }) => {
  await page.goto("/how-to-use-this-site/");

  const results = await new AxeBuilder({ page }).include(".domain-language-figure").analyze();
  expect(results.violations).toEqual([]);
});

test("metamodel graphic is an inline SVG with working links", async ({ page }) => {
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
