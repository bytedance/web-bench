const { test, expect } = require('@playwright/test');

test.describe('Task 1: Login Form Structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3211');
  });

  test('should display username input field that accepts text input', async ({ page }) => {
    const userInput = page.locator('#user');
    await expect(userInput).toBeVisible();
    
    // Test behavior: can type in the field
    await userInput.fill('testuser');
    await expect(userInput).toHaveValue('testuser');
  });

  test('should display password input field that hides input text', async ({ page }) => {
    const passwordInput = page.locator('#password');
    await expect(passwordInput).toBeVisible();
    
    // Test behavior: can type in the field
    await passwordInput.fill('secretpass');
    await expect(passwordInput).toHaveValue('secretpass');
  });

  test('should display clickable Login button', async ({ page }) => {
    const loginButton = page.locator('#login');
    await expect(loginButton).toBeVisible();
    
    // Test behavior: button is clickable
    await expect(loginButton).toBeEnabled();
    await loginButton.click();
  });

  test('should display clickable Reset button', async ({ page }) => {
    const resetButton = page.locator('#reset');
    await expect(resetButton).toBeVisible();
    
    // Test behavior: button is clickable
    await expect(resetButton).toBeEnabled();
    await resetButton.click();
  });

  test('should have input fields with reasonable dimensions', async ({ page }) => {
    const userInput = page.locator('#user');
    const passwordInput = page.locator('#password');
    
    // Test behavioral aspects: fields should have reasonable size for input
    const userBox = await userInput.boundingBox();
    const passwordBox = await passwordInput.boundingBox();
    
    expect(userBox.width).toBeGreaterThan(50);
    expect(userBox.height).toBeGreaterThan(15);
    expect(passwordBox.width).toBeGreaterThan(50);
    expect(passwordBox.height).toBeGreaterThan(15);
  });
});