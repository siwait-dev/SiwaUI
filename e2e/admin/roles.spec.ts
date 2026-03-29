import { expect, test } from '@playwright/test';
import { gotoAdminPage } from '../helpers/admin-helpers';

test.describe('Rollenbeheer', () => {
  test.beforeEach(async ({ page }) => {
    const roles = ['Admin', 'Manager'];
    const claimsByRole: Record<string, { type: string; value: string }[]> = {
      Admin: [{ type: 'permission', value: 'users.read' }],
      Manager: [],
    };

    await page.route('http://localhost:5115/roles**', async route => {
      const url = new URL(route.request().url());
      const path = url.pathname;
      const method = route.request().method();

      if (method === 'GET' && path.endsWith('/roles')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ roles }),
        });
      }

      if (method === 'POST' && path.endsWith('/roles')) {
        const body = route.request().postDataJSON() as { name: string };
        if (!roles.includes(body.name)) roles.push(body.name);
        claimsByRole[body.name] ??= [];
        return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      }

      const claimsMatch = path.match(/\/roles\/([^/]+)\/claims$/);
      if (claimsMatch) {
        const role = decodeURIComponent(claimsMatch[1]);

        if (method === 'GET') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ claims: claimsByRole[role] ?? [] }),
          });
        }

        if (method === 'POST') {
          const body = route.request().postDataJSON() as { type: string; value: string };
          claimsByRole[role] ??= [];
          claimsByRole[role].push({ type: body.type, value: body.value });
          return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
        }

        if (method === 'DELETE') {
          const body = route.request().postDataJSON() as { type: string; value: string };
          claimsByRole[role] = (claimsByRole[role] ?? []).filter(
            claim => claim.type !== body.type || claim.value !== body.value,
          );
          return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
        }
      }

      const roleMatch = path.match(/\/roles\/([^/]+)$/);
      if (roleMatch && method === 'DELETE') {
        const role = decodeURIComponent(roleMatch[1]);
        const index = roles.indexOf(role);
        if (index >= 0) roles.splice(index, 1);
        delete claimsByRole[role];
        return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      }

      return route.continue();
    });

    await gotoAdminPage(page, '/app/admin/roles');
  });

  test('toont de rollenlijst', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Rollenbeheer' })).toBeVisible();
    await expect(page.getByText('Admin')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Claims beheren' }).first()).toBeVisible();
  });

  test('kan een nieuwe rol aanmaken', async ({ page }) => {
    await page.getByRole('button', { name: 'Rol toevoegen' }).click();
    await page.locator('.p-dialog input').first().fill('Support');
    await page.getByRole('button', { name: 'Opslaan' }).click();

    await expect(page.getByText('Rol aangemaakt')).toBeVisible();
    await expect(page.getByText('Support')).toBeVisible();
  });

  test('kan claims laden, toevoegen en verwijderen', async ({ page }) => {
    const adminRow = page.locator('tr', { hasText: 'Admin' });
    await adminRow.getByRole('button', { name: 'Claims beheren' }).click();

    await expect(page.getByText('users.read')).toBeVisible();

    const dialog = page.locator('.p-dialog').last();
    await dialog.locator('input').nth(0).fill('permission');
    await dialog.locator('input').nth(1).fill('users.write');
    await dialog.getByRole('button', { name: 'Claim toevoegen' }).click();

    await expect(page.getByText('Claim toegevoegd')).toBeVisible();
    await expect(page.getByText('users.write')).toBeVisible();

    const claimRow = page.locator('tr', { hasText: 'users.write' });
    await claimRow.locator('button').click();

    await expect(page.getByText('Claim verwijderd')).toBeVisible();
    await expect(page.getByText('users.write')).toHaveCount(0);
  });
});
