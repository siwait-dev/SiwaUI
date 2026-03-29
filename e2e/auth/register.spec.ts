import { test, expect } from '@playwright/test';
import {
  clearAuthToken,
  gotoAndWait,
  mockPasswordPolicy,
  mockRegisterSuccess,
  mockRegisterConflict,
} from '../helpers/auth-helpers';

test.describe('Registratiepagina', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuthToken(page);
    await mockPasswordPolicy(page);
    await gotoAndWait(page, '/register');
  });

  // ── Formulier zichtbaar ────────────────────────────────────────────────────

  test('toont het registratieformulier', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Account aanmaken' })).toBeVisible();
  });

  // ── Validatie: leeg formulier ──────────────────────────────────────────────

  test('toont verplicht-fouten bij leeg formulier', async ({ page }) => {
    await page.getByRole('button', { name: 'Account aanmaken' }).click();

    // Alle vier de verplicht-foutmeldingen moeten zichtbaar zijn
    const errors = page.getByText('Dit veld is verplicht');
    await expect(errors).toHaveCount(4);
  });

  test('toont e-mailfout bij ongeldig e-mailadres', async ({ page }) => {
    await page.locator('input[type="email"]').fill('geen-email');
    await page.getByRole('button', { name: 'Account aanmaken' }).click();

    await expect(page.getByText('Voer een geldig e-mailadres in')).toBeVisible();
  });

  test('toont wachtwoordfout bij te kort wachtwoord', async ({ page }) => {
    await page.locator('input[id="firstName"]').fill('Jan');
    await page.locator('input[id="lastName"]').fill('Jansen');
    await page.locator('input[type="email"]').fill('test@test.nl');
    await page.locator('input[type="password"]').fill('kort');
    await page.getByRole('button', { name: 'Account aanmaken' }).click();

    // Mock retourneert minLength: 8 — foutmelding toont het getal uit de policy
    await expect(page.getByText('Wachtwoord moet minimaal 8 tekens bevatten')).toBeVisible();
  });

  // ── API-foutafhandeling ────────────────────────────────────────────────────

  test('toont foutmelding als account al bestaat (409)', async ({ page }) => {
    await mockRegisterConflict(page);

    await page.locator('input[id="firstName"]').fill('Jan');
    await page.locator('input[id="lastName"]').fill('Jansen');
    await page.locator('input[type="email"]').fill('test@test.nl');
    await page.locator('input[type="password"]').fill('Wachtwoord1!');
    await page.getByRole('button', { name: 'Account aanmaken' }).click();

    await expect(page.getByText('Er bestaat al een account met dit e-mailadres')).toBeVisible();
  });

  // ── Succespad ──────────────────────────────────────────────────────────────

  test('navigeert naar activatiepagina na succesvolle registratie', async ({ page }) => {
    await mockRegisterSuccess(page);

    await page.locator('input[id="firstName"]').fill('Jan');
    await page.locator('input[id="lastName"]').fill('Jansen');
    await page.locator('input[type="email"]').fill('nieuw@test.nl');
    await page.locator('input[type="password"]').fill('Wachtwoord1!');
    await page.getByRole('button', { name: 'Account aanmaken' }).click();

    await expect(page).toHaveURL(/\/activate/);
  });

  test('stuurt email mee als query-parameter naar activatiepagina', async ({ page }) => {
    await mockRegisterSuccess(page);

    await page.locator('input[id="firstName"]').fill('Jan');
    await page.locator('input[id="lastName"]').fill('Jansen');
    await page.locator('input[type="email"]').fill('nieuw@test.nl');
    await page.locator('input[type="password"]').fill('Wachtwoord1!');
    await page.getByRole('button', { name: 'Account aanmaken' }).click();

    await expect(page).toHaveURL(/\/activate\?email=nieuw(@|%40)test\.nl/);
  });

  // ── Navigatielink ──────────────────────────────────────────────────────────

  test('navigeert naar loginpagina via link', async ({ page }) => {
    await page.getByRole('link', { name: 'Aanmelden' }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});
