const { test, expect } = require('@playwright/test');

test.describe('Task 9: Add hover effects for operator buttons in light mode', () => {
  test('should change to lighter gold on hover', async ({ page }) => {
    await page.goto('/index.html');
    
    // Toggle to light mode first
    const toggleButton = page.locator('#toggle');
    await toggleButton.click();
    
    const operatorButton = page.locator('.buttons button:nth-child(4)');
    await operatorButton.hover();
    
    const hoverBackgroundColor = await operatorButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    expect(hoverBackgroundColor).toBe('rgb(255, 237, 74)'); // #ffed4a
  });

  test('should have hover effects on multiple operator buttons', async ({ page }) => {
    await page.goto('/index.html');
    
    // Toggle to light mode first
    const toggleButton = page.locator('#toggle');
    await toggleButton.click();
    
    const operatorSelectors = [
      '.buttons button:nth-child(8)',
      '.buttons button:nth-child(12)'
    ];
    
    for (const selector of operatorSelectors) {
      const button = page.locator(selector);
      if (await button.count() > 0) {
        await button.hover();
        
        const hoverColor = await button.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });
        
        expect(hoverColor).toBe('rgb(255, 237, 74)'); // #ffed4a
      }
    }
  });

  test('should maintain hover functionality with smooth transitions', async ({ page }) => {
    await page.goto('/index.html');
    
    // Toggle to light mode first
    const toggleButton = page.locator('#toggle');
    await toggleButton.click();
    
    const operatorButton = page.locator('.buttons button:nth-child(16)');
    
    // Check transition property is maintained
    const transitionProperty = await operatorButton.evaluate((el) => {
      return window.getComputedStyle(el).transition;
    });
    
    expect(transitionProperty).toContain('0.3s');
    
    // Test hover state change
    await operatorButton.hover();
    await page.waitForTimeout(100); // Allow transition to take effect
    
    const isHovered = await operatorButton.evaluate((el) => {
      return el.matches(':hover');
    });
    
    expect(isHovered).toBe(true);
  });
});
