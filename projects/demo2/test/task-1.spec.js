const { test, expect } = require('@playwright/test');

test.describe('Task 1: Login Form Structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3211');
  });

  test('should have username input field with correct placeholder', async ({ page }) => {
    const userInput = page.locator('#user');
    await expect(userInput).toBeVisible();
    await expect(userInput).toHaveAttribute('type', 'text');
    await expect(userInput).toHaveAttribute('placeholder', 'User');
  });

  test('should have password input field with correct placeholder', async ({ page }) => {
    const passwordInput = page.locator('#password');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(passwordInput).toHaveAttribute('placeholder', 'Password');
  });

  test('should have Login button', async ({ page }) => {
    const loginButton = page.locator('#login');
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toHaveText('Login');
  });

  test('should have Reset button', async ({ page }) => {
    const resetButton = page.locator('#reset');
    await expect(resetButton).toBeVisible();
    await expect(resetButton).toHaveText('Reset');
  });

  test('should have proper styling for input fields', async ({ page }) => {
    const userInput = page.locator('#user');
    const passwordInput = page.locator('#password');
    
    // Check if inputs have margin-bottom styling
    const userMargin = await userInput.evaluate(el => getComputedStyle(el).marginBottom);
    const passwordMargin = await passwordInput.evaluate(el => getComputedStyle(el).marginBottom);
    
    expect(userMargin).toBe('5px');
    expect(passwordMargin).toBe('5px');
  });
});