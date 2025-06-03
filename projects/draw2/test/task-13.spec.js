const { test, expect } = require('@playwright/test');

test.describe('Task 13: Rect Shape Implementation', () => {
  test('should create SVG rect elements with proper attributes', async ({ page }) => {
    await page.goto('/index.html');
    
    const rectInput = page.locator('.toolkit .shape .rect');
    const canvas = page.locator('.canvas');
    
    // Select rect tool and draw a rectangle
    await rectInput.click();
    
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 50;
    const startY = canvasBox.y + 50;
    const endX = canvasBox.x + 150;
    const endY = canvasBox.y + 120;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if rect was created
    const rectElement = page.locator('.canvas rect');
    await expect(rectElement).toBeVisible();
    
    // Check rect attributes
    await expect(rectElement).toHaveAttribute('stroke', '#000000');
    await expect(rectElement).toHaveAttribute('stroke-width', '9');
    await expect(rectElement).toHaveAttribute('fill', 'white');
    
    const rectAttrs = await rectElement.evaluate(el => ({
      x: parseFloat(el.getAttribute('x')),
      y: parseFloat(el.getAttribute('y')),
      width: parseFloat(el.getAttribute('width')),
      height: parseFloat(el.getAttribute('height'))
    }));
    
    expect(rectAttrs.x).toBeCloseTo(50, 0);
    expect(rectAttrs.y).toBeCloseTo(50, 0);
    expect(rectAttrs.width).toBeCloseTo(100, 0);
    expect(rectAttrs.height).toBeCloseTo(70, 0);
  });

  test('should resize rectangle during drawing with onCreateMove', async ({ page }) => {
    await page.goto('/index.html');
    
    const rectInput = page.locator('.toolkit .shape .rect');
    const canvas = page.locator('.canvas');
    
    await rectInput.click();
    
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 30;
    const startY = canvasBox.y + 40;
    
    // Start drawing
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    
    // Drag to create rectangle
    await page.mouse.move(startX + 80, startY + 60);
    await page.mouse.up();
    
    const rectElement = page.locator('.canvas rect');
    const finalAttrs = await rectElement.evaluate(el => ({
      x: parseFloat(el.getAttribute('x')),
      y: parseFloat(el.getAttribute('y')),
      width: parseFloat(el.getAttribute('width')),
      height: parseFloat(el.getAttribute('height'))
    }));
    
    expect(finalAttrs.x).toBeCloseTo(30, 0);
    expect(finalAttrs.y).toBeCloseTo(40, 0);
    expect(finalAttrs.width).toBeCloseTo(80, 0);
    expect(finalAttrs.height).toBeCloseTo(60, 0);
  });

  test('should handle reverse dragging (top-right to bottom-left)', async ({ page }) => {
    await page.goto('/index.html');
    
    const rectInput = page.locator('.toolkit .shape .rect');
    const canvas = page.locator('.canvas');
    
    await rectInput.click();
    
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 100;
    const startY = canvasBox.y + 30;
    const endX = canvasBox.x + 50;
    const endY = canvasBox.y + 80;
    
    // Draw from top-right to bottom-left
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    const rectElement = page.locator('.canvas rect');
    const rectAttrs = await rectElement.evaluate(el => ({
      x: parseFloat(el.getAttribute('x')),
      y: parseFloat(el.getAttribute('y')),
      width: parseFloat(el.getAttribute('width')),
      height: parseFloat(el.getAttribute('height'))
    }));
    
    // Rectangle should be positioned at the minimum x,y coordinates
    expect(rectAttrs.x).toBeCloseTo(50, 0);
    expect(rectAttrs.y).toBeCloseTo(30, 0);
    expect(rectAttrs.width).toBeCloseTo(50, 0);
    expect(rectAttrs.height).toBeCloseTo(50, 0);
  });
});
