const { test, expect } = require('@playwright/test');

test('small rectangle maintains minimum dimensions', async ({ page }) => {
  await page.goto('/');
  
  // Set line width to 20
  await page.fill('.line-width', '20');
  
  // Draw very small rectangle
  await page.click('label.rect');
  const canvas = page.locator('.canvas');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(105, 103); // Very small rectangle
  await page.mouse.up();
  
  const rect = page.locator('svg rect');
  const width = parseFloat(await rect.getAttribute('width'));
  const height = parseFloat(await rect.getAttribute('height'));
  
  expect(width).toBeGreaterThanOrEqual(20);
  expect(height).toBeGreaterThanOrEqual(20);
});

test('normal rectangle dimensions are preserved', async ({ page }) => {
  await page.goto('/');
  
  await page.fill('.line-width', '5');
  
  await page.click('label.rect');
  const canvas = page.locator('.canvas');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(250, 200); // Large rectangle
  await page.mouse.up();
  
  const rect = page.locator('svg rect');
  const width = parseFloat(await rect.getAttribute('width'));
  const height = parseFloat(await rect.getAttribute('height'));
  
  expect(width).toBeCloseTo(150, 5);
  expect(height).toBeCloseTo(100, 5);
});