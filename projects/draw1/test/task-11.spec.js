const { test, expect } = require('@playwright/test');

test('small ellipse maintains minimum radii', async ({ page }) => {
  await page.goto('/');
  
  // Set line width to 16
  await page.fill('.line-width', '16');
  
  // Draw very small ellipse
  await page.click('label.ellipse');
  const canvas = page.locator('.canvas');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(106, 104); // Very small ellipse
  await page.mouse.up();
  
  const ellipse = page.locator('svg ellipse');
  const rx = parseFloat(await ellipse.getAttribute('rx'));
  const ry = parseFloat(await ellipse.getAttribute('ry'));
  
  expect(rx).toBeGreaterThanOrEqual(8); // half of line width
  expect(ry).toBeGreaterThanOrEqual(8);
});

test('normal ellipse radii are calculated correctly', async ({ page }) => {
  await page.goto('/');
  
  await page.fill('.line-width', '4');
  
  await page.click('label.ellipse');
  const canvas = page.locator('.canvas');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(300, 250); // Large ellipse
  await page.mouse.up();
  
  const ellipse = page.locator('svg ellipse');
  const rx = parseFloat(await ellipse.getAttribute('rx'));
  const ry = parseFloat(await ellipse.getAttribute('ry'));
  
  expect(rx).toBeCloseTo(100, 5); // half of 200px width
  expect(ry).toBeCloseTo(75, 5);  // half of 150px height
});