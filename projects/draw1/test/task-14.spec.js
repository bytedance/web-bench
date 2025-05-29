const { test, expect } = require('@playwright/test');

test('sequential move and rotate operations work together', async ({ page }) => {
  await page.goto('/');
  
  // Create a rectangle
  await page.click('label.rect');
  const canvas = page.locator('.canvas');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 200);
  await page.mouse.up();
  
  // Move the rectangle
  await page.click('label.move');
  await page.mouse.move(150, 150);
  await page.mouse.down();
  await page.mouse.move(250, 250);
  await page.mouse.up();
  
  // Then rotate it
  await page.click('label.rotate');
  await page.mouse.move(300, 300);
  await page.mouse.down();
  await page.mouse.move(350, 300);
  await page.mouse.up();
  
  // Check both transforms are applied
  const rect = page.locator('svg rect');
  const transform = await rect.getAttribute('transform');
  expect(transform).toContain('translate');
  expect(transform).toContain('rotate');
});

test('rotate then move operations preserve both transformations', async ({ page }) => {
  await page.goto('/');
  
  // Create an ellipse
  await page.click('label.ellipse');
  const canvas = page.locator('.canvas');
  await page.mouse.move(50, 50);
  await page.mouse.down();
  await page.mouse.move(150, 100);
  await page.mouse.up();
  
  // Rotate first
  await page.click('label.rotate');
  await page.mouse.move(100, 75);
  await page.mouse.down();
  await page.mouse.move(100, 25);
  await page.mouse.up();
  
  // Then move
  await page.click('label.move');
  await page.mouse.move(100, 75);
  await page.mouse.down();
  await page.mouse.move(200, 175);
  await page.mouse.up();
  
  const ellipse = page.locator('svg ellipse');
  const transform = await ellipse.getAttribute('transform');
  expect(transform).toBeTruthy();
  expect(transform.split(' ').length).toBeGreaterThan(1); // Multiple transforms
});