const { test, expect } = require('@playwright/test');

test.describe('Task 2: Reset Button Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3211');
  });

  test('should clear username field when Reset button is clicked', async ({ page }) => {
    const userInput = page.locator('#user');
    const resetButton = page.locator('#reset');
    
    // Fill the username field and verify it has content
    await userInput.fill('testuser');
    await expect(userInput).toHaveValue('testuser');
    
    // Click reset and verify field is cleared
    await resetButton.click();
    await expect(userInput).toHaveValue('');
  });

  test('should clear password field when Reset button is clicked', async ({ page }) => {
    const passwordInput = page.locator('#password');
    const resetButton = page.locator('#reset');
    
    // Fill the password field and verify it has content
    await passwordInput.fill('mypassword');
    await expect(passwordInput).toHaveValue('mypassword');
    
    // Click reset and verify field is cleared
    await resetButton.click();
    await expect(passwordInput).toHaveValue('');
  });

  test('should clear both fields simultaneously when Reset is clicked', async ({ page }) => {
    const userInput = page.locator('#user');
    const passwordInput = page.locator('#password');
    const resetButton = page.locator('#reset');
    
    // Fill both fields with different content
    await userInput.fill('admin');
    await passwordInput.fill('admin123');
    
    // Verify both fields have content
    await expect(userInput).toHaveValue('admin');
    await expect(passwordInput).toHaveValue('admin123');
    
    // Single reset click should clear both
    await resetButton.click();
    await expect(userInput).toHaveValue('');
    await expect(passwordInput).toHaveValue('');
  });

  test('should handle multiple reset clicks without errors', async ({ page }) => {
    const userInput = page.locator('#user');
    const passwordInput = page.locator('#password');
    const resetButton = page.locator('#reset');
    
    // Fill fields
    await userInput.fill('user1');
    await passwordInput.fill('pass1');
    
    // Multiple reset clicks
    await resetButton.click();
    await resetButton.click();
    await resetButton.click();
    
    // Should still be empty and functional
    await expect(userInput).toHaveValue('');
    await expect(passwordInput).toHaveValue('');
    
    // Should still be able to input after multiple resets
    await userInput.fill('newuser');
    await expect(userInput).toHaveValue('newuser');
  });

  test('should work with various input lengths and special characters', async ({ page }) => {
    const userInput = page.locator('#user');
    const passwordInput = page.locator('#password');
    const resetButton = page.locator('#reset');
    
    // Fill with long text and special characters
    const longUser = 'very_long_username_with_special_chars_123!@#$%';
    const complexPass = 'C0mpl3x_P@ssw0rd_W1th_Symb0ls!@#$%^&*()';
    
    await userInput.fill(longUser);
    await passwordInput.fill(complexPass);
    
    // Verify content
    await expect(userInput).toHaveValue(longUser);
    await expect(passwordInput).toHaveValue(complexPass);
    
    // Reset should clear everything
    await resetButton.click();
    await expect(userInput).toHaveValue('');
    await expect(passwordInput).toHaveValue('');
  });
});