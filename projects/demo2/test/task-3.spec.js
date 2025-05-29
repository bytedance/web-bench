const { test, expect } = require('@playwright/test');

test.describe('Task 3: Login Button Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should show alert when username is empty and password is filled', async ({ page }) => {
    const passwordInput = page.locator('#password');
    const loginButton = page.locator('#login');
    
    // Fill only password field
    await passwordInput.fill('somepassword');
    
    // Set up alert handler to capture dialog behavior
    let alertTriggered = false;
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertTriggered = true;
      alertMessage = dialog.message();
      await dialog.accept();
    });
    
    // Click login button and test validation behavior
    await loginButton.click();
    
    // Wait for alert to be processed
    await page.waitForTimeout(100);
    
    // Verify alert was triggered and has expected message
    expect(alertTriggered).toBe(true);
    expect(alertMessage).toBe('Invalid user');
  });

  test('should show alert when password is empty and username is filled', async ({ page }) => {
    const userInput = page.locator('#user');
    const loginButton = page.locator('#login');
    
    // Fill only username field
    await userInput.fill('validuser');
    
    // Set up alert handler to capture dialog behavior
    let alertTriggered = false;
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertTriggered = true;
      alertMessage = dialog.message();
      await dialog.accept();
    });
    
    // Click login button and test validation behavior
    await loginButton.click();
    
    // Wait for alert to be processed
    await page.waitForTimeout(100);
    
    // Verify alert behavior
    expect(alertTriggered).toBe(true);
    expect(alertMessage).toBe('Invalid password');
  });

  test('should show success alert when both fields are filled', async ({ page }) => {
    const userInput = page.locator('#user');
    const passwordInput = page.locator('#password');
    const loginButton = page.locator('#login');
    
    // Fill both fields with valid content
    await userInput.fill('validuser');
    await passwordInput.fill('validpass');
    
    // Set up alert handler to capture success behavior
    let alertTriggered = false;
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertTriggered = true;
      alertMessage = dialog.message();
      await dialog.accept();
    });
    
    // Click login button and test success behavior
    await loginButton.click();
    
    // Wait for alert to be processed
    await page.waitForTimeout(100);
    
    // Verify success behavior
    expect(alertTriggered).toBe(true);
    expect(alertMessage).toBe('Login successfully');
  });

  test('should prioritize user validation when both fields are empty', async ({ page }) => {
    const loginButton = page.locator('#login');
    
    // Set up alert handler to test validation priority
    let alertTriggered = false;
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertTriggered = true;
      alertMessage = dialog.message();
      await dialog.accept();
    });
    
    // Click login button without filling any field
    await loginButton.click();
    
    // Wait for alert to be processed
    await page.waitForTimeout(100);
    
    // Should check user first based on validation priority logic
    expect(alertTriggered).toBe(true);
    expect(alertMessage).toBe('Invalid user');
  });

  test('should handle login attempts with various input scenarios', async ({ page }) => {
    const userInput = page.locator('#user');
    const passwordInput = page.locator('#password');
    const loginButton = page.locator('#login');
    
    // Test with minimal valid input (single character)
    await userInput.fill('a');
    await passwordInput.fill('1');
    
    // Set up alert handler
    let alertTriggered = false;
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertTriggered = true;
      alertMessage = dialog.message();
      await dialog.accept();
    });
    
    // Click login button
    await loginButton.click();
    
    // Wait for alert to be processed
    await page.waitForTimeout(100);
    
    // Should show success for any non-empty input
    expect(alertTriggered).toBe(true);
    expect(alertMessage).toBe('Login successfully');
    
    // Reset alert state for next test
    alertTriggered = false;
    alertMessage = '';
    
    // Test with whitespace-only username
    await userInput.fill('   ');  // spaces only
    await passwordInput.fill('validpass');
    
    // Click login button
    await loginButton.click();
    await page.waitForTimeout(100);
    
    // Should still show success (whitespace is considered content)
    expect(alertTriggered).toBe(true);
    expect(alertMessage).toBe('Login successfully');
  });
});