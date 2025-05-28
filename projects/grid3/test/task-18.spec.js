const { test, expect } = require('@playwright/test');

test.describe('Task 18: Left and right drag elements with hover visibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../src/index.html');
    await page.setViewportSize({ width: 1200, height: 800 });
  });

  test('should display left and right drag elements', async ({ page }) => {
    const leftDrag = page.locator('.left-drag');
    const rightDrag = page.locator('.right-drag');
    
    await expect(leftDrag).toBeAttached();
    await expect(rightDrag).toBeAttached();
  });

  test('should hide drag elements by default', async ({ page }) => {
    const leftDrag = page.locator('.left-drag');
    const rightDrag = page.locator('.right-drag');
    
    const leftOpacity = await leftDrag.evaluate(el => getComputedStyle(el).opacity);
    const rightOpacity = await rightDrag.evaluate(el => getComputedStyle(el).opacity);
    
    expect(parseFloat(leftOpacity)).toBe(0);
    expect(parseFloat(rightOpacity)).toBe(0);
  });

  test('should show drag elements when hovering over content', async ({ page }) => {
    const content = page.locator('.content');
    const leftDrag = page.locator('.left-drag');
    const rightDrag = page.locator('.right-drag');
    
    await content.hover();
    
    const leftOpacity = await leftDrag.evaluate(el => getComputedStyle(el).opacity);
    const rightOpacity = await rightDrag.evaluate(el => getComputedStyle(el).opacity);
    
    expect(parseFloat(leftOpacity)).toBeGreaterThan(0);
    expect(parseFloat(rightOpacity)).toBeGreaterThan(0);
  });

  test('should position left drag at left side of content', async ({ page }) => {
    const content = page.locator('.content');
    const leftDrag = page.locator('.left-drag');
    
    const contentBox = await content.boundingBox();
    const leftDragBox = await leftDrag.boundingBox();
    
    expect(leftDragBox.x).toBeCloseTo(contentBox.x, 5);
  });

  test('should position right drag at right side of content', async ({ page }) => {
    const content = page.locator('.content');
    const rightDrag = page.locator('.right-drag');
    
    const contentBox = await content.boundingBox();
    const rightDragBox = await rightDrag.boundingBox();
    
    expect(rightDragBox.x + rightDragBox.width).toBeCloseTo(contentBox.x + contentBox.width, 5);
  });
});