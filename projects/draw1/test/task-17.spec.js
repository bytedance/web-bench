const { test, expect } = require('@playwright/test');

test('move tool is selected after creating a shape', async ({ page }) => {
  await page.goto('/');
  
  // Create a rectangle
  await page.click('label.rect');
  const canvas = page.locator('.canvas');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 200);
  await page.mouse.up();
  
  // Check that move tool is now selected
  const moveRadio = page.locator('label.move input[type="radio"]');
  expect(await moveRadio.isChecked()).toBe(true);
});

test('move tool is selected after copying a shape', async ({ page }) => {
  await page.goto('/');
  
  // Create an ellipse
  await page.click('label.ellipse');
  const canvas = page.locator('.canvas');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 200);
  await page.mouse.up();
  
  // Copy the ellipse
  await page.click('label.copy');
  await page.mouse.click(150, 150);
  
  // Check that move tool is now selected
  const moveRadio = page.locator('label.move input[type="radio"]');
  expect(await moveRadio.isChecked()).toBe(true);
});