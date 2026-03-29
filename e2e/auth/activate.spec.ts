import { test, expect } from '@playwright/test';
import {
  clearAuthToken,
  gotoAndWait,
  mockActivateSuccess,
  mockActivateInvalid,
} from '../helpers/auth-helpers';

test.describe('Activatiepagina', () => {
  // ── Geen params: instructiescherm ─────────────────────────────────────────

  test('toont instructie als er geen query-params zijn', async ({ page }) => {
    await clearAuthToken(page);
    await gotoAndWait(page, '/activate');

    await expect(page.getByText('Controleer je e-mail')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Terug naar aanmelden' })).toBeVisible();
  });

  // ── Succespad: link uit e-mail ─────────────────────────────────────────────

  test('activeert automatisch en toont succesbericht bij geldige link', async ({ page }) => {
    await clearAuthToken(page);
    await mockActivateSuccess(page);

    await gotoAndWait(page, '/activate?email=test%40test.nl&token=GELDIG-TOKEN');

    await expect(page.getByText('succesvol geactiveerd')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Naar aanmelden' })).toBeVisible();
  });

  test('navigeert naar loginpagina na succesvolle activatie via knop', async ({ page }) => {
    await clearAuthToken(page);
    await mockActivateSuccess(page);

    await gotoAndWait(page, '/activate?email=test%40test.nl&token=GELDIG-TOKEN');
    await page.getByRole('button', { name: 'Naar aanmelden' }).click();

    await expect(page).toHaveURL(/\/login/);
  });

  // ── Foutpad: ongeldige of verlopen link ───────────────────────────────────

  test('toont foutmelding bij ongeldige activatietoken', async ({ page }) => {
    await clearAuthToken(page);
    await mockActivateInvalid(page);

    await gotoAndWait(page, '/activate?email=test%40test.nl&token=ONGELDIGE-TOKEN');

    await expect(page.getByText('Ongeldige of verlopen activatiecode')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Nieuwe activatielink aanvragen' }),
    ).toBeVisible();
  });

  // ── Navigatielink ──────────────────────────────────────────────────────────

  test('navigeert naar loginpagina via "Terug"-link', async ({ page }) => {
    await clearAuthToken(page);
    await gotoAndWait(page, '/activate');

    await page.getByRole('link', { name: 'Terug naar aanmelden' }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});
