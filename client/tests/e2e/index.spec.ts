import { test, expect } from '@playwright/test';

test.describe('user can manage index page', () => {

    test.beforeEach(async ({ page }) => {
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
    });

    test('user can see stats section', async ({ page }) => {
        // Task section
        await expect(page.getByTestId('task-progress')).toBeVisible();
        // task text
        await expect(page.getByTestId('total-tasks-donut')).toBeVisible();
    });

    test('user can see events section', async ({ page }) => {
        // Events section
        await expect(page.getByTestId('upcoming-events')).toBeVisible();
    })

    test('user can navigate to list section', async ({ page }) => {
        // list button
        await page.getByTestId('menu-button-list').click();
        // list url
        await expect(page).toHaveURL('http://localhost:3000/list', {timeout: 3 * 60 * 1000});
    });

    test('user can navigate to board section', async ({ page }) => {
        // board button
        await page.getByTestId('menu-button-board').click();
        // board url
        await expect(page).toHaveURL('http://localhost:3000/board', {timeout: 3 * 60 * 1000});
    });

    test('user can navigate to calendar section', async ({ page }) => {
        // calendar button
        await page.getByTestId('menu-button-calendar').click();
        // calendar url
        await expect(page).toHaveURL('http://localhost:3000/calendar', {timeout: 3 * 60 * 1000});
    });

    test('user can navigate to tidier section', async ({ page }) => {
        // tidier button
        await page.getByTestId('menu-button-tidier').click();
        // tidier url
        await expect(page).toHaveURL('http://localhost:3000/tidier', {timeout: 3 * 60 * 1000});
    });

    test('user can navigate to preferences section', async ({ page }) => {
        const isMobile = await page.evaluate(() => window.innerWidth <= 800);
        const testId = isMobile ? "menu-button-settings-mobile" : "menu-button-settings";
        // settings button
        await page.getByTestId(testId).click();
        // settings url
        await expect(page).toHaveURL('http://localhost:3000/settings', {timeout: 3 * 60 * 1000});
    });

    test('user can switch to dark mode', async ({ page }) => {
        const isMobile = await page.evaluate(() => window.innerWidth <= 800);
        const testId = isMobile ? "menu-button-dark-light-mobile" : "menu-button-dark-light";
        // light mode by default
        await expect(page.getByTestId('index-container')).not.toHaveCSS('background-color', '#3F3C3C');
        // theme button
        await page.getByTestId(testId).click();
        // dark mode
        await expect(page.getByTestId('index-container')).toHaveCSS('background-color', 'rgb(63, 60, 60)');
    });

    test('user can switch languages', async ({ page }) => {
        const isMobile = await page.evaluate(() => window.innerWidth <= 800);
        const testId = isMobile ? "menu-button-language-mobile" : "menu-button-language";
        // english by default
        await expect(page.getByTestId('welcome-back')).toHaveText(/Welcome back/);
        // language button
        await page.getByTestId(testId).click();
        // spanish 
        await expect(page.getByTestId('welcome-back')).toHaveText(/Hola de nuevo/);
    });
})