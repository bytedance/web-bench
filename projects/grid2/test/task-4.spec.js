const { test, expect } = require('@playwright/test');

test('Task 4: Logo in header', async ({ page }) => {
  await page.goto('file://' + __dirname + '/../src/index.html');
  
  const logo = page.locator('.logo');
  await expect(logo).toBeVisible();
  await expect(logo).toHaveCSS('background-color', 'rgb(0, 123, 255)');
});