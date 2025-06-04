const { test, expect } = require('@playwright/test');

test.describe('Task 12: Create distinctive styling for memory function buttons', () => {
  test('should have green background for memory buttons', async ({ page }) => {
    await page.goto('/index.html');
    
    const memoryButton = page.locator('.buttons button.memory-btn').first();
    const backgroundColor = await memoryButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    expect(backgroundColor).toBe('rgb(76, 175, 80)'); // #4caf50
  });

  test('should have white text on memory buttons', async ({ page }) => {
    await page.goto('/index.html');
    
    const memoryButton = page.locator('.buttons button.memory-btn').first();
    const color = await memoryButton.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    
    expect(color).toBe('rgb(255, 255, 255)'); // white
  });

  test('should have hover effects on memory buttons', async ({ page }) => {
    await page.goto('/index.html');
    
    const memoryButton = page.locator('.buttons button.memory-btn').first();
    await memoryButton.hover();
    
    const hoverBackgroundColor = await memoryButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    expect(hoverBackgroundColor).toBe('rgb(69, 160, 73)'); // #45a049
  });
});
