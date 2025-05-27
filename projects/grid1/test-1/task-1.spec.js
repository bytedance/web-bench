const { test, expect } = require('@playwright/test');

test('Task 1: Basic layout with header, footer, content', async ({ page }) => {
  await page.goto('file://' + __dirname + '/../src/index.html');
  
  await expect(page.locator('.root')).toBeVisible();
  await expect(page.locator('.header')).toBeVisible();
  await expect(page.locator('.footer')).toBeVisible();
  await expect(page.locator('.content')).toBeVisible();
  
  const root = page.locator('.root');
  await expect(root).toHaveCSS('display', 'grid');
  await expect(root).toHaveCSS('height', '100vh');
});