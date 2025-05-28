const { test, expect } = require('@playwright/test');

test.describe('Task 20: Right-drag at bottom for height adjustment when width < 400px', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../src/index.html');
  });

  test('should position right-drag at bottom of content when width < 400px', async ({ page }) => {
    await page.setViewportSize({ width: 350, height: 600 });
    
    const content = page.locator('.content');
    const rightDrag = page.locator('.right-drag');
    
    const contentBox = await content.boundingBox();
    const rightDragBox = await rightDrag.boundingBox();
    
    expect(rightDragBox.y).toBeGreaterThan(contentBox.y + contentBox.height - 20);
  });

  test('should change right-drag cursor to vertical resize when width < 400px', async ({ page }) => {
    await page.setViewportSize({ width: 350, height: 600 });
    
    const content = page.locator('.content');
    const rightDrag = page.locator('.right-drag');
    
    await content.hover();
    
    const cursor = await rightDrag.evaluate(el => getComputedStyle(el).cursor);
    expect(cursor).toBe('ns-resize');
  });

  test('should allow dragging right-drag to adjust content height when width < 400px', async ({ page }) => {
    await page.setViewportSize({ width: 350, height: 800 });
    
    const content = page.locator('.content');
    const rightDrag = page.locator('.right-drag');
    
    const initialContentBox = await content.boundingBox();
    
    await content.hover();
    await rightDrag.dragTo(rightDrag, { targetPosition: { x: 0, y: 50 } });
    
    const finalContentBox = await content.boundingBox();
    expect(finalContentBox.height).toBeGreaterThan(initialContentBox.height + 20);
  });

  test('should maintain horizontal resize behavior when width >= 400px', async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 600 });
    
    const content = page.locator('.content');
    const rightDrag = page.locator('.right-drag');
    
    await content.hover();
    
    const cursor = await rightDrag.evaluate(el => getComputedStyle(el).cursor);
    expect(cursor).toBe('ew-resize');
    
    const contentBox = await content.boundingBox();
    const rightDragBox = await rightDrag.boundingBox();
    
    expect(rightDragBox.x + rightDragBox.width).toBeCloseTo(contentBox.x + contentBox.width, 5);
  });

  test('should maintain minimum content height when dragging vertically', async ({ page }) => {
    await page.setViewportSize({ width: 350, height: 600 });
    
    const content = page.locator('.content');
    const rightDrag = page.locator('.right-drag');
    
    await content.hover();
    await rightDrag.dragTo(rightDrag, { targetPosition: { x: 0, y: -500 } });
    
    const finalContentBox = await content.boundingBox();
    expect(finalContentBox.height).toBeGreaterThan(100);
  });
});