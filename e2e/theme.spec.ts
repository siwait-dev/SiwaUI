import { test, expect } from '@playwright/test';

test.describe('Theme switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load with light theme by default', async ({ page }) => {
    const htmlClass = await page.evaluate(() => document.documentElement.className);
    expect(htmlClass).toContain('light');
  });

  test('page title should be set', async ({ page }) => {
    await expect(page).toHaveTitle(/SiwaUI/);
  });
});
