import { test, expect } from '@playwright/test';

test.describe('Task 10: Ellipse shape implementation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('ellipse should start as circle with radius based on line width', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Set line width
    const lineWidth = '13';
    await page.fill('input[name="line-width"]', lineWidth);
    
    await page.click('label:has(input[value="ellipse"])');
    
    // Create a small ellipse (should be circular)
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 101, canvasBox.y + 101);
    await page.mouse.up();
    
    const ellipse = await canvas.locator('ellipse').first();
    const rx = await ellipse.getAttribute('rx');
    const ry = await ellipse.getAttribute('ry');
    
    // Should start as a circle with minimum radius
    expect(Number(rx)).toBeGreaterThan(0);
    expect(Number(rx)).toBe(Number(ry));
  });

  test('ellipse should support asymmetric resizing', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    await page.click('label:has(input[value="ellipse"])');
    
    // Create an ellipse with different width and height
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 150);
    await page.mouse.up();
    
    const ellipse = await canvas.locator('ellipse').first();
    const rx = await ellipse.getAttribute('rx');
    const ry = await ellipse.getAttribute('ry');
    
    // Radii should be different for asymmetric ellipse
    expect(Number(rx)).not.toBe(Number(ry));
    expect(Number(rx)).toBeCloseTo(50, 0);
    expect(Number(ry)).toBeCloseTo(25, 0);
  });

  test('ellipse should handle negative drag directions', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    await page.click('label:has(input[value="ellipse"])');
    
    // Drag from bottom-right to top-left
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 150);
    await page.mouse.up();
    
    const ellipse = await canvas.locator('ellipse').first();
    const cx = await ellipse.getAttribute('cx');
    const cy = await ellipse.getAttribute('cy');
    const rx = await ellipse.getAttribute('rx');
    const ry = await ellipse.getAttribute('ry');
    
    // Center should be at midpoint
    expect(Number(cx)).toBeCloseTo(150, 0);
    expect(Number(cy)).toBeCloseTo(175, 0);
    expect(Number(rx)).toBeCloseTo(50, 0);
    expect(Number(ry)).toBeCloseTo(25, 0);
  });

  test('ellipse should maintain correct center point', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    await page.click('label:has(input[value="ellipse"])');
    
    // Create ellipse
    const startX = 100, startY = 100;
    const endX = 180, endY = 160;
    
    await page.mouse.move(canvasBox.x + startX, canvasBox.y + startY);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + endX, canvasBox.y + endY);
    await page.mouse.up();
    
    const ellipse = await canvas.locator('ellipse').first();
    const cx = await ellipse.getAttribute('cx');
    const cy = await ellipse.getAttribute('cy');
    
    // Center should be at midpoint
    const expectedCx = (startX + endX) / 2;
    const expectedCy = (startY + endY) / 2;
    
    expect(Number(cx)).toBeCloseTo(expectedCx, 0);
    expect(Number(cy)).toBeCloseTo(expectedCy, 0);
  });

  test('ellipse should have proper fill and stroke', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Set custom color
    await page.fill('input[name="color"]', '#0000ff');
    
    await page.click('label:has(input[value="ellipse"])');
    
    // Create ellipse
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    const ellipse = await canvas.locator('ellipse').first();
    const fill = await ellipse.getAttribute('fill');
    const stroke = await ellipse.getAttribute('stroke');
    const strokeWidth = await ellipse.getAttribute('stroke-width');
    
    expect(fill).toBe('white');
    expect(stroke).toBe('#0000ff');
    expect(Number(strokeWidth)).toBeGreaterThan(0);
  });
});
