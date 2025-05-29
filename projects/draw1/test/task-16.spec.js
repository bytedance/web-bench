const { test, expect } = require('@playwright/test');

test('move rotate zoom sequence works correctly', async ({ page }) => {
  await page.goto('/');
  
  // Create a rectangle
  await page.click('label.rect');
  const canvas = page.locator('.canvas');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 200);
  await page.mouse.up();
  
  // Move it
  await page.click('label.move');
  await page.mouse.move(150, 150);
  await page.mouse.down();
  await page.mouse.move(250, 250);
  await page.mouse.up();
  
  // Rotate it
  await page.click('label.rotate');
  await page.mouse.move(300, 300);
  await page.mouse.down();
  await page.mouse.move(350, 300);
  await page.mouse.up();
  
  // Zoom it
  await page.click('label.zoom');
  await page.mouse.move(300, 300);
  await page.mouse.down();
  await page.mouse.move(400, 400);
  await page.mouse.up();
  
  // Check all transforms are present
  const rect = page.locator('svg rect');
  const transform = await rect.getAttribute('transform');
  expect(transform).toContain('translate');
  expect(transform).toContain('rotate');
  expect(transform).toContain('scale');
});

test('zoom move rotate sequence preserves all transformations', async ({ page }) => {
  await page.goto('/');
  
  // Create an ellipse
  await page.click('label.ellipse');
  const canvas = page.locator('.canvas');
  await page.mouse.move(50, 50);
  await page.mouse.down();
  await page.mouse.move(150, 150);
  await page.mouse.up();
  
  // Zoom first
  await page.click('label.zoom');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(150, 150);
  await page.mouse.up();
  
  // Move second
  await page.click('label.move');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 200);
  await page.mouse.up();
  
  // Rotate third
  await page.click('label.rotate');
  await page.mouse.move(200, 200);
  await page.mouse.down();
  await page.mouse.move(250, 200);
  await page.mouse.up();
  
  const ellipse = page.locator('svg ellipse');
  const transform = await ellipse.getAttribute('transform');
  const transformParts = transform.split(' ').filter(part => part.trim());
  expect(transformParts.length).toBeGreaterThan(2); // Multiple operations applied
});