const { test, expect } = require('@playwright/test');

test('Task 2: Leftbar and rightbar added', async ({ page }) => {
  await page.goto('file://' + __dirname + '/../src/index.html');
  
  await expect(page.locator('.leftbar')).toBeVisible();
  await expect(page.locator('.rightbar')).toBeVisible();
  
  const root = page.locator('.root');
  await expect(root).toHaveCSS('grid-template-areas', '"header header header" "leftbar content rightbar" "footer footer footer"');
});