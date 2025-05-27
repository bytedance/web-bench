// test/task-11.spec.js
const { test, expect } = require('@playwright/test');

test('Task 11: First 3 rows in rightbar on small screens', async ({ page }) => {
  await page.goto('file://' + __dirname + '/../src/index.html');
  
  await page.setViewportSize({ width: 350, height: 600 });
  
  const rightbar = page.locator('.rightbar');
  await expect(rightbar).toHaveCSS('grid-template-rows', 'repeat(3, 1fr)');
  
  const visibleItems = page.locator('.rightbar-item:not([style*="display: none"])');
  await expect(visibleItems).toHaveCount(6);
});