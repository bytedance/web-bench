import { test, expect } from '@playwright/test';

test.describe('Task 12: Shape base class', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should create shapes when drawing', async ({ page }) => {
    // Select line tool
    await page.click('.shape .line');
    
    // Draw a line
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await page.mouse.up();
    
    // Check if shape was created
    const shapes = await page.$$('.canvas > *');
    expect(shapes.length).toBeGreaterThan(0);
  });

  test('should create different shape types', async ({ page }) => {
    // Create a line
    await page.click('.shape .line');
    await page.mouse.move(50, 50);
    await page.mouse.down();
    await page.mouse.move(150, 50);
    await page.mouse.up();
    
    // Create a rect
    await page.click('.shape .rect');
    await page.mouse.move(50, 100);
    await page.mouse.down();
    await page.mouse.move(150, 200);
    await page.mouse.up();
    
    // Create an ellipse
    await page.click('.shape .ellipse');
    await page.mouse.move(200, 100);
    await page.mouse.down();
    await page.mouse.move(300, 200);
    await page.mouse.up();
    
    // Check shapes were created
    const lines = await page.$$('.canvas line');
    const rects = await page.$$('.canvas rect');
    const ellipses = await page.$$('.canvas ellipse');
    
    expect(lines.length).toBe(1);
    expect(rects.length).toBe(1);
    expect(ellipses.length).toBe(1);
  });

  test('shapes should have proper SVG structure', async ({ page }) => {
    // Create a rect
    await page.click('.shape .rect');
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await page.mouse.up();
    
    // Check rect attributes
    const rect = await page.$('.canvas rect');
    const hasStroke = await rect.getAttribute('stroke');
    const hasFill = await rect.getAttribute('fill');
    const hasStrokeWidth = await rect.getAttribute('stroke-width');
    
    expect(hasStroke).toBeTruthy();
    expect(hasFill).toBeTruthy();
    expect(hasStrokeWidth).toBeTruthy();
  });

  test('shapes should be removed when deleted', async ({ page }) => {
    // Create a shape
    await page.click('.shape .rect');
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await page.mouse.up();
    
    let shapes = await page.$$('.canvas > *');
    const initialCount = shapes.length;
    
    // Switch to delete mode and click the shape
    await page.click('.operation .delete');
    await page.click('.canvas rect');
    
    shapes = await page.$$('.canvas > *');
    expect(shapes.length).toBe(initialCount - 1);
  });

  test('registered shapes should include line, rect, and ellipse', async ({ page }) => {
    // Test that all three shape types can be created
    const shapeTypes = ['line', 'rect', 'ellipse'];
    
    for (const shapeType of shapeTypes) {
      await page.click(`.shape .${shapeType}`);
      
      // Verify the tool is selected
      const selectedValue = await page.$eval('input[name="operation"]:checked', el => el.value);
      expect(selectedValue).toBe(shapeType);
    }
  });
});
