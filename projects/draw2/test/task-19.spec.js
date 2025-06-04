const { test, expect } = require('@playwright/test');
require('../../../libraries/test-util/src/coverage');
test.describe('Task 19: Copy, Delete, and Fill Operations', () => {
  test('should copy shapes with offset positioning', async ({ page }) => {
    await page.goto('/index.html');
    
    const rectInput = page.locator('.toolkit .shape .rect');
    const copyInput = page.locator('.toolkit .operation .copy');
    const canvas = page.locator('.canvas');
    
    // Create a rectangle
    await rectInput.click();
    const canvasBox = await canvas.boundingBox();
    await page.mouse.move(canvasBox.x + 50, canvasBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.up();
    
    // Switch to copy tool and click on the rectangle
    await copyInput.click();
    await page.mouse.click(canvasBox.x + 75, canvasBox.y + 75);
    
    // Should now have 2 rectangles
    const rectElements = page.locator('.canvas rect');
    await expect(rectElements).toHaveCount(2);
    
    // Get positions of both rectangles
    const positions = await rectElements.evaluateAll(rects => 
      rects.map(rect => ({
        x: parseFloat(rect.getAttribute('x')),
        y: parseFloat(rect.getAttribute('y'))
      }))
    );
    
    // Second rectangle should be offset from the first
    expect(positions[1].x).toBe(positions[0].x + 20); // Shape.offset.x
    expect(positions[1].y).toBe(positions[0].y + 20); // Shape.offset.y
  });

  test('should delete shapes when using delete operation', async ({ page }) => {
    await page.goto('/index.html');
    
    const lineInput = page.locator('.toolkit .shape .line');
    const ellipseInput = page.locator('.toolkit .shape .ellipse');
    const deleteInput = page.locator('.toolkit .operation .delete');
    const canvas = page.locator('.canvas');
    
    const canvasBox = await canvas.boundingBox();
    
    // Create a line
    await lineInput.click();
    await page.mouse.move(canvasBox.x + 30, canvasBox.y + 30);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 80, canvasBox.y + 30);
    await page.mouse.up();
    
    // Create an ellipse
    await ellipseInput.click();
    await page.mouse.move(canvasBox.x + 120, canvasBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 170, canvasBox.y + 100);
    await page.mouse.up();
    
    // Should have 2 shapes
    const allShapes = page.locator('.canvas > *');
    await expect(allShapes).toHaveCount(2);
    
    // Delete the line
    await deleteInput.click();
    await page.mouse.click(canvasBox.x + 55, canvasBox.y + 30);
    
    // Should now have 1 shape (ellipse only)
    await expect(allShapes).toHaveCount(1);
    const remainingShape = page.locator('.canvas ellipse');
    await expect(remainingShape).toBeVisible();
  });

  test('should fill shapes with selected color', async ({ page }) => {
    await page.goto('/index.html');
    
    const rectInput = page.locator('.toolkit .shape .rect');
    const fillInput = page.locator('.toolkit .operation .fill');
    const colorInput = page.locator('.toolkit .prop .color');
    const canvas = page.locator('.canvas');
    
    // Create a rectangle
    await rectInput.click();
    const canvasBox = await canvas.boundingBox();
    await page.mouse.move(canvasBox.x + 60, canvasBox.y + 60);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 120, canvasBox.y + 120);
    await page.mouse.up();
    
    const rectElement = page.locator('.canvas rect');
    
    // Initial fill should be white
    await expect(rectElement).toHaveAttribute('fill', 'white');
    
    // Change color and use fill tool
    await colorInput.fill('#ff0000');
    await fillInput.click();
    await page.mouse.click(canvasBox.x + 90, canvasBox.y + 90);
    
    // Rectangle should now be filled with red
    await expect(rectElement).toHaveAttribute('fill', '#ff0000');
  });

  test('should not perform operations on empty canvas areas', async ({ page }) => {
    await page.goto('/index.html');
    
    const copyInput = page.locator('.toolkit .operation .copy');
    const deleteInput = page.locator('.toolkit .operation .delete');
    const fillInput = page.locator('.toolkit .operation .fill');
    const canvas = page.locator('.canvas');
    
    const canvasBox = await canvas.boundingBox();
    const allShapes = page.locator('.canvas > *');
    
    // Try copy on empty area
    await copyInput.click();
    await page.mouse.click(canvasBox.x + 200, canvasBox.y + 200);
    await expect(allShapes).toHaveCount(0);
    
    // Try delete on empty area
    await deleteInput.click();
    await page.mouse.click(canvasBox.x + 250, canvasBox.y + 250);
    await expect(allShapes).toHaveCount(0);
    
    // Try fill on empty area
    await fillInput.click();
    await page.mouse.click(canvasBox.x + 300, canvasBox.y + 300);
    await expect(allShapes).toHaveCount(0);
  });
});
