const { test, expect } = require('@playwright/test');

test.describe('Task 3: Implement dark mode styling for calculator container', () => {
  test('should have dark mode class applied to calculator', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    await expect(calculator).toHaveClass(/dark-mode/);
  });

  test('should have dark background in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator.dark-mode');
    const backgroundColor = await calculator.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    expect(backgroundColor).toBe('rgb(51, 51, 51)'); // #333
  });

  test('should have darker border color in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator.dark-mode');
    const borderColor = await calculator.evaluate((el) => {
      return window.getComputedStyle(el).borderColor;
    });
    
    expect(borderColor).toBe('rgb(102, 102, 102)'); // #666
  });
});
