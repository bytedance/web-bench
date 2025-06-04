const { test, expect } = require('@playwright/test');

test.describe('Task 7: Update Clear button layout and functionality', () => {
  test('should span Clear button across 3 columns', async ({ page }) => {
    await page.goto('/index.html');
    
    const clearButton = page.locator('button:has-text("Clear")');
    
    const gridColumn = await clearButton.evaluate(el => {
      return window.getComputedStyle(el).gridColumn;
    });
    
    // Should span 3 columns
    expect(gridColumn).toBe('span 3');
  });

  test('should have Clear button text content', async ({ page }) => {
    await page.goto('/index.html');
    
    const clearButton = page.locator('button:has-text("Clear")');
    await expect(clearButton).toBeVisible();
    
    const buttonText = await clearButton.textContent();
    expect(buttonText).toBe('Clear');
  });

  test('should clear display when Clear button is clicked', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    const clearButton = page.locator('button:has-text("Clear")');
    const numberButton = page.locator('button:has-text("7")');
    
    // Enter some numbers
    await numberButton.click();
    await numberButton.click();
    
    // Check display has content
    let displayValue = await display.inputValue();
    expect(displayValue).toBe('77');
    
    // Click clear button
    await clearButton.click();
    
    // Check display is cleared
    displayValue = await display.inputValue();
    expect(displayValue).toBe('');
  });
});
