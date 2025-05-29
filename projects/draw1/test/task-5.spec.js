const { test, expect } = require('@playwright/test');

test('drawing ellipse with mouse creates svg ellipse element', async ({ page }) => {
  await page.goto('/');
  
  // Select ellipse tool
  await page.click('label.ellipse');
  
  // Draw an ellipse
  const canvas = page.locator('.canvas');
  await canvas.hover();
  await page.mouse.down();
  await page.mouse.move(200, 150);
  await page.mouse.up();
  
  // Check ellipse element was created
  const ellipse = page.locator('svg ellipse');
  await expect(ellipse).toBeVisible();
  
  // Check ellipse has required attributes
  expect(await ellipse.getAttribute('fill')).toBe('white');
  expect(await ellipse.getAttribute('stroke')).toBeTruthy();
  expect(await ellipse.getAttribute('stroke-width')).toBeTruthy();
});

test('ellipse radii are calculated from bounding rectangle', async ({ page }) => {
  await page.goto('/');
  
  await page.click('label.ellipse');
  
  const canvas = page.locator('.canvas');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(300, 200);
  await page.mouse.up();
  
  const ellipse = page.locator('svg ellipse');
  const rx = parseFloat(await ellipse.getAttribute('rx'));
  const ry = parseFloat(await ellipse.getAttribute('ry'));
  
  expect(rx).toBeGreaterThan(0);
  expect(ry).toBeGreaterThan(0);
  expect(rx).toBeCloseTo(100, 10); // half of 200px width
  expect(ry).toBeCloseTo(50, 10);  // half of 100px height
});