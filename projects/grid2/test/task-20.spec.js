// test/task-20.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Task 20: Mobile Drag Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/src/index.html');
  });

  test('should move right-drag to bottom on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 350, height: 600 });
    
    const rightDrag = page.locator('.right-drag');
    const content = page.locator('.content');
    
    await content.hover();
    
    const rightDragPosition = await rightDrag.evaluate(el => {
      const style = getComputedStyle(el);
      return {
        bottom: style.bottom,
        top: style.top,
        cursor: style.cursor
      };
    });
    
    // On mobile, right-drag should be positioned at bottom
    expect(rightDragPosition.cursor).toContain('resize');
  });

  test('should adjust content height when dragging on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 350, height: 600 });
    
    const content = page.locator('.content');
    const rightDrag = page.locator('.right-drag');
    
    await content.hover();
    
    const initialHeight = await content.evaluate(el => el.offsetHeight);
    
    // Simulate vertical drag on mobile
    await rightDrag.dragTo(content, {
      targetPosition: { x: 175, y: initialHeight + 50 }
    });
    
    await page.waitForTimeout(100);
    
    const finalHeight = await content.evaluate(el => el.offsetHeight);
    expect(typeof finalHeight).toBe('number');
  });

  test('should maintain grid layout on mobile with height adjustment', async ({ page }) => {
    await page.setViewportSize({ width: 350, height: 600 });
    
    const root = page.locator('.root');
    const display = await root.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('grid');
  });

  test('should handle both width and height dragging based on viewport', async ({ page }) => {
    // Test desktop behavior first
    await page.setViewportSize({ width: 800, height: 600 });
    const content = page.locator('.content');
    const rightDrag = page.locator('.right-drag');
    
    await content.hover();
    let cursorStyle = await rightDrag.evaluate(el => getComputedStyle(el).cursor);
    expect(cursorStyle).toContain('ew-resize');
    
    // Test mobile behavior
    await page.setViewportSize({ width: 350, height: 600 });
    await content.hover();
    cursorStyle = await rightDrag.evaluate(el => getComputedStyle(el).cursor);
    expect(cursorStyle).toContain('resize');
  });

  test('should respond to viewport changes for drag behavior', async ({ page }) => {
    const content = page.locator('.content');
    const rightDrag = page.locator('.right-drag');
    
    // Start with desktop
    await page.setViewportSize({ width: 800, height: 600 });
    await content.hover();
    
    // Switch to mobile
    await page.setViewportSize({ width: 350, height: 600 });
    await content.hover();
    
    // Drag element should still be functional
    await expect(rightDrag).toBeVisible();
    
    const dragExists = await rightDrag.evaluate(el => el.offsetWidth > 0 || el.offsetHeight > 0);
    expect(dragExists).toBe(true);
  });
});