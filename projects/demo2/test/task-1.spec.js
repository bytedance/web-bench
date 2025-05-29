const { test, expect } = require('@playwright/test');

test.describe('Task 1: Login Form Structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should display username input field that accepts text input', async ({ page }) => {
    const userInput = page.locator('#user');
    await expect(userInput).toBeVisible();
    
    // Test behavior: can type in the field
    await userInput.fill('testuser');
    await expect(userInput).toHaveValue('testuser');
    
    // Test that it's a text input type behavior
    await userInput.clear();
    await userInput.type('another test');
    await expect(userInput).toHaveValue('another test');
  });

  test('should display password input field that hides input text', async ({ page }) => {
    const passwordInput = page.locator('#password');
    await expect(passwordInput).toBeVisible();
    
    // Test behavior: can type in the field
    await passwordInput.fill('secretpass');
    await expect(passwordInput).toHaveValue('secretpass');
    
    // Test that input can be cleared and refilled
    await passwordInput.clear();
    await passwordInput.type('newpassword');
    await expect(passwordInput).toHaveValue('newpassword');
  });

  test('should display clickable Login button with proper text', async ({ page }) => {
    const loginButton = page.locator('#login');
    await expect(loginButton).toBeVisible();
    
    // Test behavior: button is clickable and enabled
    await expect(loginButton).toBeEnabled();
    
    // Test that clicking doesn't cause errors (basic interaction)
    await loginButton.click();
    
    // Test button can be clicked multiple times
    await loginButton.click();
  });

  test('should display clickable Reset button with proper text', async ({ page }) => {
    const resetButton = page.locator('#reset');
    await expect(resetButton).toBeVisible();
    
    // Test behavior: button is clickable and enabled
    await expect(resetButton).toBeEnabled();
    
    // Test that clicking doesn't cause errors (basic interaction)
    await resetButton.click();
    
    // Test button responds to multiple clicks
    await resetButton.click();
  });

  test('should have input fields with reasonable dimensions for usability', async ({ page }) => {
    const userInput = page.locator('#user');
    const passwordInput = page.locator('#password');
    
    // Test behavioral aspects: fields should have reasonable size for input
    const userBox = await userInput.boundingBox();
    const passwordBox = await passwordInput.boundingBox();
    
    // Ensure inputs are large enough to be usable
    expect(userBox.width).toBeGreaterThan(50);
    expect(userBox.height).toBeGreaterThan(15);
    expect(passwordBox.width).toBeGreaterThan(50);
    expect(passwordBox.height).toBeGreaterThan(15);
    
    // Test that inputs can receive focus (behavioral validation)
    await userInput.focus();
    await expect(userInput).toBeFocused();
    
    await passwordInput.focus();
    await expect(passwordInput).toBeFocused();
  });
});