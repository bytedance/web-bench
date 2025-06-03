// Test for Task 18: Create custom cursor system based on selected tool
import { test, expect } from '@playwright/test';

test.describe('Task 18: Custom Cursor System', () => {
  test('should change cursor based on selected tool', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Test line tool cursor
    await page.locator('.line').click();
    const canvasBox = await canvas.boundingBox();
    await page.mouse.move(canvasBox.x, canvasBox.y);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 300, canvasBox.y + 300);
    await page.mouse.up();
    const line = canvas.locator('line')
    
    // Test move tool cursor
    await page.locator('.move').click();
    await line.hover()
    
    const moveCursor = await line.evaluate(el => getComputedStyle(el).cursor);
    expect(moveCursor).not.toBe('auto');
    expect(moveCursor).not.toBe('default');
    
    // Test rotate tool cursor
    await page.locator('.rotate').click();
    await line.hover()
    
    const rotateCursor = await line.evaluate(el => getComputedStyle(el).cursor);
    expect(rotateCursor).not.toBe('auto');
    expect(rotateCursor).not.toBe('default');
    expect(rotateCursor).not.toBe(moveCursor);
  });

  test('should apply tool-specific cursors to canvas children', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create a rectangle first
    await page.locator('.rect').click();
    const canvasBox = await canvas.boundingBox();
    await page.mouse.move(canvasBox.x, canvasBox.y);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.up();
    
    const rectElement = canvas.locator('rect');
    await expect(rectElement).toBeVisible();
    
    // Test cursor on shape elements
    await page.locator('.zoom').click();
    await rectElement.hover();
    
    // Check that cursor changes when hovering over shapes
    const shapeParentCursor = await rectElement.evaluate(el => getComputedStyle(el).cursor);
    expect(shapeParentCursor).not.toBe('auto');
    expect(shapeParentCursor).not.toBe('default');
    
    // Test with different tool
    await page.locator('.copy').click();
    await rectElement.hover();
    
    const copyCursor = await rectElement.evaluate(el => getComputedStyle(el).cursor);
    expect(copyCursor).not.toBe('auto');
    expect(copyCursor).not.toBe('default');
  });

});
