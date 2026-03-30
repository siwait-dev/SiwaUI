import { expect, test } from '@playwright/test';
import { gotoAdminPage } from '../helpers/admin-helpers';

test.describe('Thema-instellingen', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAdminPage(page, '/app/admin/theme');
  });

  test('laadt de pagina en toont de huidige voorkeuren', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Thema-instellingen' })).toBeVisible();
    await expect(page.locator('html')).toHaveClass(/light/);
    await expect(page.locator('html')).toHaveAttribute('data-layout', 'sidebar');
    await expect(
      page.getByText('Navigatie staat in een vaste zijbalk aan de linkerkant.'),
    ).toBeVisible();
  });

  test('kan naar donker thema schakelen', async ({ page }) => {
    await page.getByRole('button', { name: 'Donker' }).click();

    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('kan naar topbar layout schakelen', async ({ page }) => {
    await page.getByRole('button', { name: 'Topbalk' }).click();

    await expect(page.locator('html')).toHaveAttribute('data-layout', 'topbar');
    await expect(
      page.getByText('Navigatie staat als horizontale balk bovenaan de pagina.'),
    ).toBeVisible();
  });
});
