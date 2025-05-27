const { test, expect } = require('@playwright/test');

test('Task 7: Content and rightbar layout on very small screens', async ({ page }) => {
  await page.goto('file://' + __dirname + '/../src/index.html');
  
  await page.setViewportSize({ width: 350, height: 600 });
  
  const root = page.locator('.root');
  await expect(root).toHaveCSS('grid-template-areas', '"header" "content" "rightbar" "footer"');
});