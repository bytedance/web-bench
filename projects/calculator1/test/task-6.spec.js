const { test, expect } = require('@playwright/test');

test.describe('Task 6: Special styling for operator buttons', () => {
  test('should style operator buttons differently in light mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const toggleButton = page.locator('#toggle');
    
    // Switch to light mode
    await toggleButton.click();
    await page.waitForTimeout(300);
    
    // Check operator buttons (4th, 8th, 12th, 16th, 18th positions)
    const operatorPositions = [4, 8, 12, 16, 18];
    
    for (const position of operatorPositions) {
      const operatorButton = page.locator(`.buttons button:nth-child(${position})`);
      
      const styles = await operatorButton.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color
        };
      });
      
      // Golden background in light mode
      expect(styles.backgroundColor).toBe('rgb(255, 215, 0)'); // #ffd700
      expect(styles.color).toBe('rgb(0, 0, 0)'); // black
    }
  });

  test('should style operator buttons differently in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Already in dark mode by default
    const operatorPositions = [4, 8, 12, 16, 18];
    
    for (const position of operatorPositions) {
      const operatorButton = page.locator(`.buttons button:nth-child(${position})`);
      
      const styles = await operatorButton.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color
        };
      });
      
      // Orange background in dark mode
      expect(styles.backgroundColor).toBe('rgb(255, 140, 0)'); // #ff8c00
      expect(styles.color).toBe('rgb(255, 255, 255)'); // white
    }
  });

  test('should have proper hover effects for operator buttons', async ({ page }) => {
    await page.goto('/index.html');
    
    const operatorButton = page.locator('.buttons button:nth-child(4)'); // Division button
    
    // Get initial background
    const initialBg = await operatorButton.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Hover and check color change
    await operatorButton.hover();
    await page.waitForTimeout(100);
    
    const hoverBg = await operatorButton.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Hover should change the background color
    expect(hoverBg).not.toBe(initialBg);
  });
});
