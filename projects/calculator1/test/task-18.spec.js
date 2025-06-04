const { test, expect } = require('@playwright/test');

test.describe('Task 18: Style memory and clicks panels with proper layout and dark mode support', () => {
  test('should have memory panel with proper flexbox layout', async ({ page }) => {
    await page.goto('/index.html');
    
    const memoryPanel = page.locator('.memory-panel');
    const styles = await memoryPanel.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        padding: style.padding,
        fontSize: style.fontSize,
        display: style.display,
        justifyContent: style.justifyContent,
        alignItems: style.alignItems
      };
    });
    
    expect(styles.padding).toBe('10px');
    expect(styles.fontSize).toBe('16px');
    expect(styles.display).toBe('flex');
    expect(styles.justifyContent).toBe('space-between');
    expect(styles.alignItems).toBe('center');
  });

  test('should have clicks panel with proper flexbox layout', async ({ page }) => {
    await page.goto('/index.html');
    
    const clicksPanel = page.locator('.clicks-panel');
    const styles = await clicksPanel.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        padding: style.padding,
        fontSize: style.fontSize,
        display: style.display,
        justifyContent: style.justifyContent,
        alignItems: style.alignItems
      };
    });
    
    expect(styles.padding).toBe('10px');
    expect(styles.fontSize).toBe('16px');
    expect(styles.display).toBe('flex');
    expect(styles.justifyContent).toBe('space-between');
    expect(styles.alignItems).toBe('center');
  });

  test('should have proper dark mode styling for panels', async ({ page }) => {
    await page.goto('/index.html');
    
    // Calculator starts in dark mode by default
    const memoryPanel = page.locator('.dark-mode .memory-panel');
    const clicksPanel = page.locator('.dark-mode .clicks-panel');
    
    const memoryColor = await memoryPanel.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    
    const clicksColor = await clicksPanel.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    
    expect(memoryColor).toBe('rgb(255, 255, 255)'); // white
    expect(clicksColor).toBe('rgb(255, 255, 255)'); // white
  });
});
