const { test, expect } = require('@playwright/test');
const coverage = require('../../../libraries/test-util/src/coverage');test.afterEach(coverage);;
test.describe('Task 16: Move Operation Implementation', () => {
  test('should move shapes when using move operation', async ({ page }) => {
    await page.goto('/index.html');
    
    const lineInput = page.locator('.toolkit .shape .line');
    const moveInput = page.locator('.toolkit .operation .move');
    const canvas = page.locator('.canvas');
    
    // First create a line
    await lineInput.click();
    const canvasBox = await canvas.boundingBox();
    await page.mouse.move(canvasBox.x + 50, canvasBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 50);
    await page.mouse.up();
    
    // Wait for auto-switch to move tool
    await page.waitForTimeout(100);
    await expect(moveInput).toBeChecked();
    
    const lineElement = page.locator('.canvas line');
    
    // Get initial position
    const initialTransform = await lineElement.evaluate(el => el.style.transform);
    
    // Move the line by dragging it
    await page.mouse.move(canvasBox.x + 75, canvasBox.y + 50); // Center of line
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 125, canvasBox.y + 100); // Move 50px right, 50px down
    await page.mouse.up();
    
    // Check if transform was applied
    const finalTransform = await lineElement.evaluate(el => el.style.transform);
    expect(finalTransform).toContain('translate');
    expect(finalTransform).not.toBe(initialTransform);
  });

  test('should calculate position deltas correctly during move', async ({ page }) => {
    await page.goto('/index.html');
    
    const rectInput = page.locator('.toolkit .shape .rect');
    const moveInput = page.locator('.toolkit .operation .move');
    const canvas = page.locator('.canvas');
    
    // Create a rectangle
    await rectInput.click();
    const canvasBox = await canvas.boundingBox();
    await page.mouse.move(canvasBox.x + 40, canvasBox.y + 40);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 80, canvasBox.y + 80);
    await page.mouse.up();
    
    // Wait for auto-switch to move tool
    await page.waitForTimeout(100);
    
    const rectElement = page.locator('.canvas rect');
    
    // Move the rectangle by a specific amount
    await page.mouse.move(canvasBox.x + 60, canvasBox.y + 60); // Center of rect
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 90, canvasBox.y + 90); // Move 30px right, 30px down
    await page.mouse.up();
    
    const transform = await rectElement.evaluate(el => el.style.transform);
    expect(transform).toContain('translate(30px, 30px)');
  });

  test('should not move canvas itself, only shapes on it', async ({ page }) => {
    await page.goto('/index.html');
    
    const moveInput = page.locator('.toolkit .operation .move');
    const canvas = page.locator('.canvas');
    
    // Select move tool and try to drag on empty canvas
    await moveInput.click();
    
    const canvasBox = await canvas.boundingBox();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 250, canvasBox.y + 250);
    await page.mouse.up();
    
    // Canvas should not have any transform applied
    const canvasTransform = await canvas.evaluate(el => el.style.transform);
    expect(canvasTransform).toBe('');
    
    // No shapes should be created
    const shapes = page.locator('.canvas > *');
    const shapeCount = await shapes.count();
    expect(shapeCount).toBe(0);
  });
});
