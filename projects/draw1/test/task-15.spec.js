const { test, expect } = require('@playwright/test');

test('zoom operation scales shapes around center', async ({ page }) => {
  await page.goto('/');
  
  // Create a rectangle
  await page.click('label.rect');
  const canvas = page.locator('.canvas');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 200);
  await page.mouse.up();
  
  // Zoom the rectangle
  await page.click('label.zoom');
  await page.mouse.move(150, 150); // Center
  await page.mouse.down();
  await page.mouse.move(200, 200); // Move away to zoom in
  await page.mouse.up();
  
  // Check if rectangle has scale transform
  const rect = page.locator('svg rect');
  const transform = await rect.getAttribute('transform');
  expect(transform).toContain('scale');
});

test('zoom operation changes shape size based on mouse distance', async ({ page }) => {
  await page.goto('/');
  
  // Create a line
  await page.click('label.line');
  const canvas = page.locator('.canvas');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 100);
  await page.mouse.up();
  
  // Zoom out by moving closer to center
  await page.click('label.zoom');
  await page.mouse.move(200, 100); // End of line
  await page.mouse.down();
  await page.mouse.move(150, 100); // Move closer to center
  await page.mouse.up();
  
  const line = page.locator('svg line');
  const transform = await line.getAttribute('transform');
  expect(transform).toContain('scale');
  
  // Extract scale value - should be less than 1 (zoomed out)
  const scaleMatch = transform.match(/scale\(([0-9.]+)/);
  if (scaleMatch) {
    const scaleValue = parseFloat(scaleMatch[1]);
    expect(scaleValue).toBeLessThan(1);
  }
});