import { expect, test } from '@playwright/test';
import { gotoAdminPage } from '../helpers/admin-helpers';

test.describe('Wachtwoordbeleid', () => {
  test.beforeEach(async ({ page }) => {
    let policy = {
      minLength: 8,
      requireDigit: true,
      requireUppercase: true,
      requireNonAlphanumeric: false,
      maxAgeDays: 90,
      historyCount: 5,
      checkBreachedPasswords: true,
      refreshTokenExpirationDays: 7,
    };

    await page.route('http://localhost:5115/password-policy', async route => {
      if (route.request().method() === 'GET') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(policy),
        });
      }

      if (route.request().method() === 'PUT') {
        policy = route.request().postDataJSON() as typeof policy;
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(policy),
        });
      }

      return route.continue();
    });

    await gotoAdminPage(page, '/app/admin/password-policy');
  });

  test('laadt het bestaande wachtwoordbeleid', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Wachtwoordbeleid' })).toBeVisible();
    await expect(page.locator('input').first()).toHaveValue('8');
  });

  test('kan het wachtwoordbeleid opslaan', async ({ page }) => {
    await page.locator('input').first().fill('12');
    await page.getByRole('button', { name: 'Beleid opslaan' }).click();

    await expect(page.getByText('Wachtwoordbeleid opgeslagen.')).toBeVisible();
  });
});
