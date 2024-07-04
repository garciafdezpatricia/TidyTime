import { test, expect } from '@playwright/test';

test('user can log into the appication', async ({page}) => {
    // Navigate to main page
    await page.goto('http://localhost:3000');
    await expect(page.getByRole('button', { name: 'TidyTime' })).toBeVisible();
    // Expect a login page
    await expect(page.getByTestId("inrupt-login-article")).toBeVisible();
    // Click log in button
    await page.getByTestId("inrupt-login-button").click();
    // Introduce credentials
    // @ts-ignore
    await page.getByRole('textbox', { name: 'Username' }).fill(process.env.E2E_TEST_USER);
    // @ts-ignore
    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.E2E_TEST_PASSWORD);
    // Log in
    await page.getByRole('button', { name: 'submit' }).click();
    // Accept Inrupt
    await page.getByRole('button', {name: 'Continue'}).click();
    // Back to main page
    await expect(page.getByTestId('welcome-back')).toBeVisible({timeout: 3 * 60 * 1000});
    // Log out
    await page.getByTestId('inrupt-logout-button').click();
});
