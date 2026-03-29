import { test, expect } from '@playwright/test';
import { setAuthToken, gotoAndWait, mockPasswordPolicy } from '../helpers/auth-helpers';

const mockProfile = {
  userId: '1',
  email: 'test@test.nl',
  firstName: 'Jan',
  lastName: 'Jansen',
  roles: ['Admin'],
};

test.describe('Profielpagina', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthToken(page);
    await mockPasswordPolicy(page);

    // Mock GET /auth/me
    await page.route('**/auth/me', route => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockProfile),
        });
      } else {
        route.continue();
      }
    });

    await gotoAndWait(page, '/app/profile');
  });

  test('toont het profielformulier met geladen gegevens', async ({ page }) => {
    await expect(page.locator('input').first()).toHaveValue('Jan');
    await expect(page.locator('input').nth(1)).toHaveValue('Jansen');
  });

  test('toont e-mailadres als readonly', async ({ page }) => {
    const emailInput = page.locator('input[readonly]');
    await expect(emailInput).toHaveValue('test@test.nl');
  });

  test('toont succesbericht na opslaan', async ({ page }) => {
    // route.fallback() — valt terug op de beforeEach-handler voor GET-verzoeken
    await page.route('**/auth/me', route => {
      if (route.request().method() === 'PUT') {
        route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      } else {
        route.fallback();
      }
    });

    // Wacht tot het formulier geladen is voordat we opslaan
    await expect(page.locator('input').first()).toHaveValue('Jan');
    await page.getByRole('button', { name: 'Wijzigingen opslaan' }).click();
    await expect(page.getByText('Profiel succesvol opgeslagen.')).toBeVisible();
  });

  test('toont foutmelding bij mislukt opslaan', async ({ page }) => {
    // 400 gebruiken: 500 triggert de errorInterceptor die naar /errors/500 navigeert
    // route.fallback() — valt terug op de beforeEach-handler voor GET-verzoeken
    await page.route('**/auth/me', route => {
      if (route.request().method() === 'PUT') {
        route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Bad request' }),
        });
      } else {
        route.fallback();
      }
    });

    // Wacht tot het formulier geladen is voordat we opslaan
    await expect(page.locator('input').first()).toHaveValue('Jan');
    await page.getByRole('button', { name: 'Wijzigingen opslaan' }).click();
    await expect(page.getByText('Opslaan mislukt. Probeer het opnieuw.')).toBeVisible();
  });

  test('toont validatiefout bij leeg voornaamveld', async ({ page }) => {
    await page.locator('input').first().fill('');
    await page.getByRole('button', { name: 'Wijzigingen opslaan' }).click();
    await expect(page.getByText('Dit veld is verplicht').first()).toBeVisible();
  });
});
