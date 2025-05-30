import { test, expect } from '@playwright/test';

test.describe('Task 14: Canvas drag functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should update shape size while dragging during creation', async ({ page }) => {
    await page.click('.shape .rect');
    
    // Start drawing
    await page.mouse.move(100, 100);
    await page.mouse.down();
    
    // Move to create small rect
    await page.mouse.move(120, 120);
    
    // Get intermediate size
    let rect = await page.$('.canvas rect');
    let width1 = await rect.getAttribute('width');
    
    // Continue dragging to make it larger
    await page.mouse.move(200, 200);
    let width2 = await rect.getAttribute('width');
    
    await page.mouse.up();
    
    // Width should have increased
    expect(parseFloat(width2)).toBeGreaterThan(parseFloat(width1));
  });

  test('should move shapes in move mode', async ({ page }) => {
    // Create a shape
    await page.click('.shape .ellipse');
    await page.mouse.move(150, 150);
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await page.mouse.up();
    
    // Get initial position
    const ellipse = await page.$('.canvas ellipse');
    const initialCx = await ellipse.getAttribute('cx');
    const initialCy = await ellipse.getAttribute('cy');
    
    // Switch to move mode and drag the shape
    await page.click('.operation .move');
    await page.mouse.move(parseFloat(initialCx), parseFloat(initialCy));
    await page.mouse.down();
    await page.mouse.move(parseFloat(initialCx) + 50, parseFloat(initialCy) + 50);
    await page.mouse.up();
    
    // Check transform was applied (shape moved)
    const transform = await ellipse.getAttribute('style');
    expect(transform).toContain('transform');
    expect(transform).toContain('translate');
  });

  test('should rotate shapes in rotate mode', async ({ page }) => {
    // Create a rect
    await page.click('.shape .rect');
    await page.mouse.move(150, 150);
    await page.mouse.down();
    await page.mouse.move(250, 250);
    await page.mouse.up();
    
    // Switch to rotate mode
    await page.click('.operation .rotate');
    
    const rect = await page.$('.canvas rect');
    
    // Drag to rotate
    await page.mouse.move(200, 150);
    await page.mouse.down();
    await page.mouse.move(250, 200);
    await page.mouse.up();
    
    // Check that rotation was applied
    const transform = await rect.getAttribute('style');
    expect(transform).toContain('rotate');
  });

  test('should scale shapes in zoom mode', async ({ page }) => {
    // Create a shape
    await page.click('.shape .line');
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(200, 100);
    await page.mouse.up();
    
    // Switch to zoom mode
    await page.click('.operation .zoom');
    
    const line = await page.$('.canvas line');
    
    // Drag to scale
    await page.mouse.move(150, 100);
    await page.mouse.down();
    await page.mouse.move(250, 100);
    await page.mouse.up();
    
    // Check that scale was applied
    const transform = await line.getAttribute('style');
    expect(transform).toContain('scale');
  });

  test('continuous drag should update shape smoothly', async ({ page }) => {
    await page.click('.shape .rect');
    
    // Start drawing
    await page.mouse.move(50, 50);
    await page.mouse.down();
    
    // Drag through multiple points
    const points = [
      [60, 60], [80, 80], [100, 100], [120, 120], [150, 150]
    ];
    
    for (const [x, y] of points) {
      await page.mouse.move(x, y);
    }
    
    await page.mouse.up();
    
    // Final shape should reflect the last position
    const rect = await page.$('.canvas rect');
    const width = await rect.getAttribute('width');
    const height = await rect.getAttribute('height');
    
    expect(parseFloat(width)).toBeGreaterThan(80);
    expect(parseFloat(height)).toBeGreaterThan(80);
  });
});
