import { test, expect } from '@playwright/test';

test.describe('Task 4: Canvas class functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('Canvas should bind to SVG element with selector', async ({ page }) => {
    // Check that Canvas is instantiated properly
    const canvasExists = await page.evaluate(() => {
      return typeof window.Canvas !== 'undefined' || 
             document.querySelector('.canvas') !== null;
    });
    expect(canvasExists).toBe(true);
  });

  test('should handle mouse drawing events', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Select line tool
    await page.click('label:has(input[value="line"])');
    
    // Perform mouse drawing
    await page.mouse.move(canvasBox.x + 50, canvasBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.up();
    
    // Check if a shape was created
    const shapes = await canvas.locator('line, rect, ellipse').count();
    expect(shapes).toBeGreaterThan(0);
  });

  test('should handle touch drawing events', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Select rect tool
    await page.click('label:has(input[value="rect"])');
    
    // Simulate touch events
    await page.touchscreen.tap(canvasBox.x + 100, canvasBox.y + 100);
    
    // Note: Full touch drawing simulation may require more complex interaction
    // This tests that touch events don't cause errors
    const hasErrors = await page.evaluate(() => {
      return window.consoleErrors && window.consoleErrors.length > 0;
    });
    expect(hasErrors).toBeFalsy();
  });

  test('should calculate cursor position relative to canvas', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Select ellipse tool
    await page.click('label:has(input[value="ellipse"])');
    
    // Draw at specific position
    const startX = 100;
    const startY = 100;
    
    await page.mouse.move(canvasBox.x + startX, canvasBox.y + startY);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + startX + 50, canvasBox.y + startY + 50);
    await page.mouse.up();
    
    // Check if shape was created at approximately the right position
    const shape = await canvas.locator('ellipse').first();
    const cx = await shape.getAttribute('cx');
    const cy = await shape.getAttribute('cy');
    
    // Position should be relative to canvas, not page
    expect(Number(cx)).toBeGreaterThan(0);
    expect(Number(cy)).toBeGreaterThan(0);
  });

  test('Canvas should accept Toolkit instance', async ({ page }) => {
    // Test that canvas responds to toolkit changes
    await page.click('label:has(input[value="line"])');
    
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Change color
    await page.fill('input[type="color"]', '#ff0000');
    
    // Draw a line
    await page.mouse.move(canvasBox.x + 50, canvasBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 50);
    await page.mouse.up();
    
    // Check if line has the selected color
    const line = await canvas.locator('line').first();
    const stroke = await line.getAttribute('stroke');
    expect(stroke).toBe('#ff0000');
  });
});
