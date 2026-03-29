import { expect, test } from '@playwright/test';
import { gotoAdminPage } from '../helpers/admin-helpers';

test.describe('Applicatie-instellingen', () => {
  test.beforeEach(async ({ page }) => {
    let settings = {
      appName: 'SiwaUI',
      idleTimeoutEnabled: true,
      idleTimeoutMinutes: 30,
    };

    await page.route('http://localhost:5115/settings', async route => {
      if (route.request().method() === 'GET') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(settings),
        });
      }

      if (route.request().method() === 'PUT') {
        settings = route.request().postDataJSON() as typeof settings;
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(settings),
        });
      }

      return route.continue();
    });

    await gotoAdminPage(page, '/app/admin/settings');
  });

  test('laadt de bestaande instellingen', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Applicatie-instellingen' })).toBeVisible();
    await expect(page.locator('input').first()).toHaveValue('SiwaUI');
  });

  test('kan instellingen opslaan', async ({ page }) => {
    await page.locator('input').first().fill('Siwa Platform');
    await page.getByRole('button', { name: 'Instellingen opslaan' }).click();

    await expect(page.getByText('Instellingen succesvol opgeslagen.')).toBeVisible();
  });
});
