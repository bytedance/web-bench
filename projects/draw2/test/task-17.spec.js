import { test, expect } from '@playwright/test';

test.describe('Task 17: Fill operation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should change shape fill colors', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create a rect
    await page.click('label:has(input[value="rect"])');
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Set color picker to red
    await page.fill('input[name="color"]', '#ff0000');
    
    // Switch to fill tool
    await page.click('label:has(input[value="fill"])');
    
    // Fill the rect
    const rect = await canvas.locator('rect').first();
    await rect.click();
    
    // Check fill was changed
    const fill = await rect.getAttribute('fill');
    expect(fill).toBe('#ff0000');
  });

  test('should work only on shape elements', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create an ellipse
    await page.click('label:has(input[value="ellipse"])');
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 250, canvasBox.y + 250);
    await page.mouse.up();
    
    // Set color
    await page.fill('input[name="color"]', '#00ff00');
    
    // Switch to fill tool
    await page.click('label:has(input[value="fill"])');
    
    // Click on ellipse
    const ellipse = await canvas.locator('ellipse').first();
    await ellipse.click();
    
    // Ellipse should have new fill
    const ellipseFill = await ellipse.getAttribute('fill');
    expect(ellipseFill).toBe('#00ff00');
    
    // Click on empty canvas area
    await page.mouse.click(canvasBox.x + 50, canvasBox.y + 50);
    
    // Canvas should not have fill attribute changed
    const canvasFill = await canvas.getAttribute('fill');
    expect(canvasFill).not.toBe('#00ff00');
  });

  test('should use current color from color picker', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create multiple shapes
    const shapes = [
      { type: 'rect', x: 100 },
      { type: 'ellipse', x: 200 },
      { type: 'rect', x: 300 }
    ];
    
    for (const shape of shapes) {
      await page.click(`label:has(input[value="${shape.type}"])`);
      await page.mouse.move(canvasBox.x + shape.x, canvasBox.y + 100);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + shape.x + 50, canvasBox.y + 150);
      await page.mouse.up();
    }
    
    // Switch to fill tool
    await page.click('label:has(input[value="fill"])');
    
    // Fill each shape with different colors
    const colors = ['#ff0000', '#00ff00', '#0000ff'];
    
    for (let i = 0; i < shapes.length; i++) {
      await page.fill('input[name="color"]', colors[i]);
      
      const shape = await canvas.locator(`${shapes[i].type}`).nth(shapes[i].type === 'rect' ? Math.floor(i/2) : 0);
      await shape.click();
      
      const fill = await shape.getAttribute('fill');
      expect(fill).toBe(colors[i]);
    }
  });

  test('should not change stroke color when filling', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Set initial stroke color
    await page.fill('input[name="color"]', '#ff0000');
    
    // Create a rect
    await page.click('label:has(input[value="rect"])');
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    const rect = await canvas.locator('rect').first();
    const originalStroke = await rect.getAttribute('stroke');
    
    // Change color and fill
    await page.fill('input[name="color"]', '#00ff00');
    await page.click('label:has(input[value="fill"])');
    await rect.click();
    
    // Check fill changed but stroke didn't
    const newFill = await rect.getAttribute('fill');
    const newStroke = await rect.getAttribute('stroke');
    
    expect(newFill).toBe('#00ff00');
    expect(newStroke).toBe(originalStroke);
  });

  test('should fill line shapes appropriately', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create a line
    await page.click('label:has(input[value="line"])');
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Set color
    await page.fill('input[name="color"]', '#ff00ff');
    
    // Switch to fill tool
    await page.click('label:has(input[value="fill"])');
    
    // Try to fill the line
    const line = await canvas.locator('line').first();
    await line.click();
    
    // Lines typically don't have fill, so verify it handles gracefully
    // The stroke might change or nothing happens - just ensure no errors
    const lineExists = await line.isVisible();
    expect(lineExists).toBe(true);
  });
});
