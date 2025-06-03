// Test for Task 9: Implement Rect shape class
import { test, expect } from '@playwright/test';

test.describe('Task 9: Rect Shape Implementation', () => {
  test('should create SVG rect elements with white fill and colored stroke', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Set a specific color
    await page.locator('.color').fill('#ff0000');
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
    
    // Check fill and stroke
    await expect(rectElement).toHaveAttribute('fill', 'white');
    await expect(rectElement).toHaveAttribute('stroke', '#ff0000');
    
    const strokeWidth = await rectElement.getAttribute('stroke-width');
    expect(parseFloat(strokeWidth)).toBeGreaterThan(0);
  });

  test('should support dynamic resizing with minimum dimensions', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    await page.locator('.rect').click();
    
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 150;
    const startY = canvasBox.y + 150;
    
    // Create a very small rectangle (should maintain minimum size)
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 3, startY + 2);
    await page.mouse.up();
    
    const rectElement = canvas.locator('rect');
    await expect(rectElement).toBeVisible();
    
    const width = parseFloat(await rectElement.getAttribute('width'));
    const height = parseFloat(await rectElement.getAttribute('height'));
    const lineWidth = parseFloat(await rectElement.getAttribute('stroke-width'));
    
    // Should maintain minimum dimensions based on line width
    expect(width).toBeGreaterThanOrEqual(lineWidth);
    expect(height).toBeGreaterThanOrEqual(lineWidth);
  });

  test('should handle drag in any direction with proper coordinates', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    await page.locator('.rect').click();
    
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 200;
    const startY = canvasBox.y + 200;
    
    // Drag from bottom-right to top-left (negative direction)
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX - 100, startY - 80);
    await page.mouse.up();
    
    const rectElement = canvas.locator('rect');
    await expect(rectElement).toBeVisible();
    
    const x = parseFloat(await rectElement.getAttribute('x'));
    const y = parseFloat(await rectElement.getAttribute('y'));
    const width = parseFloat(await rectElement.getAttribute('width'));
    const height = parseFloat(await rectElement.getAttribute('height'));
    
    // Rectangle should be positioned correctly regardless of drag direction
    expect(x).toBeLessThan(200); // Should be at the left edge
    expect(y).toBeLessThan(200); // Should be at the top edge
    expect(width).toBeGreaterThan(50);
    expect(height).toBeGreaterThan(50);
    
    // Create another rectangle dragging in positive direction
    await page.mouse.move(startX + 50, startY + 50);
    await page.mouse.down();
    await page.mouse.move(startX + 150, startY + 130);
    await page.mouse.up();
    
    const allRects = canvas.locator('rect');
    expect(await allRects.count()).toBe(2);
  });
});
