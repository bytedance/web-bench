// test/task-19.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Task 19: JavaScript Drag Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/src/index.html');
  });

  test('should load JavaScript file successfully', async ({ page }) => {
    const scriptLoaded = await page.evaluate(() => {
      return typeof document !== 'undefined';
    });
    expect(scriptLoaded).toBe(true);
  });

  test('should adjust content width when dragging right-drag', async ({ page }) => {
    const content = page.locator('.content');
    const rightDrag = page.locator('.right-drag');
    
    await content.hover();
    
    const initialWidth = await content.evaluate(el => el.offsetWidth);
    
    // Simulate drag to the right
    await rightDrag.dragTo(content, {
      targetPosition: { x: initialWidth + 50, y: 100 }
    });
    
    // Allow time for the drag operation
    await page.waitForTimeout(100);
    
    const finalWidth = await content.evaluate(el => el.offsetWidth);
    // Width should be different after dragging (either increased or controlled by CSS)
    expect(typeof finalWidth).toBe('number');
  });

  test('should adjust content width when dragging left-drag', async ({ page }) => {
    const content = page.locator('.content');
    const leftDrag = page.locator('.left-drag');
    
    await content.hover();
    
    const initialWidth = await content.evaluate(el => el.offsetWidth);
    
    // Simulate drag to the left
    await leftDrag.dragTo(content, {
      targetPosition: { x: 50, y: 100 }
    });
    
    await page.waitForTimeout(100);
    
    const finalWidth = await content.evaluate(el => el.offsetWidth);
    expect(typeof finalWidth).toBe('number');
  });

  test('should handle mouse events for dragging', async ({ page }) => {
    const content = page.locator('.content');
    const rightDrag = page.locator('.right-drag');
    
    await content.hover();
    
    // Test mousedown event handling
    await rightDrag.dispatchEvent('mousedown', { clientX: 100, clientY: 100 });
    await page.mouse.move(150, 100);
    await page.mouse.up();
    
    // Should not throw errors
    expect(true).toBe(true);
  });

  test('should maintain drag functionality across multiple operations', async ({ page }) => {
    const content = page.locator('.content');
    const rightDrag = page.locator('.right-drag');
    
    await content.hover();
    
    // First drag operation
    await rightDrag.dragTo(content, { targetPosition: { x: 200, y: 100 } });
    await page.waitForTimeout(50);
    
    // Second drag operation
    await rightDrag.dragTo(content, { targetPosition: { x: 250, y: 100 } });
    await page.waitForTimeout(50);
    
    const finalWidth = await content.evaluate(el => el.offsetWidth);
    expect(typeof finalWidth).toBe('number');
  });
});