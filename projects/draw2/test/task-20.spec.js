import { test, expect } from '@playwright/test';

test.describe('Task 20: Application initialization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('application should be initialized on page load', async ({ page }) => {
    // Check that toolkit and canvas are ready
    const toolkit = await page.$('.toolkit');
    const canvas = await page.$('.canvas');
    
    expect(toolkit).toBeTruthy();
    expect(canvas).toBeTruthy();
    
    // Check that controls are interactive
    await page.click('.shape .line');
    const isChecked = await page.$eval('.shape .line input', el => el.checked);
    expect(isChecked).toBe(true);
  });

  test('should auto-switch to move tool after drawing shapes', async ({ page }) => {
    // Draw a line
    await page.click('.shape .line');
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(200, 100);
    await page.mouse.up();
    
    // Should switch to move tool
    await page.waitForTimeout(100); // Small delay for event handling
    const moveChecked = await page.$eval('.operation .move input', el => el.checked);
    expect(moveChecked).toBe(true);
  });

  test('should auto-switch to move after drawing each shape type', async ({ page }) => {
    const shapes = ['line', 'rect', 'ellipse'];
    
    for (const shape of shapes) {
      // Select shape tool
      await page.click(`.shape .${shape}`);
      
      // Draw shape
      await page.mouse.move(50, 50);
      await page.mouse.down();
      await page.mouse.move(150, 150);
      await page.mouse.up();
      
      // Check switched to move
      await page.waitForTimeout(100);
      const moveChecked = await page.$eval('.operation .move input', el => el.checked);
      expect(moveChecked).toBe(true);
    }
  });

  test('should auto-switch to move after copy operation', async ({ page }) => {
    // Create a shape first
    await page.click('.shape .rect');
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(150, 150);
    await page.mouse.up();
    
    // Wait for auto-switch to move
    await page.waitForTimeout(100);
    
    // Switch to copy
    await page.click('.operation .copy');
    
    // Copy the shape
    await page.click('.canvas rect');
    
    // Should switch back to move
    await page.waitForTimeout(100);
    const moveChecked = await page.$eval('.operation .move input', el => el.checked);
    expect(moveChecked).toBe(true);
  });

  test('should not auto-switch for other operations', async ({ page }) => {
    // Create a shape
    await page.click('.shape .ellipse');
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(150, 150);
    await page.mouse.up();
    
    // Wait for auto-switch to move
    await page.waitForTimeout(100);
    
    // Test operations that shouldn't auto-switch
    const operations = ['rotate', 'zoom', 'delete', 'fill'];
    
    for (const op of operations) {
      await page.click(`.operation .${op}`);
      
      // Perform operation
      if (op === 'delete') {
        // Create new shape to delete
        await page.click('.shape .ellipse');
        await page.mouse.move(200, 200);
        await page.mouse.down();
        await page.mouse.move(250, 250);
        await page.mouse.up();
        await page.waitForTimeout(100);
        await page.click(`.operation .${op}`);
      }
      
      await page.click('.canvas ellipse');
      await page.waitForTimeout(100);
      
      // Should still be on the same tool
      const stillChecked = await page.$eval(`.operation .${op} input`, el => el.checked);
      if (op !== 'delete') { // Delete might switch after removing last shape
        expect(stillChecked).toBe(true);
      }
    }
  });
});
