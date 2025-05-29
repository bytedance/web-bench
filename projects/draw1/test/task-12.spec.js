const { test, expect } = require('@playwright/test');

test('move operation allows dragging shapes', async ({ page }) => {
  await page.goto('/');
  
  // Create a rectangle
  await page.click('label.rect');
  const canvas = page.locator('.canvas');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 200);
  await page.mouse.up();
  
  // Switch to move tool and drag the rectangle
  await page.click('label.move');
  await page.mouse.move(150, 150); // Center of rectangle
  await page.mouse.down();
  await page.mouse.move(250, 250); // Move it
  await page.mouse.up();
  
  // Check if rectangle has transform attribute indicating movement
  const rect = page.locator('svg rect');
  const transform = await rect.getAttribute('transform');
  expect(transform).toContain('translate');
});

test('move operation works with different shape types', async ({ page }) => {
  await page.goto('/');
  
  // Create an ellipse
  await page.click('label.ellipse');
  const canvas = page.locator('.canvas');
  await page.mouse.move(50, 50);
  await page.mouse.down();
  await page.mouse.move(150, 150);
  await page.mouse.up();
  
  // Move the ellipse
  await page.click('label.move');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 200);
  await page.mouse.up();
  
  const ellipse = page.locator('svg ellipse');
  const transform = await ellipse.getAttribute('transform');
  expect(transform).toBeTruthy();
});