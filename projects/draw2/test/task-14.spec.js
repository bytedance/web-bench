const { test, expect } = require('@playwright/test');
require('../../../libraries/test-util/src/coverage');
test.describe('Task 14: Ellipse Shape Implementation', () => {
  test('should create SVG ellipse elements with proper attributes', async ({ page }) => {
    await page.goto('/index.html');
    
    const ellipseInput = page.locator('.toolkit .shape .ellipse');
    const canvas = page.locator('.canvas');
    
    // Select ellipse tool and draw an ellipse
    await ellipseInput.click();
    
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 50;
    const startY = canvasBox.y + 50;
    const endX = canvasBox.x + 150;
    const endY = canvasBox.y + 120;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    // Check if ellipse was created
    const ellipseElement = page.locator('.canvas ellipse');
    await expect(ellipseElement).toBeVisible();
    
    // Check ellipse attributes
    await expect(ellipseElement).toHaveAttribute('stroke', '#000000');
    await expect(ellipseElement).toHaveAttribute('stroke-width', '9');
    await expect(ellipseElement).toHaveAttribute('fill', 'white');
    
    const ellipseAttrs = await ellipseElement.evaluate(el => ({
      cx: parseFloat(el.getAttribute('cx')),
      cy: parseFloat(el.getAttribute('cy')),
      rx: parseFloat(el.getAttribute('rx')),
      ry: parseFloat(el.getAttribute('ry'))
    }));
    
    // Center should be at the middle of the drag area
    expect(ellipseAttrs.cx).toBeCloseTo(100, 0);
    expect(ellipseAttrs.cy).toBeCloseTo(85, 0);
    expect(ellipseAttrs.rx).toBeCloseTo(50, 0);
    expect(ellipseAttrs.ry).toBeCloseTo(35, 0);
  });

  test('should adjust ellipse dimensions during creation with onCreateMove', async ({ page }) => {
    await page.goto('/index.html');
    
    const ellipseInput = page.locator('.toolkit .shape .ellipse');
    const canvas = page.locator('.canvas');
    
    await ellipseInput.click();
    
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 40;
    const startY = canvasBox.y + 60;
    
    // Start drawing
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    
    // Drag to create ellipse
    await page.mouse.move(startX + 120, startY + 80);
    await page.mouse.up();
    
    const ellipseElement = page.locator('.canvas ellipse');
    const finalAttrs = await ellipseElement.evaluate(el => ({
      cx: parseFloat(el.getAttribute('cx')),
      cy: parseFloat(el.getAttribute('cy')),
      rx: parseFloat(el.getAttribute('rx')),
      ry: parseFloat(el.getAttribute('ry'))
    }));
    
    expect(finalAttrs.cx).toBeCloseTo(100, 0); // 40 + 60 (half width)
    expect(finalAttrs.cy).toBeCloseTo(100, 0); // 60 + 40 (half height)
    expect(finalAttrs.rx).toBeCloseTo(60, 0);
    expect(finalAttrs.ry).toBeCloseTo(40, 0);
  });

  test('should handle negative direction dragging for ellipse', async ({ page }) => {
    await page.goto('/index.html');
    
    const ellipseInput = page.locator('.toolkit .shape .ellipse');
    const canvas = page.locator('.canvas');
    
    await ellipseInput.click();
    
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 120;
    const startY = canvasBox.y + 100;
    const endX = canvasBox.x + 60;
    const endY = canvasBox.y + 40;
    
    // Draw from bottom-right to top-left
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    
    const ellipseElement = page.locator('.canvas ellipse');
    const ellipseAttrs = await ellipseElement.evaluate(el => ({
      cx: parseFloat(el.getAttribute('cx')),
      cy: parseFloat(el.getAttribute('cy')),
      rx: parseFloat(el.getAttribute('rx')),
      ry: parseFloat(el.getAttribute('ry'))
    }));
    
    // Ellipse should be properly positioned regardless of drag direction
    expect(ellipseAttrs.rx).toBeCloseTo(30, 0);
    expect(ellipseAttrs.ry).toBeCloseTo(30, 0);
    expect(ellipseAttrs.cx).toBeCloseTo(90, 0); // Should be between the two x points
    expect(ellipseAttrs.cy).toBeCloseTo(70, 0); // Should be between the two y points
  });
});
