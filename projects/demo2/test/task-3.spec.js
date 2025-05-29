const { test, expect } = require('@playwright/test');

test.describe('Task 3: Login Button Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3211');
  });

  test('should show "Invalid user" alert when username is empty', async ({ page }) => {
    const passwordInput = page.locator('#password');
    const loginButton = page.locator('#login');
    
    // Fill only password field
    await passwordInput.fill('testpass');
    
    // Set up alert handler
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });
    
    // Click login button
    await loginButton.click();
    
    // Wait a moment for alert to be handled
    await page.waitForTimeout(100);
    
    // Check alert message
    expect(alertMessage).toBe('Invalid user');
  });

  test('should show "Invalid password" alert when password is empty', async ({ page }) => {
    const userInput = page.locator('#user');
    const loginButton = page.locator('#login');
    
    // Fill only username field
    await userInput.fill('testuser');
    
    // Set up alert handler
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });
    
    // Click login button
    await loginButton.click();
    
    // Wait a moment for alert to be handled
    await page.waitForTimeout(100);
    
    // Check alert message
    expect(alertMessage).toBe('Invalid password');
  });

  test('should show "Login successfully" alert when both fields are filled', async ({ page }) => {
    const userInput = page.locator('#user');
    const passwordInput = page.locator('#password');
    const loginButton = page.locator('#login');
    
    // Fill both fields
    await userInput.fill('testuser');
    await passwordInput.fill('testpass');
    
    // Set up alert handler
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });
    
    // Click login button
    await loginButton.click();
    
    // Wait a moment for alert to be handled
    await page.waitForTimeout(100);
    
    // Check alert message
    expect(alertMessage).toBe('Login successfully');
  });

  test('should show "Invalid user" alert when both fields are empty', async ({ page }) => {
    const loginButton = page.locator('#login');
    
    // Set up alert handler
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });
    
    // Click login button without filling any field
    await loginButton.click();
    
    // Wait a moment for alert to be handled
    await page.waitForTimeout(100);
    
    // Check alert message (should check user first)
    expect(alertMessage).toBe('Invalid user');
  });

  test('should validate with different input values', async ({ page }) => {
    const userInput = page.locator('#user');
    const passwordInput = page.locator('#password');
    const loginButton = page.locator('#login');
    
    // Test with single character inputs
    await userInput.fill('a');
    await passwordInput.fill('b');
    
    // Set up alert handler
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });
    
    // Click login button
    await loginButton.click();
    
    // Wait a moment for alert to be handled
    await page.waitForTimeout(100);
    
    // Should show success message
    expect(alertMessage).toBe('Login successfully');
  });
});