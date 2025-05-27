const { test, expect } = require('@playwright/test');

test('Task 5: Leftbar and rightbar widths, leftbar disappears on small screens', async ({ page }) => {
  await page.goto('file://' + __dirname + '/../src/index.html');
  
  await page.setViewportSize({ width: 1200, height: 800 });
  await expect(page.locator('.leftbar')).toBeVisible();
  
  await page.setViewportSize({ width: 799, height: 600 });
  await expect(page.locator('.leftbar')).toBeHidden();
});