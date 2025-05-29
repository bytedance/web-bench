const { test, expect } = require('@playwright/test');

test('short line maintains minimum width', async ({ page }) => {
  await page.goto('/');
  
  // Set line width to 15
  await page.fill('.line-width', '15');
  
  // Select line tool and draw very short line
  await page.click('label.line');
  const canvas = page.locator('.canvas');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(105, 102); // Very short movement
  await page.mouse.up();
  
  const line = page.locator('svg line');
  const x1 = parseFloat(await line.getAttribute('x1'));
  const y1 = parseFloat(await line.getAttribute('y1'));
  const x2 = parseFloat(await line.getAttribute('x2'));
  const y2 = parseFloat(await line.getAttribute('y2'));
  
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  expect(length).toBeGreaterThanOrEqual(15);
});

test('normal length line is not affected by minimum width rule', async ({ page }) => {
  await page.goto('/');
  
  await page.fill('.line-width', '10');
  
  await page.click('label.line');
  const canvas = page.locator('.canvas');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 150); // Long movement
  await page.mouse.up();
  
  const line = page.locator('svg line');
  const x1 = parseFloat(await line.getAttribute('x1'));
  const y1 = parseFloat(await line.getAttribute('y1'));
  const x2 = parseFloat(await line.getAttribute('x2'));
  const y2 = parseFloat(await line.getAttribute('y2'));
  
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  expect(length).toBeCloseTo(Math.sqrt(10000 + 2500), 5); // Expected length
});