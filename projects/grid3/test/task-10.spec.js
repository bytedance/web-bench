const { test, expect } = require('@playwright/test');

test.describe('Task 10: Rightbar grid with 10 rows and 2 columns', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../src/index.html');
    await page.setViewportSize({ width: 1200, height: 800 });
  });

  test('should display 40 rightbar items in total', async ({ page }) => {
    const rightbarItems = page.locator('.rightbar-item');
    await expect(rightbarItems).toHaveCount(40);
  });

  test('should arrange rightbar items in 2 columns layout', async ({ page }) => {
    const rightbarItems = page.locator('.rightbar-item');
    const firstItem = rightbarItems.nth(0);
    const secondItem = rightbarItems.nth(1);
    
    const firstBox = await firstItem.boundingBox();
    const secondBox = await secondItem.boundingBox();
    
    expect(Math.abs(firstBox.y - secondBox.y)).toBeLessThan(5);
    expect(secondBox.x).toBeGreaterThan(firstBox.x + firstBox.width - 5);
  });

  test('should display overflow text with ellipsis in rightbar items', async ({ page }) => {
    const rightbarItems = page.locator('.rightbar-item');
    const firstItem = rightbarItems.nth(0);
    
    const itemText = await firstItem.textContent();
    const computedStyle = await firstItem.evaluate(el => {
      const style = getComputedStyle(el);
      return {
        overflow: style.overflow,
        textOverflow: style.textOverflow,
        whiteSpace: style.whiteSpace
      };
    });
    
    expect(itemText).toContain('this-is-a-very-long-text-sample-to-test-overflow');
    expect(computedStyle.textOverflow).toBe('ellipsis');
  });

  test('should arrange rightbar items in rows of 2', async ({ page }) => {
    const rightbarItems = page.locator('.rightbar-item');
    const firstRowItems = [rightbarItems.nth(0), rightbarItems.nth(1)];
    const secondRowItems = [rightbarItems.nth(2), rightbarItems.nth(3)];
    
    const firstRowBoxes = await Promise.all(firstRowItems.map(item => item.boundingBox()));
    const secondRowBoxes = await Promise.all(secondRowItems.map(item => item.boundingBox()));
    
    expect(Math.abs(firstRowBoxes[0].y - firstRowBoxes[1].y)).toBeLessThan(5);
    expect(secondRowBoxes[0].y).toBeGreaterThan(firstRowBoxes[0].y + firstRowBoxes[0].height - 5);
  });

  test('should maintain rightbar visibility and structure', async ({ page }) => {
    const rightbar = page.locator('.rightbar');
    const rightbarItems = page.locator('.rightbar-item');
    
    await expect(rightbar).toBeVisible();
    
    const rightbarBox = await rightbar.boundingBox();
    expect(rightbarBox.width).toBeGreaterThan(150);
    expect(rightbarBox.height).toBeGreaterThan(200);
    
    const visibleItems = await rightbarItems.count();
    expect(visibleItems).toBe(40);
  });
});