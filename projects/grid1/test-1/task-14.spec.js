// test/task-14.spec.js
const { test, expect } = require('@playwright/test');

test('Task 14: 1 card per row on small screens', async ({ page }) => {
  await page.goto('file://' + __dirname + '/../src/index.html');
  
  await page.setViewportSize({ width: 599, height: 600 });
  
  const content = page.locator('.content');
  await expect(content).toHaveCSS('grid-template-columns', '1fr');
});