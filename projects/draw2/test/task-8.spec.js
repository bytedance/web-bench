// Test for Task 8: Implement Line shape class
import { test, expect } from '@playwright/test';

test.describe('Task 8: Line Shape Implementation', () => {
  test('should create SVG line elements with minimum length', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    await page.locator('.line').click();
    
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 100;
    const startY = canvasBox.y + 100;
    
    // Create a very short line (should be at minimum length)
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 2, startY + 1);
    await page.mouse.up();
    
    const lineElement = canvas.locator('line');
    await expect(lineElement).toBeAttached();
    
    // Check that line has minimum dimensions based on line width
    const x1 = parseFloat(await lineElement.getAttribute('x1'));
    const x2 = parseFloat(await lineElement.getAttribute('x2'));
    const lineWidth = parseFloat(await lineElement.getAttribute('stroke-width'));
    
    const actualLength = Math.abs(x2 - x1);
    expect(actualLength).toBeGreaterThanOrEqual(lineWidth);
  });

  test('should dynamically update endpoint based on cursor movement', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    await page.locator('.line').click();
    
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 150;
    const startY = canvasBox.y + 150;
    
    // Start drawing
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    
    // Move to create a longer line
    await page.mouse.move(startX + 100, startY + 50);
    await page.mouse.up();
    
    const lineElement = canvas.locator('line');
    await expect(lineElement).toBeVisible();
    
    const x1 = parseFloat(await lineElement.getAttribute('x1'));
    const y1 = parseFloat(await lineElement.getAttribute('y1'));
    const x2 = parseFloat(await lineElement.getAttribute('x2'));
    const y2 = parseFloat(await lineElement.getAttribute('y2'));
    
    // Line should span the distance we dragged
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    expect(length).toBeGreaterThan(50);
  });

  test('should support cloning with offset positioning', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create a line
    await page.locator('.line').click();
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 200;
    const startY = canvasBox.y + 100;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 80, startY + 40);
    await page.mouse.up();
    
    const originalLine = canvas.locator('line').first();
    await expect(originalLine).toBeVisible();
    
    const originalX1 = parseFloat(await originalLine.getAttribute('x1'));
    const originalY1 = parseFloat(await originalLine.getAttribute('y1'));
    
    // Copy the line
    await page.locator('.copy').click();
    await originalLine.click();
    
    // Should have two lines now
    const allLines = canvas.locator('line');
    expect(await allLines.count()).toBe(2);
    
    // Check that copied line is offset
    const copiedLine = allLines.nth(1);
    const copiedX1 = parseFloat(await copiedLine.getAttribute('x1'));
    const copiedY1 = parseFloat(await copiedLine.getAttribute('y1'));
    
    // Should be offset by approximately 20 pixels
    expect(copiedX1).toBeCloseTo(originalX1 + 20, 0);
    expect(copiedY1).toBeCloseTo(originalY1 + 20, 0);
  });
});
