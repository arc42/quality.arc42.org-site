import { expect, test } from "@playwright/test";

const PAGE = "/aboutthissite/";
const HEADING = "h3#orphanqualities";

test("heading permalink carries no native tooltip", async ({ page }) => {
  await page.goto(PAGE);

  const link = page.locator(`${HEADING} a.header-link`);
  await expect(link).toHaveAttribute("aria-label", /Copy link to section: Orphan Qualities/);

  // A `title` would pop the browser's own unstyled tooltip over the section
  // text and repeat the accessible name word for word.
  expect(await link.getAttribute("title")).toBeNull();
});

test("heading permalink becomes visible on keyboard focus", async ({ page }) => {
  await page.goto(PAGE);

  const link = page.locator(`${HEADING} a.header-link`);
  // Hidden until the heading is hovered or the link itself is focused.
  await expect(link).toHaveCSS("opacity", "0");

  await link.focus();
  await expect(link).toHaveCSS("opacity", "1");
});

test("anchor jumps land the heading below the sticky header", async ({ page }) => {
  for (const width of [390, 768, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(PAGE);
    await page.evaluate(() => {
      window.location.hash = "#orphanqualities";
    });

    const headerHeight = await page
      .locator(".site-header")
      .evaluate((el) => el.getBoundingClientRect().height);

    await expect
      .poll(async () =>
        page.locator(HEADING).evaluate((el) => el.getBoundingClientRect().top),
      )
      .toBeGreaterThanOrEqual(headerHeight);
  }
});
