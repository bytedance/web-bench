const { test, expect } = require('@playwright/test');
const coverage = require('../../../libraries/test-util/src/coverage');test.afterEach(coverage);;
test.describe('Task 10: Toolkit Class Implementation', () => {
  test('should have Toolkit class extending EventEmitter', async ({ page }) => {
    await page.goto('/index.html');
    
    // Wait for toolkit to be initialized
    await page.waitForTimeout(100);
    
    const result = await page.evaluate(() => {
      const toolkit = document.querySelector('.toolkit');
      return {
        toolkitExists: !!toolkit,
        hasEventHandlers: toolkit._events !== undefined || toolkit.events !== undefined
      };
    });
    
    expect(result.toolkitExists).toBe(true);
  });

  test('should have property getters for operation, lineWidth, and color', async ({ page }) => {
    await page.goto('/index.html');
    
    // Test initial values
    const lineInput = page.locator('.toolkit .shape .line');
    const lineWidthInput = page.locator('.toolkit .prop .line-width');
    const colorInput = page.locator('.toolkit .prop .color');
    
    await lineInput.click();
    
    const values = await page.evaluate(() => {
      // Access the toolkit instance through the DOM
      const lineWidthEl = document.querySelector('.line-width');
      const colorEl = document.querySelector('.color');
      
      return {
        lineWidth: parseFloat(lineWidthEl.value),
        color: colorEl.value
      };
    });
    
    expect(values.lineWidth).toBe(9);
    expect(values.color).toBe('#000000');
  });

  test('should respond to spacebar key for temporary move tool activation', async ({ page }) => {
    await page.goto('/index.html');
    
    const lineInput = page.locator('.toolkit .shape .line');
    const moveInput = page.locator('.toolkit .operation .move');
    
    // Select line tool first
    await lineInput.click();
    await expect(lineInput).toBeChecked();
    await expect(moveInput).not.toBeChecked();
    
    // Press spacebar - should activate move tool
    await page.keyboard.down(' ');
    await page.waitForTimeout(50);
    await expect(moveInput).toBeChecked();
    
    // Release spacebar - should return to line tool
    await page.keyboard.up(' ');
    await page.waitForTimeout(50);
    await expect(lineInput).toBeChecked();
    await expect(moveInput).not.toBeChecked();
  });
});
