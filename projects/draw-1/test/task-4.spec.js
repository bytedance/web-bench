// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 4 Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should be able to draw a rect on canvas after clicking rect label', async ({ page }) => {
    // Click the rect label to select it
    await page.locator('.shape > .rect').click();
    
    // Get the canvas element
    const canvas = page.locator('.canvas');
    await expect(canvas).toBeVisible();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Define start and end points for the rectangle
    const startX = canvasBoundingBox.x + 50;
    const startY = canvasBoundingBox.y + 50;
    const endX = canvasBoundingBox.x + 150;
    const endY = canvasBoundingBox.y + 150;
    
    // Draw a rectangle by mouse down at start point and mouse up at end point
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if a rect element was created in the SVG canvas
    const rect = page.locator('.canvas rect');
    await expect(rect).toBeVisible();
    
    // Check if the rect has the correct coordinates
    const x = await rect.getAttribute('x');
    const y = await rect.getAttribute('y');
    const width = await rect.getAttribute('width');
    const height = await rect.getAttribute('height');
    
    // Convert to numbers for comparison
    expect(parseFloat(x)).toBeCloseTo(startX - canvasBoundingBox.x, 0);
    expect(parseFloat(y)).toBeCloseTo(startY - canvasBoundingBox.y, 0);
    expect(parseFloat(width)).toBeCloseTo(endX - startX, 0);
    expect(parseFloat(height)).toBeCloseTo(endY - startY, 0);
  });

  test('should apply line width from input to drawn rect', async ({ page }) => {
    // Set a specific line width
    await page.locator('.prop > .line-width').fill('5');
    
    // Click the rect label to select it
    await page.locator('.shape > .rect').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw a rectangle
    const startX = canvasBoundingBox.x + 50;
    const startY = canvasBoundingBox.y + 50;
    const endX = canvasBoundingBox.x + 150;
    const endY = canvasBoundingBox.y + 150;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if the rect has the correct stroke-width
    const rect = page.locator('.canvas rect');
    const strokeWidth = await rect.getAttribute('stroke-width');
    
    expect(strokeWidth).toBe('5');
  });

  test('should apply color from color selector to drawn rect stroke', async ({ page }) => {
    // Set a specific color
    await page.locator('.prop > .color').fill('#ff0000');
    
    // Click the rect label to select it
    await page.locator('.shape > .rect').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw a rectangle
    const startX = canvasBoundingBox.x + 50;
    const startY = canvasBoundingBox.y + 50;
    const endX = canvasBoundingBox.x + 150;
    const endY = canvasBoundingBox.y + 150;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if the rect has the correct stroke color
    const rect = page.locator('.canvas rect');
    const strokeColor = await rect.getAttribute('stroke');
    
    expect(strokeColor.toLowerCase()).toBe('#ff0000');
  });

  test('should have white fill color for drawn rect', async ({ page }) => {
    // Click the rect label to select it
    await page.locator('.shape > .rect').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw a rectangle
    const startX = canvasBoundingBox.x + 50;
    const startY = canvasBoundingBox.y + 50;
    const endX = canvasBoundingBox.x + 150;
    const endY = canvasBoundingBox.y + 150;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if the rect has white fill color
    const rect = page.locator('.canvas rect');
    const fillColor = await rect.getAttribute('fill');
    
    expect(fillColor.toLowerCase()).toBe('white');
  });

  test('should be able to draw multiple rects', async ({ page }) => {
    // Click the rect label to select it
    await page.locator('.shape > .rect').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw first rectangle
    await page.mouse.move(canvasBoundingBox.x + 50, canvasBoundingBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 150, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Draw second rectangle
    await page.mouse.move(canvasBoundingBox.x + 200, canvasBoundingBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 300, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Check if two rectangles were created
    const rects = page.locator('.canvas rect');
    expect(await rects.count()).toBe(2);
  });
});