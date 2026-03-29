import { test, expect } from '@playwright/test';
import {
  clearAuthToken,
  gotoAndWait,
  mockPasswordPolicy,
  mockResetPasswordSuccess,
  mockResetPasswordError,
} from '../helpers/auth-helpers';

test.describe('Wachtwoord resetten pagina', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthToken(page);
    await mockPasswordPolicy(page);
  });

  // ── Redirect bij ontbrekende params ───────────────────────────────────────

  test('redirect naar forgot-password als query-params ontbreken', async ({ page }) => {
    await gotoAndWait(page, '/reset-password');
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  // ── Formulier zichtbaar ────────────────────────────────────────────────────

  test('toont het reset-wachtwoord-formulier bij geldige params', async ({ page }) => {
    await gotoAndWait(page, '/reset-password?email=test%40test.nl&token=GELDIG-TOKEN');
    await expect(page.getByRole('button', { name: 'Wachtwoord opslaan' })).toBeVisible();
  });

  // ── Validatie ──────────────────────────────────────────────────────────────

  test('toont verplicht-fouten bij leeg formulier', async ({ page }) => {
    await gotoAndWait(page, '/reset-password?email=test%40test.nl&token=GELDIG-TOKEN');
    await page.getByRole('button', { name: 'Wachtwoord opslaan' }).click();

    await expect(page.getByText('Dit veld is verplicht').first()).toBeVisible();
  });

  test('toont fout bij niet-overeenkomende wachtwoorden', async ({ page }) => {
    await gotoAndWait(page, '/reset-password?email=test%40test.nl&token=GELDIG-TOKEN');

    await page.locator('input[id="newPassword"]').fill('Wachtwoord1!');
    await page.locator('input[id="confirmPassword"]').fill('Anders1!');
    await page.getByRole('button', { name: 'Wachtwoord opslaan' }).click();

    await expect(page.getByText('Wachtwoorden komen niet overeen')).toBeVisible();
  });

  // ── Succespad ──────────────────────────────────────────────────────────────

  test('navigeert naar login met success-param na geslaagde reset', async ({ page }) => {
    await mockResetPasswordSuccess(page);
    await gotoAndWait(page, '/reset-password?email=test%40test.nl&token=GELDIG-TOKEN');

    await page.locator('input[id="newPassword"]').fill('NieuwWW1!');
    await page.locator('input[id="confirmPassword"]').fill('NieuwWW1!');
    await page.getByRole('button', { name: 'Wachtwoord opslaan' }).click();

    await expect(page).toHaveURL(/\/login\?reset=success/);
  });

  test('toont succesbericht op loginpagina na reset', async ({ page }) => {
    await mockResetPasswordSuccess(page);
    await gotoAndWait(page, '/reset-password?email=test%40test.nl&token=GELDIG-TOKEN');

    await page.locator('input[id="newPassword"]').fill('NieuwWW1!');
    await page.locator('input[id="confirmPassword"]').fill('NieuwWW1!');
    await page.getByRole('button', { name: 'Wachtwoord opslaan' }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(
      page.getByText('Wachtwoord succesvol gewijzigd. Je kunt nu inloggen.'),
    ).toBeVisible();
  });

  // ── Foutpad ────────────────────────────────────────────────────────────────

  test('toont foutmelding bij ongeldige resettoken (400)', async ({ page }) => {
    await mockResetPasswordError(page);
    await gotoAndWait(page, '/reset-password?email=test%40test.nl&token=VERLOPEN-TOKEN');

    await page.locator('input[id="newPassword"]').fill('NieuwWW1!');
    await page.locator('input[id="confirmPassword"]').fill('NieuwWW1!');
    await page.getByRole('button', { name: 'Wachtwoord opslaan' }).click();

    await expect(
      page.getByText('Ongeldige of verlopen resetlink. Vraag een nieuwe aan.'),
    ).toBeVisible();
  });
});
