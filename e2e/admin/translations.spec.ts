import { expect, test } from '@playwright/test';
import { gotoAdminPage } from '../helpers/admin-helpers';

test.describe('Vertalingenbeheer', () => {
  test.beforeEach(async ({ page }) => {
    const nlTranslations: Record<string, string> = {
      'USER.LOGIN.TITLE': 'Aanmelden',
      'COMMON.SAVE': 'Opslaan',
    };
    const enTranslations: Record<string, string> = {
      'USER.LOGIN.TITLE': 'Login',
      'COMMON.SAVE': 'Save',
    };

    await page.route('http://localhost:5115/translations**', async route => {
      const url = new URL(route.request().url());
      const path = url.pathname;
      const method = route.request().method();

      if (method === 'GET' && path.endsWith('/translations/nl/flat')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ translations: nlTranslations }),
        });
      }

      if (method === 'GET' && path.endsWith('/translations/en/flat')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ translations: enTranslations }),
        });
      }

      if (method === 'POST' && path.endsWith('/translations')) {
        const body = route.request().postDataJSON() as {
          key: string;
          languageCode: 'nl' | 'en';
          value: string;
        };
        if (body.languageCode === 'nl') nlTranslations[body.key] = body.value;
        if (body.languageCode === 'en') enTranslations[body.key] = body.value;
        return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      }

      const deleteMatch = path.match(/\/translations\/(nl|en)\/(.+)$/);
      if (deleteMatch && method === 'DELETE') {
        const language = deleteMatch[1] as 'nl' | 'en';
        const key = decodeURIComponent(deleteMatch[2]);
        if (language === 'nl') delete nlTranslations[key];
        if (language === 'en') delete enTranslations[key];
        return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      }

      return route.continue();
    });

    await gotoAdminPage(page, '/app/admin/translations');
  });

  test('toont bestaande vertalingen', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Vertalingen' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'USER.LOGIN.TITLE', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Aanmelden', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Login', exact: true })).toBeVisible();
  });

  test('kan een nieuwe vertaalsleutel opslaan', async ({ page }) => {
    await page.getByRole('button', { name: 'Sleutel toevoegen' }).click();

    const dialog = page.locator('.p-dialog').last();
    await dialog.locator('input').nth(0).fill('USER.REGISTER.TITLE');
    await dialog.locator('input').nth(1).fill('User');
    await dialog.locator('textarea').nth(0).fill('Registreren');
    await dialog.locator('textarea').nth(1).fill('Register');
    await dialog.getByRole('button', { name: 'Opslaan' }).click();

    await expect(page.getByText('Vertaling opgeslagen')).toBeVisible();
    await expect(page.getByText('USER.REGISTER.TITLE')).toBeVisible();
    await expect(page.getByText('Registreren')).toBeVisible();
  });

  test('kan een vertaalsleutel verwijderen', async ({ page }) => {
    const row = page.locator('tr', { hasText: 'USER.LOGIN.TITLE' });
    await row.locator('button').nth(1).click();
    await page.getByRole('button', { name: 'Yes' }).click();

    await expect(page.getByText('Vertaling verwijderd')).toBeVisible();
    await expect(page.getByText('USER.LOGIN.TITLE')).toHaveCount(0);
  });
});
