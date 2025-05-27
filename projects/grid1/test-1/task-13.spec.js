// test/task-13.spec.js
const { test, expect } = require('@playwright/test');

test('Task 13: 2 cards per row on medium screens', async ({ page }) => {
  await page.goto('file://' + __dirname + '/../src/index.html');
  
  await page.setViewportSize({ width: 999, height: 600 });
  
  const content = page.locator('.content');
  await expect(content).toHaveCSS('grid-template-columns', 'repeat(2, 1fr)');
});