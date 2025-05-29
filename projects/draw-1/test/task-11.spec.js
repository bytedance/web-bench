// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 11 Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should keep ellipse x-radius equal to half line width when drawing very narrow ellipse', async ({ page }) => {
    // Set a specific line width
    const lineWidth = 16;
    await page.locator('.prop > .line-width').fill(lineWidth.toString());
    
    // Click the ellipse label to select it
    await page.locator('.shape > .ellipse').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw a very narrow ellipse (x-radius less than half line width)
    const startX = canvasBoundingBox.x + 100;
    const startY = canvasBoundingBox.y + 100;
    const endX = startX + 6; // Width less than line width (16)
    const endY = startY + 50; // Height greater than line width
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if an ellipse element was created
    const ellipse = page.locator('.canvas ellipse');
    await expect(ellipse).toBeVisible();
    
    // Get ellipse x-radius
    const rx = parseFloat(await ellipse.getAttribute('rx'));
    
    // X-radius should be at least half the line width
    const halfLineWidth = lineWidth / 2;
    expect(rx).toBeGreaterThanOrEqual(halfLineWidth - 1); // Allow small rounding errors
  });

  test('should keep ellipse y-radius equal to half line width when drawing very short ellipse', async ({ page }) => {
    // Set a specific line width
    const lineWidth = 16;
    await page.locator('.prop > .line-width').fill(lineWidth.toString());
    
    // Click the ellipse label to select it
    await page.locator('.shape > .ellipse').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw a very short ellipse (y-radius less than half line width)
    const startX = canvasBoundingBox.x + 100;
    const startY = canvasBoundingBox.y + 100;
    const endX = startX + 50; // Width greater than line width
    const endY = startY + 6; // Height less than line width (16)
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if an ellipse element was created
    const ellipse = page.locator('.canvas ellipse');
    await expect(ellipse).toBeVisible();
    
    // Get ellipse y-radius
    const ry = parseFloat(await ellipse.getAttribute('ry'));
    
    // Y-radius should be at least half the line width
    const halfLineWidth = lineWidth / 2;
    expect(ry).toBeGreaterThanOrEqual(halfLineWidth - 1); // Allow small rounding errors
  });

  test('should keep both x and y radii equal to half line width when drawing very small ellipse', async ({ page }) => {
    // Set a specific line width
    const lineWidth = 16;
    await page.locator('.prop > .line-width').fill(lineWidth.toString());
    
    // Click the ellipse label to select it
    await page.locator('.shape > .ellipse').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw a very small ellipse (both radii less than half line width)
    const startX = canvasBoundingBox.x + 100;
    const startY = canvasBoundingBox.y + 100;
    const endX = startX + 6; // Width less than line width
    const endY = startY + 6; // Height less than line width
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if an ellipse element was created
    const ellipse = page.locator('.canvas ellipse');
    await expect(ellipse).toBeVisible();
    
    // Get ellipse radii
    const rx = parseFloat(await ellipse.getAttribute('rx'));
    const ry = parseFloat(await ellipse.getAttribute('ry'));
    
    // Both radii should be at least half the line width
    const halfLineWidth = lineWidth / 2;
    expect(rx).toBeGreaterThanOrEqual(halfLineWidth - 1); // Allow small rounding errors
    expect(ry).toBeGreaterThanOrEqual(halfLineWidth - 1); // Allow small rounding errors
  });

  test('should not modify ellipse radii when they exceed half line width', async ({ page }) => {
    // Set a specific line width
    const lineWidth = 10;
    await page.locator('.prop > .line-width').fill(lineWidth.toString());
    
    // Click the ellipse label to select it
    await page.locator('.shape > .ellipse').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw an ellipse larger than the line width
    const startX = canvasBoundingBox.x + 100;
    const startY = canvasBoundingBox.y + 100;
    const endX = startX + 50; // Width greater than line width
    const endY = startY + 50; // Height greater than line width
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if an ellipse element was created
    const ellipse = page.locator('.canvas ellipse');
    await expect(ellipse).toBeVisible();
    
    // Get ellipse radii
    const rx = parseFloat(await ellipse.getAttribute('rx'));
    const ry = parseFloat(await ellipse.getAttribute('ry'));
    
    // Expected radii based on mouse movement
    const expectedRx = Math.abs(endX - startX) / 2;
    const expectedRy = Math.abs(endY - startY) / 2;
    
    // Radii should be close to the expected values (not modified)
    expect(rx).toBeCloseTo(expectedRx, 0);
    expect(ry).toBeCloseTo(expectedRy, 0);
  });

  test('should work with different line width values', async ({ page }) => {
    // Test with a larger line width
    const lineWidth = 20;
    await page.locator('.prop > .line-width').fill(lineWidth.toString());
    
    // Click the ellipse label to select it
    await page.locator('.shape > .ellipse').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw a very small ellipse
    const startX = canvasBoundingBox.x + 100;
    const startY = canvasBoundingBox.y + 100;
    const endX = startX + 5; // Width less than line width
    const endY = startY + 5; // Height less than line width
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if an ellipse element was created
    const ellipse = page.locator('.canvas ellipse');
    await expect(ellipse).toBeVisible();
    
    // Get ellipse radii
    const rx = parseFloat(await ellipse.getAttribute('rx'));
    const ry = parseFloat(await ellipse.getAttribute('ry'));
    
    // Both radii should be at least half the line width
    const halfLineWidth = lineWidth / 2;
    expect(rx).toBeGreaterThanOrEqual(halfLineWidth - 1); // Allow small rounding errors
    expect(ry).toBeGreaterThanOrEqual(halfLineWidth - 1); // Allow small rounding errors
  });
});