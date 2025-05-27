// test/task-12.spec.js
const { test, expect } = require('@playwright/test');

test('Task 12: 12 cards in content with 3 per row', async ({ page }) => {
  await page.goto('file://' + __dirname + '/../src/index.html');
  
  const cards = page.locator('.card');
  await expect(cards).toHaveCount(12);
  
  const content = page.locator('.content');
  await expect(content).toHaveCSS('grid-template-columns', 'repeat(3, 1fr)');
  await expect(content).toHaveCSS('overflow-y', 'auto');
});