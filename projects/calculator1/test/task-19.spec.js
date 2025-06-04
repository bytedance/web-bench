const { test, expect } = require('@playwright/test');

test.describe('Task 19: Style memory and clicks display elements with monospace font and background', () => {
  test('should have memory element with monospace font and proper styling', async ({ page }) => {
    await page.goto('/index.html');
    
    const memoryElement = page.locator('#memory');
    const styles = await memoryElement.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        fontFamily: style.fontFamily,
        backgroundColor: style.backgroundColor,
        padding: style.padding,
        borderRadius: style.borderRadius,
        textAlign: style.textAlign,
        minWidth: style.minWidth
      };
    });
    
    expect(styles.fontFamily).toContain('monospace');
    expect(styles.backgroundColor).toBe('rgba(0, 0, 0, 0.1)');
    expect(styles.padding).toBe('4px 8px');
    expect(styles.borderRadius).toBe('3px');
    expect(styles.textAlign).toBe('right');
    expect(styles.minWidth).toBe('50px');
  });

  test('should have clicks element with proper styling', async ({ page }) => {
    await page.goto('/index.html');
    
    const clicksElement = page.locator('#clicks');
    const styles = await clicksElement.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        fontFamily: style.fontFamily,
        backgroundColor: style.backgroundColor,
        padding: style.padding,
        borderRadius: style.borderRadius,
        width: style.width
      };
    });
    
    expect(styles.fontFamily).toContain('monospace');
    expect(styles.backgroundColor).toBe('rgba(0, 0, 0, 0.1)');
    expect(styles.padding).toBe('4px 8px');
    expect(styles.borderRadius).toBe('3px');
    expect(styles.width).toBe('180px');
  });

  test('should have proper dark mode variants', async ({ page }) => {
    await page.goto('/index.html');
    
    // Calculator starts in dark mode by default
    const memoryElement = page.locator('.dark-mode #memory');
    const clicksElement = page.locator('.dark-mode #clicks');
    
    const memoryBackground = await memoryElement.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    const clicksBackground = await clicksElement.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    expect(memoryBackground).toBe('rgba(255, 255, 255, 0.1)');
    expect(clicksBackground).toBe('rgba(255, 255, 255, 0.1)');
  });
});
