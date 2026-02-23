import { expect, test } from '@playwright/test';

test('playwright setup smoke test', async ({ page }) => {
  await page.setContent('<main><h1>Playwright setup is active</h1></main>');

  await expect(
    page.getByRole('heading', { name: 'Playwright setup is active' })
  ).toBeVisible();
});
