const { test, expect } = require('@playwright/test');

test.describe('Task 13: Implement dark mode styling for memory buttons', () => {
  test('should have darker green background for memory buttons in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Calculator starts in dark mode by default
    const memoryButton = page.locator('.dark-mode .buttons button.memory-btn').first();
    const backgroundColor = await memoryButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    expect(backgroundColor).toBe('rgb(46, 125, 50)'); // #2e7d32
  });

  test('should maintain white text color in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const memoryButton = page.locator('.dark-mode .buttons button.memory-btn').first();
    const color = await memoryButton.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    
    expect(color).toBe('rgb(255, 255, 255)'); // white
  });

  test('should have appropriate hover effects in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const memoryButton = page.locator('.dark-mode .buttons button.memory-btn').first();
    await memoryButton.hover();
    
    const hoverBackgroundColor = await memoryButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    expect(hoverBackgroundColor).toBe('rgb(56, 142, 60)'); // #388e3c
  });
});
