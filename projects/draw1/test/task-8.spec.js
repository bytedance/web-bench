const { test, expect } = require('@playwright/test');

test('copy operation duplicates clicked shape', async ({ page }) => {
  await page.goto('/');
  
  // Create a rectangle
  await page.click('label.rect');
  const canvas = page.locator('.canvas');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 200);
  await page.mouse.up();
  
  // Copy the rectangle
  await page.click('label.copy');
  await page.mouse.click(150, 150);
  
  // Verify two rectangles exist
  const rects = page.locator('svg rect');
  expect(await rects.count()).toBe(2);
});

test('copied shape is offset from original', async ({ page }) => {
  await page.goto('/');
  
  // Create an ellipse
  await page.click('label.ellipse');
  const canvas = page.locator('.canvas');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 200);
  await page.mouse.up();
  
  const originalEllipse = page.locator('svg ellipse').first();
  const originalCx = parseFloat(await originalEllipse.getAttribute('cx'));
  const originalCy = parseFloat(await originalEllipse.getAttribute('cy'));
  
  // Copy the ellipse
  await page.click('label.copy');
  await page.mouse.click(150, 150);
  
  // Check the copied ellipse position
  const ellipses = page.locator('svg ellipse');
  expect(await ellipses.count()).toBe(2);
  
  // The copied ellipse should be offset
  const copiedEllipse = page.locator('svg ellipse').nth(1);
  const transform = await copiedEllipse.getAttribute('transform');
  expect(transform).toContain('translate');
});