const { test, expect } = require('@playwright/test');

test.describe('Task 1: Body Styling and Layout', () => {
  test('Test case 1: Body should have gray background and centered layout', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check if body has gray background
    const bodyStyles = await page.evaluate(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body);
      return {
        backgroundColor: styles.backgroundColor,
        display: styles.display,
        flexDirection: styles.flexDirection,
        alignItems: styles.alignItems
      };
    });
    
    expect(bodyStyles.backgroundColor).toBe('rgb(170, 170, 170)'); // #aaa
    expect(bodyStyles.display).toBe('flex');
    expect(bodyStyles.flexDirection).toBe('column');
    expect(bodyStyles.alignItems).toBe('center');
  });

  test('Test case 2: Body should have minimum height of 100vh and no margin', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check body height and margin properties
    const bodyDimensions = await page.evaluate(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body);
      return {
        minHeight: styles.minHeight,
        margin: styles.margin
      };
    });
    
    expect(bodyDimensions.minHeight).toBe('100vh');
    expect(bodyDimensions.margin).toBe('0px');
  });

  test('Test case 3: Calculator should be properly centered on the page', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check if calculator is centered by comparing its position
    const calculatorPosition = await page.locator('.calculator').boundingBox();
    const viewportSize = page.viewportSize();
    
    expect(calculatorPosition).not.toBeNull();
    
    // Calculator should be roughly centered horizontally
    const centerX = viewportSize.width / 2;
    const calculatorCenterX = calculatorPosition.x + calculatorPosition.width / 2;
    
    // Allow some tolerance for centering
    expect(Math.abs(calculatorCenterX - centerX)).toBeLessThan(50);
  });
});
