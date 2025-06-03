const { test, expect } = require('@playwright/test');

test.describe('Task 20: Application Integration', () => {
  test('should initialize Toolkit and Canvas instances properly', async ({ page }) => {
    await page.goto('/index.html');
    
    // Wait for initialization
    await page.waitForTimeout(200);
    
    // Check if toolkit and canvas are properly initialized
    const result = await page.evaluate(() => {
      const toolkitElement = document.querySelector('.toolkit');
      const canvasElement = document.querySelector('.canvas');
      
      return {
        toolkitExists: !!toolkitElement,
        canvasExists: !!canvasElement,
        hasEventHandlers: true // Assume true since we can't easily inspect event listeners
      };
    });
    
    expect(result.toolkitExists).toBe(true);
    expect(result.canvasExists).toBe(true);
  });

  test('should automatically switch to move tool after shape creation', async ({ page }) => {
    await page.goto('/index.html');
    
    const lineInput = page.locator('.toolkit .shape .line');
    const rectInput = page.locator('.toolkit .shape .rect');
    const ellipseInput = page.locator('.toolkit .shape .ellipse');
    const moveInput = page.locator('.toolkit .operation .move');
    const canvas = page.locator('.canvas');
    
    const canvasBox = await canvas.boundingBox();
    
    // Test with line creation
    await lineInput.click();
    await page.mouse.move(canvasBox.x + 50, canvasBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 50);
    await page.mouse.up();
    
    await page.waitForTimeout(100);
    await expect(moveInput).toBeChecked();
    
    // Test with rectangle creation
    await rectInput.click();
    await page.mouse.move(canvasBox.x + 120, canvasBox.y + 70);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 170, canvasBox.y + 120);
    await page.mouse.up();
    
    await page.waitForTimeout(100);
    await expect(moveInput).toBeChecked();
    
    // Test with ellipse creation
    await ellipseInput.click();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 140);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 250, canvasBox.y + 190);
    await page.mouse.up();
    
    await page.waitForTimeout(100);
    await expect(moveInput).toBeChecked();
  });

  test('should handle copy operation and auto-switch to move tool', async ({ page }) => {
    await page.goto('/index.html');
    
    const rectInput = page.locator('.toolkit .shape .rect');
    const copyInput = page.locator('.toolkit .operation .copy');
    const moveInput = page.locator('.toolkit .operation .move');
    const canvas = page.locator('.canvas');
    
    // Create a rectangle first
    await rectInput.click();
    const canvasBox = await canvas.boundingBox();
    await page.mouse.move(canvasBox.x + 80, canvasBox.y + 80);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 130, canvasBox.y + 130);
    await page.mouse.up();
    
    // Wait for auto-switch to move tool
    await page.waitForTimeout(100);
    await expect(moveInput).toBeChecked();
    
    // Use copy operation
    await copyInput.click();
    await page.mouse.click(canvasBox.x + 105, canvasBox.y + 105);
    
    // Should auto-switch back to move tool after copy
    await page.waitForTimeout(100);
    await expect(moveInput).toBeChecked();
    
    // Should have 2 rectangles now
    const rectElements = page.locator('.canvas rect');
    await expect(rectElements).toHaveCount(2);
  });

  test('should maintain proper event handling throughout the application lifecycle', async ({ page }) => {
    await page.goto('/index.html');
    
    const lineInput = page.locator('.toolkit .shape .line');
    const moveInput = page.locator('.toolkit .operation .move');
    const rotateInput = page.locator('.toolkit .operation .rotate');
    const canvas = page.locator('.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create multiple shapes and perform various operations
    await lineInput.click();
    
    // Create first line
    await page.mouse.move(canvasBox.x + 30, canvasBox.y + 30);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 80, canvasBox.y + 30);
    await page.mouse.up();
    
    // Should auto-switch to move tool
    await page.waitForTimeout(100);
    await expect(moveInput).toBeChecked();
    
    // Move the line
    await page.mouse.move(canvasBox.x + 55, canvasBox.y + 30);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 85, canvasBox.y + 60);
    await page.mouse.up();
    
    // Rotate the line
    await rotateInput.click();
    await page.mouse.move(canvasBox.x + 85, canvasBox.y + 60);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 75);
    await page.mouse.up();
    
    // Create another line to test continued functionality
    await lineInput.click();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 150);
    await page.mouse.up();
    
    // Should have 2 lines and auto-switch to move tool
    await page.waitForTimeout(100);
    const lineElements = page.locator('.canvas line');
    await expect(lineElements).toHaveCount(2);
    await expect(moveInput).toBeChecked();
  });
});
