// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 13 Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should be able to rotate a rectangle after clicking rotate label', async ({ page }) => {
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
    
    // Get original rectangle transform (might be none or empty)
    const originalTransform = await rect.getAttribute('transform') || '';
    
    // Now click rotate label
    await page.locator('.operation > .rotate').click();
    
    // Get rectangle center for rotation reference
    const rectBox = await rect.boundingBox();
    const rectCenterX = rectBox.x + rectBox.width / 2;
    const rectCenterY = rectBox.y + rectBox.height / 2;
    
    // Rotate the rectangle by dragging from a point away from center
    const dragStartX = rectCenterX + 50; // Start 50px to the right of center
    const dragStartY = rectCenterY;
    
    // Drag in a circular motion to simulate rotation
    const dragEndX = rectCenterX; // End at the top of the center
    const dragEndY = rectCenterY - 50;
    
    await page.mouse.move(dragStartX, dragStartY);
    await page.mouse.down();
    await page.mouse.move(dragEndX, dragEndY);
    await page.mouse.up();
    
    // Get new rectangle transform
    const newTransform = await rect.getAttribute('transform');
    
    // Verify the rectangle has a transform attribute now
    expect(newTransform).toBeTruthy();
    expect(newTransform).not.toEqual(originalTransform);
    
    // The transform should include a rotation component
    expect(newTransform.includes('rotate')).toBe(true);
  });

  test('should be able to rotate an ellipse after clicking rotate label', async ({ page }) => {
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
    
    // Get original ellipse transform (might be none or empty)
    const originalTransform = await ellipse.getAttribute('transform') || '';
    
    // Now click rotate label
    await page.locator('.operation > .rotate').click();
    
    // Get ellipse center for rotation reference
    const ellipseBox = await ellipse.boundingBox();
    const ellipseCenterX = ellipseBox.x + ellipseBox.width / 2;
    const ellipseCenterY = ellipseBox.y + ellipseBox.height / 2;
    
    // Rotate the ellipse by dragging from a point away from center
    const dragStartX = ellipseCenterX + 50; // Start 50px to the right of center
    const dragStartY = ellipseCenterY;
    
    // Drag in a circular motion to simulate rotation
    const dragEndX = ellipseCenterX; // End at the top of the center
    const dragEndY = ellipseCenterY - 50;
    
    await page.mouse.move(dragStartX, dragStartY);
    await page.mouse.down();
    await page.mouse.move(dragEndX, dragEndY);
    await page.mouse.up();
    
    // Get new ellipse transform
    const newTransform = await ellipse.getAttribute('transform');
    
    // Verify the ellipse has a transform attribute now
    expect(newTransform).toBeTruthy();
    expect(newTransform).not.toEqual(originalTransform);
    
    // The transform should include a rotation component
    expect(newTransform.includes('rotate')).toBe(true);
  });

  test('should be able to rotate a line after clicking rotate label', async ({ page }) => {
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
    
    // Get original line transform (might be none or empty)
    const originalTransform = await line.getAttribute('transform') || '';
    
    // Now click rotate label
    await page.locator('.operation > .rotate').click();
    
    // Get line center for rotation reference
    const lineBox = await line.boundingBox();
    const lineCenterX = lineBox.x + lineBox.width / 2;
    const lineCenterY = lineBox.y + lineBox.height / 2;
    
    // Rotate the line by dragging from a point away from center
    const dragStartX = lineCenterX + 50; // Start 50px to the right of center
    const dragStartY = lineCenterY;
    
    // Drag in a circular motion to simulate rotation
    const dragEndX = lineCenterX; // End at the top of the center
    const dragEndY = lineCenterY - 50;
    
    await page.mouse.move(dragStartX, dragStartY);
    await page.mouse.down();
    await page.mouse.move(dragEndX, dragEndY);
    await page.mouse.up();
    
    // Get new line transform
    const newTransform = await line.getAttribute('transform');
    
    // Verify the line has a transform attribute now
    expect(newTransform).toBeTruthy();
    expect(newTransform).not.toEqual(originalTransform);
    
    // The transform should include a rotation component
    expect(newTransform.includes('rotate')).toBe(true);
  });

  test('should rotate shape around its center', async ({ page }) => {
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
    
    // Get original rectangle position and dimensions
    const originalX = parseFloat(await rect.getAttribute('x'));
    const originalY = parseFloat(await rect.getAttribute('y'));
    const width = parseFloat(await rect.getAttribute('width'));
    const height = parseFloat(await rect.getAttribute('height'));
    
    // Calculate center of rectangle
    const centerX = originalX + width / 2;
    const centerY = originalY + height / 2;
    
    // Now click rotate label
    await page.locator('.operation > .rotate').click();
    
    // Get rectangle bounding box for mouse operations
    const rectBox = await rect.boundingBox();
    
    // Rotate the rectangle
    const dragStartX = rectBox.x + rectBox.width; // Start at right edge
    const dragStartY = rectBox.y + rectBox.height / 2;
    const dragEndX = rectBox.x + rectBox.width / 2; // End at top edge
    const dragEndY = rectBox.y;
    
    await page.mouse.move(dragStartX, dragStartY);
    await page.mouse.down();
    await page.mouse.move(dragEndX, dragEndY);
    await page.mouse.up();
    
    // Get new transform
    const transform = await rect.getAttribute('transform');
    
    // The transform should include the center coordinates
    // Format is typically: rotate(angle, centerX, centerY)
    expect(transform).toContain(`${centerX.toFixed(0)}`);
    expect(transform).toContain(`${centerY.toFixed(0)}`);
  });

  test('should only rotate the selected shape when multiple shapes exist', async ({ page }) => {
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
    
    // Get original transforms
    const originalRectTransform = await rect.getAttribute('transform') || '';
    const originalEllipseTransform = await ellipse.getAttribute('transform') || '';
    
    // Now click rotate label
    await page.locator('.operation > .rotate').click();
    
    // Rotate only the rectangle
    const rectBox = await rect.boundingBox();
    const rectCenterX = rectBox.x + rectBox.width / 2;
    const rectCenterY = rectBox.y + rectBox.height / 2;
    
    await page.mouse.move(rectCenterX + 50, rectCenterY);
    await page.mouse.down();
    await page.mouse.move(rectCenterX, rectCenterY - 50);
    await page.mouse.up();
    
    // Get new transforms
    const newRectTransform = await rect.getAttribute('transform');
    const newEllipseTransform = await ellipse.getAttribute('transform') || '';
    
    // Verify only the rectangle was rotated
    expect(newRectTransform).toBeTruthy();
    expect(newRectTransform).not.toEqual(originalRectTransform);
    expect(newEllipseTransform).toEqual(originalEllipseTransform);
  });
});