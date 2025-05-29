// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 3 Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should be able to draw a line on canvas after clicking line label', async ({ page }) => {
    // Click the line label to select it
    await page.locator('.shape > .line').click();
    
    // Get the canvas element
    const canvas = page.locator('.canvas');
    await expect(canvas).toBeVisible();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Define start and end points for the line
    const startX = canvasBoundingBox.x + 50;
    const startY = canvasBoundingBox.y + 50;
    const endX = canvasBoundingBox.x + 150;
    const endY = canvasBoundingBox.y + 150;
    
    // Draw a line by mouse down at start point and mouse up at end point
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if a line element was created in the SVG canvas
    const line = page.locator('.canvas line');
    await expect(line).toBeVisible();
    
    // Check if the line has the correct coordinates
    const x1 = await line.getAttribute('x1');
    const y1 = await line.getAttribute('y1');
    const x2 = await line.getAttribute('x2');
    const y2 = await line.getAttribute('y2');
    
    // Convert to numbers for comparison
    expect(parseFloat(x1)).toBeCloseTo(startX - canvasBoundingBox.x, 0);
    expect(parseFloat(y1)).toBeCloseTo(startY - canvasBoundingBox.y, 0);
    expect(parseFloat(x2)).toBeCloseTo(endX - canvasBoundingBox.x, 0);
    expect(parseFloat(y2)).toBeCloseTo(endY - canvasBoundingBox.y, 0);
  });

  test('should apply line width from input to drawn line', async ({ page }) => {
    // Set a specific line width
    await page.locator('.prop > .line-width').fill('5');
    
    // Click the line label to select it
    await page.locator('.shape > .line').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw a line
    const startX = canvasBoundingBox.x + 50;
    const startY = canvasBoundingBox.y + 50;
    const endX = canvasBoundingBox.x + 150;
    const endY = canvasBoundingBox.y + 150;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if the line has the correct stroke-width
    const line = page.locator('.canvas line');
    const strokeWidth = await line.getAttribute('stroke-width');
    
    expect(strokeWidth).toBe('5');
  });

  test('should apply color from color selector to drawn line', async ({ page }) => {
    // Set a specific color
    await page.locator('.prop > .color').fill('#ff0000');
    
    // Click the line label to select it
    await page.locator('.shape > .line').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw a line
    const startX = canvasBoundingBox.x + 50;
    const startY = canvasBoundingBox.y + 50;
    const endX = canvasBoundingBox.x + 150;
    const endY = canvasBoundingBox.y + 150;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if the line has the correct stroke color
    const line = page.locator('.canvas line');
    const strokeColor = await line.getAttribute('stroke');
    
    expect(strokeColor.toLowerCase()).toBe('#ff0000');
  });

  test('should be able to draw multiple lines', async ({ page }) => {
    // Click the line label to select it
    await page.locator('.shape > .line').click();
    
    // Get canvas bounding box for mouse operations
    const canvasBoundingBox = await page.locator('.canvas').boundingBox();
    
    // Draw first line
    await page.mouse.move(canvasBoundingBox.x + 50, canvasBoundingBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 150, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Draw second line
    await page.mouse.move(canvasBoundingBox.x + 200, canvasBoundingBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 300, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Check if two lines were created
    const lines = page.locator('.canvas line');
    expect(await lines.count()).toBe(2);
  });
});