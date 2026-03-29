import { expect, test } from '@playwright/test';
import { gotoAdminPage } from '../helpers/admin-helpers';

test.describe('Logviewer', () => {
  test.beforeEach(async ({ page }) => {
    const logs = [
      {
        id: 1,
        level: 'error',
        message: 'Something failed',
        stackTrace: 'Error: stack',
        url: '/app/admin/users',
        userAgent: 'Playwright',
        userId: '1',
        correlationId: 'corr-123',
        timestamp: '2026-03-29T12:00:00Z',
        actionTrail: 'Open users',
        context: '{"module":"users"}',
      },
      {
        id: 2,
        level: 'info',
        message: 'Loaded translations',
        url: '/app/admin/translations',
        userAgent: 'Playwright',
        userId: '2',
        correlationId: 'corr-999',
        timestamp: '2026-03-29T12:10:00Z',
      },
    ];

    await page.route('http://localhost:5115/logs/client**', route => {
      if (route.request().method() !== 'GET') {
        return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      }

      const url = new URL(route.request().url());
      const userId = url.searchParams.get('userId')?.toLowerCase() ?? '';
      const correlationId = url.searchParams.get('correlationId')?.toLowerCase() ?? '';

      const items = logs.filter(log => {
        if (userId && !(log.userId ?? '').toLowerCase().includes(userId)) return false;
        if (correlationId && !(log.correlationId ?? '').toLowerCase().includes(correlationId))
          return false;
        return true;
      });

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items,
          totalCount: items.length,
          page: 1,
          pageSize: 50,
          totalPages: 1,
        }),
      });
    });

    await gotoAdminPage(page, '/app/admin/logs');
  });

  test('toont logregels', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Logviewer' })).toBeVisible();
    await expect(page.getByText('Something failed')).toBeVisible();
    await expect(page.getByText('corr-123')).toBeVisible();
  });

  test('kan filteren op correlatie-id', async ({ page }) => {
    await page.getByPlaceholder('Filter op correlatie-id').fill('corr-999');
    await page.getByPlaceholder('Filter op correlatie-id').press('Enter');

    await expect(page.getByText('Loaded translations')).toBeVisible();
    await expect(page.getByText('Something failed')).toHaveCount(0);
  });

  test('kan logdetails openen', async ({ page }) => {
    const row = page.locator('tr', { hasText: 'Something failed' });
    await row.getByRole('button', { name: 'Details' }).click();

    await expect(page.getByText('Logdetails')).toBeVisible();
    await expect(page.getByText('Open users')).toBeVisible();
    await expect(page.getByText('Error: stack')).toBeVisible();
  });
});
