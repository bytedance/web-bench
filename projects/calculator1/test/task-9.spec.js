const { test, expect } = require('@playwright/test');

test.describe('Task 9: Memory function buttons with special styling', () => {
  test('should have all memory buttons with proper styling', async ({ page }) => {
    await page.goto('/index.html');
    
    const memoryButtons = ['MR', 'M+', 'M-', 'MC'];
    
    for (const buttonText of memoryButtons) {
      const button = page.locator(`button:has-text("${buttonText}")`);
      await expect(button).toBeVisible();
      
      // Check if button has memory-btn class styling
      const styles = await button.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color
        };
      });
      
      // Should have green background and white text
      expect(styles.backgroundColor).toBe('rgb(46, 125, 50)'); // Dark mode green
      expect(styles.color).toBe('rgb(255, 255, 255)'); // white
    }
  });

  test('should have proper hover effects for memory buttons', async ({ page }) => {
    await page.goto('/index.html');
    
    const memoryButton = page.locator('button:has-text("MR")');
    
    // Get initial background
    const initialBg = await memoryButton.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Hover and check color change
    await memoryButton.hover();
    await page.waitForTimeout(100);
    
    const hoverBg = await memoryButton.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Hover should change the background color
    expect(hoverBg).not.toBe(initialBg);
  });

  test('should have different styling in light mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const toggleButton = page.locator('#toggle');
    
    // Switch to light mode
    await toggleButton.click();
    await page.waitForTimeout(300);
    
    const memoryButton = page.locator('button:has-text("MR")');
    
    const styles = await memoryButton.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color
      };
    });
    
    // Light mode should have different green color
    expect(styles.backgroundColor).toBe('rgb(76, 175, 80)'); // Light mode green
    expect(styles.color).toBe('rgb(255, 255, 255)'); // white
  });
});
