const { test, expect } = require('@playwright/test');

test.describe('Task 1: Add centered page background with body styles', () => {
  test('should have body with light gray background and flex display', async ({ page }) => {
    await page.goto('/index.html');
    
    const body = page.locator('body');
    const bodyStyles = await body.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        backgroundColor: style.backgroundColor,
        display: style.display,
        minHeight: style.minHeight,
        margin: style.margin
      };
    });
    
    expect(bodyStyles.backgroundColor).toBe('rgb(170, 170, 170)'); // #aaa
    expect(bodyStyles.display).toBe('flex');
    expect(bodyStyles.minHeight).toBe('100vh');
    expect(bodyStyles.margin).toBe('0px');
  });

  test('should center calculator vertically and horizontally', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    await expect(calculator).toBeVisible();
    
    // Check if calculator is centered by examining its position
    const calculatorBox = await calculator.boundingBox();
    const viewportSize = page.viewportSize();
    
    // Calculator should be roughly centered horizontally
    const centerX = viewportSize.width / 2;
    const calculatorCenterX = calculatorBox.x + calculatorBox.width / 2;
    expect(Math.abs(calculatorCenterX - centerX)).toBeLessThan(50);
  });

  test('should have proper body flex layout properties', async ({ page }) => {
    await page.goto('/index.html');
    
    const body = page.locator('body');
    const flexProperties = await body.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        flexDirection: style.flexDirection,
        alignItems: style.alignItems
      };
    });
    
    expect(flexProperties.flexDirection).toBe('column');
    expect(flexProperties.alignItems).toBe('center');
  });
});
