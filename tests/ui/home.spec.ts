import { expect, test } from "@playwright/test";

test("home page renders splash hero, graph preview, and theme links", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Software Quality, Made Navigable",
    })
  ).toBeVisible();

  await expect(page.getByRole("link", { name: /Quality Characteristics/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Example Requirements/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Quality Dimensions/i })).toBeVisible();

  await expect(page.locator(".q42-nav-graph")).toBeVisible();

  await expect(page.locator("#q-graph-home")).toBeVisible();

  await expect(
    page.getByText("Preview themes here, then click the graph to open the full overlay")
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Qualities/i })).toBeDisabled();
  await expect(page.getByRole("button", { name: /Requirements/i })).toBeDisabled();
  await expect(page.getByRole("button", { name: /Standards/i })).toBeDisabled();
  await expect(page.getByRole("button", { name: /Fullscreen/i })).toBeVisible();

  const themeBar = page.locator(".q42-dim-bar");
  await expect(themeBar).toBeVisible();
  await expect(themeBar.getByRole("button", { name: /#reliable/i })).toBeVisible();
  await expect(themeBar.getByRole("button", { name: /#maintainable/i })).toBeVisible();

  await themeBar.getByRole("button", { name: /#reliable/i }).click();
  await expect(themeBar.getByRole("button", { name: /#reliable/i })).toHaveAttribute(
    "aria-pressed",
    "true"
  );

  await page.locator("#q-graph-home").click();

  const overlay = page.locator("#q42-graph-overlay");
  await expect(overlay).toBeVisible();
  await expect(overlay).not.toHaveAttribute("hidden", "");
  await expect(
    overlay.getByRole("button", { name: /Close graph overlay/i })
  ).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth + 1;
  });

  expect(hasHorizontalOverflow).toBeFalsy();
});
