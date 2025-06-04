const { test, expect } = require('@playwright/test');

test.describe('Task 5: Implement dark mode styling for display input field', () => {
  test('should have dark background in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('.dark-mode .display');
    const backgroundColor = await display.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    expect(backgroundColor).toBe('rgb(68, 68, 68)'); // #444
  });

  test('should have white text color in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('.dark-mode .display');
    const color = await display.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    
    expect(color).toBe('rgb(255, 255, 255)'); // white
  });

  test('should be functional for input and display in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('.display');
    await expect(display).toBeVisible();
    
    // Click a number button to test functionality
    const numberButton = page.locator('.buttons button').first();
    await numberButton.click();
    
    const displayValue = await display.inputValue();
    expect(displayValue).toBe('7');
  });
});
