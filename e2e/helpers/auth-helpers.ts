import { Page } from '@playwright/test';

interface TestTokenOptions {
  sub?: string;
  email?: string;
  name?: string;
  exp?: number;
  roles?: string[];
}

// ── Test JWT ──────────────────────────────────────────────────────────────────
// Geldige base64url-payload zodat decodeJwt() in AuthService correct werkt.
export function createTestToken(options: TestTokenOptions = {}): string {
  const payload = Buffer.from(
    JSON.stringify({
      sub: options.sub ?? '1',
      email: options.email ?? 'test@test.nl',
      name: options.name ?? 'Test Gebruiker',
      exp: options.exp ?? 4070908800,
      role: options.roles ?? [],
    }),
  ).toString('base64url');

  return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${payload}.test-signature`;
}

export const TEST_TOKEN = createTestToken();

// ── Navigatie-helper ──────────────────────────────────────────────────────────

/**
 * Navigeert naar een pagina en wacht tot de i18n-vertalingen zijn geladen.
 *
 * Strategie: intercept de /assets/i18n/*.json-verzoeken en serveer ze direct
 * vanuit het lokale bestandssysteem. Dit elimineert elke async-vertraging van
 * de dev-server en maakt tests deterministisch ongeacht server-warmup.
 */
export async function gotoAndWait(page: Page, path: string): Promise<void> {
  // Serveer vertaalbestanden direct vanuit het lokale FS (geen netwerk-afhankelijkheid)
  await page.route('**/assets/i18n/nl.json', route =>
    route.fulfill({ path: 'src/assets/i18n/nl.json', contentType: 'application/json' }),
  );
  await page.route('**/assets/i18n/en.json', route =>
    route.fulfill({ path: 'src/assets/i18n/en.json', contentType: 'application/json' }),
  );

  await page.goto(path);

  // Wacht tot Angular de vertalingen heeft toegepast:
  // zolang er ruwe sleutels (bijv. "LOGIN.SUBMIT") zichtbaar zijn, wachten we.
  await page.waitForFunction(
    () => !/\b[A-Z][A-Z_]*\.[A-Z][A-Z_]+\b/.test(document.body.innerText),
    undefined,
    { timeout: 10_000 },
  );
}

// ── localStorage helpers ──────────────────────────────────────────────────────

/** Zet een auth-token in localStorage vóór het laden van de pagina. */
export async function setAuthToken(page: Page, token = TEST_TOKEN): Promise<void> {
  await page.addInitScript(t => {
    localStorage.setItem('siwa-token', t);
    localStorage.setItem('siwa-refresh-token', 'test-refresh-token');
  }, token);
}

/** Wist het auth-token uit localStorage vóór het laden van de pagina. */
export async function clearAuthToken(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.removeItem('siwa-token');
    localStorage.removeItem('siwa-refresh-token');
  });
}

// ── API mocks ─────────────────────────────────────────────────────────────────

export async function mockLoginSuccess(page: Page): Promise<void> {
  await page.route('**/auth/login', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ accessToken: TEST_TOKEN, refreshToken: 'refresh-token' }),
    }),
  );
}

export async function mockLoginUnauthorized(page: Page): Promise<void> {
  await page.route('**/auth/login', route =>
    route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({
        error: {
          hasError: true,
          errors: [
            { code: 'VALIDATION.INVALID_CREDENTIALS', message: '', statusCode: 401, type: 'Error' },
          ],
        },
      }),
    }),
  );
}

export async function mockRegisterSuccess(page: Page): Promise<void> {
  await page.route('**/auth/register', route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }),
  );
}

export async function mockRegisterConflict(page: Page): Promise<void> {
  await page.route('**/auth/register', route =>
    route.fulfill({
      status: 409,
      contentType: 'application/json',
      body: JSON.stringify({
        error: {
          hasError: true,
          errors: [
            {
              code: 'VALIDATION.ACCOUNT_EXISTS',
              message: '',
              statusCode: 409,
              type: 'Error',
            },
          ],
        },
      }),
    }),
  );
}

export async function mockActivateSuccess(page: Page): Promise<void> {
  await page.route('**/auth/activate', route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }),
  );
}

export async function mockActivateInvalid(page: Page): Promise<void> {
  await page.route('**/auth/activate', route =>
    route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Invalid or expired code' }),
    }),
  );
}

export async function mockForgotPasswordSuccess(page: Page): Promise<void> {
  await page.route('**/auth/forgot-password', route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }),
  );
}

export async function mockPasswordPolicy(page: Page): Promise<void> {
  await page.route('**/password-policy', route => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          minLength: 8,
          requireDigit: true,
          requireUppercase: true,
          requireNonAlphanumeric: true,
          maxAgeDays: null,
          historyCount: 0,
          checkBreachedPasswords: false,
          refreshTokenExpirationDays: 7,
        }),
      });
    } else {
      route.continue();
    }
  });
}

export async function mockResetPasswordSuccess(page: Page): Promise<void> {
  await page.route('**/auth/reset-password', route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }),
  );
}

export async function mockResetPasswordError(page: Page): Promise<void> {
  await page.route('**/auth/reset-password', route =>
    route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Invalid token' }),
    }),
  );
}

export async function mockChangePasswordSuccess(page: Page): Promise<void> {
  await page.route('**/auth/change-password', route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }),
  );
}

export async function mockChangePasswordError(page: Page): Promise<void> {
  await page.route('**/auth/change-password', route =>
    route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Wrong current password' }),
    }),
  );
}
