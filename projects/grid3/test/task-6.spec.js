const { test, expect } = require('@playwright/test');

test.describe('Task 6: Responsive menu behavior at 399px and below', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../src/index.html');
  });

  test('should distribute menu items evenly in header space when width <= 399px', async ({ page }) => {
    await page.setViewportSize({ width: 399, height: 600 });
    
    const header = page.locator('.header');
    const menuItems = page.locator('.menu-item');
    
    const headerBox = await header.boundingBox();
    const firstItemBox = await menuItems.nth(0).boundingBox();
    const lastItemBox = await menuItems.nth(2).boundingBox();
    
    expect(firstItemBox.width).toBeCloseTo(headerBox.width, 20);
    expect(lastItemBox.x + lastItemBox.width).toBeCloseTo(headerBox.x + headerBox.width, 20);
  });

  test('should hide logo when viewport width <= 399px', async ({ page }) => {
    await page.setViewportSize({ width: 399, height: 600 });
    const logo = page.locator('.logo');
    await expect(logo).not.toBeVisible();
  });

  test('should show logo when viewport width > 399px', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 600 });
    const logo = page.locator('.logo');
    await expect(logo).toBeVisible();
  });

  test('should stack menu items vertically when width <= 399px', async ({ page }) => {
    await page.setViewportSize({ width: 350, height: 600 });
    
    const menuItems = page.locator('.menu-item');
    const firstItemBox = await menuItems.nth(0).boundingBox();
    const secondItemBox = await menuItems.nth(1).boundingBox();
    
    expect(secondItemBox.y).toBeGreaterThan(firstItemBox.y + firstItemBox.height - 5);
  });

  test('should maintain menu item visibility in small viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 600 });
    
    const menuItems = page.locator('.menu-item');
    await expect(menuItems).toHaveCount(3);
    
    for (let i = 0; i < 3; i++) {
      await expect(menuItems.nth(i)).toBeVisible();
    }
  });
});