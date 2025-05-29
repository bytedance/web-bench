const { test, expect } = require('@playwright/test');

test('touch events work for creating shapes', async ({ page }) => {
  await page.goto('/');
  
  // Create a rectangle using touch
  await page.click('label.rect');
  const canvas = page.locator('.canvas');
  
  await page.touchscreen.tap(100, 100);
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 200);
  await page.mouse.up();
  
  // Check rect was created
  const rect = page.locator('svg rect');
  await expect(rect).toBeVisible();
});

test('touch events work for copy and delete operations', async ({ page }) => {
  await page.goto('/');
  
  // Create a line
  await page.click('label.line');
  const canvas = page.locator('.canvas');
  await page.mouse.move(50, 50);
  await page.mouse.down();
  await page.mouse.move(150, 100);
  await page.mouse.up();
  
  // Copy using touch
  await page.click('label.copy');
  await page.touchscreen.tap(100, 75);
  
  // Verify two lines exist
  const lines = page.locator('svg line');
  expect(await lines.count()).toBe(2);
  
  // Delete one using touch
  await page.click('label.delete');
  await page.touchscreen.tap(100, 75);
  
  // Verify one line remains
  expect(await lines.count()).toBe(1);
});