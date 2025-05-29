const { test, expect } = require('@playwright/test');

test('drawing rect with mouse creates svg rect element', async ({ page }) => {
  await page.goto('/');
  
  // Select rect tool
  await page.click('label.rect');
  
  // Draw a rectangle
  const canvas = page.locator('.canvas');
  await canvas.hover();
  await page.mouse.down();
  await page.mouse.move(200, 150);
  await page.mouse.up();
  
  // Check rect element was created
  const rect = page.locator('svg rect');
  await expect(rect).toBeVisible();
  
  // Check rect has required attributes
  expect(await rect.getAttribute('fill')).toBe('white');
  expect(await rect.getAttribute('stroke')).toBeTruthy();
  expect(await rect.getAttribute('stroke-width')).toBeTruthy();
});

test('rect dimensions are calculated from mouse drag', async ({ page }) => {
  await page.goto('/');
  
  await page.click('label.rect');
  
  const canvas = page.locator('.canvas');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(300, 250);
  await page.mouse.up();
  
  const rect = page.locator('svg rect');
  const width = parseInt(await rect.getAttribute('width'));
  const height = parseInt(await rect.getAttribute('height'));
  
  expect(width).toBeGreaterThan(0);
  expect(height).toBeGreaterThan(0);
  expect(width).toBeCloseTo(200, 10);
  expect(height).toBeCloseTo(150, 10);
});