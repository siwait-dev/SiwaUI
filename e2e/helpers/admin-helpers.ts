import { Page } from '@playwright/test';
import { createTestToken, gotoAndWait, setAuthToken } from './auth-helpers';

export async function mockBackgroundRequests(page: Page): Promise<void> {
  await page.route('http://localhost:5115/logs/client', route => {
    if (route.request().method() === 'POST') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    }

    return route.continue();
  });

  await page.route('http://localhost:5115/hubs/notifications/negotiate**', route =>
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
}

export async function gotoAdminPage(page: Page, path: string): Promise<void> {
  await setAuthToken(page, createTestToken({ roles: ['Admin'] }));
  await mockBackgroundRequests(page);
  await gotoAndWait(page, path);
}
