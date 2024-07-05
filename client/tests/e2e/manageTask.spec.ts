import { test, expect } from '@playwright/test';
import { randomBytes } from 'crypto';

test.describe('user can add, edit and delete a task', () => {

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

        // list button
        await page.getByTestId('menu-button-list').click();
        // list url
        await expect(page).toHaveURL('http://localhost:3000/list', {timeout: 3 * 60 * 1000});
        // list view loaded
        await expect(page.getByTestId('tab-container-add-list')).toBeVisible({ timeout: 3 * 60 * 1000});
        // add new list
        await page.getByTestId('tab-container-add-list').click();
        let active = await page.$('section.active-tab p');
        expect(active).not.toBeUndefined();
    });

    test('user can show/hide tasks', async ({ page }) => {
        // create new task with random name
        const newTask = randomBytes(4).toString('hex');
        await page.getByPlaceholder('New task...').fill(newTask);
        await page.getByTestId('create-task-button').click();
        // check the random name is in the content
        await expect(page.getByText(newTask)).toBeVisible();
        // mark the task as done
        const li = await page.$(`li:has(.task-content h4:has-text("${newTask}"))`);
        const check = await li?.$('.icon-container');
        await check?.click();
        // check the random string is not in the content
        await expect(page.getByText(newTask)).not.toBeVisible();
        // show done tasks
        await page.getByTestId('see-done-task').click();
        // check the random string is in the content
        await expect(page.getByText(newTask)).toBeVisible();
    });

    test('user can edit a task', async ({ page }) => {
        // create new task with random name
        const newTask = randomBytes(4).toString('hex');
        await page.getByPlaceholder('New task...').fill(newTask);
        await page.getByTestId('create-task-button').click();
        // check the random name is in the content
        await expect(page.getByText(newTask)).toBeVisible();
        // open edit task modal
        const li = await page.$(`li:has(.task-content h4:has-text("${newTask}"))`);
        const edit = await li?.$('.edit-icon');
        await edit?.click();
        await expect(page.getByTestId('edit-task-modal')).toBeVisible();
        // edit the name to another random string
        const newTitle = randomBytes(4).toString('hex');
        await page.getByTestId('task-title').fill(newTitle);
        // save
        await page.getByTestId('save-task').click();
        // check the random string is in the content
        await expect(page.getByText(newTitle)).toBeVisible();
    });

    test('user can delete a task', async ({ page }) => {
        // create new task with random name
        const newTask = randomBytes(4).toString('hex');
        await page.getByPlaceholder('New task...').fill(newTask);
        await page.getByTestId('create-task-button').click();
        // check the random name is in the content
        await expect(page.getByText(newTask)).toBeVisible();
        // open edit task modal
        const li = await page.$(`li:has(.task-content h4:has-text("${newTask}"))`);
        const edit = await li?.$('.edit-icon');
        await edit?.click();
        await expect(page.getByTestId('edit-task-modal')).toBeVisible();
        // delete the task
        await page.getByTestId('delete-task').click();
        // Confirmation modal
        await page.getByTestId('primary-button').click();
        // check the random string is not in the content
        await expect(page.getByText(newTask)).not.toBeVisible();
    })

});

test.describe('user can add, edit and delete a list', () => {
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

        // list button
        await page.getByTestId('menu-button-list').click();
        // list url
        await expect(page).toHaveURL('http://localhost:3000/list', {timeout: 3 * 60 * 1000});
        // list view loaded
        await expect(page.getByTestId('tab-container-add-list')).toBeVisible({ timeout: 3 * 60 * 1000});
        // add new list
        await page.getByTestId('tab-container-add-list').click();
        let active = await page.$('section.active-tab p');
        expect(active).not.toBeUndefined();
   });

   test('user can add and delete a list', async ({ page }) => {
        // add new list
        await page.getByTestId('tab-container-add-list').click();
        // new list name
        const listNameBefore = await page.$('section.active-tab p');
        const textContentBefore = await listNameBefore?.textContent();
        // take active tab
        const dropdown = await page.$('section.active-tab div.edit-dropdown');
        await dropdown?.click();
        // edit modal
        await expect(page.getByTestId('edit-modal')).toBeVisible();
        // remove list
        await expect(page.getByTestId('remove-button')).toBeVisible();
        await page.getByTestId('remove-button').click();
        // confirmation panel
        await page.getByRole('button', { name: 'Delete' }).click();
        // list removed
        const listName = await page.$('section.active-tab p');
        const textContent = await listName?.textContent();
        expect(textContent).not.toBe(textContentBefore);
   });

   test('user can add and edit a list', async ({ page }) => {
        // add new list
        await page.getByTestId('tab-container-add-list').click();
        const listNameBefore = await page.$('section.active-tab p');
        const textContentBefore = await listNameBefore?.textContent();
        // take active tab
        const dropdown = await page.$('section.active-tab div.edit-dropdown');
        // open edit modal
        await dropdown?.click();
        // edit modal
        await expect(page.getByTestId('edit-modal')).toBeVisible();
        // rename list
        await expect(page.getByTestId('rename-button')).toBeVisible();
        await page.getByTestId('rename-button').click();
        await expect(page.getByTestId('rename-input')).toBeVisible();
        await page.getByTestId('rename-input').fill(randomBytes(2).toString('hex'));
        await expect(page.getByTestId('confirm-rename')).toBeVisible();
        await page.getByTestId('confirm-rename').click();
        // see list with new name
        const listName = await page.$('section.active-tab p');
        const textContent = await listName?.textContent();
        expect(textContent).not.toBe(textContentBefore);
        // open edit modal
        await dropdown?.click();
        // edit modal
        await expect(page.getByTestId('edit-modal')).toBeVisible();
        // remove list
        await expect(page.getByTestId('remove-button')).toBeVisible();
        await page.getByTestId('remove-button').click();
        // confirmation panel
        await page.getByRole('button', { name: 'Delete' }).click();
    });

});