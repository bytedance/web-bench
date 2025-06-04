const { test, expect } = require('@playwright/test');

test.describe('Task 7: Implement dark mode styling for calculator buttons', () => {
  test('should have dark background for buttons in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const button = page.locator('.dark-mode button').first();
    const backgroundColor = await button.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    expect(backgroundColor).toBe('rgb(68, 68, 68)'); // #444
  });

  test('should have white text color in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const button = page.locator('.dark-mode button').first();
    const color = await button.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    
    expect(color).toBe('rgb(255, 255, 255)'); // white
  });

  test('should have darker borders in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const button = page.locator('.dark-mode button').first();
    const borderColor = await button.evaluate((el) => {
      return window.getComputedStyle(el).borderColor;
    });
    
    expect(borderColor).toBe('rgb(102, 102, 102)'); // #666
  });
});
