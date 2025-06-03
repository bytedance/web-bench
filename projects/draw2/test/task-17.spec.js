// Test for Task 17: Implement fill operation to change shape colors
import { test, expect } from '@playwright/test';

test.describe('Task 17: Fill Operation for Changing Shape Colors', () => {
  test('should apply selected color to clicked shape fill attribute', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create a rectangle
    await page.locator('.rect').click();
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 100;
    const startY = canvasBox.y + 100;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 80, startY + 60);
    await page.mouse.up();
    
    const rectElement = canvas.locator('rect');
    await expect(rectElement).toBeVisible();
    await expect(rectElement).toHaveAttribute('fill', 'white');
    
    // Change color and apply fill
    await page.locator('.color').fill('#ff0000');
    await page.locator('.fill').click();
    await rectElement.click();
    
    // Shape should now have red fill
    await expect(rectElement).toHaveAttribute('fill', '#ff0000');
  });

  test('should work only on shape elements not canvas', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create an ellipse
    await page.locator('.ellipse').click();
    const canvasBox = await canvas.boundingBox();
    const centerX = canvasBox.x + 150;
    const centerY = canvasBox.y + 150;
    
    await page.mouse.move(centerX - 40, centerY - 30);
    await page.mouse.down();
    await page.mouse.move(centerX + 40, centerY + 30);
    await page.mouse.up();
    
    const ellipseElement = canvas.locator('ellipse');
    await expect(ellipseElement).toBeVisible();
    
    // Set color and switch to fill tool
    await page.locator('.color').fill('#00ff00');
    await page.locator('.fill').click();
    
    // Try to fill empty canvas area (should do nothing)
    await page.mouse.click(canvasBox.x + 50, canvasBox.y + 50);
    
    // Canvas should not have fill attribute
    const canvasFill = await canvas.getAttribute('fill');
    expect(canvasFill).toBeNull();
    
    // Click on the ellipse to fill it
    await ellipseElement.click();
    
    // Ellipse should have green fill
    await expect(ellipseElement).toHaveAttribute('fill', '#00ff00');
  });

  test('should use current color from color picker input', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create multiple shapes
    await page.locator('.rect').click();
    const canvasBox = await canvas.boundingBox();
    
    // Create first rectangle
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 160, canvasBox.y + 140);
    await page.mouse.up();
    
    // Create second rectangle
    await page.locator('.rect').click();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 260, canvasBox.y + 140);
    await page.mouse.up();
    
    const allRects = canvas.locator('rect');
    expect(await allRects.count()).toBe(2);
    
    // Fill first rectangle with blue
    await page.locator('.color').fill('#0000ff');
    await page.locator('.fill').click();
    await allRects.first().click();
    
    await expect(allRects.first()).toHaveAttribute('fill', '#0000ff');
    
    // Change color to yellow and fill second rectangle
    await page.locator('.color').fill('#ffff00');
    await allRects.nth(1).click();
    
    await expect(allRects.nth(1)).toHaveAttribute('fill', '#ffff00');
    
    // First rectangle should still be blue
    await expect(allRects.first()).toHaveAttribute('fill', '#0000ff');
  });
});
