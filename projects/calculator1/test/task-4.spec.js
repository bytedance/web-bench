const { test, expect } = require('@playwright/test');

test.describe('Task 4: Dark mode styling for display input field', () => {
  test('should have proper styling for display in light mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('.display');
    const toggleButton = page.locator('#toggle');
    
    // Switch to light mode
    await toggleButton.click();
    await page.waitForTimeout(300);
    
    const styles = await display.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        transition: computed.transition,
        boxSizing: computed.boxSizing
      };
    });
    
    expect(styles.backgroundColor).toBe('rgb(255, 255, 255)'); // white
    expect(styles.color).toBe('rgb(0, 0, 0)'); // black
    expect(styles.transition).toContain('all');
    expect(styles.boxSizing).toBe('border-box');
  });

  test('should have proper styling for display in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('.display');
    
    // Already in dark mode by default
    const styles = await display.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color
      };
    });
    
    expect(styles.backgroundColor).toBe('rgb(68, 68, 68)'); // #444
    expect(styles.color).toBe('rgb(255, 255, 255)'); // white
  });

  test('should smoothly transition when switching between modes', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('.display');
    const toggleButton = page.locator('#toggle');
    
    // Get initial colors
    const initialBg = await display.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    const initialColor = await display.evaluate(el => {
      return window.getComputedStyle(el).color;
    });
    
    // Toggle mode
    await toggleButton.click();
    await page.waitForTimeout(300);
    
    // Get new colors
    const newBg = await display.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    const newColor = await display.evaluate(el => {
      return window.getComputedStyle(el).color;
    });
    
    // Colors should change
    expect(initialBg).not.toBe(newBg);
    expect(initialColor).not.toBe(newColor);
  });
});
