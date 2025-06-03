// Test for Task 12: Add move operation for dragging shapes
import { test, expect } from '@playwright/test';

test.describe('Task 12: Move Operation for Dragging Shapes', () => {
  test('should allow dragging shapes around the canvas', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create a rectangle
    await page.locator('.rect').click();
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 100;
    const startY = canvasBox.y + 100;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 80, startY + 60);
    await page.mouse.up();
    
    const rectElement = canvas.locator('rect');
    await expect(rectElement).toBeVisible();
    
    // Switch to move tool and drag the rectangle
    await page.locator('.move').click();
    
    // Get initial transform
    const initialTransform = await rectElement.evaluate(el => el.style.transform || '');
    
    await rectElement.hover();
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 80);
    await page.mouse.up();
    
    // Check that translate transform was applied
    const newTransform = await rectElement.evaluate(el => el.style.transform);
    expect(newTransform).toContain('translate');
    expect(newTransform).not.toBe(initialTransform);
  });

  test('should preserve rotation and scale when moving shapes', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create an ellipse
    await page.locator('.ellipse').click();
    const canvasBox = await canvas.boundingBox();
    const centerX = canvasBox.x + 200;
    const centerY = canvasBox.y + 150;
    
    await page.mouse.move(centerX - 40, centerY - 30);
    await page.mouse.down();
    await page.mouse.move(centerX + 40, centerY + 30);
    await page.mouse.up();
    
    const ellipseElement = canvas.locator('ellipse');
    await expect(ellipseElement).toBeVisible();
    
    // First rotate the ellipse
    await page.locator('.rotate').click();
    await ellipseElement.hover();
    await page.mouse.down();
    await page.mouse.move(centerX + 80, centerY);
    await page.mouse.up();
    
    const transformAfterRotate = await ellipseElement.evaluate(el => el.style.transform);
    expect(transformAfterRotate).toContain('rotate');
    
    // Then move it
    await page.locator('.move').click();
    await ellipseElement.hover();
    await page.mouse.down();
    await page.mouse.move(centerX + 50, centerY + 50);
    await page.mouse.up();
    
    const finalTransform = await ellipseElement.evaluate(el => el.style.transform);
    
    // Should contain both translate and rotate
    expect(finalTransform).toContain('translate');
    expect(finalTransform).toContain('rotate');
  });

  test('should not allow moving the canvas itself', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Switch to move tool
    await page.locator('.move').click();
    
    // Try to drag the canvas background
    const canvasBox = await canvas.boundingBox();
    const emptyX = canvasBox.x + 50;
    const emptyY = canvasBox.y + 50;
    
    await page.mouse.move(emptyX, emptyY);
    await page.mouse.down();
    await page.mouse.move(emptyX + 100, emptyY + 100);
    await page.mouse.up();
    
    // Canvas should not have any transform applied
    const canvasTransform = await canvas.evaluate(el => el.style.transform || '');
    expect(canvasTransform).toBe('');
    
    // Canvas position should remain unchanged
    const newCanvasBox = await canvas.boundingBox();
    expect(newCanvasBox.x).toBeCloseTo(canvasBox.x, 0);
    expect(newCanvasBox.y).toBeCloseTo(canvasBox.y, 0);
  });
});
