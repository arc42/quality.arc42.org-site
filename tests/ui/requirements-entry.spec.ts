import { expect, test } from "@playwright/test";

const REQUIREMENTS_RED = "rgb(255, 179, 179)";

test("requirements entry page layout and key reddish dimension buttons", async ({
  page,
}) => {
  await page.goto("/requirements/");

  const headerPanel = page.locator(".panel.requirements-header").first();
  await expect(headerPanel).toBeVisible();
  await expect(headerPanel).toHaveCSS("background-color", REQUIREMENTS_RED);

  await expect(
    page.getByRole("heading", { level: 1, name: "Quality Requirements" })
  ).toBeVisible();

  const sectionHeading = page.getByRole("heading", {
    level: 2,
    name: "Dimensions and Quality Requirements",
  });
  await expect(sectionHeading).toBeVisible();

  const dimensionsSection = sectionHeading.locator("xpath=following-sibling::div[1]");
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

  await expect(efficientButton).toHaveCSS("background-color", REQUIREMENTS_RED);
  await expect(reliableButton).toHaveCSS("background-color", REQUIREMENTS_RED);
});
