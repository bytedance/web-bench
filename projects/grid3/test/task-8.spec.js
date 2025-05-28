const { test, expect } = require('@playwright/test');

test.describe('Task 8: Menu items full width below 400px', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../src/index.html');
  });

  test('should make each menu item occupy full page width when width < 400px', async ({ page }) => {
    await page.setViewportSize({ width: 350, height: 600 });
    
    const menuItems = page.locator('.menu-item');
    const viewportWidth = 350;
    
    for (let i = 0; i < 3; i++) {
      const itemBox = await menuItems.nth(i).boundingBox();
      expect(itemBox.width).toBeCloseTo(viewportWidth, 30);
      expect(itemBox.x).toBeLessThan(10);
    }
  });

  test('should stack menu items vertically when each takes full width', async ({ page }) => {
    await page.setViewportSize({ width: 350, height: 600 });
    
    const menuItems = page.locator('.menu-item');
    const firstItemBox = await menuItems.nth(0).boundingBox();
    const secondItemBox = await menuItems.nth(1).boundingBox();
    const thirdItemBox = await menuItems.nth(2).boundingBox();
    
    expect(secondItemBox.y).toBeGreaterThan(firstItemBox.y + firstItemBox.height - 5);
    expect(thirdItemBox.y).toBeGreaterThan(secondItemBox.y + secondItemBox.height - 5);
  });

  test('should center text in full-width menu items', async ({ page }) => {
    await page.setViewportSize({ width: 350, height: 600 });
    
    const menuItem = page.locator('.menu-item').first();
    const textAlign = await menuItem.evaluate(el => getComputedStyle(el).textAlign);
    expect(textAlign).toBe('center');
  });

  test('should maintain horizontal layout when width >= 400px', async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 600 });
    
    const menuItems = page.locator('.menu-item');
    const firstItemBox = await menuItems.nth(0).boundingBox();
    const secondItemBox = await menuItems.nth(1).boundingBox();
    
    expect(Math.abs(firstItemBox.y - secondItemBox.y)).toBeLessThan(5);
    expect(secondItemBox.x).toBeGreaterThan(firstItemBox.x + firstItemBox.width - 5);
  });

  test('should preserve menu item functionality in full-width mode', async ({ page }) => {
    await page.setViewportSize({ width: 350, height: 600 });
    
    const menuItems = page.locator('.menu-item');
    
    for (let i = 0; i < 3; i++) {
      const item = menuItems.nth(i);
      await expect(item).toBeVisible();
      await item.click();
    }
  });
});