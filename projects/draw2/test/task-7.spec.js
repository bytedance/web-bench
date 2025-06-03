import { test, expect } from '@playwright/test';

test.describe('Task 7: Shape base class functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('shapes should be created through factory method', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Draw a line shape
    await page.click('label:has(input[value="line"])');
    await page.mouse.move(canvasBox.x + 50, canvasBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.up();
    
    // Check that a line was created
    const line = await canvas.locator('line');
    await expect(line).toHaveCount(1);
  });

  test('shapes should have transform capabilities', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create a rect shape
    await page.click('label:has(input[value="rect"])');
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Switch to move tool
    await page.click('label:has(input[value="move"])');
    
    // Move the shape
    const rect = await canvas.locator('rect').first();
    await rect.click();
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.up();
    
    // Check that transform attribute exists
    const transform = await rect.getAttribute('transform');
    expect(transform).toBeTruthy();
  });

  test('shapes should support cloning', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create an ellipse
    await page.click('label:has(input[value="ellipse"])');
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.up();
    
    // Switch to copy tool
    await page.click('label:has(input[value="copy"])');
    
    // Click on the ellipse to copy it
    const ellipse = await canvas.locator('ellipse').first();
    await ellipse.click();
    
    // Should have 2 ellipses now
    const ellipses = await canvas.locator('ellipse');
    await expect(ellipses).toHaveCount(2);
  });

  test('shapes should support deletion', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create a line
    await page.click('label:has(input[value="line"])');
    await page.mouse.move(canvasBox.x + 50, canvasBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.up();
    
    // Verify line exists
    let lines = await canvas.locator('line');
    await expect(lines).toHaveCount(1);
    
    // Switch to delete tool
    await page.click('label:has(input[value="delete"])');
    
    // Click on the line to delete it
    const line = await canvas.locator('line').first();
    await line.click();
    
    // Line should be removed
    lines = await canvas.locator('line');
    await expect(lines).toHaveCount(0);
  });

  test('shape registry should track created shapes', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create multiple shapes
    const shapeTypes = ['line', 'rect', 'ellipse'];
    
    for (const shapeType of shapeTypes) {
      await page.click(`label:has(input[value="${shapeType}"])`);
      await page.mouse.move(canvasBox.x + 50, canvasBox.y + 50);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
      await page.mouse.up();
    }
    
    // Check all shapes were created
    const totalShapes = await canvas.locator('line, rect, ellipse').count();
    expect(totalShapes).toBe(3);
  });
});
