// Test for Task 4: Create a Canvas class that manages SVG drawing operations
import { test, expect } from '@playwright/test';

test.describe('Task 4: Canvas Class Drawing Operations', () => {
  test('should respond to mouse events on canvas', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    await expect(canvas).toBeVisible();
    
    // Select line tool first
    await page.locator('.line').click();
    
    // Test mouse down and move on canvas
    await canvas.hover();
    
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 100;
    const startY = canvasBox.y + 100;
    const endX = canvasBox.x + 200;
    const endY = canvasBox.y + 150;
    
    // Perform drawing operation
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if a line element was created
    const lineElement = canvas.locator('line');
    await expect(lineElement).toBeVisible();
  });

  test('should calculate cursor positions relative to canvas', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    await page.locator('.rect').click();
    
    const canvasBox = await canvas.boundingBox();
    const clickX = canvasBox.x + 50;
    const clickY = canvasBox.y + 75;
    
    // Draw a rectangle
    await page.mouse.move(clickX, clickY);
    await page.mouse.down();
    await page.mouse.move(clickX + 100, clickY + 80);
    await page.mouse.up();
    
    // Check if rectangle was created with appropriate position
    const rectElement = canvas.locator('rect');
    await expect(rectElement).toBeVisible();
    
    const rectX = await rectElement.getAttribute('x');
    const rectY = await rectElement.getAttribute('y');
    
    // Positions should be relative to canvas, not absolute page coordinates
    expect(parseFloat(rectX)).toBeLessThan(200);
    expect(parseFloat(rectY)).toBeLessThan(200);
  });

  test('should handle drawing operations for different shapes', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Test ellipse drawing
    await page.locator('.ellipse').click();
    
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 150;
    const startY = canvasBox.y + 150;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 80, startY + 60);
    await page.mouse.up();
    
    // Check if ellipse was created
    const ellipseElement = canvas.locator('ellipse');
    await expect(ellipseElement).toBeVisible();
    
    // Test line drawing
    await page.locator('.line').click();
    
    await page.mouse.move(startX + 200, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 300, startY + 100);
    await page.mouse.up();
    
    // Check if line was created
    const lineElement = canvas.locator('line');
    await expect(lineElement).toBeVisible();
  });
});
