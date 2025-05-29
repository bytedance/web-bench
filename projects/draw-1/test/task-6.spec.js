// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 6 Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should be able to delete a line after clicking delete label', async ({ page }) => {
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
    
    // Now click delete label
    await page.locator('.operation > .delete').click();
    
    // Click on the line to delete it
    const lineCenter = await line.boundingBox().then(box => ({
      x: box.x + box.width / 2,
      y: box.y + box.height / 2
    }));
    
    await page.mouse.click(lineCenter.x, lineCenter.y);
    
    // Verify line was deleted
    await expect(line).not.toBeAttached();
  });

  test('should be able to delete a rectangle after clicking delete label', async ({ page }) => {
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
    
    // Now click delete label
    await page.locator('.operation > .delete').click();
    
    // Click on the rectangle to delete it
    const rectCenter = await rect.boundingBox().then(box => ({
      x: box.x + box.width / 2,
      y: box.y + box.height / 2
    }));
    
    await page.mouse.click(rectCenter.x, rectCenter.y);
    
    // Verify rectangle was deleted
    await expect(rect).not.toBeAttached();
  });

  test('should be able to delete an ellipse after clicking delete label', async ({ page }) => {
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
    
    // Now click delete label
    await page.locator('.operation > .delete').click();
    
    // Click on the ellipse to delete it
    const ellipseCenter = await ellipse.boundingBox().then(box => ({
      x: box.x + box.width / 2,
      y: box.y + box.height / 2
    }));
    
    await page.mouse.click(ellipseCenter.x, ellipseCenter.y);
    
    // Verify ellipse was deleted
    await expect(ellipse).not.toBeAttached();
  });

  test('should be able to delete one shape without affecting others', async ({ page }) => {
    // Draw a line
    await page.locator('.shape > .line').click();
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    await page.mouse.move(canvasBoundingBox.x + 50, canvasBoundingBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 150, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Draw a rectangle
    await page.locator('.shape > .rect').click();
    await page.mouse.move(canvasBoundingBox.x + 200, canvasBoundingBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 300, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Verify both shapes exist
    const line = page.locator('.canvas line');
    const rect = page.locator('.canvas rect');
    await expect(line).toBeVisible();
    await expect(rect).toBeVisible();
    
    // Delete only the rectangle
    await page.locator('.operation > .delete').click();
    const rectCenter = await rect.boundingBox().then(box => ({
      x: box.x + box.width / 2,
      y: box.y + box.height / 2
    }));
    
    await page.mouse.click(rectCenter.x, rectCenter.y);
    
    // Verify rectangle was deleted but line still exists
    await expect(rect).not.toBeAttached();
    await expect(line).toBeVisible();
  });
});