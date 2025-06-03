import { test, expect } from '@playwright/test';

test.describe('Task 5: Toolkit class functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should track currently selected operation', async ({ page }) => {
    // Select different operations and verify selection
    await page.click('label:has(input[value="move"])');
    let checkedValue = await page.locator('input[name="operation"]:checked').getAttribute('value');
    expect(checkedValue).toBe('move');
    
    await page.click('label:has(input[value="rect"])');
    checkedValue = await page.locator('input[name="operation"]:checked').getAttribute('value');
    expect(checkedValue).toBe('rect');
    
    await page.click('label:has(input[value="delete"])');
    checkedValue = await page.locator('input[name="operation"]:checked').getAttribute('value');
    expect(checkedValue).toBe('delete');
  });

  test('line width slider should have correct range and default', async ({ page }) => {
    const slider = await page.locator('input[name="line-width"]');
    
    // Check range attributes
    const min = await slider.getAttribute('min');
    const max = await slider.getAttribute('max');
    const step = await slider.getAttribute('step');
    const value = await slider.getAttribute('value');
    
    expect(Number(min)).toBe(1);
    expect(Number(max)).toBe(21);
    expect(Number(step)).toBe(4);
    expect(Number(value)).toBe(9);
  });

  test('line width slider should update value on change', async ({ page }) => {
    const slider = await page.locator('input[name="line-width"]');
    
    // Change slider value
    await slider.fill('13');
    const newValue = await slider.inputValue();
    expect(Number(newValue)).toBe(13);
    
    // Test drawing with new line width
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    await page.click('label:has(input[value="line"])');
    await page.mouse.move(canvasBox.x + 50, canvasBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 50);
    await page.mouse.up();
    
    const line = await canvas.locator('line').first();
    const strokeWidth = await line.getAttribute('stroke-width');
    expect(Number(strokeWidth)).toBe(13);
  });

  test('color picker should provide access to color values', async ({ page }) => {
    const colorPicker = await page.locator('input[name="color"]');
    
    // Set a specific color
    await colorPicker.fill('#ff00ff');
    const colorValue = await colorPicker.inputValue();
    expect(colorValue).toBe('#ff00ff');
    
    // Test drawing with the color
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    await page.click('label:has(input[value="rect"])');
    await page.mouse.move(canvasBox.x + 50, canvasBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.up();
    
    const rect = await canvas.locator('rect').first();
    const stroke = await rect.getAttribute('stroke');
    expect(stroke).toBe('#ff00ff');
  });

  test('should emit operation-change events when tools are switched', async ({ page }) => {
    // Set up event listener
    await page.evaluate(() => {
      window.operationChanges = [];
      document.addEventListener('operation-change', (e) => {
        window.operationChanges.push(e.detail || e.target.value);
      });
    });
    
    // Switch between different tools
    await page.click('label:has(input[value="line"])');
    await page.click('label:has(input[value="move"])');
    await page.click('label:has(input[value="ellipse"])');
    
    // Check if events were fired
    const changes = await page.evaluate(() => window.operationChanges);
    expect(changes.length).toBeGreaterThan(0);
  });
});
