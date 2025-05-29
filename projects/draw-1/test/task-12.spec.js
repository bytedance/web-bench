// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 12 Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should be able to move a rectangle after clicking move label', async ({ page }) => {
    // First draw a rectangle
    await page.locator('.shape > .rect').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Draw a rectangle
    await page.mouse.move(canvasBoundingBox.x + 50, canvasBoundingBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 150, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Verify rectangle was created
    const rect = page.locator('.canvas rect');
    await expect(rect).toBeVisible();
    
    // Get original rectangle position
    const originalX = parseFloat(await rect.getAttribute('x'));
    const originalY = parseFloat(await rect.getAttribute('y'));
    
    // Now click move label
    await page.locator('.operation > .move').click();
    
    // Get rectangle center for dragging
    const rectBox = await rect.boundingBox();
    const rectCenterX = rectBox.x + rectBox.width / 2;
    const rectCenterY = rectBox.y + rectBox.height / 2;
    
    // Move the rectangle by dragging it
    const moveOffsetX = 50;
    const moveOffsetY = 30;
    
    await page.mouse.move(rectCenterX, rectCenterY);
    await page.mouse.down();
    await page.mouse.move(rectCenterX + moveOffsetX, rectCenterY + moveOffsetY);
    await page.mouse.up();
    
    // Get new rectangle position
    const newX = parseFloat(await rect.getAttribute('x'));
    const newY = parseFloat(await rect.getAttribute('y'));
    
    // Verify the rectangle has moved by the expected amount
    expect(newX).toBeCloseTo(originalX + moveOffsetX, 0);
    expect(newY).toBeCloseTo(originalY + moveOffsetY, 0);
  });

  test('should be able to move an ellipse after clicking move label', async ({ page }) => {
    // First draw an ellipse
    await page.locator('.shape > .ellipse').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Draw an ellipse
    await page.mouse.move(canvasBoundingBox.x + 50, canvasBoundingBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 150, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Verify ellipse was created
    const ellipse = page.locator('.canvas ellipse');
    await expect(ellipse).toBeVisible();
    
    // Get original ellipse position
    const originalCX = parseFloat(await ellipse.getAttribute('cx'));
    const originalCY = parseFloat(await ellipse.getAttribute('cy'));
    
    // Now click move label
    await page.locator('.operation > .move').click();
    
    // Get ellipse center for dragging
    const ellipseBox = await ellipse.boundingBox();
    const ellipseCenterX = ellipseBox.x + ellipseBox.width / 2;
    const ellipseCenterY = ellipseBox.y + ellipseBox.height / 2;
    
    // Move the ellipse by dragging it
    const moveOffsetX = 50;
    const moveOffsetY = 30;
    
    await page.mouse.move(ellipseCenterX, ellipseCenterY);
    await page.mouse.down();
    await page.mouse.move(ellipseCenterX + moveOffsetX, ellipseCenterY + moveOffsetY);
    await page.mouse.up();
    
    // Get new ellipse position
    const newCX = parseFloat(await ellipse.getAttribute('cx'));
    const newCY = parseFloat(await ellipse.getAttribute('cy'));
    
    // Verify the ellipse has moved by the expected amount
    expect(newCX).toBeCloseTo(originalCX + moveOffsetX, 0);
    expect(newCY).toBeCloseTo(originalCY + moveOffsetY, 0);
  });

  test('should be able to move a line after clicking move label', async ({ page }) => {
    // First draw a line
    await page.locator('.shape > .line').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Draw a line
    await page.mouse.move(canvasBoundingBox.x + 50, canvasBoundingBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 150, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Verify line was created
    const line = page.locator('.canvas line');
    await expect(line).toBeVisible();
    
    // Get original line position
    const originalX1 = parseFloat(await line.getAttribute('x1'));
    const originalY1 = parseFloat(await line.getAttribute('y1'));
    const originalX2 = parseFloat(await line.getAttribute('x2'));
    const originalY2 = parseFloat(await line.getAttribute('y2'));
    
    // Now click move label
    await page.locator('.operation > .move').click();
    
    // Get line center for dragging
    const lineBox = await line.boundingBox();
    const lineCenterX = lineBox.x + lineBox.width / 2;
    const lineCenterY = lineBox.y + lineBox.height / 2;
    
    // Move the line by dragging it
    const moveOffsetX = 50;
    const moveOffsetY = 30;
    
    await page.mouse.move(lineCenterX, lineCenterY);
    await page.mouse.down();
    await page.mouse.move(lineCenterX + moveOffsetX, lineCenterY + moveOffsetY);
    await page.mouse.up();
    
    // Get new line position
    const newX1 = parseFloat(await line.getAttribute('x1'));
    const newY1 = parseFloat(await line.getAttribute('y1'));
    const newX2 = parseFloat(await line.getAttribute('x2'));
    const newY2 = parseFloat(await line.getAttribute('y2'));
    
    // Verify the line has moved by the expected amount
    expect(newX1).toBeCloseTo(originalX1 + moveOffsetX, 0);
    expect(newY1).toBeCloseTo(originalY1 + moveOffsetY, 0);
    expect(newX2).toBeCloseTo(originalX2 + moveOffsetX, 0);
    expect(newY2).toBeCloseTo(originalY2 + moveOffsetY, 0);
  });

  test('should be able to move a shape multiple times', async ({ page }) => {
    // First draw a rectangle
    await page.locator('.shape > .rect').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Draw a rectangle
    await page.mouse.move(canvasBoundingBox.x + 50, canvasBoundingBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 150, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Verify rectangle was created
    const rect = page.locator('.canvas rect');
    await expect(rect).toBeVisible();
    
    // Get original rectangle position
    const originalX = parseFloat(await rect.getAttribute('x'));
    const originalY = parseFloat(await rect.getAttribute('y'));
    
    // Now click move label
    await page.locator('.operation > .move').click();
    
    // Move the rectangle first time
    const rectBox1 = await rect.boundingBox();
    const rectCenterX1 = rectBox1.x + rectBox1.width / 2;
    const rectCenterY1 = rectBox1.y + rectBox1.height / 2;
    
    const moveOffsetX1 = 50;
    const moveOffsetY1 = 30;
    
    await page.mouse.move(rectCenterX1, rectCenterY1);
    await page.mouse.down();
    await page.mouse.move(rectCenterX1 + moveOffsetX1, rectCenterY1 + moveOffsetY1);
    await page.mouse.up();
    
    // Move the rectangle second time
    const rectBox2 = await rect.boundingBox();
    const rectCenterX2 = rectBox2.x + rectBox2.width / 2;
    const rectCenterY2 = rectBox2.y + rectBox2.height / 2;
    
    const moveOffsetX2 = -20;
    const moveOffsetY2 = 40;
    
    await page.mouse.move(rectCenterX2, rectCenterY2);
    await page.mouse.down();
    await page.mouse.move(rectCenterX2 + moveOffsetX2, rectCenterY2 + moveOffsetY2);
    await page.mouse.up();
    
    // Get final rectangle position
    const finalX = parseFloat(await rect.getAttribute('x'));
    const finalY = parseFloat(await rect.getAttribute('y'));
    
    // Verify the rectangle has moved by the combined amount
    expect(finalX).toBeCloseTo(originalX + moveOffsetX1 + moveOffsetX2, 0);
    expect(finalY).toBeCloseTo(originalY + moveOffsetY1 + moveOffsetY2, 0);
  });

  test('should only move the selected shape when multiple shapes exist', async ({ page }) => {
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
    
    // Get original positions
    const originalRectX = parseFloat(await rect.getAttribute('x'));
    const originalRectY = parseFloat(await rect.getAttribute('y'));
    const originalEllipseCX = parseFloat(await ellipse.getAttribute('cx'));
    const originalEllipseCY = parseFloat(await ellipse.getAttribute('cy'));
    
    // Now click move label
    await page.locator('.operation > .move').click();
    
    // Move only the rectangle
    const rectBox = await rect.boundingBox();
    const rectCenterX = rectBox.x + rectBox.width / 2;
    const rectCenterY = rectBox.y + rectBox.height / 2;
    
    const moveOffsetX = 50;
    const moveOffsetY = 30;
    
    await page.mouse.move(rectCenterX, rectCenterY);
    await page.mouse.down();
    await page.mouse.move(rectCenterX + moveOffsetX, rectCenterY + moveOffsetY);
    await page.mouse.up();
    
    // Get new positions
    const newRectX = parseFloat(await rect.getAttribute('x'));
    const newRectY = parseFloat(await rect.getAttribute('y'));
    const newEllipseCX = parseFloat(await ellipse.getAttribute('cx'));
    const newEllipseCY = parseFloat(await ellipse.getAttribute('cy'));
    
    // Verify only the rectangle moved
    expect(newRectX).toBeCloseTo(originalRectX + moveOffsetX, 0);
    expect(newRectY).toBeCloseTo(originalRectY + moveOffsetY, 0);
    expect(newEllipseCX).toBeCloseTo(originalEllipseCX, 0);
    expect(newEllipseCY).toBeCloseTo(originalEllipseCY, 0);
  });
});