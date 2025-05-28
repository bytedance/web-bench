const { test, expect } = require('@playwright/test');

test.describe('Task 3: Login Button Validation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('file://' + __dirname + '/../src/index.html');
    });

    test('should show "Invalid user" alert when user input is empty', async ({ page }) => {
        const passwordInput = page.locator('#password');
        const loginButton = page.locator('#login');

        // Fill password but leave user empty
        await passwordInput.fill('testpassword');

        // Set up alert handler
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Invalid user');
            await dialog.accept();
        });

        // Click login button
        await loginButton.click();
    });

    test('should show "Invalid password" alert when password input is empty', async ({ page }) => {
        const userInput = page.locator('#user');
        const loginButton = page.locator('#login');

        // Fill user but leave password empty
        await userInput.fill('testuser');

        // Set up alert handler
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Invalid password');
            await dialog.accept();
        });

        // Click login button
        await loginButton.click();
    });

    test('should show "Login successfully" alert when both inputs have values', async ({ page }) => {
        const userInput = page.locator('#user');
        const passwordInput = page.locator('#password');
        const loginButton = page.locator('#login');

        // Fill both inputs
        await userInput.fill('testuser');
        await passwordInput.fill('testpassword');

        // Set up alert handler
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Login successfully');
            await dialog.accept();
        });

        // Click login button
        await loginButton.click();
    });

    test('should show "Invalid user" alert when user input contains only whitespace', async ({ page }) => {
        const userInput = page.locator('#user');
        const passwordInput = page.locator('#password');
        const loginButton = page.locator('#login');

        // Fill user with whitespace and password with valid value
        await userInput.fill('   ');
        await passwordInput.fill('testpassword');

        // Set up alert handler
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Invalid user');
            await dialog.accept();
        });

        // Click login button
        await loginButton.click();
    });

    test('should show "Invalid password" alert when password input contains only whitespace', async ({ page }) => {
        const userInput = page.locator('#user');
        const passwordInput = page.locator('#password');
        const loginButton = page.locator('#login');

        // Fill user with valid value and password with whitespace
        await userInput.fill('testuser');
        await passwordInput.fill('   ');

        // Set up alert handler
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Invalid password');
            await dialog.accept();
        });

        // Click login button
        await loginButton.click();
    });
});