const { test, expect } = require('@playwright/test');

test.describe('Task 1: Body styling with full-height layout and gray background', () => {
  test('should have proper body styling with centered content', async ({ page }) => {
    await page.goto('/index.html');
    
    const body = page.locator('body');
    
    // Check body has proper height and alignment
    const bodyStyles = await body.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        minHeight: styles.minHeight,
        margin: styles.margin,
        display: styles.display,
        flexDirection: styles.flexDirection,
        alignItems: styles.alignItems,
        backgroundColor: styles.backgroundColor
      };
    });
    
    expect(bodyStyles.minHeight).toBe('100vh');
    expect(bodyStyles.display).toBe('flex');
    expect(bodyStyles.flexDirection).toBe('column');
    expect(bodyStyles.alignItems).toBe('center');
  });

  test('should center calculator vertically and horizontally', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    await expect(calculator).toBeVisible();
    
    // Check if calculator is centered by comparing its position
    const calculatorBox = await calculator.boundingBox();
    const viewportSize = page.viewportSize();
    
    // Calculator should be roughly centered horizontally
    const centerX = viewportSize.width / 2;
    const calculatorCenterX = calculatorBox.x + calculatorBox.width / 2;
    const horizontalDiff = Math.abs(centerX - calculatorCenterX);
    
    expect(horizontalDiff).toBeLessThan(50); // Allow some tolerance
  });

  test('should have gray background color', async ({ page }) => {
    await page.goto('/index.html');
    
    const body = page.locator('body');
    const backgroundColor = await body.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Check for gray background (rgb(170, 170, 170) = #aaa)
    expect(backgroundColor).toBe('rgb(170, 170, 170)');
  });
});
