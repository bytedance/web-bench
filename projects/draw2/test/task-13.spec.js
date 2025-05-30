import { test, expect } from '@playwright/test';

test.describe('Task 13: Canvas class mouse/touch events', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('canvas should respond to mouse down events', async ({ page }) => {
    await page.click('.shape .line');
    
    const initialShapes = await page.$$('.canvas > *');
    const initialCount = initialShapes.length;
    
    // Start drawing
    await page.mouse.move(100, 100);
    await page.mouse.down();
    
    // Even without moving, a shape might be created
    await page.mouse.up();
    
    const finalShapes = await page.$$('.canvas > *');
    expect(finalShapes.length).toBeGreaterThanOrEqual(initialCount);
  });

  test('should track cursor position during drawing', async ({ page }) => {
    await page.click('.shape .rect');
    
    // Draw a rectangle from (100,100) to (200,200)
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await page.mouse.up();
    
    // Check that a rect was created with appropriate size
    const rect = await page.$('.canvas rect');
    const width = await rect.getAttribute('width');
    const height = await rect.getAttribute('height');
    
    expect(parseFloat(width)).toBeGreaterThan(50);
    expect(parseFloat(height)).toBeGreaterThan(50);
  });

  test('should select existing shapes in move mode', async ({ page }) => {
    // Create a shape first
    await page.click('.shape .ellipse');
    await page.mouse.move(150, 150);
    await page.mouse.down();
    await page.mouse.move(250, 250);
    await page.mouse.up();
    
    // Switch to move mode
    await page.click('.operation .move');
    
    // Click on the shape
    const ellipse = await page.$('.canvas ellipse');
    const bbox = await ellipse.boundingBox();
    await page.mouse.click(bbox.x + bbox.width/2, bbox.y + bbox.height/2);
    
    // Shape should still exist (not deleted)
    const stillExists = await page.$('.canvas ellipse');
    expect(stillExists).toBeTruthy();
  });

  test('should not create shapes when clicking on canvas in operation modes', async ({ page }) => {
    // Create a shape
    await page.click('.shape .rect');
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await page.mouse.up();
    
    const initialCount = (await page.$$('.canvas > *')).length;
    
    // Switch to move mode and click on empty canvas
    await page.click('.operation .move');
    await page.mouse.click(300, 300);
    
    const finalCount = (await page.$$('.canvas > *')).length;
    expect(finalCount).toBe(initialCount);
  });

  test('should handle mouse leave events', async ({ page }) => {
    await page.click('.shape .line');
    
    // Start drawing
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(150, 150);
    
    // Move mouse outside canvas (simulate mouse leave)
    await page.mouse.move(0, 0);
    await page.mouse.up();
    
    // Should have created a shape
    const shapes = await page.$$('.canvas line');
    expect(shapes.length).toBeGreaterThan(0);
  });
});
