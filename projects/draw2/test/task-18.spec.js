// Test for Task 18: Create custom cursor system based on selected tool
import { test, expect } from '@playwright/test';

test.describe('Task 18: Custom Cursor System', () => {
  test('should change cursor based on selected tool', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Test line tool cursor
    await page.locator('.line').click();
    await canvas.hover();
    
    const lineCursor = await canvas.evaluate(el => getComputedStyle(el).cursor);
    expect(lineCursor).not.toBe('auto');
    expect(lineCursor).not.toBe('default');
    
    // Test move tool cursor
    await page.locator('.move').click();
    await canvas.hover();
    
    const moveCursor = await canvas.evaluate(el => getComputedStyle(el).cursor);
    expect(moveCursor).not.toBe('auto');
    expect(moveCursor).not.toBe('default');
    expect(moveCursor).not.toBe(lineCursor);
    
    // Test rotate tool cursor
    await page.locator('.rotate').click();
    await canvas.hover();
    
    const rotateCursor = await canvas.evaluate(el => getComputedStyle(el).cursor);
    expect(rotateCursor).not.toBe('auto');
    expect(rotateCursor).not.toBe('default');
    expect(rotateCursor).not.toBe(lineCursor);
    expect(rotateCursor).not.toBe(moveCursor);
  });

  test('should apply tool-specific cursors to canvas children', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create a rectangle first
    await page.locator('.rect').click();
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 150;
    const startY = canvasBox.y + 150;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 80, startY + 60);
    await page.mouse.up();
    
    const rectElement = canvas.locator('rect');
    await expect(rectElement).toBeVisible();
    
    // Test cursor on shape elements
    await page.locator('.zoom').click();
    await rectElement.hover();
    
    // Check that cursor changes when hovering over shapes
    const shapeParentCursor = await canvas.evaluate(el => getComputedStyle(el).cursor);
    expect(shapeParentCursor).not.toBe('auto');
    expect(shapeParentCursor).not.toBe('default');
    
    // Test with different tool
    await page.locator('.copy').click();
    await rectElement.hover();
    
    const copyCursor = await canvas.evaluate(el => getComputedStyle(el).cursor);
    expect(copyCursor).not.toBe('auto');
    expect(copyCursor).not.toBe('default');
  });

  test('should use appropriate cursor icons for different operations', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    const tools = ['.line', '.rect', '.ellipse', '.move', '.rotate', '.zoom', '.copy', '.delete', '.fill'];
    const cursors = [];
    
    // Collect cursors for different tools
    for (const tool of tools) {
      await page.locator(tool).click();
      await canvas.hover();
      await page.waitForTimeout(50);
      
      const cursor = await canvas.evaluate(el => getComputedStyle(el).cursor);
      cursors.push({ tool, cursor });
    }
    
    // Verify that different tools have different cursors
    const uniqueCursors = new Set(cursors.map(c => c.cursor));
    
    // Should have multiple different cursor types
    expect(uniqueCursors.size).toBeGreaterThan(1);
    
    // None should be the default cursor
    expect(uniqueCursors.has('auto')).toBeFalsy();
    expect(uniqueCursors.has('default')).toBeFalsy();
    
    // Check that cursors contain data URI or specific cursor types
    cursors.forEach(({ tool, cursor }) => {
      expect(cursor).not.toBe('');
      // Should be either a data URI, url(), or specific cursor type
      const isValidCursor = cursor.includes('data:') || 
                           cursor.includes('url(') || 
                           ['pointer', 'crosshair', 'move', 'grab', 'copy'].includes(cursor);
      expect(isValidCursor).toBeTruthy();
    });
  });
});
