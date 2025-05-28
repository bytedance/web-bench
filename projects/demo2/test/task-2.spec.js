const { test, expect } = require('@playwright/test');

test.describe('Task 2: Reset Button Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('file://' + __dirname + '/../src/index.html');
    });

    test('should clear user and password inputs when reset button is clicked', async ({ page }) => {
        const userInput = page.locator('#user');
        const passwordInput = page.locator('#password');
        const resetButton = page.locator('#reset');

        // Fill inputs with test data
        await userInput.fill('testuser');
        await passwordInput.fill('testpassword');

        // Verify inputs have values
        await expect(userInput).toHaveValue('testuser');
        await expect(passwordInput).toHaveValue('testpassword');

        // Click reset button
        await resetButton.click();

        // Verify inputs are cleared
        await expect(userInput).toHaveValue('');
        await expect(passwordInput).toHaveValue('');
    });
});