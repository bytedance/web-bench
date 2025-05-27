const { test, expect } = require('@playwright/test');

test('Task 3: Menu with 3 items in header', async ({ page }) => {
  await page.goto('file://' + __dirname + '/../src/index.html');
  
  const menu = page.locator('.menu');
  await expect(menu).toBeVisible();
  
  const menuItems = page.locator('.menu-item');
  await expect(menuItems).toHaveCount(3);
  
  await expect(menu).toHaveCSS('justify-content', 'end');
});