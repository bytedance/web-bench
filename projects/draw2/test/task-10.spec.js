// Test for Task 10: Implement Ellipse shape class
import { test, expect } from '@playwright/test';

test.describe('Task 10: Ellipse Shape Implementation', () => {
  test('should create SVG ellipse elements starting as circles', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    await page.locator('.ellipse').click();
    
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 100;
    const startY = canvasBox.y + 100;
    
    // Create a small ellipse (should start as circle)
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 5, startY + 5);
    await page.mouse.up();
    
    const ellipseElement = canvas.locator('ellipse');
    await expect(ellipseElement).toBeVisible();
    
    // Check that it has white fill and colored stroke
    await expect(ellipseElement).toHaveAttribute('fill', 'white');
    
    const rx = parseFloat(await ellipseElement.getAttribute('rx'));
    const ry = parseFloat(await ellipseElement.getAttribute('ry'));
    const lineWidth = parseFloat(await ellipseElement.getAttribute('stroke-width'));
    
    // Should maintain minimum radius based on line width
    expect(rx).toBeGreaterThanOrEqual(lineWidth / 2);
    expect(ry).toBeGreaterThanOrEqual(lineWidth / 2);
  });

  test('should support asymmetric resizing to create ellipses', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    await page.locator('.ellipse').click();
    
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 150;
    const startY = canvasBox.y + 150;
    
    // Create an asymmetric ellipse
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 120, startY + 60);
    await page.mouse.up();
    
    const ellipseElement = canvas.locator('ellipse');
    await expect(ellipseElement).toBeVisible();
    
    const rx = parseFloat(await ellipseElement.getAttribute('rx'));
    const ry = parseFloat(await ellipseElement.getAttribute('ry'));
    
    // Should have different radii for asymmetric shape
    expect(Math.abs(rx - ry)).toBeGreaterThan(10);
    expect(rx).toBeGreaterThan(50);
    expect(ry).toBeGreaterThan(25);
  });

  test('should handle negative drag directions properly', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    await page.locator('.ellipse').click();
    
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 200;
    const startY = canvasBox.y + 200;
    
    // Drag in negative direction
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX - 80, startY - 60);
    await page.mouse.up();
    
    const ellipseElement = canvas.locator('ellipse');
    await expect(ellipseElement).toBeVisible();
    
    const cx = parseFloat(await ellipseElement.getAttribute('cx'));
    const cy = parseFloat(await ellipseElement.getAttribute('cy'));
    const rx = parseFloat(await ellipseElement.getAttribute('rx'));
    const ry = parseFloat(await ellipseElement.getAttribute('ry'));
    
    // Center should be positioned correctly for negative drag
    expect(cx).toBeLessThan(200);
    expect(cy).toBeLessThan(200);
    expect(rx).toBeGreaterThan(30);
    expect(ry).toBeGreaterThan(20);
    
    // Create another ellipse in positive direction for comparison
    await page.locator('.ellipse').click();
    await page.mouse.move(startX + 50, startY + 50);
    await page.mouse.down();
    await page.mouse.move(startX + 130, startY + 110);
    await page.mouse.up();
    
    const allEllipses = canvas.locator('ellipse');
    expect(await allEllipses.count()).toBe(2);
  });
});
