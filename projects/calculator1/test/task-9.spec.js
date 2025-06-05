const { test, expect } = require('@playwright/test');

test.describe('Task 9: Pi button and error handling', () => {
  test('Test case 1: Pi button replaces display with Math.PI', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    const piButton = page.locator('text=π');
    
    // Input some value first
    await page.locator('text=5').click();
    await expect(display).toHaveValue('5');
    
    // Click pi button - should replace the value
    await piButton.click();
    const displayValue = await display.inputValue();
    expect(parseFloat(displayValue)).toBeCloseTo(Math.PI, 10);
  });

  test('Test case 2: Error handling for invalid operations', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    const reciprocalButton = page.locator('text=1/x');
    
    // Test division by zero error
    await page.locator('text=0').click();
    await reciprocalButton.click();
    await expect(display).toHaveValue('Error');
    
    // Clear and test another error case
    await page.locator('text=Clear').click();
    await page.locator('text=√').click(); // Square root of empty should show error
    await expect(display).toHaveValue('Error');
  });

  test('Test case 3: Error state can be cleared', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    const clearButton = page.locator('text=Clear');
    
    // Create an error state
    await page.locator('text=0').click();
    await page.locator('text=1/x').click();
    await expect(display).toHaveValue('Error');
    
    // Clear the error
    await clearButton.click();
    await expect(display).toHaveValue('');
    
    // Verify calculator works normally after clearing error
    await page.locator('text=5').click();
    await expect(display).toHaveValue('5');
  });
});
