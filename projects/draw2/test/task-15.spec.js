// Test for Task 15: Implement copy operation that duplicates shapes
import { test, expect } from '@playwright/test';

test.describe('Task 15: Copy Operation for Shape Duplication', () => {
  test('should clone shapes with all attributes preserved', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create a rectangle with specific color and line width
    await page.locator('.color').fill('#00ff00');
    await page.locator('.line-width').fill('13');
    await page.locator('.rect').click();
    
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 100;
    const startY = canvasBox.y + 100;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 80, startY + 60);
    await page.mouse.up();
    
    const originalRect = canvas.locator('rect').first();
    await expect(originalRect).toBeVisible();
    
    // Get original attributes
    const originalStroke = await originalRect.getAttribute('stroke');
    const originalStrokeWidth = await originalRect.getAttribute('stroke-width');
    const originalFill = await originalRect.getAttribute('fill');
    const originalWidth = await originalRect.getAttribute('width');
    const originalHeight = await originalRect.getAttribute('height');
    
    // Copy the rectangle
    await page.locator('.copy').click();
    await originalRect.click();
    
    // Should have two rectangles now
    const allRects = canvas.locator('rect');
    expect(await allRects.count()).toBe(2);
    
    // Check that copied rectangle has same attributes
    const copiedRect = allRects.nth(1);
    await expect(copiedRect).toHaveAttribute('stroke', originalStroke);
    await expect(copiedRect).toHaveAttribute('stroke-width', originalStrokeWidth);
    await expect(copiedRect).toHaveAttribute('fill', originalFill);
    await expect(copiedRect).toHaveAttribute('width', originalWidth);
    await expect(copiedRect).toHaveAttribute('height', originalHeight);
  });

  test('should offset copy by 20 pixels in both x and y directions', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create a line
    await page.locator('.line').click();
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 150;
    const startY = canvasBox.y + 150;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 50);
    await page.mouse.up();
    
    const originalLine = canvas.locator('line').first();
    await expect(originalLine).toBeVisible();
    
    // Get original position
    const originalX1 = parseFloat(await originalLine.getAttribute('x1'));
    const originalY1 = parseFloat(await originalLine.getAttribute('y1'));
    const originalX2 = parseFloat(await originalLine.getAttribute('x2'));
    const originalY2 = parseFloat(await originalLine.getAttribute('y2'));
    
    // Copy the line
    await page.locator('.copy').click();
    await originalLine.click();
    
    // Check copied line position
    const allLines = canvas.locator('line');
    expect(await allLines.count()).toBe(2);
    
    const copiedLine = allLines.nth(1);
    const copiedX1 = parseFloat(await copiedLine.getAttribute('x1'));
    const copiedY1 = parseFloat(await copiedLine.getAttribute('y1'));
    const copiedX2 = parseFloat(await copiedLine.getAttribute('x2'));
    const copiedY2 = parseFloat(await copiedLine.getAttribute('y2'));
    
    // Should be offset by 20 pixels
    expect(copiedX1).toBeCloseTo(originalX1 + 20, 0);
    expect(copiedY1).toBeCloseTo(originalY1 + 20, 0);
    expect(copiedX2).toBeCloseTo(originalX2 + 20, 0);
    expect(copiedY2).toBeCloseTo(originalY2 + 20, 0);
  });

  test('should register new shape in shapes array and insert into canvas', async ({ page }) => {
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
    
    const originalEllipse = canvas.locator('ellipse').first();
    await expect(originalEllipse).toBeVisible();
    
    // Copy the ellipse
    await page.locator('.copy').click();
    await originalEllipse.click();
    
    // Should have two ellipses in canvas
    const allEllipses = canvas.locator('ellipse');
    expect(await allEllipses.count()).toBe(2);
    
    // Both should be visible and functional
    const copiedEllipse = allEllipses.nth(1);
    await expect(copiedEllipse).toBeVisible();
    
    // Test that copied shape can be manipulated (e.g., moved)
    await page.locator('.move').click();
    await copiedEllipse.hover();
    await page.mouse.down();
    await page.mouse.move(centerX + 100, centerY + 80);
    await page.mouse.up();
    
    // Should have transform applied
    const transform = await copiedEllipse.evaluate(el => el.style.transform);
    expect(transform).toContain('translate');
  });
});
