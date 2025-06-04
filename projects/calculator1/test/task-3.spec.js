const { test, expect } = require('@playwright/test');

test.describe('Task 3: Dark mode styling for calculator container', () => {
  test('should have white background in light mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    const toggleButton = page.locator('#toggle');
    
    // Switch to light mode (initially in dark mode)
    await toggleButton.click();
    await page.waitForTimeout(300); // Wait for transition
    
    const backgroundColor = await calculator.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Should be white background in light mode
    expect(backgroundColor).toBe('rgb(255, 255, 255)');
  });

  test('should have dark background in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    
    // Initially in dark mode
    const backgroundColor = await calculator.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Should be dark background (#333 = rgb(51, 51, 51))
    expect(backgroundColor).toBe('rgb(51, 51, 51)');
  });

  test('should have different border colors for light and dark modes', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    const toggleButton = page.locator('#toggle');
    
    // Get dark mode border color
    const darkBorderColor = await calculator.evaluate(el => {
      return window.getComputedStyle(el).borderColor;
    });
    
    // Switch to light mode
    await toggleButton.click();
    await page.waitForTimeout(300);
    
    // Get light mode border color
    const lightBorderColor = await calculator.evaluate(el => {
      return window.getComputedStyle(el).borderColor;
    });
    
    // Border colors should be different
    expect(darkBorderColor).not.toBe(lightBorderColor);
    
    // Dark mode should have darker border (#666 = rgb(102, 102, 102))
    expect(darkBorderColor).toBe('rgb(102, 102, 102)');
  });
});
