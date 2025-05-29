const { test, expect } = require('@playwright/test');

test('space key enables temporary move mode', async ({ page }) => {
  await page.goto('/');
  
  // Create a rectangle
  await page.click('label.rect');
  const canvas = page.locator('.canvas');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 200);
  await page.mouse.up();
  
  // Select line tool
  await page.click('label.line');
  expect(await page.locator('label.line input[type="radio"]').isChecked()).toBe(true);
  
  // Hold space and move a shape
  await page.keyboard.down('Space');
  await page.mouse.move(150, 150);
  await page.mouse.down();
  await page.mouse.move(250, 250);
  await page.mouse.up();
  
  // Release space
  await page.keyboard.up('Space');
  
  // Check that original tool is restored
  expect(await page.locator('label.line input[type="radio"]').isChecked()).toBe(true);
});

test('space key movement works with different selected tools', async ({ page }) => {
  await page.goto('/');
  
  // Create an ellipse
  await page.click('label.ellipse');
  const canvas = page.locator('.canvas');
  await page.mouse.move(50, 50);
  await page.mouse.down();
  await page.mouse.move(150, 150);
  await page.mouse.up();
  
  // Select delete tool
  await page.click('label.delete');
  
  // Use space to temporarily move
  await page.keyboard.down('Space');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 200);
  await page.mouse.up();
  await page.keyboard.up('Space');
  
  // Verify ellipse moved and delete tool is still selected
  const ellipse = page.locator('svg ellipse');
  const transform = await ellipse.getAttribute('transform');
  expect(transform).toContain('translate');
  expect(await page.locator('label.delete input[type="radio"]').isChecked()).toBe(true);
});