const { test, expect } = require('@playwright/test');

test.describe('Task 1: Login Form Elements', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('file://' + __dirname + '/../src/index.html');
    });

    test('should have user input with id "user"', async ({ page }) => {
        const userInput = page.locator('#user');
        await expect(userInput).toBeVisible();
        await expect(userInput).toHaveAttribute('type', 'text');
    });

    test('should have password input with id "password"', async ({ page }) => {
        const passwordInput = page.locator('#password');
        await expect(passwordInput).toBeVisible();
        await expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('should have login button with id "login"', async ({ page }) => {
        const loginButton = page.locator('#login');
        await expect(loginButton).toBeVisible();
        await expect(loginButton).toHaveText('Login');
    });

    test('should have reset button with id "reset"', async ({ page }) => {
        const resetButton = page.locator('#reset');
        await expect(resetButton).toBeVisible();
        await expect(resetButton).toHaveText('Reset');
    });
});