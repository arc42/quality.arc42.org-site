import { expect, test } from "@playwright/test";

test("requirements entry page layout and key dimension buttons", async ({
  page,
}) => {
  await page.goto("/requirements/");

  const headerPanel = page
    .locator('.section-hero[data-section="requirements"]')
    .first();
  await expect(headerPanel).toBeVisible();

  await expect(
    page.getByRole("heading", { level: 1, name: "Example Requirements" })
  ).toBeVisible();

  const sectionHeading = page.getByRole("heading", {
    level: 2,
    name: "Dimensions and Quality Requirements",
  });
  await expect(sectionHeading).toBeVisible();

  const dimensionsSection = sectionHeading.locator(
    "xpath=following-sibling::div[1]"
  );
  const efficientButton = dimensionsSection.locator(
    'a.hov.tags.req:has-text("efficient")'
  );
  const reliableButton = dimensionsSection.locator(
    'a.hov.tags.req:has-text("reliable")'
  );

  await expect(efficientButton).toBeVisible();
  await expect(reliableButton).toBeVisible();

  await expect(efficientButton.locator("span")).toContainText(/^\d+$/);
  await expect(reliableButton.locator("span")).toContainText(/^\d+$/);
});
