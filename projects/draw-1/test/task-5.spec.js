// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 5 Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should be able to draw an ellipse on canvas after clicking ellipse label', async ({ page }) => {
    // Click the ellipse label to select it
    await page.locator('.shape > .ellipse').click();
    
    // Get the canvas element
    const canvas = page.locator('.canvas');
    await expect(canvas).toBeVisible();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Define start and end points for the ellipse
    const startX = canvasBoundingBox.x + 50;
    const startY = canvasBoundingBox.y + 50;
    const endX = canvasBoundingBox.x + 150;
    const endY = canvasBoundingBox.y + 150;
    
    // Draw an ellipse by mouse down at start point and mouse up at end point
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if an ellipse element was created in the SVG canvas
    const ellipse = page.locator('.canvas ellipse');
    await expect(ellipse).toBeVisible();
    
    // Check if the ellipse has the correct attributes
    const cx = await ellipse.getAttribute('cx');
    const cy = await ellipse.getAttribute('cy');
    const rx = await ellipse.getAttribute('rx');
    const ry = await ellipse.getAttribute('ry');
    
    // Calculate expected values
    const expectedCX = startX - canvasBoundingBox.x + (endX - startX) / 2;
    const expectedCY = startY - canvasBoundingBox.y + (endY - startY) / 2;
    const expectedRX = Math.abs(endX - startX) / 2;
    const expectedRY = Math.abs(endY - startY) / 2;
    
    // Convert to numbers for comparison
    expect(parseFloat(cx)).toBeCloseTo(expectedCX, 0);
    expect(parseFloat(cy)).toBeCloseTo(expectedCY, 0);
    expect(parseFloat(rx)).toBeCloseTo(expectedRX, 0);
    expect(parseFloat(ry)).toBeCloseTo(expectedRY, 0);
  });

  test('should apply line width from input to drawn ellipse', async ({ page }) => {
    // Set a specific line width
    await page.locator('.prop > .line-width').fill('5');
    
    // Click the ellipse label to select it
    await page.locator('.shape > .ellipse').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw an ellipse
    const startX = canvasBoundingBox.x + 50;
    const startY = canvasBoundingBox.y + 50;
    const endX = canvasBoundingBox.x + 150;
    const endY = canvasBoundingBox.y + 150;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if the ellipse has the correct stroke-width
    const ellipse = page.locator('.canvas ellipse');
    const strokeWidth = await ellipse.getAttribute('stroke-width');
    
    expect(strokeWidth).toBe('5');
  });

  test('should apply color from color selector to drawn ellipse stroke', async ({ page }) => {
    // Set a specific color
    await page.locator('.prop > .color').fill('#ff0000');
    
    // Click the ellipse label to select it
    await page.locator('.shape > .ellipse').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw an ellipse
    const startX = canvasBoundingBox.x + 50;
    const startY = canvasBoundingBox.y + 50;
    const endX = canvasBoundingBox.x + 150;
    const endY = canvasBoundingBox.y + 150;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if the ellipse has the correct stroke color
    const ellipse = page.locator('.canvas ellipse');
    const strokeColor = await ellipse.getAttribute('stroke');
    
    expect(strokeColor.toLowerCase()).toBe('#ff0000');
  });

  test('should have white fill color for drawn ellipse', async ({ page }) => {
    // Click the ellipse label to select it
    await page.locator('.shape > .ellipse').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw an ellipse
    const startX = canvasBoundingBox.x + 50;
    const startY = canvasBoundingBox.y + 50;
    const endX = canvasBoundingBox.x + 150;
    const endY = canvasBoundingBox.y + 150;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if the ellipse has white fill color
    const ellipse = page.locator('.canvas ellipse');
    const fillColor = await ellipse.getAttribute('fill');
    
    expect(fillColor.toLowerCase()).toBe('white');
  });

  test('should be able to draw multiple ellipses', async ({ page }) => {
    // Click the ellipse label to select it
    await page.locator('.shape > .ellipse').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw first ellipse
    await page.mouse.move(canvasBoundingBox.x + 50, canvasBoundingBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 150, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Draw second ellipse
    await page.mouse.move(canvasBoundingBox.x + 200, canvasBoundingBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 300, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Check if two ellipses were created
    const ellipses = page.locator('.canvas ellipse');
    expect(await ellipses.count()).toBe(2);
  });
});