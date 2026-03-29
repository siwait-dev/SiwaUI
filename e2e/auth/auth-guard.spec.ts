import { test, expect } from '@playwright/test';
import { clearAuthToken, gotoAndWait, setAuthToken } from '../helpers/auth-helpers';

test.describe('AuthGuard', () => {
  test('niet-ingelogde gebruiker wordt omgeleid naar /login bij /app/dashboard', async ({
    page,
  }) => {
    await clearAuthToken(page);
    await gotoAndWait(page, '/app/dashboard');

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('button', { name: 'Aanmelden' })).toBeVisible();
  });

  test('niet-ingelogde gebruiker wordt omgeleid bij /app/profile', async ({ page }) => {
    await clearAuthToken(page);
    await gotoAndWait(page, '/app/profile');

    await expect(page).toHaveURL(/\/login/);
  });

  test('ingelogde gebruiker heeft toegang tot /app/dashboard', async ({ page }) => {
    await setAuthToken(page);
    await gotoAndWait(page, '/app/dashboard');

    // Blijft op dashboard — geen redirect naar /login
    await expect(page).toHaveURL(/\/app\/dashboard/);
  });

  test('uitloggen via gebruikersmenu wist token en stuurt naar /login', async ({ page }) => {
    await page.route('**/auth/logout', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }),
    );
    await setAuthToken(page);
    await gotoAndWait(page, '/app/dashboard');

    await expect(page).toHaveURL(/\/app\/dashboard/);

    // Open gebruikersmenu (aria-label is "Gebruikersmenu" in het Nederlands)
    await page.getByRole('button', { name: 'Gebruikersmenu' }).click();

    // Klik op "Afmelden" in het popup-menu (niet de sidebar-knop)
    await page.locator('.p-menu-item-label', { hasText: 'Afmelden' }).click();

    // Terug naar login
    await expect(page).toHaveURL(/\/login/);

    // Token moet gewist zijn
    const token = await page.evaluate(() => localStorage.getItem('siwa-token'));
    expect(token).toBeNull();

    const refreshToken = await page.evaluate(() => localStorage.getItem('siwa-refresh-token'));
    expect(refreshToken).toBeNull();
  });
});
