import { expect, test } from "@playwright/test";

const CHARACTERISTICS = [
  { slug: "accessibility", title: "Accessibility" },
  { slug: "time-to-market", title: "Time to Market" },
];

const SECTION_HEADINGS = [
  { heading: "Directly Related Quality Requirements", variant: "requirements" },
  { heading: "Related Qualities", variant: "qualities" },
  { heading: "Related Approaches", variant: "approaches" },
  { heading: "Related Standards", variant: "standards" },
];

for (const characteristic of CHARACTERISTICS) {
  test(`characteristic layout: ${characteristic.slug}`, async ({ page }) => {
    await page.goto(`/qualities/${characteristic.slug}`);

    await expect(
      page.getByRole("heading", { level: 1, name: characteristic.title })
    ).toBeVisible();

    const qualityHeader = page
      .locator('.section-hero[data-section="qualities"]')
      .first();
    await expect(qualityHeader).toBeVisible();

    for (const section of SECTION_HEADINGS) {
      const heading = page
        .locator(`h2.section-heading.${section.variant}`)
        .filter({ hasText: section.heading })
        .first();
      await expect(heading).toBeVisible();
    }
  });
}
