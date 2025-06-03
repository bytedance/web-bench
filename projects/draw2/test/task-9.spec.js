import { test, expect } from '@playwright/test';

test.describe('Task 9: Rect shape implementation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('rect should have white fill and colored stroke', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Set stroke color
    await page.fill('input[name="color"]', '#ff0000');
    
    // Create a rect
    await page.click('label:has(input[value="rect"])');
    await page.mouse.move(canvasBox.x + 50, canvasBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.up();
    
    const rect = await canvas.locator('rect').first();
    const fill = await rect.getAttribute('fill');
    const stroke = await rect.getAttribute('stroke');
    
    expect(fill).toBe('white');
    expect(stroke).toBe('#ff0000');
  });

  test('rect should support dynamic resizing from origin point', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    await page.click('label:has(input[value="rect"])');
    
    const startX = 100;
    const startY = 100;
    
    // Start drawing
    await page.mouse.move(canvasBox.x + startX, canvasBox.y + startY);
    await page.mouse.down();
    
    // Drag to create rect
    await page.mouse.move(canvasBox.x + startX + 100, canvasBox.y + startY + 80);
    
    const rect = await canvas.locator('rect').first();
    const width = await rect.getAttribute('width');
    const height = await rect.getAttribute('height');
    
    expect(Number(width)).toBeCloseTo(100, 0);
    expect(Number(height)).toBeCloseTo(80, 0);
    
    await page.mouse.up();
  });

  test('rect should have minimum dimensions matching line width', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Set line width
    const lineWidth = '17';
    await page.fill('input[name="line-width"]', lineWidth);
    
    await page.click('label:has(input[value="rect"])');
    
    // Create a very small rect
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 101, canvasBox.y + 101);
    await page.mouse.up();
    
    const rect = await canvas.locator('rect').first();
    const width = await rect.getAttribute('width');
    const height = await rect.getAttribute('height');
    
    // Minimum dimensions should be at least line width
    expect(Number(width)).toBeGreaterThanOrEqual(Number(lineWidth));
    expect(Number(height)).toBeGreaterThanOrEqual(Number(lineWidth));
  });

  test('rect should handle negative drag directions', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    await page.click('label:has(input[value="rect"])');
    
    // Drag from bottom-right to top-left
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.up();
    
    const rect = await canvas.locator('rect').first();
    const x = await rect.getAttribute('x');
    const y = await rect.getAttribute('y');
    const width = await rect.getAttribute('width');
    const height = await rect.getAttribute('height');
    
    // Rect should be positioned correctly
    expect(Number(x)).toBeCloseTo(100, 0);
    expect(Number(y)).toBeCloseTo(100, 0);
    expect(Number(width)).toBeCloseTo(100, 0);
    expect(Number(height)).toBeCloseTo(100, 0);
  });

  test('rect should update center point during creation', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    await page.click('label:has(input[value="rect"])');
    
    // Create rect
    await page.mouse.move(canvasBox.x + 50, canvasBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.up();
    
    const rect = await canvas.locator('rect').first();
    
    // Switch to rotate tool to test center point
    await page.click('label:has(input[value="rotate"])');
    
    // Click on rect and try to rotate
    await rect.click();
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 100);
    await page.mouse.up();
    
    // Check if transform was applied (indicates center point works)
    const transform = await rect.getAttribute('transform');
    expect(transform).toContain('rotate');
  });
});
