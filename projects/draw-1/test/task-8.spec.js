// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 8 Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should be able to copy a rectangle', async ({ page }) => {
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
    expect(await rect.count()).toBe(1);
    
    // Get original rectangle attributes
    const originalRect = rect.first();
    const originalX = parseFloat(await originalRect.getAttribute('x'));
    const originalY = parseFloat(await originalRect.getAttribute('y'));
    const originalWidth = parseFloat(await originalRect.getAttribute('width'));
    const originalHeight = parseFloat(await originalRect.getAttribute('height'));
    
    // Now click copy label
    await page.locator('.operation > .copy').click();
    
    // Click on the rectangle to copy it
    const rectCenter = await originalRect.boundingBox().then(box => ({
      x: box.x + box.width / 2,
      y: box.y + box.height / 2
    }));
    
    await page.mouse.click(rectCenter.x, rectCenter.y);
    
    // Verify a new rectangle was created
    await expect(rect).toHaveCount(2);
    
    // Get copied rectangle attributes
    const copiedRect = rect.nth(1);
    const copiedX = parseFloat(await copiedRect.getAttribute('x'));
    const copiedY = parseFloat(await copiedRect.getAttribute('y'));
    const copiedWidth = parseFloat(await copiedRect.getAttribute('width'));
    const copiedHeight = parseFloat(await copiedRect.getAttribute('height'));
    
    // Verify copied rectangle is positioned 20 to the right and 20 below the original
    expect(copiedX).toBeCloseTo(originalX + 20, 0);
    expect(copiedY).toBeCloseTo(originalY + 20, 0);
    expect(copiedWidth).toBeCloseTo(originalWidth, 0);
    expect(copiedHeight).toBeCloseTo(originalHeight, 0);
  });

  test('should be able to copy an ellipse', async ({ page }) => {
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
    expect(await ellipse.count()).toBe(1);
    
    // Get original ellipse attributes
    const originalEllipse = ellipse.first();
    const originalCX = parseFloat(await originalEllipse.getAttribute('cx'));
    const originalCY = parseFloat(await originalEllipse.getAttribute('cy'));
    const originalRX = parseFloat(await originalEllipse.getAttribute('rx'));
    const originalRY = parseFloat(await originalEllipse.getAttribute('ry'));
    
    // Now click copy label
    await page.locator('.operation > .copy').click();
    
    // Click on the ellipse to copy it
    const ellipseCenter = await originalEllipse.boundingBox().then(box => ({
      x: box.x + box.width / 2,
      y: box.y + box.height / 2
    }));
    
    await page.mouse.click(ellipseCenter.x, ellipseCenter.y);
    
    // Verify a new ellipse was created
    await expect(ellipse).toHaveCount(2);
    
    // Get copied ellipse attributes
    const copiedEllipse = ellipse.nth(1);
    const copiedCX = parseFloat(await copiedEllipse.getAttribute('cx'));
    const copiedCY = parseFloat(await copiedEllipse.getAttribute('cy'));
    const copiedRX = parseFloat(await copiedEllipse.getAttribute('rx'));
    const copiedRY = parseFloat(await copiedEllipse.getAttribute('ry'));
    
    // Verify copied ellipse is positioned 20 to the right and 20 below the original
    expect(copiedCX).toBeCloseTo(originalCX + 20, 0);
    expect(copiedCY).toBeCloseTo(originalCY + 20, 0);
    expect(copiedRX).toBeCloseTo(originalRX, 0);
    expect(copiedRY).toBeCloseTo(originalRY, 0);
  });

  test('should be able to copy a line', async ({ page }) => {
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
    expect(await line.count()).toBe(1);
    
    // Get original line attributes
    const originalLine = line.first();
    const originalX1 = parseFloat(await originalLine.getAttribute('x1'));
    const originalY1 = parseFloat(await originalLine.getAttribute('y1'));
    const originalX2 = parseFloat(await originalLine.getAttribute('x2'));
    const originalY2 = parseFloat(await originalLine.getAttribute('y2'));
    
    // Now click copy label
    await page.locator('.operation > .copy').click();
    
    // Click on the line to copy it
    const lineCenter = await originalLine.boundingBox().then(box => ({
      x: box.x + box.width / 2,
      y: box.y + box.height / 2
    }));
    
    await page.mouse.click(lineCenter.x, lineCenter.y);
    
    // Verify a new line was created
    await expect(line).toHaveCount(2);
    
    // Get copied line attributes
    const copiedLine = line.nth(1);
    const copiedX1 = parseFloat(await copiedLine.getAttribute('x1'));
    const copiedY1 = parseFloat(await copiedLine.getAttribute('y1'));
    const copiedX2 = parseFloat(await copiedLine.getAttribute('x2'));
    const copiedY2 = parseFloat(await copiedLine.getAttribute('y2'));
    
    // Verify copied line is positioned 20 to the right and 20 below the original
    expect(copiedX1).toBeCloseTo(originalX1 + 20, 0);
    expect(copiedY1).toBeCloseTo(originalY1 + 20, 0);
    expect(copiedX2).toBeCloseTo(originalX2 + 20, 0);
    expect(copiedY2).toBeCloseTo(originalY2 + 20, 0);
  });

  test('should copy all attributes of the original shape', async ({ page }) => {
    // Draw a rectangle with custom properties
    await page.locator('.prop > .line-width').fill('5');
    await page.locator('.prop > .color').fill('#ff0000');
    await page.locator('.shape > .rect').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Draw a rectangle
    await page.mouse.move(canvasBoundingBox.x + 50, canvasBoundingBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 150, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Fill the rectangle with a different color
    await page.locator('.prop > .color').fill('#0000ff');
    await page.locator('.operation > .fill').click();
    const rect = page.locator('.canvas rect');
    const rectCenter = await rect.boundingBox().then(box => ({
      x: box.x + box.width / 2,
      y: box.y + box.height / 2
    }));
    await page.mouse.click(rectCenter.x, rectCenter.y);
    
    // Get original rectangle attributes
    const originalRect = rect.first();
    const originalStrokeWidth = await originalRect.getAttribute('stroke-width');
    const originalStroke = await originalRect.getAttribute('stroke');
    const originalFill = await originalRect.getAttribute('fill');
    
    // Now copy the rectangle
    await page.locator('.operation > .copy').click();
    await page.mouse.click(rectCenter.x, rectCenter.y);
    
    // Verify a new rectangle was created
    await expect(rect).toHaveCount(2);
    
    // Get copied rectangle attributes
    const copiedRect = rect.nth(1);
    const copiedStrokeWidth = await copiedRect.getAttribute('stroke-width');
    const copiedStroke = await copiedRect.getAttribute('stroke');
    const copiedFill = await copiedRect.getAttribute('fill');
    
    // Verify all attributes were copied correctly
    expect(copiedStrokeWidth).toBe(originalStrokeWidth);
    expect(copiedStroke.toLowerCase()).toBe(originalStroke.toLowerCase());
    expect(copiedFill.toLowerCase()).toBe(originalFill.toLowerCase());
  });
});