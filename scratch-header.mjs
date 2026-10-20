import { chromium } from "playwright";
const base = process.env.UI_BASE_URL;
const out = process.argv[2] || "scratch-shots";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 800 } });
await page.goto(base + "/qualities/accessibility");
const add = page.locator("[data-map-add]").first();
if (await add.count()) await add.click();
for (const w of [1300, 1190, 1180, 1000, 800, 720, 600, 400]) {
  await page.setViewportSize({ width: w, height: 800 });
  await page.waitForTimeout(150);
  const open = await page.locator(".site-menu-toggle").getAttribute("aria-expanded");
  if (open !== "true") await page.locator(".site-menu-toggle").click();
  await page.waitForTimeout(150);
  const box = await page.locator(".site-header").boundingBox();
  await page.screenshot({ path: `${out}/h-${w}.png`, clip: { x: 0, y: 0, width: w, height: Math.min(box.height + 10, 800) } });
  const focused = await page.evaluate(() => document.activeElement?.textContent.trim());
  console.log(w, Math.round(box.height), "focus:", focused);
  await page.locator(".site-menu-toggle").click();
}
await browser.close();
