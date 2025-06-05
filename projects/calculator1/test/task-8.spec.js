const { test, expect } = require('@playwright/test');

test.describe('Task 8: Scientific operations implementation', () => {
  test('Test case 1: Square root operation works correctly', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    const sqrtButton = page.locator('button:has-text("√")');
    
    // Input 9 and calculate square root
    await page.locator('.buttons button:has-text("9")').click();
    await expect(display).toHaveValue('9');
    
    await sqrtButton.click();
    await expect(display).toHaveValue('3');
    
    // Test with decimal - use nth-child(9) for button "1"
    await page.locator('button:has-text("Clear")').click();
    await page.locator('.buttons button:nth-child(9)').click(); // button "1"
    await page.locator('.buttons button:has-text("6")').click();
    await sqrtButton.click();
    await expect(display).toHaveValue('4');
  });

  test('Test case 2: Square operation works correctly', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    const squareButton = page.locator('button:has-text("^2")');
    
    // Input 5 and calculate square
    await page.locator('.buttons button:has-text("5")').click();
    await expect(display).toHaveValue('5');
    
    await squareButton.click();
    await expect(display).toHaveValue('25');
    
    // Test with another number
    await page.locator('button:has-text("Clear")').click();
    await page.locator('.buttons button:has-text("3")').click();
    await squareButton.click();
    await expect(display).toHaveValue('9');
  });

  test('Test case 3: Reciprocal operation works correctly', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    const reciprocalButton = page.locator('button:has-text("1/x")');
    
    // Input 4 and calculate reciprocal
    await page.locator('.buttons button:has-text("4")').click();
    await expect(display).toHaveValue('4');
    
    await reciprocalButton.click();
    await expect(display).toHaveValue('0.25');
    
    // Test error case with zero
    await page.locator('button:has-text("Clear")').click();
    await page.locator('.buttons button:has-text("0")').click();
    await reciprocalButton.click();
    await expect(display).toHaveValue('Error');
  });
});
