// Test for Task 7: Create a base Shape class with static shape registry
import { test, expect } from '@playwright/test';

test.describe('Task 7: Base Shape Class and Registry', () => {
  test('should create shapes with proper element references', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Draw a line
    await page.locator('.line').click();
    await canvas.click({ position: { x: 100, y: 100 } });
    await page.mouse.move(200, 150);
    await page.mouse.up();
    
    const lineElement = canvas.locator('line');
    await expect(lineElement).toBeVisible();
    
    // Draw a rectangle
    await page.locator('.rect').click();
    const canvasBox = await canvas.boundingBox();
    await page.mouse.move(canvasBox.x + 250, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 350, canvasBox.y + 200);
    await page.mouse.up();
    
    const rectElement = canvas.locator('rect');
    await expect(rectElement).toBeVisible();
  });

  test('should support move transformations on created shapes', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create a rectangle
    await page.locator('.rect').click();
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 150;
    const startY = canvasBox.y + 150;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 80);
    await page.mouse.up();
    
    const rectElement = canvas.locator('rect');
    await expect(rectElement).toBeVisible();
    
    // Get initial position
    const initialX = await rectElement.getAttribute('x');
    
    // Switch to move tool and drag the rectangle
    await page.locator('.move').click();
    await rectElement.hover();
    await page.mouse.down();
    await page.mouse.move(startX + 50, startY + 50);
    await page.mouse.up();
    
    // Check that transform was applied (element should have transform style)
    const transform = await rectElement.evaluate(el => el.style.transform);
    expect(transform).toContain('translate');
  });

  test('should support remove functionality for shapes', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create an ellipse
    await page.locator('.ellipse').click();
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 200;
    const startY = canvasBox.y + 200;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 80, startY + 60);
    await page.mouse.up();
    
    const ellipseElement = canvas.locator('ellipse');
    await expect(ellipseElement).toBeVisible();
    
    // Delete the ellipse
    await page.locator('.delete').click();
    await ellipseElement.click();
    
    // Ellipse should be removed
    await expect(ellipseElement).not.toBeVisible();
  });
});
