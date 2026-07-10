import { expect, test } from "@playwright/test";

test("dimensions page renders image and required sections", async ({ page }) => {
  await page.goto("/dimensions/");

  const modelImage = page.locator('img[alt="Dimensions and quality characteristics"]');
  await expect(modelImage).toBeVisible();
  await expect(modelImage).toHaveAttribute(
    "src",
    /q42-dimensions-qualities-requirements(-v\d+)?\.webp$/,
  );

  await expect(
    page.getByRole("heading", {
      level: 3,
      name: "Dimensions and Quality Characteristics",
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", {
      level: 3,
      name: "Dimensions and Quality Requirements",
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { level: 3, name: "Dimensions and Approaches" }),
  ).toBeVisible();
});

test("dimensions and quality characteristics has efficient/flexible buttons with counters and section wash", async ({
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

  // Chips use the per-section paper wash (see _tag-chips.scss), so the
  // quality (blue-washed) chip background must differ from the requirement
  // (red-washed) chips further down the page — that's the section colour
  // legend doing its job.
  const qualityBackground = await efficientButton.evaluate(
    (el) => getComputedStyle(el).backgroundColor,
  );
  expect(qualityBackground).not.toBe("rgba(0, 0, 0, 0)");
  const requirementChip = page.locator('a.hov.tags.req:has-text("efficient")').first();
  const requirementBackground = await requirementChip.evaluate(
    (el) => getComputedStyle(el).backgroundColor,
  );
  expect(requirementBackground).not.toBe(qualityBackground);
});

test("dimensions and quality requirements has efficient/flexible buttons with counters", async ({
  page,
}) => {
  await page.goto("/dimensions/");

  const heading = page.getByRole("heading", {
    level: 3,
    name: "Dimensions and Quality Requirements",
  });
  await expect(heading).toBeVisible();

  const section = heading.locator("xpath=following-sibling::div[1]");
  const efficientButton = section.locator('a.hov.tags.req:has-text("efficient")');
  const flexibleButton = section.locator('a.hov.tags.req:has-text("flexible")');

  await expect(efficientButton).toBeVisible();
  await expect(flexibleButton).toBeVisible();

  await expect(efficientButton.locator("span")).toContainText(/^\d+$/);
  await expect(flexibleButton.locator("span")).toContainText(/^\d+$/);
});
