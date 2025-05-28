const { test, expect } = require('@playwright/test');

test.describe('Task 5: Responsive sidebar widths and leftbar visibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../src/index.html');
  });

  test('should set leftbar width to smaller of 200px and 20vw', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    const leftbar = page.locator('.leftbar');
    const leftbarBox = await leftbar.boundingBox();
    
    const expectedWidth = Math.min(200, 1200 * 0.2);
    expect(leftbarBox.width).toBeCloseTo(expectedWidth, 10);
  });

  test('should set rightbar width to bigger of 200px and 20vw', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    const rightbar = page.locator('.rightbar');
    const rightbarBox = await rightbar.boundingBox();
    
    const expectedWidth = Math.max(200, 1200 * 0.2);
    expect(rightbarBox.width).toBeCloseTo(expectedWidth, 10);
  });

  test('should hide leftbar when viewport width is 799px or less', async ({ page }) => {
    await page.setViewportSize({ width: 799, height: 600 });
    const leftbar = page.locator('.leftbar');
    await expect(leftbar).not.toBeVisible();
  });

  test('should show leftbar when viewport width is above 799px', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    const leftbar = page.locator('.leftbar');
    await expect(leftbar).toBeVisible();
  });

  test('should maintain rightbar visibility when leftbar is hidden', async ({ page }) => {
    await page.setViewportSize({ width: 750, height: 600 });
    const leftbar = page.locator('.leftbar');
    const rightbar = page.locator('.rightbar');
    
    await expect(leftbar).not.toBeVisible();
    await expect(rightbar).toBeVisible();
  });
});