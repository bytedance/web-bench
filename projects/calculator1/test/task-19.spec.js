const { test, expect } = require('@playwright/test');

test.describe('Task 19: Scientific calculator functions', () => {
  test('should implement square root (√) operation', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    const sqrtButton = page.locator('button:has-text("√")');
    
    // Calculate square root of 9
    await page.locator('button:has-text("9")').click();
    await sqrtButton.click();
    
    const displayValue = await display.inputValue();
    expect(displayValue).toBe('3');
  });

  test('should implement square (^2) and reciprocal (1/x) operations', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    const squareButton = page.locator('button:has-text("^2")');
    const reciprocalButton = page.locator('button:has-text("1/x")');
    const clearButton = page.locator('button:has-text("Clear")');
    
    // Calculate 4 squared
    await page.locator('button:has-text("4")').click();
    await squareButton.click();
    
    let displayValue = await display.inputValue();
    expect(displayValue).toBe('16');
    
    // Clear and test reciprocal
    await clearButton.click();
    await page.locator('button:has-text("2")').click();
    await reciprocalButton.click();
    
    displayValue = await display.inputValue();
    expect(displayValue).toBe('0.5');
  });

  test('should implement pi (π) and trigonometric functions', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    const piButton = page.locator('button:has-text("π")');
    const sinButton = page.locator('button:has-text("sin")');
    const cosButton = page.locator('button:has-text("cos")');
    const clearButton = page.locator('button:has-text("Clear")');
    
    // Test pi insertion
    await piButton.click();
    let displayValue = await display.inputValue();
    expect(parseFloat(displayValue)).toBeCloseTo(Math.PI, 5);
    
    // Clear and test sin(0)
    await clearButton.click();
    await page.locator('button:has-text("0")').click();
    await sinButton.click();
    displayValue = await display.inputValue();
    expect(parseFloat(displayValue)).toBeCloseTo(0, 5);
    
    // Clear and test cos(0)
    await clearButton.click();
    await page.locator('button:has-text("0")').click();
    await cosButton.click();
    displayValue = await display.inputValue();
    expect(parseFloat(displayValue)).toBeCloseTo(1, 5);
  });

  test('should handle mathematical errors properly', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    const reciprocalButton = page.locator('button:has-text("1/x")');
    const clearButton = page.locator('button:has-text("Clear")');
    
    // Test division by zero error
    await page.locator('button:has-text("0")').click();
    await reciprocalButton.click();
    
    const displayValue = await display.inputValue();
    expect(displayValue).toBe('Error');
    
    // Clear should reset from error state
    await clearButton.click();
    const clearedValue = await display.inputValue();
    expect(clearedValue).toBe('');
  });
});
