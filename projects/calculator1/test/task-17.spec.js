const { test, expect } = require('@playwright/test');

test.describe('Task 17: Replace inline onclick handlers with event listeners', () => {
  test('should not have onclick attributes on calculator buttons', async ({ page }) => {
    await page.goto('/index.html');
    
    const buttons = page.locator('.buttons button');
    const buttonCount = await buttons.count();
    
    // Check that no buttons have onclick attributes
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const onclickAttr = await button.getAttribute('onclick');
      expect(onclickAttr).toBeNull();
    }
  });

  test('should handle button clicks through event listeners', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    const numberButton = page.locator('button:has-text("5")');
    const operatorButton = page.locator('button:has-text("+")');
    
    // Click number button
    await numberButton.click();
    let displayValue = await display.inputValue();
    expect(displayValue).toBe('5');
    
    // Click operator button
    await operatorButton.click();
    displayValue = await display.inputValue();
    expect(displayValue).toBe('5+');
    
    // Click another number
    const anotherNumber = page.locator('button:has-text("3")');
    await anotherNumber.click();
    displayValue = await display.inputValue();
    expect(displayValue).toBe('5+3');
  });

  test('should properly extract button text content for calculations', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    const equalsButton = page.locator('button:has-text("=")');
    const clearButton = page.locator('button:has-text("Clear")');
    
    // Set up a simple calculation: 2 + 3
    await page.locator('button:has-text("2")').click();
    await page.locator('button:has-text("+")').click();
    await page.locator('button:has-text("3")').click();
    await equalsButton.click();
    
    // Should calculate correctly
    let displayValue = await display.inputValue();
    expect(displayValue).toBe('5');
    
    // Clear should work
    await clearButton.click();
    displayValue = await display.inputValue();
    expect(displayValue).toBe('');
  });
});
