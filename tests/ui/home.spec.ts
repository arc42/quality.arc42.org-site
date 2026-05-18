import { expect, test } from "@playwright/test";

test("home page renders hero, directory entries, and graph section", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Quality drives Architecture",
    })
  ).toBeVisible();

  const directory = page.locator(".home-violet-directory");
  await expect(directory).toBeVisible();
  await expect(directory.locator("li")).toHaveCount(3);

  await expect(
    page.getByRole("link", { name: /Quality Characteristics/ })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Example Requirements/ })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Solution Approaches/ })
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { level: 2, name: "The quality graph" })
  ).toBeVisible();

  await expect(page.locator("#q-graph-container")).toBeVisible();

  await expect(page.getByRole("link", { name: "Open graph" })).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth + 1;
  });

  expect(hasHorizontalOverflow).toBeFalsy();
});
