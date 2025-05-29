// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 9 Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should keep line length equal to line width when drawing very short line', async ({ page }) => {
    // Set a specific line width
    const lineWidth = 15;
    await page.locator('.prop > .line-width').fill(lineWidth.toString());
    
    // Click the line label to select it
    await page.locator('.shape > .line').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw a very short line (shorter than line width)
    const startX = canvasBoundingBox.x + 100;
    const startY = canvasBoundingBox.y + 100;
    const endX = startX + 5; // Make it shorter than line width (15)
    const endY = startY + 5;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if a line element was created
    const line = page.locator('.canvas line');
    await expect(line).toBeVisible();
    
    // Get line coordinates
    const x1 = parseFloat(await line.getAttribute('x1'));
    const y1 = parseFloat(await line.getAttribute('y1'));
    const x2 = parseFloat(await line.getAttribute('x2'));
    const y2 = parseFloat(await line.getAttribute('y2'));
    
    // Calculate line length using Pythagorean theorem
    const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    
    // Line length should be at least the line width
    expect(lineLength).toBeGreaterThanOrEqual(lineWidth - 1); // Allow small rounding errors
  });

  test('should maintain line direction when adjusting short line length', async ({ page }) => {
    // Set a specific line width
    const lineWidth = 15;
    await page.locator('.prop > .line-width').fill(lineWidth.toString());
    
    // Click the line label to select it
    await page.locator('.shape > .line').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw a very short diagonal line
    const startX = canvasBoundingBox.x + 100;
    const startY = canvasBoundingBox.y + 100;
    const endX = startX + 3; // Very short horizontal component
    const endY = startY + 4; // Very short vertical component
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if a line element was created
    const line = page.locator('.canvas line');
    await expect(line).toBeVisible();
    
    // Get line coordinates
    const x1 = parseFloat(await line.getAttribute('x1'));
    const y1 = parseFloat(await line.getAttribute('y1'));
    const x2 = parseFloat(await line.getAttribute('x2'));
    const y2 = parseFloat(await line.getAttribute('y2'));
    
    // Calculate original direction vector
    const originalDx = endX - startX;
    const originalDy = endY - startY;
    const originalLength = Math.sqrt(Math.pow(originalDx, 2) + Math.pow(originalDy, 2));
    const originalUnitDx = originalDx / originalLength;
    const originalUnitDy = originalDy / originalLength;
    
    // Calculate actual direction vector
    const actualDx = x2 - x1;
    const actualDy = y2 - y1;
    const actualLength = Math.sqrt(Math.pow(actualDx, 2) + Math.pow(actualDy, 2));
    const actualUnitDx = actualDx / actualLength;
    const actualUnitDy = actualDy / actualLength;
    
    // Direction should be maintained (unit vectors should be similar)
    expect(actualUnitDx).toBeCloseTo(originalUnitDx, 1);
    expect(actualUnitDy).toBeCloseTo(originalUnitDy, 1);
    
    // Length should be at least the line width
    expect(actualLength).toBeGreaterThanOrEqual(lineWidth - 1); // Allow small rounding errors
  });

  test('should not modify line length when it exceeds line width', async ({ page }) => {
    // Set a specific line width
    const lineWidth = 10;
    await page.locator('.prop > .line-width').fill(lineWidth.toString());
    
    // Click the line label to select it
    await page.locator('.shape > .line').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw a line longer than the line width
    const startX = canvasBoundingBox.x + 100;
    const startY = canvasBoundingBox.y + 100;
    const endX = startX + 50; // Much longer than line width
    const endY = startY + 50;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if a line element was created
    const line = page.locator('.canvas line');
    await expect(line).toBeVisible();
    
    // Get line coordinates
    const x1 = parseFloat(await line.getAttribute('x1'));
    const y1 = parseFloat(await line.getAttribute('y1'));
    const x2 = parseFloat(await line.getAttribute('x2'));
    const y2 = parseFloat(await line.getAttribute('y2'));
    
    // Calculate line length
    const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    
    // Expected length based on mouse movement
    const expectedLength = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    
    // Line length should be close to the expected length (not modified)
    expect(lineLength).toBeCloseTo(expectedLength, 0);
  });

  test('should work with different line width values', async ({ page }) => {
    // Test with a larger line width
    const lineWidth = 20;
    await page.locator('.prop > .line-width').fill(lineWidth.toString());
    
    // Click the line label to select it
    await page.locator('.shape > .line').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw a very short line
    const startX = canvasBoundingBox.x + 100;
    const startY = canvasBoundingBox.y + 100;
    const endX = startX + 5; // Shorter than line width
    const endY = startY;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if a line element was created
    const line = page.locator('.canvas line');
    await expect(line).toBeVisible();
    
    // Get line coordinates
    const x1 = parseFloat(await line.getAttribute('x1'));
    const y1 = parseFloat(await line.getAttribute('y1'));
    const x2 = parseFloat(await line.getAttribute('x2'));
    const y2 = parseFloat(await line.getAttribute('y2'));
    
    // Calculate line length
    const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    
    // Line length should be at least the line width
    expect(lineLength).toBeGreaterThanOrEqual(lineWidth - 1); // Allow small rounding errors
  });
});