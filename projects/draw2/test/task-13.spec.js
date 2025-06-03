import { test, expect } from '@playwright/test';

test.describe('Task 13: Rotate operation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should rotate shapes using angle calculations', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create a rect
    await page.click('label:has(input[value="rect"])');
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 250, canvasBox.y + 250);
    await page.mouse.up();
    
    // Switch to rotate tool
    await page.click('label:has(input[value="rotate"])');
    
    // Rotate the rect
    const rect = await canvas.locator('rect').first();
    await rect.click();
    await page.mouse.down();
    
    // Move to create rotation
    await page.mouse.move(canvasBox.x + 300, canvasBox.y + 200);
    await page.mouse.up();
    
    // Check rotation was applied
    const transform = await rect.getAttribute('transform');
    expect(transform).toContain('rotate');
  });

  test('should calculate rotation between two vectors from center', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create an ellipse at known position
    await page.click('label:has(input[value="ellipse"])');
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Switch to rotate tool
    await page.click('label:has(input[value="rotate"])');
    
    const ellipse = await canvas.locator('ellipse').first();
    const cx = Number(await ellipse.getAttribute('cx'));
    const cy = Number(await ellipse.getAttribute('cy'));
    
    // Start rotation from right of center
    await ellipse.click();
    await page.mouse.move(canvasBox.x + cx + 50, canvasBox.y + cy);
    await page.mouse.down();
    
    // Rotate 90 degrees (move to below center)
    await page.mouse.move(canvasBox.x + cx, canvasBox.y + cy + 50);
    await page.mouse.up();
    
    // Should have rotation transform
    const transform = await ellipse.getAttribute('transform');
    expect(transform).toContain('rotate');
  });

  test('should handle edge case of zero-length vectors', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create a line
    await page.click('label:has(input[value="line"])');
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Switch to rotate tool
    await page.click('label:has(input[value="rotate"])');
    
    const line = await canvas.locator('line').first();
    
    // Click on the line
    await line.click();
    
    // Try to rotate with very small movement
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.move(canvasBox.x + 151, canvasBox.y + 151);
    await page.mouse.up();
    
    // Should handle gracefully (no errors)
    const lineStillExists = await line.isVisible();
    expect(lineStillExists).toBe(true);
  });

  test('should maintain transform origin at shape center', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create a rect
    await page.click('label:has(input[value="rect"])');
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    const rect = await canvas.locator('rect').first();
    
    // Get rect center
    const x = Number(await rect.getAttribute('x'));
    const y = Number(await rect.getAttribute('y'));
    const width = Number(await rect.getAttribute('width'));
    const height = Number(await rect.getAttribute('height'));
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    
    // Switch to rotate tool and rotate
    await page.click('label:has(input[value="rotate"])');
    await rect.click();
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + centerX + 100, canvasBox.y + centerY);
    await page.mouse.up();
    
    // Transform should include center point
    const transform = await rect.getAttribute('transform');
    expect(transform).toContain('rotate');
    expect(transform).toMatch(/rotate\([^,]+,\s*\d+,\s*\d+\)/);
  });

  test('should apply rotation in degrees', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create multiple shapes and rotate them
    const shapes = ['line', 'rect', 'ellipse'];
    
    for (let i = 0; i < shapes.length; i++) {
      await page.click(`label:has(input[value="${shapes[i]}"])`);
      const x = 100 + i * 100;
      await page.mouse.move(canvasBox.x + x, canvasBox.y + 100);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + x + 50, canvasBox.y + 150);
      await page.mouse.up();
    }
    
    // Switch to rotate and rotate each shape
    await page.click('label:has(input[value="rotate"])');
    
    const allShapes = await canvas.locator('line, rect, ellipse');
    const count = await allShapes.count();
    
    for (let i = 0; i < count; i++) {
      const shape = allShapes.nth(i);
      await shape.click();
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + 200, canvasBox.y + 50);
      await page.mouse.up();
      
      const transform = await shape.getAttribute('transform');
      expect(transform).toContain('rotate');
    }
  });
});
