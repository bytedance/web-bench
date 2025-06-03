import { test, expect } from '@playwright/test';

test.describe('Task 19: Automatic tool switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should switch to move tool after shape creation', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Select line tool
    await page.click('label:has(input[value="line"])');
    
    // Create a line
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Should automatically switch to move tool
    const checkedTool = await page.locator('input[name="operation"]:checked').getAttribute('value');
    expect(checkedTool).toBe('move');
  });

  test('should switch to move tool after copy operation', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create a rect first
    await page.click('label:has(input[value="rect"])');
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Select copy tool
    await page.click('label:has(input[value="copy"])');
    
    // Copy the rect
    const rect = await canvas.locator('rect').first();
    await rect.click();
    
    // Should switch to move tool after copy
    const checkedTool = await page.locator('input[name="operation"]:checked').getAttribute('value');
    expect(checkedTool).toBe('move');
  });

  test('should check if operation is in whitelist', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Test shape creation tools (should switch to move)
    const shapeTools = ['line', 'rect', 'ellipse'];
    
    for (const tool of shapeTools) {
      await page.click(`label:has(input[value="${tool}"])`);
      
      // Create shape
      await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
      await page.mouse.up();
      
      // Should switch to move
      const checkedTool = await page.locator('input[name="operation"]:checked').getAttribute('value');
      expect(checkedTool).toBe('move');
    }
  });

  test('should not switch for operations not in whitelist', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create a shape first
    await page.click('label:has(input[value="rect"])');
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Now test non-whitelist operations
    const nonWhitelistOps = ['delete', 'fill', 'rotate', 'zoom'];
    
    for (const op of nonWhitelistOps) {
      // Select the operation
      await page.click(`label:has(input[value="${op}"])`);
      
      // Perform the operation
      const rect = await canvas.locator('rect').first();
      if (rect && await rect.count() > 0) {
        await rect.click();
        
        // Tool should remain the same
        const checkedTool = await page.locator('input[name="operation"]:checked').getAttribute('value');
        expect(checkedTool).toBe(op);
      }
    }
  });

  test('should enable immediate manipulation of created shapes', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create an ellipse
    await page.click('label:has(input[value="ellipse"])');
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 250, canvasBox.y + 250);
    await page.mouse.up();
    
    // Should be in move mode now
    const checkedTool = await page.locator('input[name="operation"]:checked').getAttribute('value');
    expect(checkedTool).toBe('move');
    
    // Immediately move the shape without switching tools
    const ellipse = await canvas.locator('ellipse').first();
    await ellipse.click();
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Check transform was applied
    const transform = await ellipse.getAttribute('transform');
    expect(transform).toContain('translate');
  });
});
