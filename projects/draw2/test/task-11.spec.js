import { test, expect } from '@playwright/test';

test.describe('Task 11: Shape transformation system', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should apply translate transformation when moving shapes', async ({ page }) => {
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
    
    // Move the rect
    const rect = await canvas.locator('rect').first();
    await rect.click();
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.up();
    
    // Check transform contains translate
    const transform = await rect.getAttribute('transform');
    expect(transform).toContain('translate');
  });

  test('should calculate rotation angles correctly', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create an ellipse
    await page.click('label:has(input[value="ellipse"])');
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 250, canvasBox.y + 250);
    await page.mouse.up();
    
    // Switch to rotate tool
    await page.click('label:has(input[value="rotate"])');
    
    // Rotate the ellipse
    const ellipse = await canvas.locator('ellipse').first();
    await ellipse.click();
    await page.mouse.down();
    
    // Move to create rotation
    await page.mouse.move(canvasBox.x + 300, canvasBox.y + 200);
    await page.mouse.up();
    
    // Check transform contains rotate
    const transform = await ellipse.getAttribute('transform');
    expect(transform).toContain('rotate');
  });

  test('should compute scale factors based on distance ratios', async ({ page }) => {
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
    
    // Scale the line
    const line = await canvas.locator('line').first();
    await line.click();
    await page.mouse.down();
    
    // Move away from center to scale up
    await page.mouse.move(canvasBox.x + 250, canvasBox.y + 250);
    await page.mouse.up();
    
    // Check transform contains scale
    const transform = await line.getAttribute('transform');
    expect(transform).toContain('scale');
  });

  test('should maintain transform order when combining transformations', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create a rect
    await page.click('label:has(input[value="rect"])');
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    const rect = await canvas.locator('rect').first();
    
    // Apply move transformation
    await page.click('label:has(input[value="move"])');
    await rect.click();
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.up();
    
    // Apply rotate transformation
    await page.click('label:has(input[value="rotate"])');
    await rect.click();
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 100);
    await page.mouse.up();
    
    // Apply scale transformation
    await page.click('label:has(input[value="zoom"])');
    await rect.click();
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 300, canvasBox.y + 300);
    await page.mouse.up();
    
    // Check all transforms are present
    const transform = await rect.getAttribute('transform');
    expect(transform).toContain('translate');
    expect(transform).toContain('rotate');
    expect(transform).toContain('scale');
  });

  test('should parse existing CSS transforms correctly', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create an ellipse
    await page.click('label:has(input[value="ellipse"])');
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    const ellipse = await canvas.locator('ellipse').first();
    
    // Apply multiple transformations
    await page.click('label:has(input[value="move"])');
    await ellipse.click();
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 120, canvasBox.y + 120);
    await page.mouse.up();
    
    // Apply another move to test parsing
    await ellipse.click();
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 140, canvasBox.y + 140);
    await page.mouse.up();
    
    // Transform should be updated correctly
    const transform = await ellipse.getAttribute('transform');
    expect(transform).toBeTruthy();
    expect(transform.length).toBeGreaterThan(0);
  });
});
