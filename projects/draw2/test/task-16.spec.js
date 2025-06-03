import { test, expect } from '@playwright/test';

test.describe('Task 16: Delete operation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should remove shapes from canvas', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create a line
    await page.click('label:has(input[value="line"])');
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Verify line exists
    let lines = await canvas.locator('line');
    await expect(lines).toHaveCount(1);
    
    // Switch to delete tool
    await page.click('label:has(input[value="delete"])');
    
    // Delete the line
    const line = await canvas.locator('line').first();
    await line.click();
    
    // Line should be removed
    lines = await canvas.locator('line');
    await expect(lines).toHaveCount(0);
  });

  test('should remove shape from registry array', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create multiple shapes
    const shapes = ['rect', 'ellipse', 'line'];
    
    for (const shape of shapes) {
      await page.click(`label:has(input[value="${shape}"])`);
      await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
      await page.mouse.up();
    }
    
    // Verify all shapes exist
    let totalShapes = await canvas.locator('line, rect, ellipse').count();
    expect(totalShapes).toBe(3);
    
    // Delete one shape
    await page.click('label:has(input[value="delete"])');
    const rect = await canvas.locator('rect').first();
    await rect.click();
    
    // Should have one less shape
    totalShapes = await canvas.locator('line, rect, ellipse').count();
    expect(totalShapes).toBe(2);
  });

  test('should remove SVG element from DOM', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create an ellipse
    await page.click('label:has(input[value="ellipse"])');
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 250, canvasBox.y + 250);
    await page.mouse.up();
    
    // Get the ellipse element
    const ellipse = await canvas.locator('ellipse').first();
    const ellipseId = await ellipse.evaluate(el => {
      el.id = 'test-ellipse';
      return el.id;
    });
    
    // Delete it
    await page.click('label:has(input[value="delete"])');
    await ellipse.click();
    
    // Element should not exist in DOM
    const deletedElement = await page.locator(`#${ellipseId}`);
    await expect(deletedElement).toHaveCount(0);
  });

  test('should prevent deletion of canvas itself', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Switch to delete tool
    await page.click('label:has(input[value="delete"])');
    
    // Try to click on empty canvas area
    await page.mouse.click(canvasBox.x + 100, canvasBox.y + 100);
    
    // Canvas should still exist
    await expect(canvas).toBeVisible();
    await expect(canvas).toHaveCount(1);
  });

  test('should delete multiple shapes independently', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create 3 rects
    await page.click('label:has(input[value="rect"])');
    
    for (let i = 0; i < 3; i++) {
      const x = 100 + i * 100;
      await page.mouse.move(canvasBox.x + x, canvasBox.y + 100);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + x + 50, canvasBox.y + 150);
      await page.mouse.up();
    }
    
    // Verify 3 rects exist
    let rects = await canvas.locator('rect');
    await expect(rects).toHaveCount(3);
    
    // Delete them one by one
    await page.click('label:has(input[value="delete"])');
    
    for (let i = 2; i >= 0; i--) {
      const rect = await canvas.locator('rect').first();
      await rect.click();
      
      // Check count decreased
      rects = await canvas.locator('rect');
      await expect(rects).toHaveCount(i);
    }
  });
});
