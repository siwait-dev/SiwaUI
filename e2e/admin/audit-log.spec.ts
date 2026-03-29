import { expect, test } from '@playwright/test';
import { gotoAdminPage } from '../helpers/admin-helpers';

test.describe('Auditlog', () => {
  test.beforeEach(async ({ page }) => {
    const auditLogs = [
      {
        id: 1,
        timestamp: '2026-03-29T12:00:00Z',
        method: 'GET',
        path: '/users',
        email: 'admin@example.com',
        ipAddress: '127.0.0.1',
        statusCode: 200,
        durationMs: 15,
      },
      {
        id: 2,
        timestamp: '2026-03-29T12:05:00Z',
        method: 'POST',
        path: '/roles',
        email: 'manager@example.com',
        ipAddress: '127.0.0.2',
        statusCode: 201,
        durationMs: 22,
      },
    ];

    await page.route('http://localhost:5115/audit**', route => {
      const url = new URL(route.request().url());
      const method = url.searchParams.get('method');
      const email = url.searchParams.get('email')?.toLowerCase() ?? '';
      const path = url.searchParams.get('path')?.toLowerCase() ?? '';

      const items = auditLogs.filter(log => {
        if (method && log.method !== method) return false;
        if (email && !(log.email ?? '').toLowerCase().includes(email)) return false;
        if (path && !log.path.toLowerCase().includes(path)) return false;
        return true;
      });

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items, totalCount: items.length, page: 1, pageSize: 50 }),
      });
    });

    await gotoAdminPage(page, '/app/admin/audit');
  });

  test('toont auditregels', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Auditlog' })).toBeVisible();
    await expect(page.getByText('/users')).toBeVisible();
    await expect(page.getByText('admin@example.com')).toBeVisible();
  });

  test('kan filteren op pad', async ({ page }) => {
    await page.getByPlaceholder('Filter op pad').fill('/roles');
    await page.getByPlaceholder('Filter op pad').press('Enter');

    await expect(page.getByText('/roles')).toBeVisible();
    await expect(page.getByText('/users')).toHaveCount(0);
  });

  test('kan auditdetails openen', async ({ page }) => {
    const row = page.locator('tr', { hasText: '/users' });
    await row.getByRole('button', { name: 'Details' }).click();
    const dialog = page.getByLabel('Auditdetails');

    await expect(page.getByText('Auditdetails')).toBeVisible();
    await expect(dialog.getByText('127.0.0.1')).toBeVisible();
    await expect(dialog.getByText('15 ms')).toBeVisible();
  });
});
