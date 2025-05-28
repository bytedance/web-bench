const { test, expect } = require('@playwright/test');

test.describe('Task 19: Drag functionality to adjust content width', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../src/index.html');
    await page.setViewportSize({ width: 1200, height: 800 });
  });

  test('should allow dragging right-drag to increase content width', async ({ page }) => {
    const content = page.locator('.content');
    const rightDrag = page.locator('.right-drag');
    
    const initialContentBox = await content.boundingBox();
    
    await content.hover();
    await rightDrag.dragTo(rightDrag, { targetPosition: { x: 50, y: 0 } });
    
    const finalContentBox = await content.boundingBox();
    expect(finalContentBox.width).toBeGreaterThan(initialContentBox.width + 20);
  });

  test('should allow dragging left-drag to decrease content width', async ({ page }) => {
    const content = page.locator('.content');
    const leftDrag = page.locator('.left-drag');
    
    const initialContentBox = await content.boundingBox();
    
    await content.hover();
    await leftDrag.dragTo(leftDrag, { targetPosition: { x: 50, y: 0 } });
    
    const finalContentBox = await content.boundingBox();
    expect(finalContentBox.width).toBeLessThan(initialContentBox.width - 20);
  });

  test('should maintain minimum content width when dragging', async ({ page }) => {
    const content = page.locator('.content');
    const leftDrag = page.locator('.left-drag');
    
    await content.hover();
    await leftDrag.dragTo(leftDrag, { targetPosition: { x: 500, y: 0 } });
    
    const finalContentBox = await content.boundingBox();
    expect(finalContentBox.width).toBeGreaterThan(100);
  });

  test('should show resize cursor on drag elements', async ({ page }) => {
    const content = page.locator('.content');
    const leftDrag = page.locator('.left-drag');
    const rightDrag = page.locator('.right-drag');
    
    await content.hover();
    
    const leftCursor = await leftDrag.evaluate(el => getComputedStyle(el).cursor);
    const rightCursor = await rightDrag.evaluate(el => getComputedStyle(el).cursor);
    
    expect(leftCursor).toBe('ew-resize');
    expect(rightCursor).toBe('ew-resize');
  });

  test('should maintain card layout after content width changes', async ({ page }) => {
    const content = page.locator('.content');
    const rightDrag = page.locator('.right-drag');
    const cards = page.locator('.card');
    
    await content.hover();
    await rightDrag.dragTo(rightDrag, { targetPosition: { x: 100, y: 0 } });
    
    const firstCard = cards.nth(0);
    const secondCard = cards.nth(1);
    
    await expect(firstCard).toBeVisible();
    await expect(secondCard).toBeVisible();
  });
});