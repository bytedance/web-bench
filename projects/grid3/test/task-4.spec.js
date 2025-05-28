const { test, expect } = require('@playwright/test');

test.describe('Task 4: Add logo at left side of header', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../src/index.html');
  });

  test('should display logo in header', async ({ page }) => {
    const logo = page.locator('.logo');
    await expect(logo).toBeVisible();
  });

  test('should position logo at left side of header', async ({ page }) => {
    const header = page.locator('.header');
    const logo = page.locator('.logo');
    
    const headerBox = await header.boundingBox();
    const logoBox = await logo.boundingBox();
    
    expect(logoBox.x - headerBox.x).toBeLessThan(headerBox.width * 0.3);
  });

  test('should have logo with visible dimensions', async ({ page }) => {
    const logo = page.locator('.logo');
    const logoBox = await logo.boundingBox();
    
    expect(logoBox.width).toBeGreaterThan(30);
    expect(logoBox.height).toBeGreaterThan(20);
  });

  test('should position logo and menu on same horizontal line', async ({ page }) => {
    const logo = page.locator('.logo');
    const menu = page.locator('.menu');
    
    const logoBox = await logo.boundingBox();
    const menuBox = await menu.boundingBox();
    
    expect(Math.abs(logoBox.y - menuBox.y)).toBeLessThan(20);
  });

  test('should maintain space between logo and menu', async ({ page }) => {
    const logo = page.locator('.logo');
    const menu = page.locator('.menu');
    
    const logoBox = await logo.boundingBox();
    const menuBox = await menu.boundingBox();
    
    expect(menuBox.x - (logoBox.x + logoBox.width)).toBeGreaterThan(20);
  });
});