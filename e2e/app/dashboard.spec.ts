import { test, expect } from '@playwright/test';
import { setAuthToken, gotoAndWait, mockPasswordPolicy } from '../helpers/auth-helpers';

const mockStats = {
  totalUsers: 42,
  activeThisWeek: 17,
  auditLast24h: 8,
  recentActivity: [
    {
      timestamp: new Date().toISOString(),
      userEmail: 'test@test.nl',
      method: 'POST',
      path: '/auth/login',
      statusCode: 200,
    },
  ],
};

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthToken(page);
    await mockPasswordPolicy(page);

    await page.route('**/dashboard/stats', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockStats),
      }),
    );

    // Mock SignalR — respond to negotiate with empty response to avoid connection errors
    await page.route('**/hubs/notifications/negotiate**', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          negotiateVersion: 1,
          connectionId: 'test',
          availableTransports: [],
        }),
      }),
    );

    await gotoAndWait(page, '/app/dashboard');
  });

  test('toont het dashboard met statistieken', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText('42')).toBeVisible();
    await expect(page.getByText('17')).toBeVisible();
    await expect(page.getByText('8')).toBeVisible();
  });

  test('toont recente activiteit', async ({ page }) => {
    await expect(page.getByText('test@test.nl')).toBeVisible();
    await expect(page.getByText('POST /auth/login')).toBeVisible();
  });

  test('toont Live badge', async ({ page }) => {
    await expect(page.getByText('Live')).toBeVisible();
  });
});
