const { test, expect } = require('@playwright/test');

test.describe('Task 3: Add menu with 3 items at right side of header', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../src/index.html');
  });

  test('should display menu with 3 items in header', async ({ page }) => {
    const menu = page.locator('.menu');
    const menuItems = page.locator('.menu-item');
    
    await expect(menu).toBeVisible();
    await expect(menuItems).toHaveCount(3);
  });

  test('should position menu at right side of header', async ({ page }) => {
    const header = page.locator('.header');
    const menu = page.locator('.menu');
    
    const headerBox = await header.boundingBox();
    const menuBox = await menu.boundingBox();
    
    expect(menuBox.x + menuBox.width).toBeGreaterThan(headerBox.width * 0.7);
  });

  test('should make menu items clickable', async ({ page }) => {
    const menuItems = page.locator('.menu-item');
    
    for (let i = 0; i < 3; i++) {
      const item = menuItems.nth(i);
      await expect(item).toBeVisible();
      await item.click();
    }
  });

  test('should display menu items horizontally', async ({ page }) => {
    const menuItems = page.locator('.menu-item');
    const firstItemBox = await menuItems.nth(0).boundingBox();
    const secondItemBox = await menuItems.nth(1).boundingBox();
    
    expect(Math.abs(firstItemBox.y - secondItemBox.y)).toBeLessThan(5);
    expect(secondItemBox.x).toBeGreaterThan(firstItemBox.x);
  });

  test('should contain menu within header boundaries', async ({ page }) => {
    const header = page.locator('.header');
    const menu = page.locator('.menu');
    
    const headerBox = await header.boundingBox();
    const menuBox = await menu.boundingBox();
    
    expect(menuBox.x).toBeGreaterThanOrEqual(headerBox.x);
    expect(menuBox.x + menuBox.width).toBeLessThanOrEqual(headerBox.x + headerBox.width);
  });
});