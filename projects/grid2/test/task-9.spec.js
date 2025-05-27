const { test, expect } = require('@playwright/test');

test('Task 9: Leftbar grid with 20 rows and 2 columns', async ({ page }) => {
  await page.goto('file://' + __dirname + '/../src/index.html');
  
  await page.setViewportSize({ width: 1200, height: 800 });
  
  const leftbar = page.locator('.leftbar');
  await expect(leftbar).toHaveCSS('grid-template-rows', 'repeat(20, 1fr)');
  await expect(leftbar).toHaveCSS('grid-template-columns', 'repeat(2, 1fr)');
  
  const leftbarItems = page.locator('.leftbar-item');
  await expect(leftbarItems).toHaveCount(40);
});