
import { test, expect } from '@playwright/test';

test('Playwright documentation homepage loads', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  await expect(page).toHaveTitle(/Playwright/);
  await expect(
    page.getByRole('link', { name: 'Get started' })
  ).toBeVisible();
});

test('Get started link opens the installation guide', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  await page.getByRole('link', { name: 'Get started' }).click();

  // Verify navigation to the installation guide rather than
  // relying on a heading that may have changed.
  await expect(page).toHaveURL(/\/docs\/intro/);
  await expect(page.locator('main')).toBeVisible();
});
