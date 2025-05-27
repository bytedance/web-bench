// test/task-18.spec.js
const { test, expect } = require('@playwright/test');

test('Task 18: Drag elements with absolute position', async ({ page }) => {
  await page.goto('file://' + __dirname + '/../src/index.html');
  
  const leftDrag = page.locator('.left-drag');
  const rightDrag = page.locator('.right-drag');
  
  await expect(leftDrag).toHaveCSS('position', 'absolute');
  await expect(rightDrag).toHaveCSS('position', 'absolute');
  await expect(leftDrag).toHaveCSS('opacity', '0');
  await expect(rightDrag).toHaveCSS('opacity', '0');
  
  await page.hover('.content');
  await expect(leftDrag).toHaveCSS('opacity', '0.7');
  await expect(rightDrag).toHaveCSS('opacity', '0.7');
});