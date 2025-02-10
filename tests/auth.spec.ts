import { test, expect } from '@playwright/test'

test('redirection signed user landing page', async ({ page }) => {
    await page.goto('https://aspire-25.vercel.app/user');
    await page.waitForTimeout(5000);
    await expect(page).toHaveURL('https://aspire-25.vercel.app/');
});

test('redirection to Google OAuth on login page', async ({ page }) => {
    await page.goto('https://aspire-25.vercel.app/');
    const loginButton = page.getByRole('button', { name: 'Login with Google' });
    await expect(loginButton).toBeVisible();
    await loginButton.click();
    await page.waitForURL(/accounts\.google\.com/);
    expect(page.url()).toContain('accounts.google.com');
  });
