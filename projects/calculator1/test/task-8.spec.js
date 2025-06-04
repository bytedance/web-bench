const { test, expect } = require('@playwright/test');

test.describe('Task 8: Style operator buttons with gold coloring in light mode', () => {
  test('should have gold background for operator buttons', async ({ page }) => {
    await page.goto('/index.html');
    
    // Toggle to light mode first
    const toggleButton = page.locator('#toggle');
    await toggleButton.click();
    
    // Test nth-child(4) - division operator
    const divButton = page.locator('.buttons button:nth-child(4)');
    const backgroundColor = await divButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    expect(backgroundColor).toBe('rgb(255, 215, 0)'); // #ffd700
  });

  test('should have black text on gold operator buttons', async ({ page }) => {
    await page.goto('/index.html');
    
    // Toggle to light mode first
    const toggleButton = page.locator('#toggle');
    await toggleButton.click();
    
    const operatorButton = page.locator('.buttons button:nth-child(8)');
    const color = await operatorButton.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    
    expect(color).toBe('rgb(0, 0, 0)'); // black
  });

  test('should style all specified operator button positions', async ({ page }) => {
    await page.goto('/index.html');
    
    // Toggle to light mode first
    const toggleButton = page.locator('#toggle');
    await toggleButton.click();
    
    const operatorSelectors = [
      '.buttons button:nth-child(4)',
      '.buttons button:nth-child(8)', 
      '.buttons button:nth-child(12)',
      '.buttons button:nth-child(16)',
      '.buttons button:nth-child(18)'
    ];
    
    for (const selector of operatorSelectors) {
      const button = page.locator(selector);
      if (await button.count() > 0) {
        const backgroundColor = await button.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });
        expect(backgroundColor).toBe('rgb(255, 215, 0)'); // #ffd700
      }
    }
  });
});
