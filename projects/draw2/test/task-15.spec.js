import { test, expect } from '@playwright/test';

test.describe('Task 15: Copy operation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should duplicate selected shapes', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create a rect
    await page.click('label:has(input[value="rect"])');
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Switch to copy tool
    await page.click('label:has(input[value="copy"])');
    
    // Copy the rect
    const rect = await canvas.locator('rect').first();
    await rect.click();
    
    // Should now have 2 rects
    const rects = await canvas.locator('rect');
    await expect(rects).toHaveCount(2);
  });

  test('should clone with all attributes preserved', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Set custom color and line width
    await page.fill('input[name="color"]', '#ff00ff');
    await page.fill('input[name="line-width"]', '17');
    
    // Create a line
    await page.click('label:has(input[value="line"])');
    await page.mouse.move(canvasBox.x + 50, canvasBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.up();
    
    // Switch to copy tool
    await page.click('label:has(input[value="copy"])');
    
    // Copy the line
    const line = await canvas.locator('line').first();
    await line.click();
    
    // Check both lines have same attributes
    const lines = await canvas.locator('line');
    await expect(lines).toHaveCount(2);
    
    const line1Stroke = await lines.nth(0).getAttribute('stroke');
    const line2Stroke = await lines.nth(1).getAttribute('stroke');
    const line1Width = await lines.nth(0).getAttribute('stroke-width');
    const line2Width = await lines.nth(1).getAttribute('stroke-width');
    
    expect(line1Stroke).toBe(line2Stroke);
    expect(line1Width).toBe(line2Width);
  });

  test('should offset copy by 20 pixels in both directions', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create an ellipse
    await page.click('label:has(input[value="ellipse"])');
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.up();
    
    // Get original position
    const originalEllipse = await canvas.locator('ellipse').first();
    const originalCx = await originalEllipse.getAttribute('cx');
    const originalCy = await originalEllipse.getAttribute('cy');
    
    // Copy the ellipse
    await page.click('label:has(input[value="copy"])');
    await originalEllipse.click();
    
    // Get copied ellipse position
    const ellipses = await canvas.locator('ellipse');
    const copiedEllipse = ellipses.nth(1);
    
    const copiedCx = await copiedEllipse.getAttribute('cx');
    const copiedCy = await copiedEllipse.getAttribute('cy');
    
    // Check offset is approximately 20 pixels
    expect(Number(copiedCx) - Number(originalCx)).toBeCloseTo(20, 0);
    expect(Number(copiedCy) - Number(originalCy)).toBeCloseTo(20, 0);
  });

  test('should register new shape in shapes array', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create multiple shapes
    const shapeTypes = ['line', 'rect', 'ellipse'];
    
    for (const shapeType of shapeTypes) {
      await page.click(`label:has(input[value="${shapeType}"])`);
      await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
      await page.mouse.up();
    }
    
    // Count initial shapes
    let totalShapes = await canvas.locator('line, rect, ellipse').count();
    expect(totalShapes).toBe(3);
    
    // Copy each shape
    await page.click('label:has(input[value="copy"])');
    
    for (const shapeType of shapeTypes) {
      const shape = await canvas.locator(shapeType).first();
      await shape.click();
    }
    
    // Should have doubled the shapes
    totalShapes = await canvas.locator('line, rect, ellipse').count();
    expect(totalShapes).toBe(6);
  });

  test('should copy shapes with transformations', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create a rect
    await page.click('label:has(input[value="rect"])');
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    const rect = await canvas.locator('rect').first();
    
    // Rotate the rect
    await page.click('label:has(input[value="rotate"])');
    await rect.click();
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 250, canvasBox.y + 150);
    await page.mouse.up();
    
    // Get original transform
    const originalTransform = await rect.getAttribute('transform');
    
    // Copy the rotated rect
    await page.click('label:has(input[value="copy"])');
    await rect.click();
    
    // Check copied rect has transform
    const rects = await canvas.locator('rect');
    const copiedRect = rects.nth(1);
    const copiedTransform = await copiedRect.getAttribute('transform');
    
    // Both should have transforms (though offset will differ)
    expect(originalTransform).toContain('rotate');
    expect(copiedTransform).toContain('rotate');
  });
});
