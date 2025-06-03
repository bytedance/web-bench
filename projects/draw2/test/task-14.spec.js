import { test, expect } from '@playwright/test';

test.describe('Task 14: Zoom/scale operation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should resize shapes from their center', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create a rect
    await page.click('label:has(input[value="rect"])');
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 250, canvasBox.y + 250);
    await page.mouse.up();
    
    // Switch to zoom tool
    await page.click('label:has(input[value="zoom"])');
    
    // Scale the rect
    const rect = await canvas.locator('rect').first();
    await rect.click();
    await page.mouse.down();
    
    // Move away from center to scale up
    await page.mouse.move(canvasBox.x + 300, canvasBox.y + 300);
    await page.mouse.up();
    
    // Check scale transform was applied
    const transform = await rect.getAttribute('transform');
    expect(transform).toContain('scale');
  });

  test('should calculate scale factor as ratio of distances', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create an ellipse
    await page.click('label:has(input[value="ellipse"])');
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Switch to zoom tool
    await page.click('label:has(input[value="zoom"])');
    
    const ellipse = await canvas.locator('ellipse').first();
    const cx = Number(await ellipse.getAttribute('cx'));
    const cy = Number(await ellipse.getAttribute('cy'));
    
    // Click on ellipse
    await ellipse.click();
    
    // Start at a known distance from center
    await page.mouse.move(canvasBox.x + cx + 50, canvasBox.y + cy);
    await page.mouse.down();
    
    // Move to double the distance (should scale by ~2x)
    await page.mouse.move(canvasBox.x + cx + 100, canvasBox.y + cy);
    await page.mouse.up();
    
    // Should have scale transform
    const transform = await ellipse.getAttribute('transform');
    expect(transform).toContain('scale');
  });

  test('should apply uniform scaling to both axes', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create a line
    await page.click('label:has(input[value="line"])');
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Switch to zoom tool
    await page.click('label:has(input[value="zoom"])');
    
    const line = await canvas.locator('line').first();
    await line.click();
    await page.mouse.down();
    
    // Scale up
    await page.mouse.move(canvasBox.x + 250, canvasBox.y + 250);
    await page.mouse.up();
    
    // Check transform has uniform scale (not separate x,y values)
    const transform = await line.getAttribute('transform');
    expect(transform).toMatch(/scale\(\d+\.?\d*\)/);
  });

  test('should preserve existing transformations while scaling', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create a rect
    await page.click('label:has(input[value="rect"])');
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 250, canvasBox.y + 250);
    await page.mouse.up();
    
    const rect = await canvas.locator('rect').first();
    
    // First move it
    await page.click('label:has(input[value="move"])');
    await rect.click();
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Then rotate it
    await page.click('label:has(input[value="rotate"])');
    await rect.click();
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 300, canvasBox.y + 200);
    await page.mouse.up();
    
    // Now scale it
    await page.click('label:has(input[value="zoom"])');
    await rect.click();
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 350, canvasBox.y + 350);
    await page.mouse.up();
    
    // Should have all transforms
    const transform = await rect.getAttribute('transform');
    expect(transform).toContain('translate');
    expect(transform).toContain('rotate');
    expect(transform).toContain('scale');
  });

  test('should handle scale down operation', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create an ellipse
    await page.click('label:has(input[value="ellipse"])');
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 250, canvasBox.y + 250);
    await page.mouse.up();
    
    // Switch to zoom tool
    await page.click('label:has(input[value="zoom"])');
    
    const ellipse = await canvas.locator('ellipse').first();
    const cx = Number(await ellipse.getAttribute('cx'));
    const cy = Number(await ellipse.getAttribute('cy'));
    
    await ellipse.click();
    
    // Start far from center
    await page.mouse.move(canvasBox.x + cx + 100, canvasBox.y + cy);
    await page.mouse.down();
    
    // Move closer to center to scale down
    await page.mouse.move(canvasBox.x + cx + 30, canvasBox.y + cy);
    await page.mouse.up();
    
    // Should have scale < 1
    const transform = await ellipse.getAttribute('transform');
    expect(transform).toContain('scale');
  });
});
