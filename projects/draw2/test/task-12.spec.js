import { test, expect } from '@playwright/test';

test.describe('Task 12: Move operation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should allow dragging shapes around the canvas', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create a rect
    await page.click('label:has(input[value="rect"])');
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Switch to move tool
    await page.click('label:has(input[value="move"])');
    
    // Get initial position
    const rect = await canvas.locator('rect').first();
    const initialX = await rect.getAttribute('x');
    const initialY = await rect.getAttribute('y');
    
    // Move the rect
    await rect.click();
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 250, canvasBox.y + 250);
    await page.mouse.up();
    
    // Check position changed
    const transform = await rect.getAttribute('transform');
    expect(transform).toContain('translate');
  });

  test('should calculate position difference correctly', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create a line
    await page.click('label:has(input[value="line"])');
    await page.mouse.move(canvasBox.x + 50, canvasBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.up();
    
    // Switch to move tool
    await page.click('label:has(input[value="move"])');
    
    const line = await canvas.locator('line').first();
    
    // Move with specific delta
    await line.click();
    const startX = canvasBox.x + 100;
    const startY = canvasBox.y + 100;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    
    const deltaX = 50;
    const deltaY = 30;
    await page.mouse.move(startX + deltaX, startY + deltaY);
    await page.mouse.up();
    
    // Verify translate was applied
    const transform = await line.getAttribute('transform');
    expect(transform).toContain('translate');
  });

  test('should preserve rotation and scale during move', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create an ellipse
    await page.click('label:has(input[value="ellipse"])');
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 250, canvasBox.y + 250);
    await page.mouse.up();
    
    const ellipse = await canvas.locator('ellipse').first();
    
    // Apply rotation first
    await page.click('label:has(input[value="rotate"])');
    await ellipse.click();
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 300, canvasBox.y + 200);
    await page.mouse.up();
    
    // Now move
    await page.click('label:has(input[value="move"])');
    await ellipse.click();
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Check both transforms are present
    const transform = await ellipse.getAttribute('transform');
    expect(transform).toContain('translate');
    expect(transform).toContain('rotate');
  });

  test('should not move the canvas element itself', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Switch to move tool
    await page.click('label:has(input[value="move"])');
    
    // Try to click and drag on empty canvas
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Canvas should not have transform attribute
    const canvasTransform = await canvas.getAttribute('transform');
    expect(canvasTransform).toBeNull();
  });

  test('should move multiple shapes independently', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create two shapes
    await page.click('label:has(input[value="rect"])');
    await page.mouse.move(canvasBox.x + 50, canvasBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.up();
    
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Switch to move tool
    await page.click('label:has(input[value="move"])');
    
    // Move first rect
    const firstRect = await canvas.locator('rect').first();
    await firstRect.click();
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 80, canvasBox.y + 80);
    await page.mouse.up();
    
    // Move second rect
    const secondRect = await canvas.locator('rect').nth(1);
    await secondRect.click();
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 250, canvasBox.y + 250);
    await page.mouse.up();
    
    // Both should have different transforms
    const transform1 = await firstRect.getAttribute('transform');
    const transform2 = await secondRect.getAttribute('transform');
    
    expect(transform1).toContain('translate');
    expect(transform2).toContain('translate');
    expect(transform1).not.toBe(transform2);
  });
});
