const { test, expect } = require('@playwright/test');

test.describe('Task 2: Reset Button Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3211');
  });

  test('should clear username field when Reset button is clicked', async ({ page }) => {
    const userInput = page.locator('#user');
    const resetButton = page.locator('#reset');
    
    // Fill the username field
    await userInput.fill('testuser');
    await expect(userInput).toHaveValue('testuser');
    
    // Click reset button
    await resetButton.click();
    
    // Check if field is cleared
    await expect(userInput).toHaveValue('');
  });

  test('should clear password field when Reset button is clicked', async ({ page }) => {
    const passwordInput = page.locator('#password');
    const resetButton = page.locator('#reset');
    
    // Fill the password field
    await passwordInput.fill('testpass');
    await expect(passwordInput).toHaveValue('testpass');
    
    // Click reset button
    await resetButton.click();
    
    // Check if field is cleared
    await expect(passwordInput).toHaveValue('');
  });

  test('should clear both fields when Reset button is clicked', async ({ page }) => {
    const userInput = page.locator('#user');
    const passwordInput = page.locator('#password');
    const resetButton = page.locator('#reset');
    
    // Fill both fields
    await userInput.fill('testuser');
    await passwordInput.fill('testpass');
    
    // Verify both fields have values
    await expect(userInput).toHaveValue('testuser');
    await expect(passwordInput).toHaveValue('testpass');
    
    // Click reset button
    await resetButton.click();
    
    // Check if both fields are cleared
    await expect(userInput).toHaveValue('');
    await expect(passwordInput).toHaveValue('');
  });

  test('should work when fields are already empty', async ({ page }) => {
    const userInput = page.locator('#user');
    const passwordInput = page.locator('#password');
    const resetButton = page.locator('#reset');
    
    // Ensure fields are empty initially
    await expect(userInput).toHaveValue('');
    await expect(passwordInput).toHaveValue('');
    
    // Click reset button
    await resetButton.click();
    
    // Fields should still be empty
    await expect(userInput).toHaveValue('');
    await expect(passwordInput).toHaveValue('');
  });

  test('should reset after partial input', async ({ page }) => {
    const userInput = page.locator('#user');
    const passwordInput = page.locator('#password');
    const resetButton = page.locator('#reset');
    
    // Fill only username
    await userInput.fill('onlyuser');
    await expect(userInput).toHaveValue('onlyuser');
    await expect(passwordInput).toHaveValue('');
    
    // Click reset button
    await resetButton.click();
    
    // Both should be empty
    await expect(userInput).toHaveValue('');
    await expect(passwordInput).toHaveValue('');
  });
});