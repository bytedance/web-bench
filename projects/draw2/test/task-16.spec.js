// Test for Task 16: Add delete operation to remove shapes
import { test, expect } from '@playwright/test';

test.describe('Task 16: Delete Operation for Shape Removal', () => {
  test('should remove shapes from canvas when clicked', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create a rectangle
    await page.locator('.rect').click();
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 100;
    const startY = canvasBox.y + 100;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 80, startY + 60);
    await page.mouse.up();
    
    const rectElement = canvas.locator('rect');
    await expect(rectElement).toBeVisible();
    
    // Delete the rectangle
    await page.locator('.delete').click();
    await rectElement.click();
    
    // Rectangle should be removed from DOM
    await expect(rectElement).not.toBeVisible();
  });

  test('should remove multiple shapes independently', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create multiple shapes
    await page.locator('.line').click();
    const canvasBox = await canvas.boundingBox();
    
    // Create first line
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 180, canvasBox.y + 130);
    await page.mouse.up();
    
    // Create second line
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 150);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 280, canvasBox.y + 180);
    await page.mouse.up();
    
    // Create an ellipse
    await page.locator('.ellipse').click();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 200);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 220, canvasBox.y + 260);
    await page.mouse.up();
    
    // Should have 2 lines and 1 ellipse
    const allLines = canvas.locator('line');
    const allEllipses = canvas.locator('ellipse');
    expect(await allLines.count()).toBe(2);
    expect(await allEllipses.count()).toBe(1);
    
    // Delete one line
    await page.locator('.delete').click();
    await allLines.first().click();
    
    // Should have 1 line and 1 ellipse remaining
    expect(await canvas.locator('line').count()).toBe(1);
    expect(await canvas.locator('ellipse').count()).toBe(1);
    
    // Delete the ellipse
    await canvas.locator('ellipse').click();
    
    // Should have 1 line and 0 ellipses
    expect(await canvas.locator('line').count()).toBe(1);
    expect(await canvas.locator('ellipse').count()).toBe(0);
  });

  test('should prevent deletion of canvas itself', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Switch to delete tool
    await page.locator('.delete').click();
    
    // Try to delete the canvas background (empty area)
    const canvasBox = await canvas.boundingBox();
    const emptyX = canvasBox.x + 50;
    const emptyY = canvasBox.y + 50;
    
    await page.mouse.move(emptyX, emptyY);
    await page.mouse.click();
    
    // Canvas should still be visible and functional
    await expect(canvas).toBeVisible();
    
    // Should still be able to create shapes on canvas
    await page.locator('.rect').click();
    await page.mouse.move(emptyX, emptyY);
    await page.mouse.down();
    await page.mouse.move(emptyX + 60, emptyY + 40);
    await page.mouse.up();
    
    const rectElement = canvas.locator('rect');
    await expect(rectElement).toBeVisible();
  });
});
