import { test, expect } from '@playwright/test';

test.describe('Error paginas', () => {
  test('should show 404 page for unknown route', async ({ page }) => {
    await page.goto('/deze-pagina-bestaat-niet');
    await expect(page.locator('body')).toBeVisible();
  });
});
