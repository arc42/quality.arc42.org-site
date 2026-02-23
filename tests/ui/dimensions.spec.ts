import { expect, test } from "@playwright/test";

const QUALITY_BLUE = "rgb(0, 184, 245)";
const REQUIREMENT_RED = "rgb(255, 179, 179)";

test("dimensions page renders image and required sections", async ({ page }) => {
  await page.goto("/dimensions/");

  const modelImage = page.locator(
    'img[alt="Dimensions and quality characteristics"]'
  );
  await expect(modelImage).toBeVisible();
  await expect(modelImage).toHaveAttribute(
    "src",
    /q42-dimensions-qualities-requirements\.webp$/
  );

  await expect(
    page.getByRole("heading", {
      level: 3,
      name: "Dimensions and Quality Characteristics",
    })
  ).toBeVisible();

  await expect(
    page.getByRole("heading", {
      level: 3,
      name: "Dimensions and Quality Requirements",
    })
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { level: 3, name: "Dimensions and Approaches" })
  ).toBeVisible();
});

test("dimensions and quality characteristics has blue efficient/flexible buttons with counters", async ({
  page,
}) => {
  await page.goto("/dimensions/");

  const heading = page.getByRole("heading", {
    level: 3,
    name: "Dimensions and Quality Characteristics",
  });
  await expect(heading).toBeVisible();

  const section = heading.locator("xpath=following-sibling::div[1]");
  const efficientButton = section.locator('a.hov.tags:has-text("efficient")');
  const flexibleButton = section.locator('a.hov.tags:has-text("flexible")');

  await expect(efficientButton).toBeVisible();
  await expect(flexibleButton).toBeVisible();

  await expect(efficientButton.locator("span")).toContainText(/^\d+$/);
  await expect(flexibleButton.locator("span")).toContainText(/^\d+$/);

  await expect(efficientButton).toHaveCSS("background-color", QUALITY_BLUE);
  await expect(flexibleButton).toHaveCSS("background-color", QUALITY_BLUE);
});

test("dimensions and quality requirements has reddish efficient/flexible buttons with counters", async ({
  page,
}) => {
  await page.goto("/dimensions/");

  const heading = page.getByRole("heading", {
    level: 3,
    name: "Dimensions and Quality Requirements",
  });
  await expect(heading).toBeVisible();

  const section = heading.locator("xpath=following-sibling::div[1]");
  const efficientButton = section.locator(
    'a.hov.tags.req:has-text("efficient")'
  );
  const flexibleButton = section.locator(
    'a.hov.tags.req:has-text("flexible")'
  );

  await expect(efficientButton).toBeVisible();
  await expect(flexibleButton).toBeVisible();

  await expect(efficientButton.locator("span")).toContainText(/^\d+$/);
  await expect(flexibleButton.locator("span")).toContainText(/^\d+$/);

  await expect(efficientButton).toHaveCSS("background-color", REQUIREMENT_RED);
  await expect(flexibleButton).toHaveCSS("background-color", REQUIREMENT_RED);
});
