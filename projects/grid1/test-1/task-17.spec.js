// test/task-17.spec.js
const { test, expect } = require('@playwright/test');

test('Task 17: Footer with logo and info', async ({ page }) => {
  await page.goto('file://' + __dirname + '/../src/index.html');
  
  const footerLogo = page.locator('.footer-logo');
  const footerInfo = page.locator('.footer-info');
  
  await expect(footerLogo).toBeVisible();
  await expect(footerInfo).toBeVisible();
  
  await expect(footerInfo).toHaveCSS('white-space', 'nowrap');
  await expect(footerInfo).toHaveCSS('text-overflow', 'ellipsis');
  await expect(footerInfo).toHaveCSS('overflow', 'hidden');
});