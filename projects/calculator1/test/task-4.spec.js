const { test, expect } = require('@playwright/test');

test.describe('Task 4: Add transition effects and styling to display input', () => {
  test('should have proper transition effects on display', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('.display');
    const transitionProperty = await display.evaluate((el) => {
      return window.getComputedStyle(el).transition;
    });
    
    expect(transitionProperty).toContain('0.3s');
    expect(transitionProperty).toContain('ease');
  });

  test('should have proper box-sizing property', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('.display');
    const boxSizing = await display.evaluate((el) => {
      return window.getComputedStyle(el).boxSizing;
    });
    
    expect(boxSizing).toBe('border-box');
  });

  test('should have proper color and background properties', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('.display');
    const colorStyles = await display.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        backgroundColor: style.backgroundColor,
        color: style.color,
        textAlign: style.textAlign,
        fontSize: style.fontSize
      };
    });
    
    expect(colorStyles.backgroundColor).toBe('rgb(255, 255, 255)'); // white
    expect(colorStyles.color).toBe('rgb(0, 0, 0)'); // black
    expect(colorStyles.textAlign).toBe('right');
    expect(colorStyles.fontSize).toBe('24px');
  });
});
