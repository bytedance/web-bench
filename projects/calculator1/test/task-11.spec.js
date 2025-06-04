const { test, expect } = require('@playwright/test');

test.describe('Task 11: Add hover effects for operator buttons in dark mode', () => {
  test('should change to lighter orange on hover in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Calculator starts in dark mode by default
    const operatorButton = page.locator('.dark-mode .buttons button:nth-child(4)');
    await operatorButton.hover();
    
    const hoverBackgroundColor = await operatorButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    expect(hoverBackgroundColor).toBe('rgb(255, 165, 0)'); // #ffa500
  });

  test('should maintain white text color on hover in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const operatorButton = page.locator('.dark-mode .buttons button:nth-child(8)');
    await operatorButton.hover();
    
    const hoverTextColor = await operatorButton.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    
    expect(hoverTextColor).toBe('rgb(255, 255, 255)'); // white
  });

  test('should have hover effects on all operator buttons in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const operatorSelectors = [
      '.dark-mode .buttons button:nth-child(12)',
      '.dark-mode .buttons button:nth-child(16)'
    ];
    
    for (const selector of operatorSelectors) {
      const button = page.locator(selector);
      if (await button.count() > 0) {
        await button.hover();
        await page.waitForTimeout(50); // Allow hover effect to apply
        
        const hoverColor = await button.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });
        
        expect(hoverColor).toBe('rgb(255, 165, 0)'); // #ffa500
      }
    }
  });
});
