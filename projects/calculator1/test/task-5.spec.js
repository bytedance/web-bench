const { test, expect } = require('@playwright/test');

test.describe('Task 5: Comprehensive dark mode styling for buttons', () => {
  test('should have transition effects on all buttons', async ({ page }) => {
    await page.goto('/index.html');
    
    const buttons = page.locator('.buttons button');
    const buttonCount = await buttons.count();
    
    // Check first few buttons for transition property
    for (let i = 0; i < Math.min(5, buttonCount); i++) {
      const button = buttons.nth(i);
      const transition = await button.evaluate(el => {
        return window.getComputedStyle(el).transition;
      });
      
      expect(transition).toContain('all');
      expect(transition).toContain('0.3s');
      expect(transition).toContain('ease');
    }
  });

  test('should have proper button styling in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Get a regular number button (not operator or memory)
    const numberButton = page.locator('.buttons button').first();
    
    const styles = await numberButton.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        borderColor: computed.borderColor
      };
    });
    
    expect(styles.backgroundColor).toBe('rgb(68, 68, 68)'); // #444
    expect(styles.color).toBe('rgb(255, 255, 255)'); // white
    expect(styles.borderColor).toBe('rgb(102, 102, 102)'); // #666
  });

  test('should have proper button hover states', async ({ page }) => {
    await page.goto('/index.html');
    
    const numberButton = page.locator('.buttons button').first();
    
    // Get initial background color
    const initialBg = await numberButton.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Hover over the button
    await numberButton.hover();
    await page.waitForTimeout(100);
    
    // Get hover background color
    const hoverBg = await numberButton.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // In dark mode, hover should make button lighter
    expect(hoverBg).not.toBe(initialBg);
  });
});
