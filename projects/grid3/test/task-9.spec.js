const { test, expect } = require('@playwright/test');

test.describe('Task 9: Leftbar grid with 20 rows and 2 columns', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../src/index.html');
    await page.setViewportSize({ width: 1200, height: 800 });
  });

  test('should display 40 leftbar items in total', async ({ page }) => {
    const leftbarItems = page.locator('.leftbar-item');
    await expect(leftbarItems).toHaveCount(40);
  });

  test('should arrange items in 2 columns layout', async ({ page }) => {
    const leftbarItems = page.locator('.leftbar-item');
    const firstItem = leftbarItems.nth(0);
    const secondItem = leftbarItems.nth(1);
    
    const firstBox = await firstItem.boundingBox();
    const secondBox = await secondItem.boundingBox();
    
    expect(Math.abs(firstBox.y - secondBox.y)).toBeLessThan(5);
    expect(secondBox.x).toBeGreaterThan(firstBox.x + firstBox.width - 5);
  });

  test('should display text content in each leftbar item', async ({ page }) => {
    const leftbarItems = page.locator('.leftbar-item');
    
    for (let i = 0; i < 5; i++) {
      const itemText = await leftbarItems.nth(i).textContent();
      expect(itemText).toContain('this is a very long text sample to test word wrap');
    }
  });

  test('should arrange items in rows of 2', async ({ page }) => {
    const leftbarItems = page.locator('.leftbar-item');
    const firstRowFirstItem = leftbarItems.nth(0);
    const firstRowSecondItem = leftbarItems.nth(1);
    const secondRowFirstItem = leftbarItems.nth(2);
    
    const firstRowFirstBox = await firstRowFirstItem.boundingBox();
    const firstRowSecondBox = await firstRowSecondItem.boundingBox();
    const secondRowFirstBox = await secondRowFirstItem.boundingBox();
    
    expect(Math.abs(firstRowFirstBox.y - firstRowSecondBox.y)).toBeLessThan(5);
    expect(secondRowFirstBox.y).toBeGreaterThan(firstRowFirstBox.y + firstRowFirstBox.height - 5);
  });

  test('should handle text wrapping in leftbar items', async ({ page }) => {
    const leftbarItems = page.locator('.leftbar-item');
    const firstItem = leftbarItems.nth(0);
    
    const itemBox = await firstItem.boundingBox();
    const itemText = await firstItem.textContent();
    
    expect(itemBox.height).toBeGreaterThan(20);
    expect(itemText.length).toBeGreaterThan(30);
  });
});