// Test for Task 14: Create zoom/scale operation
import { test, expect } from '@playwright/test';

test.describe('Task 14: Zoom/Scale Operation', () => {
  test('should resize shapes from their center point', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create a rectangle
    await page.locator('.rect').click();
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 150;
    const startY = canvasBox.y + 150;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 80, startY + 60);
    await page.mouse.up();
    
    const rectElement = canvas.locator('rect');
    await expect(rectElement).toBeVisible();
    
    // Switch to zoom tool
    await page.locator('.zoom').click();
    
    // Get the center of the rectangle
    const rectBox = await rectElement.boundingBox();
    const centerX = rectBox.x + rectBox.width / 2;
    const centerY = rectBox.y + rectBox.height / 2;
    
    // Scale up by moving cursor away from center
    await page.mouse.move(centerX + 20, centerY + 15);
    await page.mouse.down();
    await page.mouse.move(centerX + 40, centerY + 30);
    await page.mouse.up();
    
    // Check that scale transform was applied
    const transform = await rectElement.evaluate(el => el.style.transform);
    expect(transform).toContain('scale');
    
    // Extract scale values
    const scaleMatch = transform.match(/scale\(([\d.-]+),\s*([\d.-]+)\)/);
    expect(scaleMatch).not.toBeNull();
    const scaleX = parseFloat(scaleMatch[1]);
    const scaleY = parseFloat(scaleMatch[2]);
    
    // Scale should be greater than 1 (scaled up)
    expect(scaleX).toBeGreaterThan(1);
    expect(scaleY).toBeGreaterThan(1);
  });

  test('should apply uniform scaling to both x and y axes', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create an ellipse
    await page.locator('.ellipse').click();
    const canvasBox = await canvas.boundingBox();
    const centerX = canvasBox.x + 200;
    const centerY = canvasBox.y + 200;
    
    await page.mouse.move(centerX - 40, centerY - 30);
    await page.mouse.down();
    await page.mouse.move(centerX + 40, centerY + 30);
    await page.mouse.up();
    
    const ellipseElement = canvas.locator('ellipse');
    await expect(ellipseElement).toBeVisible();
    
    // Switch to zoom tool
    await page.locator('.zoom').click();
    
    // Scale the ellipse
    await ellipseElement.hover();
    await page.mouse.down();
    await page.mouse.move(centerX + 80, centerY + 60);
    await page.mouse.up();
    
    const transform = await ellipseElement.evaluate(el => el.style.transform);
    expect(transform).toContain('scale');
    
    const scaleMatch = transform.match(/scale\(([\d.-]+),\s*([\d.-]+)\)/);
    expect(scaleMatch).not.toBeNull();
    const scaleX = parseFloat(scaleMatch[1]);
    const scaleY = parseFloat(scaleMatch[2]);
    
    // Both scales should be equal (uniform scaling)
    expect(scaleX).toBeCloseTo(scaleY, 2);
  });

  test('should preserve existing transformations while updating scale', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create a line
    await page.locator('.line').click();
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 100;
    const startY = canvasBox.y + 150;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 50);
    await page.mouse.up();
    
    const lineElement = canvas.locator('line');
    await expect(lineElement).toBeVisible();
    
    // First move the line
    await page.locator('.move').click();
    await lineElement.hover();
    await page.mouse.down();
    await page.mouse.move(startX + 50, startY + 30);
    await page.mouse.up();
    
    const transformAfterMove = await lineElement.evaluate(el => el.style.transform);
    expect(transformAfterMove).toContain('translate');
    
    // Then rotate it
    await page.locator('.rotate').click();
    await lineElement.hover();
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 20);
    await page.mouse.up();
    
    const transformAfterRotate = await lineElement.evaluate(el => el.style.transform);
    expect(transformAfterRotate).toContain('translate');
    expect(transformAfterRotate).toContain('rotate');
    
    // Finally scale it
    await page.locator('.zoom').click();
    await lineElement.hover();
    await page.mouse.down();
    await page.mouse.move(startX + 150, startY + 100);
    await page.mouse.up();
    
    const finalTransform = await lineElement.evaluate(el => el.style.transform);
    
    // Should contain all three transformations
    expect(finalTransform).toContain('translate');
    expect(finalTransform).toContain('rotate');
    expect(finalTransform).toContain('scale');
  });
});
