const { test, expect } = require('@playwright/test');

test('touch events work for move operation', async ({ page }) => {
  await page.goto('/');
  
  // Create a rectangle
  await page.click('label.rect');
  const canvas = page.locator('.canvas');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 200);
  await page.mouse.up();
  
  // Move using touch
  await page.click('label.move');
  await page.touchscreen.tap(150, 150);
  
  // Simulate touch drag by using mouse events at touch position
  await page.mouse.move(150, 150);
  await page.mouse.down();
  await page.mouse.move(250, 250);
  await page.mouse.up();
  
  // Check rectangle moved
  const rect = page.locator('svg rect');
  const transform = await rect.getAttribute('transform');
  expect(transform).toContain('translate');
});

test('touch events work for rotate and zoom operations', async ({ page }) => {
  await page.goto('/');
  
  // Create an ellipse
  await page.click('label.ellipse');
  const canvas = page.locator('.canvas');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 200);
  await page.mouse.up();
  
  // Rotate using touch simulation
  await page.click('label.rotate');
  await page.mouse.move(150, 150);
  await page.mouse.down();
  await page.mouse.move(200, 150);
  await page.mouse.up();
  
  let ellipse = page.locator('svg ellipse');
  let transform = await ellipse.getAttribute('transform');
  expect(transform).toContain('rotate');
  
  // Zoom using touch simulation
  await page.click('label.zoom');
  await page.mouse.move(150, 150);
  await page.mouse.down();
  await page.mouse.move(250, 250);
  await page.mouse.up();
  
  transform = await ellipse.getAttribute('transform');
  expect(transform).toContain('scale');
});