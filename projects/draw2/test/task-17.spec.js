import { test, expect } from '@playwright/test';

test.describe('Task 17: Rect shape implementation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should create rect element with stroke and fill', async ({ page }) => {
    await page.click('.shape .rect');
    
    // Draw a rectangle
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await page.mouse.up();
    
    // Check rect was created
    const rect = await page.$('.canvas rect');
    expect(rect).toBeTruthy();
    
    // Check properties
    const fill = await rect.getAttribute('fill');
    const stroke = await rect.getAttribute('stroke');
    const strokeWidth = await rect.getAttribute('stroke-width');
    
    expect(fill).toBe('white');
    expect(stroke).toBe('#000000');
    expect(strokeWidth).toBeTruthy();
  });

  test('rect should update dimensions during drag', async ({ page }) => {
    await page.click('.shape .rect');
    
    // Start drawing
    await page.mouse.move(50, 50);
    await page.mouse.down();
    
    // Move to create small rect
    await page.mouse.move(80, 80);
    
    const rect = await page.$('.canvas rect');
    let width1 = parseFloat(await rect.getAttribute('width'));
    let height1 = parseFloat(await rect.getAttribute('height'));
    
    // Continue dragging
    await page.mouse.move(150, 150);
    
    let width2 = parseFloat(await rect.getAttribute('width'));
    let height2 = parseFloat(await rect.getAttribute('height'));
    
    expect(width2).toBeGreaterThan(width1);
    expect(height2).toBeGreaterThan(height1);
    
    await page.mouse.up();
  });

  test('rect should maintain minimum size equal to line width', async ({ page }) => {
    // Set line width to 17
    const lineWidthInput = await page.$('.prop .line-width');
    await lineWidthInput.fill('17');
    
    await page.click('.shape .rect');
    
    // Try to draw a very small rect
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(102, 102); // Only 2x2 pixels
    await page.mouse.up();
    
    // Check dimensions
    const rect = await page.$('.canvas rect');
    const width = parseFloat(await rect.getAttribute('width'));
    const height = parseFloat(await rect.getAttribute('height'));
    
    expect(width).toBeGreaterThanOrEqual(17);
    expect(height).toBeGreaterThanOrEqual(17);
  });

  test('rect should handle negative drag directions', async ({ page }) => {
    await page.click('.shape .rect');
    
    // Draw from bottom-right to top-left
    await page.mouse.move(200, 200);
    await page.mouse.down();
    await page.mouse.move(100, 100);
    await page.mouse.up();
    
    // Check rect position and size
    const rect = await page.$('.canvas rect');
    const x = parseFloat(await rect.getAttribute('x'));
    const y = parseFloat(await rect.getAttribute('y'));
    const width = parseFloat(await rect.getAttribute('width'));
    const height = parseFloat(await rect.getAttribute('height'));
    
    // Position should be at top-left corner
    expect(x).toBeLessThanOrEqual(100);
    expect(y).toBeLessThanOrEqual(100);
    expect(width).toBeGreaterThan(50);
    expect(height).toBeGreaterThan(50);
  });

  test('rect stroke width and color should match settings', async ({ page }) => {
    // Set custom properties
    const lineWidthInput = await page.$('.prop .line-width');
    await lineWidthInput.fill('21');
    
    const colorInput = await page.$('.prop .color');
    await colorInput.fill('#ff00ff');
    
    await page.click('.shape .rect');
    
    // Draw rect
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await page.mouse.up();
    
    // Check properties
    const rect = await page.$('.canvas rect');
    const strokeWidth = await rect.getAttribute('stroke-width');
    const stroke = await rect.getAttribute('stroke');
    
    expect(strokeWidth).toBe('21');
    expect(stroke).toBe('#ff00ff');
  });
});
