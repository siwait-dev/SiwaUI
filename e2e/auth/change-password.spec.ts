import { test, expect } from '@playwright/test';
import {
  clearAuthToken,
  gotoAndWait,
  setAuthToken,
  mockPasswordPolicy,
  mockChangePasswordSuccess,
  mockChangePasswordError,
} from '../helpers/auth-helpers';

test.describe('Wachtwoord wijzigen pagina', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthToken(page);
    await mockPasswordPolicy(page);
    // Mock logout endpoint (fire-and-forget in AuthService)
    await page.route('**/auth/logout', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }),
    );
    await gotoAndWait(page, '/app/change-password');
  });

  // ── Formulier zichtbaar ────────────────────────────────────────────────────

  test('toont het wachtwoord-wijzigen-formulier', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Wachtwoord wijzigen' })).toBeVisible();
  });

  test('toont verlopen-banner als reason=expired in URL staat', async ({ page }) => {
    await clearAuthToken(page);
    await setAuthToken(page);
    await mockPasswordPolicy(page);
    await page.route('**/auth/logout', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }),
    );
    await gotoAndWait(page, '/app/change-password?reason=expired');

    await expect(page.getByText('Uw wachtwoord is verlopen')).toBeVisible();
  });

  // ── Validatie ──────────────────────────────────────────────────────────────

  test('toont verplicht-fouten bij leeg formulier', async ({ page }) => {
    await page.getByRole('button', { name: 'Wachtwoord wijzigen' }).click();

    await expect(page.getByText('Dit veld is verplicht').first()).toBeVisible();
  });

  test('toont fout bij niet-overeenkomende wachtwoorden', async ({ page }) => {
    await page.locator('input[id="currentPassword"]').fill('OudWW1!');
    await page.locator('input[id="newPassword"]').fill('NieuwWW1!');
    await page.locator('input[id="confirmPassword"]').fill('Anders1!');
    await page.getByRole('button', { name: 'Wachtwoord wijzigen' }).click();

    await expect(page.getByText('Wachtwoorden komen niet overeen')).toBeVisible();
  });

  // ── Succespad ──────────────────────────────────────────────────────────────

  test('toont succesbericht na succesvol wijzigen en navigeert naar dashboard', async ({
    page,
  }) => {
    await mockChangePasswordSuccess(page);

    await page.locator('input[id="currentPassword"]').fill('OudWW1!');
    await page.locator('input[id="newPassword"]').fill('NieuwWW1!');
    await page.locator('input[id="confirmPassword"]').fill('NieuwWW1!');
    await page.getByRole('button', { name: 'Wachtwoord wijzigen' }).click();

    await expect(page.getByText('Wachtwoord succesvol gewijzigd')).toBeVisible();
    await expect(page).toHaveURL(/\/app\/dashboard/, { timeout: 5000 });
  });

  // ── Foutpad ────────────────────────────────────────────────────────────────

  test('toont foutmelding bij fout huidig wachtwoord (400)', async ({ page }) => {
    await mockChangePasswordError(page);

    await page.locator('input[id="currentPassword"]').fill('FoutOudWW1!');
    await page.locator('input[id="newPassword"]').fill('NieuwWW1!');
    await page.locator('input[id="confirmPassword"]').fill('NieuwWW1!');
    await page.getByRole('button', { name: 'Wachtwoord wijzigen' }).click();

    await expect(page.getByText('Onbekend e-mailadres of wachtwoord')).toBeVisible();
  });
});
