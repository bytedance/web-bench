const { test, expect } = require('@playwright/test');

test.describe('Task 9: Pi button and error handling', () => {
  test('Test case 1: Pi button replaces display with Math.PI', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    const piButton = page.locator('button:has-text("π")');
    
    // Input some value first
    await page.locator('.buttons button:has-text("5")').click();
    await expect(display).toHaveValue('5');
    
    // Click pi button - should replace the value
    await piButton.click();
    const displayValue = await display.inputValue();
    expect(parseFloat(displayValue)).toBeCloseTo(Math.PI, 10);
  });

  test('Test case 2: Error handling for invalid operations', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    const reciprocalButton = page.locator('button:has-text("1/x")');
    
    // Test division by zero error
    await page.locator('.buttons button:has-text("0")').click();
    await reciprocalButton.click();
    await expect(display).toHaveValue('Error');
    
    // Clear and test another error case - square root of empty gives NaN
    await page.locator('button:has-text("Clear")').click();
    await page.locator('button:has-text("√")').click(); // Square root of empty should show NaN
    await expect(display).toHaveValue('NaN');
  });

  test('Test case 3: Error state can be cleared', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    const clearButton = page.locator('button:has-text("Clear")');
    
    // Create an error state
    await page.locator('.buttons button:has-text("0")').click();
    await page.locator('button:has-text("1/x")').click();
    await expect(display).toHaveValue('Error');
    
    // Clear the error
    await clearButton.click();
    await expect(display).toHaveValue('');
    
    // Verify calculator works normally after clearing error
    await page.locator('.buttons button:has-text("5")').click();
    await expect(display).toHaveValue('5');
  });
});
