const { test, expect } = require('@playwright/test');

test('toolkit container and canvas fill browser space', async ({ page }) => {
  await page.goto('/');
  
  const viewport = page.viewportSize();
  const root = page.locator('.root');
  const toolkit = page.locator('.toolkit');
  const canvas = page.locator('.canvas');
  
  // Check root takes full viewport
  const rootBox = await root.boundingBox();
  expect(rootBox.height).toBeCloseTo(viewport.height, 5);
  
  // Check toolkit and canvas together fill the root
  const toolkitBox = await toolkit.boundingBox();
  const canvasBox = await canvas.boundingBox();
  expect(toolkitBox.height + canvasBox.height).toBeCloseTo(rootBox.height, 5);
});

test('toolkit containers are arranged horizontally with correct proportions', async ({ page }) => {
  await page.goto('/');
  
  const shape = page.locator('.shape');
  const prop = page.locator('.prop');
  const operation = page.locator('.operation');
  const lineWidth = page.locator('.line-width');
  const color = page.locator('.color');
  
  // Check horizontal arrangement
  const shapeBox = await shape.boundingBox();
  const propBox = await prop.boundingBox();
  const operationBox = await operation.boundingBox();
  
  expect(shapeBox.x).toBeLessThan(propBox.x);
  expect(propBox.x).toBeLessThan(operationBox.x);
  
  // Check shape container width is smaller than operation container
  expect(shapeBox.width).toBeLessThan(operationBox.width);
  
  // Check inputs exist in prop container
  await expect(lineWidth).toBeVisible();
  await expect(color).toBeVisible();
  expect(await lineWidth.getAttribute('value')).toBe('9');
});