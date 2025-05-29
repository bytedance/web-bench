const { test, expect } = require('@playwright/test');

test('rotate operation rotates shapes around center', async ({ page }) => {
  await page.goto('/');
  
  // Create a rectangle
  await page.click('label.rect');
  const canvas = page.locator('.canvas');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 150);
  await page.mouse.up();
  
  // Switch to rotate tool and rotate the rectangle
  await page.click('label.rotate');
  await page.mouse.move(150, 125); // Center of rectangle
  await page.mouse.down();
  await page.mouse.move(200, 125); // Rotate horizontally
  await page.mouse.up();
  
  // Check if rectangle has rotate transform
  const rect = page.locator('svg rect');
  const transform = await rect.getAttribute('transform');
  expect(transform).toContain('rotate');
});

test('rotate operation preserves shape properties', async ({ page }) => {
  await page.goto('/');
  
  // Create a line with specific color
  await page.fill('.color', '#ff0000');
  await page.click('label.line');
  const canvas = page.locator('.canvas');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 100);
  await page.mouse.up();
  
  const originalStroke = await page.locator('svg line').getAttribute('stroke');
  
  // Rotate the line
  await page.click('label.rotate');
  await page.mouse.move(150, 100);
  await page.mouse.down();
  await page.mouse.move(150, 50);
  await page.mouse.up();
  
  // Verify properties are preserved
  const line = page.locator('svg line');
  expect(await line.getAttribute('stroke')).toBe(originalStroke);
  expect(await line.getAttribute('transform')).toContain('rotate');
});