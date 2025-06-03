const { test, expect } = require('@playwright/test');

test.describe('Task 12: Line Shape Implementation', () => {
  test('should create SVG line elements with proper attributes', async ({ page }) => {
    await page.goto('/index.html');
    
    const lineInput = page.locator('.toolkit .shape .line');
    const canvas = page.locator('.canvas');
    
    // Select line tool and draw a line
    await lineInput.click();
    
    // Draw line by clicking and dragging
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 50;
    const startY = canvasBox.y + 50;
    const endX = canvasBox.x + 150;
    const endY = canvasBox.y + 100;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if line was created
    const lineElement = page.locator('.canvas line');
    await expect(lineElement).toBeVisible();
    
    // Check line attributes
    await expect(lineElement).toHaveAttribute('stroke', '#000000');
    await expect(lineElement).toHaveAttribute('stroke-width', '9');
    
    const lineAttrs = await lineElement.evaluate(el => ({
      x1: el.getAttribute('x1'),
      y1: el.getAttribute('y1'),
      x2: el.getAttribute('x2'),
      y2: el.getAttribute('y2')
    }));
    
    expect(parseFloat(lineAttrs.x1)).toBeCloseTo(50, 0);
    expect(parseFloat(lineAttrs.y1)).toBeCloseTo(50, 0);
  });

  test('should update line endpoints during drawing with onCreateMove', async ({ page }) => {
    await page.goto('/index.html');
    
    const lineInput = page.locator('.toolkit .shape .line');
    const canvas = page.locator('.canvas');
    
    await lineInput.click();
    
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 30;
    const startY = canvasBox.y + 30;
    
    // Start drawing
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    
    // Move to create a longer line
    await page.mouse.move(startX + 100, startY + 50);
    await page.mouse.up();
    
    const lineElement = page.locator('.canvas line');
    const finalAttrs = await lineElement.evaluate(el => ({
      x1: parseFloat(el.getAttribute('x1')),
      y1: parseFloat(el.getAttribute('y1')),
      x2: parseFloat(el.getAttribute('x2')),
      y2: parseFloat(el.getAttribute('y2'))
    }));
    
    // Line should extend from start to end point
    expect(finalAttrs.x1).toBeCloseTo(30, 0);
    expect(finalAttrs.y1).toBeCloseTo(30, 0);
    expect(finalAttrs.x2).toBeCloseTo(130, 0);
    expect(finalAttrs.y2).toBeCloseTo(80, 0);
  });

  test('should handle line width changes from toolkit', async ({ page }) => {
    await page.goto('/index.html');
    
    const lineInput = page.locator('.toolkit .shape .line');
    const lineWidthInput = page.locator('.toolkit .prop .line-width');
    const canvas = page.locator('.canvas');
    
    // Change line width first
    await lineWidthInput.fill('17');
    await lineInput.click();
    
    // Draw line
    const canvasBox = await canvas.boundingBox();
    await page.mouse.move(canvasBox.x + 20, canvasBox.y + 20);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 80, canvasBox.y + 20);
    await page.mouse.up();
    
    const lineElement = page.locator('.canvas line');
    await expect(lineElement).toHaveAttribute('stroke-width', '17');
  });
});
