const { test, expect } = require('@playwright/test');

test('delete operation removes clicked shape', async ({ page }) => {
  await page.goto('/');
  
  // Create a rectangle first
  await page.click('label.rect');
  const canvas = page.locator('.canvas');
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 200);
  await page.mouse.up();
  
  // Verify rect exists
  let rect = page.locator('svg rect');
  await expect(rect).toBeVisible();
  
  // Select delete tool and click the rectangle
  await page.click('label.delete');
  await page.mouse.click(150, 150); // Click inside the rectangle
  
  // Verify rect is removed
  await expect(rect).not.toBeVisible();
});

test('delete operation works with different shape types', async ({ page }) => {
  await page.goto('/');
  
  // Create a line
  await page.click('label.line');
  const canvas = page.locator('.canvas');
  await page.mouse.move(50, 50);
  await page.mouse.down();
  await page.mouse.move(150, 100);
  await page.mouse.up();
  
  // Create an ellipse
  await page.click('label.ellipse');
  await page.mouse.move(200, 200);
  await page.mouse.down();
  await page.mouse.move(300, 300);
  await page.mouse.up();
  
  // Delete the line
  await page.click('label.delete');
  await page.mouse.click(100, 75); // Click on line
  
  // Verify line is gone but ellipse remains
  await expect(page.locator('svg line')).not.toBeVisible();
  await expect(page.locator('svg ellipse')).toBeVisible();
});