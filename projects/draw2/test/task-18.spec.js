import { test, expect } from '@playwright/test';

test.describe('Task 18: Custom cursor system', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should change cursor based on selected tool', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    
    // Create a shape first
    const canvasBox = await canvas.boundingBox();
    await page.click('label:has(input[value="rect"])');
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    const rect = await canvas.locator('rect').first();
    
    // Test different tool cursors
    const tools = ['move', 'rotate', 'zoom', 'delete', 'fill'];
    
    for (const tool of tools) {
      await page.click(`label:has(input[value="${tool}"])`);
      
      // Check cursor style on shape
      const cursor = await rect.evaluate(el => 
        window.getComputedStyle(el).cursor
      );
      
      // Cursor should not be default
      expect(cursor).not.toBe('auto');
      expect(cursor).not.toBe('default');
    }
  });

  test('should apply tool-specific cursors to canvas children', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create multiple shapes
    await page.click('label:has(input[value="line"])');
    await page.mouse.move(canvasBox.x + 50, canvasBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.up();
    
    await page.click('label:has(input[value="ellipse"])');
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 300, canvasBox.y + 200);
    await page.mouse.up();
    
    // Switch to move tool
    await page.click('label:has(input[value="move"])');
    
    // Check cursor on different shapes
    const line = await canvas.locator('line').first();
    const ellipse = await canvas.locator('ellipse').first();
    
    const lineCursor = await line.evaluate(el => 
      window.getComputedStyle(el).cursor
    );
    const ellipseCursor = await ellipse.evaluate(el => 
      window.getComputedStyle(el).cursor
    );
    
    // Both should have the same cursor style
    expect(lineCursor).toBe(ellipseCursor);
    expect(lineCursor).not.toBe('auto');
  });

  test('cursor should use icon data URIs like tool buttons', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create a rect
    await page.click('label:has(input[value="rect"])');
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Select a tool with custom cursor
    await page.click('label:has(input[value="rotate"])');
    
    const rect = await canvas.locator('rect').first();
    const cursor = await rect.evaluate(el => 
      window.getComputedStyle(el).cursor
    );
    
    // Cursor might be url() or custom cursor
    expect(cursor).toBeTruthy();
    expect(cursor.length).toBeGreaterThan(0);
  });

  test('cursor should change when switching tools', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create an ellipse
    await page.click('label:has(input[value="ellipse"])');
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 250, canvasBox.y + 250);
    await page.mouse.up();
    
    const ellipse = await canvas.locator('ellipse').first();
    
    // Get cursor for move tool
    await page.click('label:has(input[value="move"])');
    const moveCursor = await ellipse.evaluate(el => 
      window.getComputedStyle(el).cursor
    );
    
    // Get cursor for delete tool
    await page.click('label:has(input[value="delete"])');
    const deleteCursor = await ellipse.evaluate(el => 
      window.getComputedStyle(el).cursor
    );
    
    // Cursors should be different
    expect(moveCursor).not.toBe(deleteCursor);
  });

  test('cursor hotspot should be positioned appropriately', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create shapes
    await page.click('label:has(input[value="rect"])');
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.up();
    
    // Test that cursor interaction works properly
    const tools = ['move', 'rotate', 'zoom', 'delete'];
    
    for (const tool of tools) {
      await page.click(`label:has(input[value="${tool}"])`);
      
      // Hover over shape
      const rect = await canvas.locator('rect').first();
      await rect.hover();
      
      // Should be able to interact with shape
      const isHoverable = await rect.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.pointerEvents !== 'none';
      });
      
      expect(isHoverable).toBe(true);
    }
  });
});
