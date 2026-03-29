import { test, expect } from '@playwright/test';
import {
  clearAuthToken,
  gotoAndWait,
  mockLoginSuccess,
  mockLoginUnauthorized,
} from '../helpers/auth-helpers';

test.describe('Login pagina', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthToken(page);
    await gotoAndWait(page, '/login');
  });

  // ── Formulier zichtbaar ────────────────────────────────────────────────────

  test('toont het loginformulier', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Aanmelden' })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  // ── Validatie: leeg formulier ──────────────────────────────────────────────

  test('toont verplicht-fout bij leeg formulier', async ({ page }) => {
    await page.getByRole('button', { name: 'Aanmelden' }).click();

    await expect(page.getByText('Dit veld is verplicht').first()).toBeVisible();
  });

  test('toont e-mailfout bij ongeldig e-mailadres', async ({ page }) => {
    await page.locator('input[type="email"]').fill('geen-email');
    // Klik submit om markAllAsTouched te triggeren
    await page.getByRole('button', { name: 'Aanmelden' }).click();

    await expect(page.getByText('Voer een geldig e-mailadres in')).toBeVisible();
  });

  test('toont wachtwoordfout bij te kort wachtwoord', async ({ page }) => {
    await page.locator('input[type="email"]').fill('test@test.nl');
    await page.locator('input[type="password"]').fill('kort');
    await page.getByRole('button', { name: 'Aanmelden' }).click();

    await expect(page.getByText('Wachtwoord moet minimaal 8 tekens bevatten')).toBeVisible();
  });

  // ── API-foutafhandeling ────────────────────────────────────────────────────

  test('toont foutmelding bij ongeldige inloggegevens (401)', async ({ page }) => {
    await mockLoginUnauthorized(page);

    await page.locator('input[type="email"]').fill('test@test.nl');
    await page.locator('input[type="password"]').fill('wachtwoord123');
    await page.getByRole('button', { name: 'Aanmelden' }).click();

    await expect(page.getByText('Onbekend e-mailadres of wachtwoord')).toBeVisible();
  });

  // ── Succespad ──────────────────────────────────────────────────────────────

  test('navigeert naar dashboard na succesvolle login', async ({ page }) => {
    await mockLoginSuccess(page);

    await page.locator('input[type="email"]').fill('test@test.nl');
    await page.locator('input[type="password"]').fill('wachtwoord123');
    await page.getByRole('button', { name: 'Aanmelden' }).click();

    await expect(page).toHaveURL(/\/app\/dashboard/);
  });

  // ── Navigatielinks ─────────────────────────────────────────────────────────

  test('navigeert naar registratiepagina via link', async ({ page }) => {
    await page.getByRole('link', { name: 'Maak er een aan' }).click();
    await expect(page).toHaveURL(/\/register/);
  });

  test('navigeert naar wachtwoord-vergeten-pagina via link', async ({ page }) => {
    await page.getByRole('link', { name: 'Wachtwoord vergeten?' }).click();
    await expect(page).toHaveURL(/\/forgot-password/);
  });
});
