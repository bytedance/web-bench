// test/task-16.spec.js
const { test, expect } = require('@playwright/test');

test('Task 16: Last 2 cards order reversed', async ({ page }) => {
  await page.goto('file://' + __dirname + '/../src/index.html');
  
  const secondToLastCard = page.locator('.card:nth-last-child(2)');
  const lastCard = page.locator('.card:nth-last-child(1)');
  
  await expect(secondToLastCard).toHaveCSS('order', '2');
  await expect(lastCard).toHaveCSS('order', '1');
});