import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Tableau Colours/);
});

test('renders palette panel', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('radiogroup', { name: /palette type/i })).toBeVisible();
});
