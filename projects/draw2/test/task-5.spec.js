// Test for Task 5: Implement a Toolkit class that manages tool selection and properties
import { test, expect } from '@playwright/test';

test.describe('Task 5: Toolkit Class Tool Management', () => {
  test('should track currently selected operation through radio inputs', async ({ page }) => {
    await page.goto('/index.html');
    
    // Initially no tool should be selected
    const checkedInput = page.locator('input[name="operation"]:checked');
    const count = await checkedInput.count();
    
    // Select line tool
    await page.locator('.line').click();
    await expect(page.locator('input[value="line"]')).toBeChecked();
    
    // Select move tool
    await page.locator('.move').click();
    await expect(page.locator('input[value="move"]')).toBeChecked();
    await expect(page.locator('input[value="line"]')).not.toBeChecked();
    
    // Only one tool should be selected at a time
    const checkedAfter = page.locator('input[name="operation"]:checked');
    expect(await checkedAfter.count()).toBe(1);
  });

  test('should provide access to line width with correct range and default', async ({ page }) => {
    await page.goto('/index.html');
    
    const lineWidthInput = page.locator('.line-width');
    await expect(lineWidthInput).toBeVisible();
    await expect(lineWidthInput).toHaveAttribute('type', 'range');
    
    // Check range properties
    await expect(lineWidthInput).toHaveAttribute('min', '1');
    await expect(lineWidthInput).toHaveAttribute('max', '21');
    await expect(lineWidthInput).toHaveAttribute('step', '4');
    await expect(lineWidthInput).toHaveAttribute('value', '9');
    
    // Test changing the value
    await lineWidthInput.fill('13');
    await expect(lineWidthInput).toHaveValue('13');
  });

  test('should provide access to color values through color picker', async ({ page }) => {
    await page.goto('/index.html');
    
    const colorInput = page.locator('.color');
    await expect(colorInput).toBeVisible();
    await expect(colorInput).toHaveAttribute('type', 'color');
    await expect(colorInput).toHaveAttribute('value', '#000000');
    
    // Test changing color
    await colorInput.fill('#ff0000');
    await expect(colorInput).toHaveValue('#ff0000');
    
    // Test that color affects new shapes
    await page.locator('.rect').click();
    
    const canvas = page.locator('.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Draw a rectangle with red color
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
    await page.mouse.up();
    
    const rectElement = canvas.locator('rect');
    await expect(rectElement).toBeVisible();
    
    const stroke = await rectElement.getAttribute('stroke');
    expect(stroke).toBe('#ff0000');
  });

  test('should emit operation-change events when tools are switched', async ({ page }) => {
    await page.goto('/index.html');
    
    // Add event listener to track operation changes
    await page.evaluate(() => {
      window.operationChanges = [];
      const toolkit = document.querySelector('.toolkit');
      toolkit.addEventListener('change', (e) => {
        if (e.target.name === 'operation') {
          window.operationChanges.push(e.target.value);
        }
      });
    });
    
    // Switch between tools
    await page.locator('.line').click();
    await page.locator('.move').click();
    await page.locator('.rect').click();
    
    // Check that events were fired
    const changes = await page.evaluate(() => window.operationChanges);
    expect(changes).toContain('line');
    expect(changes).toContain('move');
    expect(changes).toContain('rect');
  });
});
