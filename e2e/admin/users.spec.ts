import { expect, test } from '@playwright/test';
import { gotoAdminPage } from '../helpers/admin-helpers';

test.describe('Gebruikersbeheer', () => {
  test.beforeEach(async ({ page }) => {
    const users = [
      {
        userId: '1',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
        emailConfirmed: true,
        roles: ['Admin'],
        createdAt: '2026-03-29T12:00:00Z',
        lastLoginAt: '2026-03-29T13:00:00Z',
      },
      {
        userId: '2',
        email: 'inactive@example.com',
        firstName: 'Inactive',
        lastName: 'User',
        isActive: false,
        emailConfirmed: false,
        roles: [],
        createdAt: '2026-03-28T12:00:00Z',
      },
    ];
    const userRoles: Record<string, string[]> = {
      '1': ['Admin'],
      '2': [],
    };

    await page.route('http://localhost:5115/users**', async route => {
      const url = new URL(route.request().url());
      const path = url.pathname;
      const method = route.request().method();

      if (method === 'GET' && path.endsWith('/users')) {
        const search = url.searchParams.get('search')?.toLowerCase() ?? '';
        const isActive = url.searchParams.get('isActive');

        let filtered = [...users];
        if (search) {
          filtered = filtered.filter(
            user =>
              `${user.firstName} ${user.lastName}`.toLowerCase().includes(search) ||
              user.email.toLowerCase().includes(search),
          );
        }
        if (isActive === 'true') filtered = filtered.filter(user => user.isActive);
        if (isActive === 'false') filtered = filtered.filter(user => !user.isActive);

        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            items: filtered.map(user => ({ ...user, roles: userRoles[user.userId] ?? [] })),
            totalCount: filtered.length,
            page: 1,
            pageSize: 10,
          }),
        });
      }

      const rolesMatch = path.match(/\/users\/([^/]+)\/roles(?:\/([^/]+))?$/);
      if (rolesMatch) {
        const userId = rolesMatch[1];
        const role = rolesMatch[2] ? decodeURIComponent(rolesMatch[2]) : null;

        if (method === 'GET') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ roles: userRoles[userId] ?? [] }),
          });
        }

        if (method === 'POST') {
          const body = route.request().postDataJSON() as { roleName: string };
          userRoles[userId] ??= [];
          if (!userRoles[userId].includes(body.roleName)) userRoles[userId].push(body.roleName);
          return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
        }

        if (method === 'DELETE' && role) {
          userRoles[userId] = (userRoles[userId] ?? []).filter(existing => existing !== role);
          return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
        }
      }

      return route.continue();
    });

    await page.route('http://localhost:5115/roles', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ roles: ['Admin', 'Manager'] }),
      }),
    );

    await gotoAdminPage(page, '/app/admin/users');
  });

  test('toont gebruikers in de lijst', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Gebruikersbeheer' })).toBeVisible();
    await expect(page.getByText('admin@example.com')).toBeVisible();
    await expect(page.getByText('inactive@example.com')).toBeVisible();
  });

  test('kan gebruikersdetails openen', async ({ page }) => {
    const row = page.locator('tr', { hasText: 'admin@example.com' });
    await row.getByRole('button', { name: 'Details' }).click();
    const dialog = page.getByLabel('Gebruikersdetails');

    await expect(page.getByText('Gebruikersdetails')).toBeVisible();
    await expect(dialog.getByText('Admin User')).toBeVisible();
    await expect(dialog.getByText('E-mail bevestigd')).toBeVisible();
  });

  test('kan rollen toevoegen en verwijderen voor een gebruiker', async ({ page }) => {
    const row = page.locator('tr', { hasText: 'admin@example.com' });
    await row.getByRole('button', { name: 'Rollen beheren' }).click();
    const dialog = page.getByLabel('Rollen beheren');

    await expect(dialog.getByText('admin@example.com')).toBeVisible();
    await dialog.locator('label[for="role_Manager"]').click();
    await expect(
      page.locator('tr', { hasText: 'admin@example.com' }).getByText('Manager'),
    ).toBeVisible();

    await dialog.locator('label[for="role_Manager"]').click();
    await expect(
      page.locator('tr', { hasText: 'admin@example.com' }).getByText('Manager'),
    ).toHaveCount(0);
  });
});
