const { test, expect } = require('@playwright/test');

test('drawing line with mouse creates svg line element', async ({ page }) => {
  await page.goto('/');
  
  // Select line tool
  await page.click('label.line');
  
  // Draw a line
  const canvas = page.locator('.canvas');
  await canvas.hover();
  await page.mouse.down();
  await page.mouse.move(200, 100);
  await page.mouse.up();
  
  // Check line element was created
  const line = page.locator('svg line');
  await expect(line).toBeVisible();
  
  // Check line has stroke properties
  expect(await line.getAttribute('stroke')).toBeTruthy();
  expect(await line.getAttribute('stroke-width')).toBeTruthy();
});

test('line uses current line width and color settings', async ({ page }) => {
  await page.goto('/');
  
  // Set line width and color
  await page.fill('.line-width', '15');
  await page.fill('.color', '#ff0000');
  
  // Select line tool and draw
  await page.click('label.line');
  const canvas = page.locator('.canvas');
  await canvas.hover();
  await page.mouse.down();
  await page.mouse.move(150, 150);
  await page.mouse.up();
  
  const line = page.locator('svg line');
  expect(await line.getAttribute('stroke-width')).toBe('15');
  expect(await line.getAttribute('stroke')).toBe('#ff0000');
});