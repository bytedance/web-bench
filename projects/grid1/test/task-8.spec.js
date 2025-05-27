const { test, expect } = require('@playwright/test');

test('Task 8: Menu items full width on very small screens', async ({ page }) => {
  await page.goto('file://' + __dirname + '/../src/index.html');
  
  await page.setViewportSize({ width: 350, height: 600 });
  
  const menu = page.locator('.menu');
  await expect(menu).toHaveCSS('grid-template-columns', '1fr');
  await expect(menu).toHaveCSS('justify-content', 'stretch');
});