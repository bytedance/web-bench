const { test, expect } = require('@playwright/test');

test('Task 10: Rightbar grid with 10 rows and 2 columns, 40 items', async ({ page }) => {
  await page.goto('file://' + __dirname + '/../src/index.html');
  
  const rightbar = page.locator('.rightbar');
  await expect(rightbar).toHaveCSS('grid-template-rows', 'repeat(10, 1fr)');
  await expect(rightbar).toHaveCSS('grid-template-columns', 'repeat(2, 1fr)');
  
  const rightbarItems = page.locator('.rightbar-item');
  await expect(rightbarItems).toHaveCount(40);
});