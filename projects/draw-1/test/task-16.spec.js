// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 16 Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should enforce minimum line length based on line width', async ({ page }) => {
    // Set a large line width
    await page.locator('.prop input[type="range"]').fill('20');
    
    // Click the line label
    await page.locator('.shape > .line').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Try to draw a very short line (shorter than line width)
    await page.mouse.move(canvasBoundingBox.x + 100, canvasBoundingBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 105, canvasBoundingBox.y + 105); // Only 7.07px diagonal length
    await page.mouse.up();
    
    // Verify line was created
    const line = page.locator('.canvas line');
    await expect(line).toBeVisible();
    
    // Get line coordinates
    const x1 = parseFloat(await line.getAttribute('x1'));
    const y1 = parseFloat(await line.getAttribute('y1'));
    const x2 = parseFloat(await line.getAttribute('x2'));
    const y2 = parseFloat(await line.getAttribute('y2'));
    
    // Calculate actual line length
    const actualLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    
    // Verify the line length is at least the line width
    expect(actualLength).toBeGreaterThanOrEqual(20);
    
    // Verify the line direction is maintained
    const originalDx = 5; // 105 - 100
    const originalDy = 5; // 105 - 100
    const actualDx = x2 - x1;
    const actualDy = y2 - y1;
    
    // Check if the direction is maintained (same ratio)
    const originalRatio = originalDy / originalDx;
    const actualRatio = actualDy / actualDx;
    expect(actualRatio).toBeCloseTo(originalRatio, 1);
  });

  test('should enforce minimum rectangle dimensions based on line width', async ({ page }) => {
    // Set a large line width
    await page.locator('.prop input[type="range"]').fill('20');
    
    // Click the rect label
    await page.locator('.shape > .rect').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Try to draw a very small rectangle (smaller than line width)
    await page.mouse.move(canvasBoundingBox.x + 100, canvasBoundingBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 105, canvasBoundingBox.y + 105); // Only 5x5 rectangle
    await page.mouse.up();
    
    // Verify rectangle was created
    const rect = page.locator('.canvas rect');
    await expect(rect).toBeVisible();
    
    // Get rectangle dimensions
    const width = parseFloat(await rect.getAttribute('width'));
    const height = parseFloat(await rect.getAttribute('height'));
    
    // Verify both width and height are at least the line width
    expect(width).toBeGreaterThanOrEqual(20);
    expect(height).toBeGreaterThanOrEqual(20);
  });

  test('should enforce minimum ellipse radii based on half the line width', async ({ page }) => {
    // Set a large line width
    await page.locator('.prop input[type="range"]').fill('20');
    
    // Click the ellipse label
    await page.locator('.shape > .ellipse').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Try to draw a very small ellipse (smaller than line width)
    await page.mouse.move(canvasBoundingBox.x + 100, canvasBoundingBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 105, canvasBoundingBox.y + 105); // Only 5x5 ellipse (rx=2.5, ry=2.5)
    await page.mouse.up();
    
    // Verify ellipse was created
    const ellipse = page.locator('.canvas ellipse');
    await expect(ellipse).toBeVisible();
    
    // Get ellipse radii
    const rx = parseFloat(await ellipse.getAttribute('rx'));
    const ry = parseFloat(await ellipse.getAttribute('ry'));
    
    // Verify both radii are at least half the line width
    expect(rx).toBeGreaterThanOrEqual(10); // Half of 20
    expect(ry).toBeGreaterThanOrEqual(10); // Half of 20
  });

  test('should adjust only the width of a rectangle if height is already sufficient', async ({ page }) => {
    // Set a line width
    await page.locator('.prop input[type="range"]').fill('15');
    
    // Click the rect label
    await page.locator('.shape > .rect').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Try to draw a rectangle with width smaller than line width but height larger
    await page.mouse.move(canvasBoundingBox.x + 100, canvasBoundingBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 105, canvasBoundingBox.y + 130); // 5x30 rectangle
    await page.mouse.up();
    
    // Verify rectangle was created
    const rect = page.locator('.canvas rect');
    await expect(rect).toBeVisible();
    
    // Get rectangle dimensions
    const width = parseFloat(await rect.getAttribute('width'));
    const height = parseFloat(await rect.getAttribute('height'));
    
    // Verify width is adjusted but height is unchanged
    expect(width).toBeGreaterThanOrEqual(15);
    expect(height).toBeCloseTo(30, 0);
  });

  test('should adjust only the height of a rectangle if width is already sufficient', async ({ page }) => {
    // Set a line width
    await page.locator('.prop input[type="range"]').fill('15');
    
    // Click the rect label
    await page.locator('.shape > .rect').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Try to draw a rectangle with height smaller than line width but width larger
    await page.mouse.move(canvasBoundingBox.x + 100, canvasBoundingBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 130, canvasBoundingBox.y + 105); // 30x5 rectangle
    await page.mouse.up();
    
    // Verify rectangle was created
    const rect = page.locator('.canvas rect');
    await expect(rect).toBeVisible();
    
    // Get rectangle dimensions
    const width = parseFloat(await rect.getAttribute('width'));
    const height = parseFloat(await rect.getAttribute('height'));
    
    // Verify height is adjusted but width is unchanged
    expect(width).toBeCloseTo(30, 0);
    expect(height).toBeGreaterThanOrEqual(15);
  });
});