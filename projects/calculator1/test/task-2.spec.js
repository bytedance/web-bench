const { test, expect } = require('@playwright/test');

test.describe('Task 2: Add white background and transitions to calculator container', () => {
  test('should have calculator with white background color', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    const backgroundColor = await calculator.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    expect(backgroundColor).toBe('rgb(255, 255, 255)'); // white
  });

  test('should have smooth transition properties', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    const transitionProperty = await calculator.evaluate((el) => {
      return window.getComputedStyle(el).transition;
    });
    
    expect(transitionProperty).toContain('0.3s');
    expect(transitionProperty).toContain('ease');
  });

  test('should have enhanced border styling', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    const borderStyles = await calculator.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        borderWidth: style.borderWidth,
        borderStyle: style.borderStyle,
        borderColor: style.borderColor,
        borderRadius: style.borderRadius
      };
    });
    
    expect(borderStyles.borderWidth).toBe('1px');
    expect(borderStyles.borderStyle).toBe('solid');
    expect(borderStyles.borderColor).toBe('rgb(204, 204, 204)'); // #ccc
    expect(borderStyles.borderRadius).toBe('5px');
  });
});
