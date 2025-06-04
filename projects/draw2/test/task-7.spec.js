const { test, expect } = require('@playwright/test');
require('../../../libraries/test-util/src/coverage');
test.describe('Task 7: Canvas Styling', () => {
  test('should have canvas with background color #eee', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    const backgroundColor = await canvas.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // #eee is rgb(238, 238, 238)
    expect(backgroundColor).toBe('rgb(238, 238, 238)');
  });

  test('should have canvas with flex: 1 to fill remaining space', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    const flexValue = await canvas.evaluate(el => {
      return window.getComputedStyle(el).flex;
    });
    
    expect(flexValue).toBe('1 1 0%');
  });

  test('should have canvas taking up most of the viewport height', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    const toolkit = page.locator('.toolkit');
    
    const canvasBox = await canvas.boundingBox();
    const toolkitBox = await toolkit.boundingBox();
    const viewportSize = page.viewportSize();
    
    // Canvas should be much larger than toolkit
    expect(canvasBox.height).toBeGreaterThan(toolkitBox.height * 5);
    
    // Canvas should take up most of the remaining space after toolkit
    const expectedCanvasHeight = viewportSize.height - toolkitBox.height;
    expect(canvasBox.height).toBeCloseTo(expectedCanvasHeight, -1); // Allow some margin for padding
  });
});
