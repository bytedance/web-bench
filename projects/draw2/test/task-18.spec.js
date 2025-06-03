const { test, expect } = require('@playwright/test');

test.describe('Task 18: Zoom Operation Implementation', () => {
  test('should scale shapes from their center point', async ({ page }) => {
    await page.goto('/index.html');
    
    const rectInput = page.locator('.toolkit .shape .rect');
    const zoomInput = page.locator('.toolkit .operation .zoom');
    const canvas = page.locator('.canvas');
    
    // Create a rectangle
    await rectInput.click();
    const canvasBox = await canvas.boundingBox();
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 140, canvasBox.y + 140);
    await page.mouse.up();
    
    // Switch to zoom tool
    await zoomInput.click();
    const rectElement = page.locator('.canvas rect');
    
    // Get initial transform
    const initialTransform = await rectElement.evaluate(el => el.style.transform);
    
    // Zoom by dragging away from center to scale up
    const centerX = canvasBox.x + 120;
    const centerY = canvasBox.y + 120;
    
    await page.mouse.move(centerX + 10, centerY + 10);
    await page.mouse.down();
    await page.mouse.move(centerX + 20, centerY + 20); // Move further from center
    await page.mouse.up();
    
    // Check if scaling was applied
    const finalTransform = await rectElement.evaluate(el => el.style.transform);
    expect(finalTransform).toContain('scale');
    expect(finalTransform).not.toBe(initialTransform);
  });

  test('should maintain aspect ratio during uniform scaling', async ({ page }) => {
    await page.goto('/index.html');
    
    const ellipseInput = page.locator('.toolkit .shape .ellipse');
    const zoomInput = page.locator('.toolkit .operation .zoom');
    const canvas = page.locator('.canvas');
    
    // Create an ellipse
    await ellipseInput.click();
    const canvasBox = await canvas.boundingBox();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 180);
    await page.mouse.up();
    
    // Switch to zoom tool
    await zoomInput.click();
    const ellipseElement = page.locator('.canvas ellipse');
    
    // Perform scaling
    const centerX = canvasBox.x + 175;
    const centerY = canvasBox.y + 165;
    
    await page.mouse.move(centerX + 15, centerY + 10);
    await page.mouse.down();
    await page.mouse.move(centerX + 30, centerY + 20);
    await page.mouse.up();
    
    const transform = await ellipseElement.evaluate(el => el.style.transform);
    expect(transform).toContain('scale');
    
    // Extract scale values - should be uniform (same x and y)
    const scaleMatch = transform.match(/scale\(([\d.]+), ([\d.]+)\)/);
    if (scaleMatch) {
      const scaleX = parseFloat(scaleMatch[1]);
      const scaleY = parseFloat(scaleMatch[2]);
      expect(scaleX).toBeCloseTo(scaleY, 2); // Should be approximately equal
    }
  });

  test('should preserve position and rotation while scaling', async ({ page }) => {
    await page.goto('/index.html');
    
    const lineInput = page.locator('.toolkit .shape .line');
    const moveInput = page.locator('.toolkit .operation .move');
    const rotateInput = page.locator('.toolkit .operation .rotate');
    const zoomInput = page.locator('.toolkit .operation .zoom');
    const canvas = page.locator('.canvas');
    
    // Create a line
    await lineInput.click();
    const canvasBox = await canvas.boundingBox();
    await page.mouse.move(canvasBox.x + 80, canvasBox.y + 80);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 120, canvasBox.y + 80);
    await page.mouse.up();
    
    // Wait for auto-switch, then move it
    await page.waitForTimeout(100);
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 80);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 130, canvasBox.y + 110);
    await page.mouse.up();
    
    // Rotate it
    await rotateInput.click();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 110);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 140, canvasBox.y + 130);
    await page.mouse.up();
    
    // Now zoom it
    await zoomInput.click();
    await page.mouse.move(canvasBox.x + 135, canvasBox.y + 115);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 145, canvasBox.y + 125);
    await page.mouse.up();
    
    const lineElement = page.locator('.canvas line');
    const finalTransform = await lineElement.evaluate(el => el.style.transform);
    
    // Should contain all three transformations
    expect(finalTransform).toContain('translate');
    expect(finalTransform).toContain('rotate');
    expect(finalTransform).toContain('scale');
  });
});
