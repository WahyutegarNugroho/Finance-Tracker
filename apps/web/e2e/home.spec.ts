import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should render hero title and login link', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    const loginLink = page.locator('a[href="/login"]');
    await expect(loginLink.first()).toBeVisible();
  });
});