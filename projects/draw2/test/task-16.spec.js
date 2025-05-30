import { test, expect } from '@playwright/test';

test.describe('Task 16: Line shape implementation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should create line element with stroke properties', async ({ page }) => {
    await page.click('.shape .line');
    
    // Draw a line
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(200, 100);
    await page.mouse.up();
    
    // Check line was created
    const line = await page.$('.canvas line');
    expect(line).toBeTruthy();
    
    // Check stroke properties
    const stroke = await line.getAttribute('stroke');
    const strokeWidth = await line.getAttribute('stroke-width');
    
    expect(stroke).toBe('#000000');
    expect(strokeWidth).toBeTruthy();
  });

  test('line should update endpoints during drag', async ({ page }) => {
    await page.click('.shape .line');
    
    // Start drawing
    await page.mouse.move(50, 50);
    await page.mouse.down();
    
    // Check initial position
    const line = await page.$('.canvas line');
    const x1 = await line.getAttribute('x1');
    const y1 = await line.getAttribute('y1');
    
    expect(x1).toBe('50');
    expect(y1).toBe('50');
    
    // Drag to new position
    await page.mouse.move(150, 150);
    
    const x2 = await line.getAttribute('x2');
    const y2 = await line.getAttribute('y2');
    
    expect(parseFloat(x2)).toBeGreaterThan(100);
    expect(parseFloat(y2)).toBeGreaterThan(100);
    
    await page.mouse.up();
  });

  test('line should maintain minimum length equal to line width', async ({ page }) => {
    // Set line width to 13
    const lineWidthInput = await page.$('.prop .line-width');
    await lineWidthInput.fill('13');
    
    await page.click('.shape .line');
    
    // Try to draw a very short line
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(102, 100); // Only 2 pixels
    await page.mouse.up();
    
    // Check line length
    const line = await page.$('.canvas line');
    const x1 = parseFloat(await line.getAttribute('x1'));
    const y1 = parseFloat(await line.getAttribute('y1'));
    const x2 = parseFloat(await line.getAttribute('x2'));
    const y2 = parseFloat(await line.getAttribute('y2'));
    
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    expect(length).toBeGreaterThanOrEqual(13);
  });

  test('line stroke width should match selected value', async ({ page }) => {
    // Set different line widths and create lines
    const widths = ['5', '13', '21'];
    
    for (let i = 0; i < widths.length; i++) {
      const lineWidthInput = await page.$('.prop .line-width');
      await lineWidthInput.fill(widths[i]);
      
      await page.click('.shape .line');
      
      await page.mouse.move(50, 50 + i * 50);
      await page.mouse.down();
      await page.mouse.move(150, 50 + i * 50);
      await page.mouse.up();
    }
    
    // Check all lines have correct stroke width
    const lines = await page.$$('.canvas line');
    expect(lines.length).toBe(3);
    
    for (let i = 0; i < lines.length; i++) {
      const strokeWidth = await lines[i].getAttribute('stroke-width');
      expect(strokeWidth).toBe(widths[i]);
    }
  });

  test('line should use current color', async ({ page }) => {
    // Set color to blue
    const colorInput = await page.$('.prop .color');
    await colorInput.fill('#0000ff');
    
    await page.click('.shape .line');
    
    // Draw line
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(200, 100);
    await page.mouse.up();
    
    // Check color
    const line = await page.$('.canvas line');
    const stroke = await line.getAttribute('stroke');
    expect(stroke).toBe('#0000ff');
  });
});
