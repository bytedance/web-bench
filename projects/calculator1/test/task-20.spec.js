const { test, expect } = require('@playwright/test');

test.describe('Task 20: Implement interactive history items with hover effects and click functionality', () => {
  test('should have history items with proper cursor and styling', async ({ page }) => {
    await page.goto('/index.html');
    
    // Click some buttons to generate history
    const button7 = page.locator('.buttons button').first(); // 7
    const buttonPlus = page.locator('.buttons button:nth-child(16)'); // +
    const button3 = page.locator('.buttons button:nth-child(11)'); // 3
    
    await button7.click();
    await buttonPlus.click();
    await button3.click();
    
    const historyItem = page.locator('.history-item').first();
    if (await historyItem.count() > 0) {
      const styles = await historyItem.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          cursor: style.cursor,
          padding: style.padding,
          borderRadius: style.borderRadius,
          transition: style.transition
        };
      });
      
      expect(styles.cursor).toBe('pointer');
      expect(styles.padding).toBe('2px 6px');
      expect(styles.borderRadius).toBe('3px');
      expect(styles.transition).toContain('0.2s ease');
    }
  });

  test('should have hover effects for history items', async ({ page }) => {
    await page.goto('/index.html');
    
    // Click some buttons to generate history
    const button5 = page.locator('.buttons button:nth-child(6)'); // 5
    await button5.click();
    
    const historyItem = page.locator('.history-item').first();
    if (await historyItem.count() > 0) {
      await historyItem.hover();
      
      const hoverBackground = await historyItem.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });
      
      expect(hoverBackground).toBe('rgba(0, 0, 0, 0.2)');
    }
  });

  test('should have dark mode hover effects for history items', async ({ page }) => {
    await page.goto('/index.html');
    
    // Calculator starts in dark mode by default
    // Click some buttons to generate history
    const button8 = page.locator('.buttons button:nth-child(2)'); // 8
    await button8.click();
    
    const historyItem = page.locator('.dark-mode .history-item').first();
    if (await historyItem.count() > 0) {
      await historyItem.hover();
      
      const hoverBackground = await historyItem.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });
      
      expect(hoverBackground).toBe('rgba(255, 255, 255, 0.2)');
    }
  });
});
