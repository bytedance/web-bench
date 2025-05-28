const { test, expect } = require('@playwright/test');

test.describe('Task 11: Display first 3 rows in rightbar when width < 400px', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + __dirname + '/../src/index.html');
  });

  test('should show only 6 rightbar items when width < 400px', async ({ page }) => {
    await page.setViewportSize({ width: 350, height: 600 });
    
    const rightbarItems = page.locator('.rightbar-item');
    const visibleItems = await rightbarItems.evaluateAll(items => 
      items.filter(item => getComputedStyle(item).display !== 'none')
    );
    
    expect(visibleItems.length).toBe(6);
  });

  test('should show all 40 rightbar items when width >= 400px', async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 600 });
    
    const rightbarItems = page.locator('.rightbar-item');
    const visibleItems = await rightbarItems.evaluateAll(items => 
      items.filter(item => getComputedStyle(item).display !== 'none')
    );
    
    expect(visibleItems.length).toBe(40);
  });

  test('should display first 6 items in 3 rows of 2 when width < 400px', async ({ page }) => {
    await page.setViewportSize({ width: 350, height: 600 });
    
    const rightbarItems = page.locator('.rightbar-item');
    const firstRowItems = [rightbarItems.nth(0), rightbarItems.nth(1)];
    const secondRowItems = [rightbarItems.nth(2), rightbarItems.nth(3)];
    const thirdRowItems = [rightbarItems.nth(4), rightbarItems.nth(5)];
    
    for (const item of [...firstRowItems, ...secondRowItems, ...thirdRowItems]) {
      await expect(item).toBeVisible();
    }
    
    await expect(rightbarItems.nth(6)).not.toBeVisible();
  });

  test('should maintain 2-column layout for visible items when width < 400px', async ({ page }) => {
    await page.setViewportSize({ width: 350, height: 600 });
    
    const rightbarItems = page.locator('.rightbar-item');
    const firstItem = rightbarItems.nth(0);
    const secondItem = rightbarItems.nth(1);
    
    const firstBox = await firstItem.boundingBox();
    const secondBox = await secondItem.boundingBox();
    
    expect(Math.abs(firstBox.y - secondBox.y)).toBeLessThan(5);
    expect(secondBox.x).toBeGreaterThan(firstBox.x + firstBox.width - 5);
  });

  test('should transition item visibility when viewport width changes', async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 600 });
    
    const rightbarItems = page.locator('.rightbar-item');
    await expect(rightbarItems.nth(10)).toBeVisible();
    
    await page.setViewportSize({ width: 350, height: 600 });
    await expect(rightbarItems.nth(10)).not.toBeVisible();
  });
});