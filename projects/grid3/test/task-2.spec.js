const { test, expect } = require('@playwright/test');

test.describe('Task 2: Add leftbar and rightbar to grid layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../src/index.html');
  });

  test('should display leftbar and rightbar elements', async ({ page }) => {
    await expect(page.locator('.leftbar')).toBeVisible();
    await expect(page.locator('.rightbar')).toBeVisible();
  });

  test('should position leftbar at left side of root', async ({ page }) => {
    const leftbar = page.locator('.leftbar');
    const leftbarBox = await leftbar.boundingBox();
    expect(leftbarBox.x).toBeLessThan(10);
  });

  test('should position rightbar at right side of root', async ({ page }) => {
    const rightbar = page.locator('.rightbar');
    const rightbarBox = await rightbar.boundingBox();
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(rightbarBox.x + rightbarBox.width).toBeGreaterThan(viewportWidth - 10);
  });

  test('should have content between leftbar and rightbar', async ({ page }) => {
    const leftbar = page.locator('.leftbar');
    const content = page.locator('.content');
    const rightbar = page.locator('.rightbar');
    
    const leftbarBox = await leftbar.boundingBox();
    const contentBox = await content.boundingBox();
    const rightbarBox = await rightbar.boundingBox();
    
    expect(contentBox.x).toBeGreaterThan(leftbarBox.x + leftbarBox.width - 5);
    expect(contentBox.x + contentBox.width).toBeLessThan(rightbarBox.x + 5);
  });

  test('should maintain three-column layout structure', async ({ page }) => {
    const leftbar = page.locator('.leftbar');
    const content = page.locator('.content');
    const rightbar = page.locator('.rightbar');
    
    const leftbarBox = await leftbar.boundingBox();
    const contentBox = await content.boundingBox();
    const rightbarBox = await rightbar.boundingBox();
    
    expect(leftbarBox.width).toBeGreaterThan(0);
    expect(contentBox.width).toBeGreaterThan(0);
    expect(rightbarBox.width).toBeGreaterThan(0);
  });
});