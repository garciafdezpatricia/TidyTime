import { test, expect } from '@playwright/test';
import { randomBytes } from 'crypto';

test.describe('user can create, edit and delete events', () => {

    test.beforeEach(async ({ page }) => {
        // Log In
        await page.goto('http://localhost:3000');
        await expect(page.getByRole('button', { name: 'TidyTime' })).toBeVisible();
        await expect(page.getByTestId("inrupt-login-article")).toBeVisible();
        await page.getByTestId("inrupt-login-button").click();
        // @ts-ignore
        await page.getByRole('textbox', { name: 'Username' }).fill(process.env.E2E_TEST_USER);
        // @ts-ignore
        await page.getByRole('textbox', { name: 'Password' }).fill(process.env.E2E_TEST_PASSWORD);
        await page.getByRole('button', { name: 'submit' }).click();
        await page.getByRole('button', {name: 'Continue'}).click();
        await expect(page.getByTestId('welcome-back')).toBeVisible({timeout: 3 * 60 * 1000});

        // calendar button
        await page.getByTestId('menu-button-calendar').click();
        // list url
        await expect(page).toHaveURL('http://localhost:3000/calendar', {timeout: 3 * 60 * 1000});
        // list view loaded
        await expect(page.getByTestId('calendar-container')).toBeVisible({ timeout: 3 * 60 * 1000});
    });

    test('user can create and edit an event', async ({ page }) => {
        // click on menu
        await page.getByTestId('calendar-menu-icon').click();
        await page.getByTestId('trigger-create-event').click()
        // add an event
        const eventTitle = randomBytes(4).toString('hex');
        // find title input
        await page.getByPlaceholder('Add a title...').fill(eventTitle);
        // dates
        let now = new Date();
        let offset = now.getTimezoneOffset() * 60000;
        let adjustedDate = new Date(now.getTime() - offset);
        let formattedDate = adjustedDate.toISOString().substring(0,16);
        await page.getByTestId('from-date').fill(formattedDate);
        await page.getByTestId('to-date').fill(formattedDate);

        // create event
        await page.getByRole('button', { name: 'Create' }).click();
        // go to day view
        await page.getByRole('button', { name: 'Day', exact: true }).click();
        // click on first rbc row
        await page.getByRole('heading', { name: eventTitle}).click();
        // wait for .edit-event-title and fill with random new name
        const newName = randomBytes(4).toString('hex');
        await page.getByPlaceholder('New title...').fill(newName);
        // button save  
        await page.getByTitle('Save').click();
        // check new name
        await expect(page.getByRole('heading', { name: newName })).toBeVisible({ timeout: 3 * 60 * 1000});
    });

    test('user can create and delete an event', async ({ page }) => {
        // click on menu
        await page.getByTestId('calendar-menu-icon').click();
        await page.getByTestId('trigger-create-event').click()
        // add an event
        const eventTitle = randomBytes(4).toString('hex');
        // find title input
        await page.getByPlaceholder('Add a title...').fill(eventTitle);
        // dates
        let now = new Date();
        let offset = now.getTimezoneOffset() * 60000;
        let adjustedDate = new Date(now.getTime() - offset);
        let formattedDate = adjustedDate.toISOString().substring(0,16);
        await page.getByTestId('from-date').fill(formattedDate);
        await page.getByTestId('to-date').fill(formattedDate);

        // create event
        await page.getByRole('button', { name: 'Create' }).click();
        // go to day view
        await page.getByRole('button', { name: 'Day', exact: true }).click();
        // click on first rbc row
        await page.getByRole('heading', { name: eventTitle}).click();
        // button delete
        await page.getByTitle('Delete').click();
        await page.getByText('Delete', { exact: true }).click();
        // check event is not there
        await expect(page.getByRole('heading', { name: eventTitle })).not.toBeVisible({timeout: 3 * 60 * 1000});
    });

});