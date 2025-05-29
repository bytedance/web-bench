const { test, expect } = require('@playwright/test');

test('fill operation changes shape fill color', async ({ page }) => {
  await page.goto('/');
  
  // Create a rectangle
  await page.click('label.rect');
  const canvas = page.locator('.canvas');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 200);
  await page.mouse.up();
  
  // Change color and select fill tool
  await page.fill('.color', '#00ff00');
  await page.click('label.fill');
  
  // Click on the rectangle
  await page.mouse.click(150, 150);
  
  // Verify fill color changed
  const rect = page.locator('svg rect');
  expect(await rect.getAttribute('fill')).toBe('#00ff00');
});

test('fill operation does not affect lines', async ({ page }) => {
  await page.goto('/');
  
  // Create a line
  await page.click('label.line');
  const canvas = page.locator('.canvas');
  await page.mouse.move(50, 50);
  await page.mouse.down();
  await page.mouse.move(150, 100);
  await page.mouse.up();
  
  const originalStroke = await page.locator('svg line').getAttribute('stroke');
  
  // Try to fill the line
  await page.fill('.color', '#ff00ff');
  await page.click('label.fill');
  await page.mouse.click(100, 75);
  
  // Verify line stroke didn't change and no fill was added
  const line = page.locator('svg line');
  expect(await line.getAttribute('stroke')).toBe(originalStroke);
  expect(await line.getAttribute('fill')).toBeNull();
});