import { test, expect } from '@playwright/test';
import { clearAuthToken, gotoAndWait, mockForgotPasswordSuccess } from '../helpers/auth-helpers';

test.describe('Wachtwoord vergeten pagina', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthToken(page);
    await gotoAndWait(page, '/forgot-password');
  });

  // ── Formulier zichtbaar ────────────────────────────────────────────────────

  test('toont het wachtwoord-vergeten-formulier', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Resetlink versturen' })).toBeVisible();
  });

  // ── Validatie ──────────────────────────────────────────────────────────────

  test('toont verplicht-fout bij leeg e-mailadres', async ({ page }) => {
    await page.getByRole('button', { name: 'Resetlink versturen' }).click();

    await expect(page.getByText('Dit veld is verplicht')).toBeVisible();
  });

  test('toont e-mailfout bij ongeldig e-mailadres', async ({ page }) => {
    await page.locator('input[type="email"]').fill('geen-email');
    await page.getByRole('button', { name: 'Resetlink versturen' }).click();

    await expect(page.getByText('Voer een geldig e-mailadres in')).toBeVisible();
  });

  // ── Succespad ──────────────────────────────────────────────────────────────

  test('toont succesbericht na verzenden resetlink', async ({ page }) => {
    await mockForgotPasswordSuccess(page);

    await page.locator('input[type="email"]').fill('test@test.nl');
    await page.getByRole('button', { name: 'Resetlink versturen' }).click();

    await expect(page.getByText(/Als er een account bestaat voor dit e-mailadres/)).toBeVisible();

    // Formulier moet verdwenen zijn
    await expect(page.getByRole('button', { name: 'Resetlink versturen' })).not.toBeVisible();
  });

  // ── Navigatielink ──────────────────────────────────────────────────────────

  test('navigeert naar loginpagina via "Terug"-link', async ({ page }) => {
    await page.getByRole('link', { name: 'Terug naar aanmelden' }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});
