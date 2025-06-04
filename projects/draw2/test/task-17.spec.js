const { test, expect } = require('@playwright/test');
const coverage = require('../../../libraries/test-util/src/coverage');test.afterEach(coverage);;
test.describe('Task 17: Rotate Operation Implementation', () => {
  test('should rotate shapes around their center point', async ({ page }) => {
    await page.goto('/index.html');
    
    const rectInput = page.locator('.toolkit .shape .rect');
    const rotateInput = page.locator('.toolkit .operation .rotate');
    const canvas = page.locator('.canvas');
    
    // Create a rectangle
    await rectInput.click();
    const canvasBox = await canvas.boundingBox();
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.up();
    
    // Switch to rotate tool
    await rotateInput.click();
    const rectElement = page.locator('.canvas rect');
    
    // Get initial transform
    const initialTransform = await rectElement.evaluate(el => el.style.transform);
    
    // Rotate by dragging around the shape center
    const centerX = canvasBox.x + 125; // Center of the rectangle
    const centerY = canvasBox.y + 125;
    
    // Start rotation from a point and drag to create rotation
    await page.mouse.move(centerX + 20, centerY); // Start to the right of center
    await page.mouse.down();
    await page.mouse.move(centerX, centerY + 20); // Move to bottom of center
    await page.mouse.up();
    
    // Check if rotation was applied
    const finalTransform = await rectElement.evaluate(el => el.style.transform);
    expect(finalTransform).toContain('rotate');
    expect(finalTransform).not.toBe(initialTransform);
  });

  test('should preserve existing translations when rotating', async ({ page }) => {
    await page.goto('/index.html');
    
    const lineInput = page.locator('.toolkit .shape .line');
    const moveInput = page.locator('.toolkit .operation .move');
    const rotateInput = page.locator('.toolkit .operation .rotate');
    const canvas = page.locator('.canvas');
    
    // Create a line
    await lineInput.click();
    const canvasBox = await canvas.boundingBox();
    await page.mouse.move(canvasBox.x + 50, canvasBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 50);
    await page.mouse.up();
    
    // Wait for auto-switch to move tool, then move the line
    await page.waitForTimeout(100);
    await page.mouse.move(canvasBox.x + 75, canvasBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 105, canvasBox.y + 80);
    await page.mouse.up();
    
    const lineElement = page.locator('.canvas line');
    const afterMoveTransform = await lineElement.evaluate(el => el.style.transform);
    
    // Now rotate
    await rotateInput.click();
    await page.mouse.move(canvasBox.x + 105, canvasBox.y + 80);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 120, canvasBox.y + 95);
    await page.mouse.up();
    
    const finalTransform = await lineElement.evaluate(el => el.style.transform);
    expect(finalTransform).toContain('translate');
    expect(finalTransform).toContain('rotate');
  });

  test('should calculate rotation angles correctly', async ({ page }) => {
    await page.goto('/index.html');
    
    const ellipseInput = page.locator('.toolkit .shape .ellipse');
    const rotateInput = page.locator('.toolkit .operation .rotate');
    const canvas = page.locator('.canvas');
    
    // Create an ellipse at a known position
    await ellipseInput.click();
    const canvasBox = await canvas.boundingBox();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 250, canvasBox.y + 250);
    await page.mouse.up();
    
    // Switch to rotate and perform a 90-degree rotation
    await rotateInput.click();
    const ellipseElement = page.locator('.canvas ellipse');
    
    const centerX = canvasBox.x + 225; // Center of ellipse
    const centerY = canvasBox.y + 225;
    
    // Perform approximately 90-degree rotation
    await page.mouse.move(centerX + 25, centerY); // Start to the right
    await page.mouse.down();
    await page.mouse.move(centerX, centerY + 25); // Move to bottom
    await page.mouse.up();
    
    const transform = await ellipseElement.evaluate(el => el.style.transform);
    expect(transform).toContain('rotate');
    
    // Extract rotation value - should be close to 90 degrees
    const rotateMatch = transform.match(/rotate\(([-\d.]+)deg\)/);
    if (rotateMatch) {
      const angle = parseFloat(rotateMatch[1]);
      expect(Math.abs(angle)).toBeGreaterThan(45); // Should be significant rotation
    }
  });
});
