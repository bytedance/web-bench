// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 10 Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should keep rectangle width equal to line width when drawing very narrow rect', async ({ page }) => {
    // Set a specific line width
    const lineWidth = 15;
    await page.locator('.prop > .line-width').fill(lineWidth.toString());
    
    // Click the rect label to select it
    await page.locator('.shape > .rect').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw a very narrow rectangle (width less than line width)
    const startX = canvasBoundingBox.x + 100;
    const startY = canvasBoundingBox.y + 100;
    const endX = startX + 5; // Width less than line width (15)
    const endY = startY + 50; // Height greater than line width
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if a rect element was created
    const rect = page.locator('.canvas rect');
    await expect(rect).toBeVisible();
    
    // Get rectangle width
    const width = parseFloat(await rect.getAttribute('width'));
    
    // Width should be at least the line width
    expect(width).toBeGreaterThanOrEqual(lineWidth - 1); // Allow small rounding errors
  });

  test('should keep rectangle height equal to line width when drawing very short rect', async ({ page }) => {
    // Set a specific line width
    const lineWidth = 15;
    await page.locator('.prop > .line-width').fill(lineWidth.toString());
    
    // Click the rect label to select it
    await page.locator('.shape > .rect').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw a very short rectangle (height less than line width)
    const startX = canvasBoundingBox.x + 100;
    const startY = canvasBoundingBox.y + 100;
    const endX = startX + 50; // Width greater than line width
    const endY = startY + 5; // Height less than line width (15)
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if a rect element was created
    const rect = page.locator('.canvas rect');
    await expect(rect).toBeVisible();
    
    // Get rectangle height
    const height = parseFloat(await rect.getAttribute('height'));
    
    // Height should be at least the line width
    expect(height).toBeGreaterThanOrEqual(lineWidth - 1); // Allow small rounding errors
  });

  test('should keep both width and height equal to line width when drawing very small rect', async ({ page }) => {
    // Set a specific line width
    const lineWidth = 15;
    await page.locator('.prop > .line-width').fill(lineWidth.toString());
    
    // Click the rect label to select it
    await page.locator('.shape > .rect').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw a very small rectangle (both width and height less than line width)
    const startX = canvasBoundingBox.x + 100;
    const startY = canvasBoundingBox.y + 100;
    const endX = startX + 5; // Width less than line width
    const endY = startY + 5; // Height less than line width
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if a rect element was created
    const rect = page.locator('.canvas rect');
    await expect(rect).toBeVisible();
    
    // Get rectangle dimensions
    const width = parseFloat(await rect.getAttribute('width'));
    const height = parseFloat(await rect.getAttribute('height'));
    
    // Both width and height should be at least the line width
    expect(width).toBeGreaterThanOrEqual(lineWidth - 1); // Allow small rounding errors
    expect(height).toBeGreaterThanOrEqual(lineWidth - 1); // Allow small rounding errors
  });

  test('should not modify rectangle dimensions when they exceed line width', async ({ page }) => {
    // Set a specific line width
    const lineWidth = 10;
    await page.locator('.prop > .line-width').fill(lineWidth.toString());
    
    // Click the rect label to select it
    await page.locator('.shape > .rect').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw a rectangle larger than the line width
    const startX = canvasBoundingBox.x + 100;
    const startY = canvasBoundingBox.y + 100;
    const endX = startX + 50; // Width greater than line width
    const endY = startY + 50; // Height greater than line width
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if a rect element was created
    const rect = page.locator('.canvas rect');
    await expect(rect).toBeVisible();
    
    // Get rectangle dimensions
    const width = parseFloat(await rect.getAttribute('width'));
    const height = parseFloat(await rect.getAttribute('height'));
    
    // Expected dimensions based on mouse movement
    const expectedWidth = Math.abs(endX - startX);
    const expectedHeight = Math.abs(endY - startY);
    
    // Dimensions should be close to the expected values (not modified)
    expect(width).toBeCloseTo(expectedWidth, 0);
    expect(height).toBeCloseTo(expectedHeight, 0);
  });

  test('should work with different line width values', async ({ page }) => {
    // Test with a larger line width
    const lineWidth = 20;
    await page.locator('.prop > .line-width').fill(lineWidth.toString());
    
    // Click the rect label to select it
    await page.locator('.shape > .rect').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw a very small rectangle
    const startX = canvasBoundingBox.x + 100;
    const startY = canvasBoundingBox.y + 100;
    const endX = startX + 5; // Width less than line width
    const endY = startY + 5; // Height less than line width
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if a rect element was created
    const rect = page.locator('.canvas rect');
    await expect(rect).toBeVisible();
    
    // Get rectangle dimensions
    const width = parseFloat(await rect.getAttribute('width'));
    const height = parseFloat(await rect.getAttribute('height'));
    
    // Both width and height should be at least the line width
    expect(width).toBeGreaterThanOrEqual(lineWidth - 1); // Allow small rounding errors
    expect(height).toBeGreaterThanOrEqual(lineWidth - 1); // Allow small rounding errors
  });
});