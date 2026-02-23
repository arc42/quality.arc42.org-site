import { expect, test } from "@playwright/test";

const QUALITY_BLUE = "rgb(0, 184, 245)";
const REQUIREMENTS_RED = "rgb(255, 179, 179)";
const APPROACHES_GREEN = "rgb(146, 239, 128)";
const STANDARDS_YELLOW = "rgb(255, 201, 92)";

const CHARACTERISTICS = [
  { slug: "accessibility", title: "Accessibility" },
  { slug: "time-to-market", title: "Time to Market" },
];

const sectionExpectation = [
  {
    heading: "Directly Related Quality Requirements",
    expectedBg: REQUIREMENTS_RED,
  },
  { heading: "Related Qualities", expectedBg: QUALITY_BLUE },
  { heading: "Related Approaches", expectedBg: APPROACHES_GREEN },
  { heading: "Related Standards", expectedBg: STANDARDS_YELLOW },
];

for (const characteristic of CHARACTERISTICS) {
  test(`characteristic layout: ${characteristic.slug}`, async ({ page }) => {
    await page.goto(`/qualities/${characteristic.slug}`);

    await expect(
      page.getByRole("heading", { level: 1, name: characteristic.title })
    ).toBeVisible();

    const qualityHeader = page.locator(".panel.quality-header").first();
    await expect(qualityHeader).toBeVisible();
    await expect(qualityHeader).toHaveCSS("background-color", QUALITY_BLUE);

    for (const section of sectionExpectation) {
      const heading = page
        .getByRole("heading", { level: 2, name: section.heading })
        .first();
      await expect(heading).toBeVisible();
      await expect(heading).toHaveCSS("background-color", section.expectedBg);
    }
  });
}
