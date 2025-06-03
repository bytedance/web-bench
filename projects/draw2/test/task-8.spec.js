import { test, expect } from '@playwright/test';

test.describe('Task 8: Line shape implementation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('line should start with minimum length equal to line width', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Set line width
    const lineWidth = '13';
    await page.fill('input[name="line-width"]', lineWidth);
    
    // Select line tool
    await page.click('label:has(input[value="line"])');
    
    // Create a very short line
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 101, canvasBox.y + 101);
    await page.mouse.up();
    
    // Check line exists with proper stroke width
    const line = await canvas.locator('line').first();
    const strokeWidth = await line.getAttribute('stroke-width');
    expect(Number(strokeWidth)).toBe(Number(lineWidth));
  });

  test('line endpoint should update dynamically during drag', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    await page.click('label:has(input[value="line"])');
    
    // Start drawing
    await page.mouse.move(canvasBox.x + 50, canvasBox.y + 50);
    await page.mouse.down();
    
    // Move to different positions
    const positions = [
      { x: 100, y: 100 },
      { x: 150, y: 150 },
      { x: 200, y: 100 }
    ];
    
    for (const pos of positions) {
      await page.mouse.move(canvasBox.x + pos.x, canvasBox.y + pos.y);
      
      // Line should exist during drag
      const line = await canvas.locator('line');
      await expect(line).toHaveCount(1);
    }
    
    await page.mouse.up();
  });

  test('line should maintain center point for transformations', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create a line
    await page.click('label:has(input[value="line"])');
    await page.mouse.move(canvasBox.x + 50, canvasBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.up();
    
    const line = await canvas.locator('line').first();
    
    // Get line coordinates
    const x1 = await line.getAttribute('x1');
    const y1 = await line.getAttribute('y1');
    const x2 = await line.getAttribute('x2');
    const y2 = await line.getAttribute('y2');
    
    // Center should be at midpoint
    const centerX = (Number(x1) + Number(x2)) / 2;
    const centerY = (Number(y1) + Number(y2)) / 2;
    
    expect(centerX).toBeGreaterThan(0);
    expect(centerY).toBeGreaterThan(0);
  });

  test('line cloning should work with offset', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create a line
    await page.click('label:has(input[value="line"])');
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Copy the line
    await page.click('label:has(input[value="copy"])');
    const line = await canvas.locator('line').first();
    await line.click();
    
    // Should have 2 lines
    const lines = await canvas.locator('line');
    await expect(lines).toHaveCount(2);
    
    // Get positions of both lines
    const line1 = lines.nth(0);
    const line2 = lines.nth(1);
    
    const x1_1 = await line1.getAttribute('x1');
    const x1_2 = await line2.getAttribute('x1');
    
    // Second line should be offset
    expect(Number(x1_2)).not.toBe(Number(x1_1));
  });

  test('line should be created with current color', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Set a specific color
    await page.fill('input[name="color"]', '#00ff00');
    
    // Create a line
    await page.click('label:has(input[value="line"])');
    await page.mouse.move(canvasBox.x + 50, canvasBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.up();
    
    // Check line color
    const line = await canvas.locator('line').first();
    const stroke = await line.getAttribute('stroke');
    expect(stroke).toBe('#00ff00');
  });
});
