// Test for Task 11: Implement shape transformation system
import { test, expect } from '@playwright/test';

test.describe('Task 11: Shape Transformation System', () => {
  test('should apply translate transformations while preserving other transforms', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create a rectangle
    await page.locator('.rect').click();
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 150;
    const startY = canvasBox.y + 150;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 80);
    await page.mouse.up();
    
    const rectElement = canvas.locator('rect');
    await expect(rectElement).toBeVisible();
    
    // Move the rectangle
    await page.locator('.move').click();
    await rectElement.hover();
    await page.mouse.down();
    await page.mouse.move(startX + 50, startY + 30);
    await page.mouse.up();
    
    // Check that transform contains translate
    const transform = await rectElement.evaluate(el => el.style.transform);
    expect(transform).toContain('translate');
    expect(transform).toMatch(/translate\([\d.-]+px,\s*[\d.-]+px\)/);
  });

  test('should calculate and apply rotation transformations', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create an ellipse
    await page.locator('.ellipse').click();
    const canvasBox = await canvas.boundingBox();
    const centerX = canvasBox.x + 200;
    const centerY = canvasBox.y + 200;
    
    await page.mouse.move(centerX - 50, centerY - 40);
    await page.mouse.down();
    await page.mouse.move(centerX + 50, centerY + 40);
    await page.mouse.up();
    
    const ellipseElement = canvas.locator('ellipse');
    await expect(ellipseElement).toBeVisible();
    
    // Rotate the ellipse
    await page.locator('.rotate').click();
    await ellipseElement.hover();
    await page.mouse.down();
    
    // Rotate around the shape by moving cursor in a circular motion
    await page.mouse.move(centerX + 80, centerY);
    await page.mouse.up();
    
    // Check that transform contains rotate
    const transform = await ellipseElement.evaluate(el => el.style.transform);
    expect(transform).toContain('rotate');
    expect(transform).toMatch(/rotate\([\d.-]+deg\)/);
  });

  test('should calculate and apply scale transformations', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create a line
    await page.locator('.line').click();
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 100;
    const startY = canvasBox.y + 150;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 50);
    await page.mouse.up();
    
    const lineElement = canvas.locator('line');
    await expect(lineElement).toBeVisible();
    
    // Scale the line
    await page.locator('.zoom').click();
    await lineElement.hover();
    await page.mouse.down();
    
    // Move cursor away from center to scale up
    await page.mouse.move(startX + 150, startY + 100);
    await page.mouse.up();
    
    // Check that transform contains scale
    const transform = await lineElement.evaluate(el => el.style.transform);
    expect(transform).toContain('scale');
    expect(transform).toMatch(/scale\([\d.-]+,\s*[\d.-]+\)/);
  });
});
