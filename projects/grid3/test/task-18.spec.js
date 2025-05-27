// test/task-18.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Task 18: Drag Elements with Hover Visibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + process.cwd() + '/src/index.html');
  });

  test('should have left-drag and right-drag elements in content', async ({ page }) => {
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
    
    await expect(leftDrag).toBeVisible();
    await expect(rightDrag).toBeVisible();
  });

  test('should position drag elements absolutely', async ({ page }) => {
    const leftDrag = page.locator('.left-drag');
    const rightDrag = page.locator('.right-drag');
    
    const leftPosition = await leftDrag.evaluate(el => getComputedStyle(el).position);
    const rightPosition = await rightDrag.evaluate(el => getComputedStyle(el).position);
    
    expect(leftPosition).toBe('absolute');
    expect(rightPosition).toBe('absolute');
  });

  test('should have appropriate cursor styles for dragging', async ({ page }) => {
    const content = page.locator('.content');
    await content.hover();
    
    const leftDrag = page.locator('.left-drag');
    const rightDrag = page.locator('.right-drag');
    
    const leftCursor = await leftDrag.evaluate(el => getComputedStyle(el).cursor);
    const rightCursor = await rightDrag.evaluate(el => getComputedStyle(el).cursor);
    
    expect(leftCursor).toContain('resize');
    expect(rightCursor).toContain('resize');
  });
});