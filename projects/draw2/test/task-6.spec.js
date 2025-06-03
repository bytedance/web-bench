import { test, expect } from '@playwright/test';

test.describe('Task 6: Spacebar keyboard shortcut', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('pressing spacebar should temporarily switch to move tool', async ({ page }) => {
    // Select rect tool first
    await page.click('label:has(input[value="rect"])');
    let checkedValue = await page.locator('input[name="operation"]:checked').getAttribute('value');
    expect(checkedValue).toBe('rect');
    
    // Press and hold spacebar
    await page.keyboard.down(' ');
    
    // Should switch to move tool
    checkedValue = await page.locator('input[name="operation"]:checked').getAttribute('value');
    expect(checkedValue).toBe('move');
  });

  test('releasing spacebar should return to previous tool', async ({ page }) => {
    // Select line tool
    await page.click('label:has(input[value="line"])');
    
    // Press spacebar
    await page.keyboard.down(' ');
    
    // Verify switched to move
    let checkedValue = await page.locator('input[name="operation"]:checked').getAttribute('value');
    expect(checkedValue).toBe('move');
    
    // Release spacebar
    await page.keyboard.up(' ');
    
    // Should return to line tool
    checkedValue = await page.locator('input[name="operation"]:checked').getAttribute('value');
    expect(checkedValue).toBe('line');
  });

  test('should track previous tool state correctly', async ({ page }) => {
    // Test switching between multiple tools
    await page.click('label:has(input[value="ellipse"])');
    await page.keyboard.down(' ');
    await page.keyboard.up(' ');
    
    let checkedValue = await page.locator('input[name="operation"]:checked').getAttribute('value');
    expect(checkedValue).toBe('ellipse');
    
    // Change to delete tool
    await page.click('label:has(input[value="delete"])');
    await page.keyboard.down(' ');
    await page.keyboard.up(' ');
    
    checkedValue = await page.locator('input[name="operation"]:checked').getAttribute('value');
    expect(checkedValue).toBe('delete');
  });

  test('spacebar should work during drawing operations', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Select rect tool
    await page.click('label:has(input[value="rect"])');
    
    // Start drawing
    await page.mouse.move(canvasBox.x + 50, canvasBox.y + 50);
    await page.mouse.down();
    
    // Press spacebar while drawing
    await page.keyboard.down(' ');
    
    // Should switch to move tool
    const checkedValue = await page.locator('input[name="operation"]:checked').getAttribute('value');
    expect(checkedValue).toBe('move');
    
    // Release mouse and spacebar
    await page.mouse.up();
    await page.keyboard.up(' ');
  });

  test('multiple spacebar presses should handle state correctly', async ({ page }) => {
    // Select fill tool
    await page.click('label:has(input[value="fill"])');
    
    // Multiple spacebar presses
    await page.keyboard.down(' ');
    await page.keyboard.up(' ');
    await page.keyboard.down(' ');
    
    let checkedValue = await page.locator('input[name="operation"]:checked').getAttribute('value');
    expect(checkedValue).toBe('move');
    
    await page.keyboard.up(' ');
    
    checkedValue = await page.locator('input[name="operation"]:checked').getAttribute('value');
    expect(checkedValue).toBe('fill');
  });
});
