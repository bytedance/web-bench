const { test, expect } = require('@playwright/test');

test('Task 6: Menu items distribution on small screens, logo disappears', async ({ page }) => {
  await page.goto('file://' + __dirname + '/../src/index.html');
  
  await page.setViewportSize({ width: 399, height: 600 });
  
  await expect(page.locator('.logo')).toBeHidden();
  
  const menu = page.locator('.menu');
  await expect(menu).toHaveCSS('grid-template-columns', '1fr');
});