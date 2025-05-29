// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 14 Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should be able to zoom a rectangle after clicking zoom label', async ({ page }) => {
    // First draw a rectangle
    await page.locator('.shape > .rect').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Draw a rectangle
    await page.mouse.move(canvasBoundingBox.x + 100, canvasBoundingBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 200, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Verify rectangle was created
    const rect = page.locator('.canvas rect');
    await expect(rect).toBeVisible();
    
    // Get original rectangle dimensions
    const originalWidth = parseFloat(await rect.getAttribute('width'));
    const originalHeight = parseFloat(await rect.getAttribute('height'));
    
    // Now click zoom label
    await page.locator('.operation > .zoom').click();
    
    // Get rectangle center for zoom reference
    const rectBox = await rect.boundingBox();
    const rectCenterX = rectBox.x + rectBox.width / 2;
    const rectCenterY = rectBox.y + rectBox.height / 2;
    
    // Zoom the rectangle by dragging from a point away from center
    const dragStartX = rectCenterX + 50; // Start 50px to the right of center
    const dragStartY = rectCenterY;
    
    // Drag outward to zoom in
    const dragEndX = rectCenterX + 100; // End 100px to the right of center
    const dragEndY = rectCenterY;
    
    await page.mouse.move(dragStartX, dragStartY);
    await page.mouse.down();
    await page.mouse.move(dragEndX, dragEndY);
    await page.mouse.up();
    
    // Get new rectangle dimensions
    const newWidth = parseFloat(await rect.getAttribute('width'));
    const newHeight = parseFloat(await rect.getAttribute('height'));
    
    // Verify the rectangle has been zoomed (dimensions changed)
    expect(newWidth).toBeGreaterThan(originalWidth);
    expect(newHeight).toBeGreaterThan(originalHeight);
  });

  test('should be able to zoom an ellipse after clicking zoom label', async ({ page }) => {
    // First draw an ellipse
    await page.locator('.shape > .ellipse').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Draw an ellipse
    await page.mouse.move(canvasBoundingBox.x + 100, canvasBoundingBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 200, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Verify ellipse was created
    const ellipse = page.locator('.canvas ellipse');
    await expect(ellipse).toBeVisible();
    
    // Get original ellipse dimensions
    const originalRx = parseFloat(await ellipse.getAttribute('rx'));
    const originalRy = parseFloat(await ellipse.getAttribute('ry'));
    
    // Now click zoom label
    await page.locator('.operation > .zoom').click();
    
    // Get ellipse center for zoom reference
    const ellipseBox = await ellipse.boundingBox();
    const ellipseCenterX = ellipseBox.x + ellipseBox.width / 2;
    const ellipseCenterY = ellipseBox.y + ellipseBox.height / 2;
    
    // Zoom the ellipse by dragging from a point away from center
    const dragStartX = ellipseCenterX + 50; // Start 50px to the right of center
    const dragStartY = ellipseCenterY;
    
    // Drag outward to zoom in
    const dragEndX = ellipseCenterX + 100; // End 100px to the right of center
    const dragEndY = ellipseCenterY;
    
    await page.mouse.move(dragStartX, dragStartY);
    await page.mouse.down();
    await page.mouse.move(dragEndX, dragEndY);
    await page.mouse.up();
    
    // Get new ellipse dimensions
    const newRx = parseFloat(await ellipse.getAttribute('rx'));
    const newRy = parseFloat(await ellipse.getAttribute('ry'));
    
    // Verify the ellipse has been zoomed (dimensions changed)
    expect(newRx).toBeGreaterThan(originalRx);
    expect(newRy).toBeGreaterThan(originalRy);
  });

  test('should be able to zoom a line after clicking zoom label', async ({ page }) => {
    // First draw a line
    await page.locator('.shape > .line').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Draw a line
    await page.mouse.move(canvasBoundingBox.x + 100, canvasBoundingBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 200, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Verify line was created
    const line = page.locator('.canvas line');
    await expect(line).toBeVisible();
    
    // Get original line coordinates
    const originalX1 = parseFloat(await line.getAttribute('x1'));
    const originalY1 = parseFloat(await line.getAttribute('y1'));
    const originalX2 = parseFloat(await line.getAttribute('x2'));
    const originalY2 = parseFloat(await line.getAttribute('y2'));
    
    // Calculate original line length
    const originalLength = Math.sqrt(
      Math.pow(originalX2 - originalX1, 2) + 
      Math.pow(originalY2 - originalY1, 2)
    );
    
    // Now click zoom label
    await page.locator('.operation > .zoom').click();
    
    // Get line center for zoom reference
    const lineBox = await line.boundingBox();
    const lineCenterX = lineBox.x + lineBox.width / 2;
    const lineCenterY = lineBox.y + lineBox.height / 2;
    
    // Zoom the line by dragging from a point away from center
    const dragStartX = lineCenterX + 50; // Start 50px to the right of center
    const dragStartY = lineCenterY;
    
    // Drag outward to zoom in
    const dragEndX = lineCenterX + 100; // End 100px to the right of center
    const dragEndY = lineCenterY;
    
    await page.mouse.move(dragStartX, dragStartY);
    await page.mouse.down();
    await page.mouse.move(dragEndX, dragEndY);
    await page.mouse.up();
    
    // Get new line coordinates
    const newX1 = parseFloat(await line.getAttribute('x1'));
    const newY1 = parseFloat(await line.getAttribute('y1'));
    const newX2 = parseFloat(await line.getAttribute('x2'));
    const newY2 = parseFloat(await line.getAttribute('y2'));
    
    // Calculate new line length
    const newLength = Math.sqrt(
      Math.pow(newX2 - newX1, 2) + 
      Math.pow(newY2 - newY1, 2)
    );
    
    // Verify the line has been zoomed (length changed)
    expect(newLength).toBeGreaterThan(originalLength);
  });

  test('should be able to zoom out (shrink) a shape', async ({ page }) => {
    // First draw a rectangle
    await page.locator('.shape > .rect').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Draw a large rectangle
    await page.mouse.move(canvasBoundingBox.x + 100, canvasBoundingBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 300, canvasBoundingBox.y + 300);
    await page.mouse.up();
    
    // Verify rectangle was created
    const rect = page.locator('.canvas rect');
    await expect(rect).toBeVisible();
    
    // Get original rectangle dimensions
    const originalWidth = parseFloat(await rect.getAttribute('width'));
    const originalHeight = parseFloat(await rect.getAttribute('height'));
    
    // Now click zoom label
    await page.locator('.operation > .zoom').click();
    
    // Get rectangle center for zoom reference
    const rectBox = await rect.boundingBox();
    const rectCenterX = rectBox.x + rectBox.width / 2;
    const rectCenterY = rectBox.y + rectBox.height / 2;
    
    // Zoom out the rectangle by dragging from a point away from center
    const dragStartX = rectCenterX + 100; // Start 100px to the right of center
    const dragStartY = rectCenterY;
    
    // Drag inward to zoom out
    const dragEndX = rectCenterX + 50; // End 50px to the right of center
    const dragEndY = rectCenterY;
    
    await page.mouse.move(dragStartX, dragStartY);
    await page.mouse.down();
    await page.mouse.move(dragEndX, dragEndY);
    await page.mouse.up();
    
    // Get new rectangle dimensions
    const newWidth = parseFloat(await rect.getAttribute('width'));
    const newHeight = parseFloat(await rect.getAttribute('height'));
    
    // Verify the rectangle has been zoomed out (dimensions decreased)
    expect(newWidth).toBeLessThan(originalWidth);
    expect(newHeight).toBeLessThan(originalHeight);
  });

  test('should only zoom the selected shape when multiple shapes exist', async ({ page }) => {
    // Draw a rectangle
    await page.locator('.shape > .rect').click();
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    await page.mouse.move(canvasBoundingBox.x + 50, canvasBoundingBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 150, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Draw an ellipse
    await page.locator('.shape > .ellipse').click();
    await page.mouse.move(canvasBoundingBox.x + 200, canvasBoundingBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 300, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Verify both shapes exist
    const rect = page.locator('.canvas rect');
    const ellipse = page.locator('.canvas ellipse');
    await expect(rect).toBeVisible();
    await expect(ellipse).toBeVisible();
    
    // Get original dimensions
    const originalRectWidth = parseFloat(await rect.getAttribute('width'));
    const originalRectHeight = parseFloat(await rect.getAttribute('height'));
    const originalEllipseRx = parseFloat(await ellipse.getAttribute('rx'));
    const originalEllipseRy = parseFloat(await ellipse.getAttribute('ry'));
    
    // Now click zoom label
    await page.locator('.operation > .zoom').click();
    
    // Zoom only the rectangle
    const rectBox = await rect.boundingBox();
    const rectCenterX = rectBox.x + rectBox.width / 2;
    const rectCenterY = rectBox.y + rectBox.height / 2;
    
    await page.mouse.move(rectCenterX + 50, rectCenterY);
    await page.mouse.down();
    await page.mouse.move(rectCenterX + 100, rectCenterY);
    await page.mouse.up();
    
    // Get new dimensions
    const newRectWidth = parseFloat(await rect.getAttribute('width'));
    const newRectHeight = parseFloat(await rect.getAttribute('height'));
    const newEllipseRx = parseFloat(await ellipse.getAttribute('rx'));
    const newEllipseRy = parseFloat(await ellipse.getAttribute('ry'));
    
    // Verify only the rectangle was zoomed
    expect(newRectWidth).toBeGreaterThan(originalRectWidth);
    expect(newRectHeight).toBeGreaterThan(originalRectHeight);
    expect(newEllipseRx).toEqual(originalEllipseRx);
    expect(newEllipseRy).toEqual(originalEllipseRy);
  });
});