// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 7 Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should be able to fill a rectangle with selected color', async ({ page }) => {
    // First draw a rectangle
    await page.locator('.shape > .rect').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Draw a rectangle
    await page.mouse.move(canvasBoundingBox.x + 50, canvasBoundingBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 150, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Verify rectangle was created with white fill
    const rect = page.locator('.canvas rect');
    await expect(rect).toBeVisible();
    const initialFill = await rect.getAttribute('fill');
    expect(initialFill.toLowerCase()).toBe('white');
    
    // Set a specific color
    await page.locator('.prop > .color').fill('#ff0000');
    
    // Now click fill label
    await page.locator('.operation > .fill').click();
    
    // Click on the rectangle to fill it
    const rectCenter = await rect.boundingBox().then(box => ({
      x: box.x + box.width / 2,
      y: box.y + box.height / 2
    }));
    
    await page.mouse.click(rectCenter.x, rectCenter.y);
    
    // Verify rectangle fill color was changed
    const newFill = await rect.getAttribute('fill');
    expect(newFill.toLowerCase()).toBe('#ff0000');
  });

  test('should be able to fill an ellipse with selected color', async ({ page }) => {
    // First draw an ellipse
    await page.locator('.shape > .ellipse').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Draw an ellipse
    await page.mouse.move(canvasBoundingBox.x + 50, canvasBoundingBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 150, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Verify ellipse was created with white fill
    const ellipse = page.locator('.canvas ellipse');
    await expect(ellipse).toBeVisible();
    const initialFill = await ellipse.getAttribute('fill');
    expect(initialFill.toLowerCase()).toBe('white');
    
    // Set a specific color
    await page.locator('.prop > .color').fill('#00ff00');
    
    // Now click fill label
    await page.locator('.operation > .fill').click();
    
    // Click on the ellipse to fill it
    const ellipseCenter = await ellipse.boundingBox().then(box => ({
      x: box.x + box.width / 2,
      y: box.y + box.height / 2
    }));
    
    await page.mouse.click(ellipseCenter.x, ellipseCenter.y);
    
    // Verify ellipse fill color was changed
    const newFill = await ellipse.getAttribute('fill');
    expect(newFill.toLowerCase()).toBe('#00ff00');
  });

  test('should be able to fill a line with selected color', async ({ page }) => {
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
    
    // Set a specific color
    await page.locator('.prop > .color').fill('#0000ff');
    
    // Now click fill label
    await page.locator('.operation > .fill').click();
    
    // Click on the line to fill it
    const lineCenter = await line.boundingBox().then(box => ({
      x: box.x + box.width / 2,
      y: box.y + box.height / 2
    }));
    
    await page.mouse.click(lineCenter.x, lineCenter.y);
    
    // For lines, fill might be applied as stroke or fill attribute
    // Check if either the stroke or fill attribute was changed
    const newFill = await line.getAttribute('fill');
    const newStroke = await line.getAttribute('stroke');
    
    // At least one of them should be the new color
    expect(newFill?.toLowerCase() === '#0000ff' || newStroke?.toLowerCase() === '#0000ff').toBeTruthy();
  });

  test('should be able to fill multiple shapes with different colors', async ({ page }) => {
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
    
    // Fill rectangle with red
    await page.locator('.prop > .color').fill('#ff0000');
    await page.locator('.operation > .fill').click();
    const rectCenter = await rect.boundingBox().then(box => ({
      x: box.x + box.width / 2,
      y: box.y + box.height / 2
    }));
    await page.mouse.click(rectCenter.x, rectCenter.y);
    
    // Fill ellipse with blue
    await page.locator('.prop > .color').fill('#0000ff');
    await page.locator('.operation > .fill').click();
    const ellipseCenter = await ellipse.boundingBox().then(box => ({
      x: box.x + box.width / 2,
      y: box.y + box.height / 2
    }));
    await page.mouse.click(ellipseCenter.x, ellipseCenter.y);
    
    // Verify each shape has the correct fill color
    const rectFill = await rect.getAttribute('fill');
    const ellipseFill = await ellipse.getAttribute('fill');
    
    expect(rectFill.toLowerCase()).toBe('#ff0000');
    expect(ellipseFill.toLowerCase()).toBe('#0000ff');
  });
});