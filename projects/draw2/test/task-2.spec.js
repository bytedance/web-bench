const { test, expect } = require('@playwright/test');
const coverage = require('../../../libraries/test-util/src/coverage');test.afterEach(coverage);;
test.describe('Task 2: Basic CSS Layout', () => {
  test('should have body with zero margin', async ({ page }) => {
    await page.goto('/index.html');
    
    const bodyMargin = await page.evaluate(() => {
      return window.getComputedStyle(document.body).margin;
    });
    
    expect(bodyMargin).toBe('0px');
  });

  test('should have .root as flex container with column direction and full viewport height', async ({ page }) => {
    await page.goto('/index.html');
    
    const root = page.locator('.root');
    
    // Check flex properties
    const styles = await root.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        display: computed.display,
        flexDirection: computed.flexDirection,
        height: computed.height,
        width: computed.width
      };
    });
    
    expect(styles.display).toBe('flex');
    expect(styles.flexDirection).toBe('column');
    
    // Check viewport dimensions
    const viewportSize = page.viewportSize();
    expect(parseInt(styles.height)).toBe(viewportSize.height);
  });

  test('should have proper layout structure with toolkit above canvas', async ({ page }) => {
    await page.goto('/index.html');
    
    const toolkit = page.locator('.toolkit');
    const canvas = page.locator('.canvas');
    
    // Both should be visible
    await expect(toolkit).toBeVisible();
    await expect(canvas).toBeVisible();
    
    // Check positioning - toolkit should be above canvas
    const toolkitBox = await toolkit.boundingBox();
    const canvasBox = await canvas.boundingBox();
    
    expect(toolkitBox.y).toBeLessThan(canvasBox.y);
  });
});
