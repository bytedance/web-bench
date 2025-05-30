import { test, expect } from '@playwright/test';

test.describe('Task 18: Ellipse shape implementation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should create ellipse element with stroke and fill', async ({ page }) => {
    await page.click('.shape .ellipse');
    
    // Draw an ellipse
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(200, 150);
    await page.mouse.up();
    
    // Check ellipse was created
    const ellipse = await page.$('.canvas ellipse');
    expect(ellipse).toBeTruthy();
    
    // Check properties
    const fill = await ellipse.getAttribute('fill');
    const stroke = await ellipse.getAttribute('stroke');
    const strokeWidth = await ellipse.getAttribute('stroke-width');
    
    expect(fill).toBe('white');
    expect(stroke).toBe('#000000');
    expect(strokeWidth).toBeTruthy();
  });

  test('ellipse should update radii during drag', async ({ page }) => {
    await page.click('.shape .ellipse');
    
    // Start drawing
    await page.mouse.move(100, 100);
    await page.mouse.down();
    
    // Move to create small ellipse
    await page.mouse.move(120, 120);
    
    const ellipse = await page.$('.canvas ellipse');
    let rx1 = parseFloat(await ellipse.getAttribute('rx'));
    let ry1 = parseFloat(await ellipse.getAttribute('ry'));
    
    // Continue dragging
    await page.mouse.move(200, 180);
    
    let rx2 = parseFloat(await ellipse.getAttribute('rx'));
    let ry2 = parseFloat(await ellipse.getAttribute('ry'));
    
    expect(rx2).toBeGreaterThan(rx1);
    expect(ry2).toBeGreaterThan(ry1);
    
    await page.mouse.up();
  });

  test('ellipse should maintain minimum radius equal to half line width', async ({ page }) => {
    // Set line width to 21
    const lineWidthInput = await page.$('.prop .line-width');
    await lineWidthInput.fill('21');
    
    await page.click('.shape .ellipse');
    
    // Try to draw a very small ellipse
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(102, 102); // Only 2x2 pixels
    await page.mouse.up();
    
    // Check radii
    const ellipse = await page.$('.canvas ellipse');
    const rx = parseFloat(await ellipse.getAttribute('rx'));
    const ry = parseFloat(await ellipse.getAttribute('ry'));
    
    expect(rx).toBeGreaterThanOrEqual(10.5); // Half of 21
    expect(ry).toBeGreaterThanOrEqual(10.5);
  });

  test('ellipse center should be positioned correctly', async ({ page }) => {
    await page.click('.shape .ellipse');
    
    // Draw from specific coordinates
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await page.mouse.up();
    
    // Check center position
    const ellipse = await page.$('.canvas ellipse');
    const cx = parseFloat(await ellipse.getAttribute('cx'));
    const cy = parseFloat(await ellipse.getAttribute('cy'));
    const rx = parseFloat(await ellipse.getAttribute('rx'));
    const ry = parseFloat(await ellipse.getAttribute('ry'));
    
    // Center should be calculated from drag coordinates
    expect(cx).toBe(100 + rx);
    expect(cy).toBe(100 + ry);
  });

  test('ellipse should handle negative drag directions', async ({ page }) => {
    await page.click('.shape .ellipse');
    
    // Draw from bottom-right to top-left
    await page.mouse.move(200, 200);
    await page.mouse.down();
    await page.mouse.move(100, 100);
    await page.mouse.up();
    
    // Check ellipse is created with proper dimensions
    const ellipse = await page.$('.canvas ellipse');
    const cx = parseFloat(await ellipse.getAttribute('cx'));
    const cy = parseFloat(await ellipse.getAttribute('cy'));
    const rx = parseFloat(await ellipse.getAttribute('rx'));
    const ry = parseFloat(await ellipse.getAttribute('ry'));
    
    // Should have positive radii
    expect(rx).toBeGreaterThan(0);
    expect(ry).toBeGreaterThan(0);
    
    // Center should be adjusted for negative direction
    expect(cx).toBeLessThan(200);
    expect(cy).toBeLessThan(200);
  });
});
