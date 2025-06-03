// Test for Task 13: Implement rotate operation using mathematical calculations
import { test, expect } from '@playwright/test';

test.describe('Task 13: Rotate Operation with Mathematical Calculations', () => {
  test('should rotate shapes around their center point', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create a rectangle
    await page.locator('.rect').click();
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 150;
    const startY = canvasBox.y + 150;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 100, startY + 60);
    await page.mouse.up();
    
    const rectElement = canvas.locator('rect');
    await expect(rectElement).toBeVisible();
    
    // Switch to rotate tool
    await page.locator('.rotate').click();
    
    // Get center of the rectangle for rotation
    const rectBox = await rectElement.boundingBox();
    const centerX = rectBox.x + rectBox.width / 2;
    const centerY = rectBox.y + rectBox.height / 2;
    
    // Start rotation from one side
    await page.mouse.move(centerX + 50, centerY);
    await page.mouse.down();
    
    // Rotate to different position
    await page.mouse.move(centerX, centerY - 50);
    await page.mouse.up();
    
    // Check that rotation was applied
    const transform = await rectElement.evaluate(el => el.style.transform);
    expect(transform).toContain('rotate');
    
    // Extract rotation angle
    const rotateMatch = transform.match(/rotate\(([\d.-]+)deg\)/);
    expect(rotateMatch).not.toBeNull();
    const angle = parseFloat(rotateMatch[1]);
    expect(Math.abs(angle)).toBeGreaterThan(0);
  });

  test('should calculate correct rotation angles between cursor positions', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create a line
    await page.locator('.line').click();
    const canvasBox = await canvas.boundingBox();
    const startX = canvasBox.x + 200;
    const startY = canvasBox.y + 200;
    
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 80, startY, {steps: 10});
    await page.mouse.up();
    
    const lineElement = canvas.locator('line');
    await expect(lineElement).toBeAttached();
    
    // Switch to rotate tool
    await page.locator('.rotate').click();
    
    // Perform a 90-degree-like rotation
    // await lineElement.hover();
    await page.mouse.move(startX + 80, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 40, startY - 40); // Move up relative to center
    await page.mouse.up();
    
    const transform = await lineElement.evaluate(el => el.style.transform);
    expect(transform).toContain('rotate');
    
    // Perform another rotation
    // await lineElement.hover();
    await page.mouse.move(startX + 40, startY - 40);
    await page.mouse.down();
    await page.mouse.move(startX + 40, startY + 40); // Move down relative to center
    await page.mouse.up();
    
    const finalTransform = await lineElement.evaluate(el => el.style.transform);
    expect(finalTransform).toContain('rotate');
    
    // The rotation angle should have changed
    expect(finalTransform).not.toBe(transform);
  });

  test('should handle edge cases like zero-length vectors', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Create an ellipse
    await page.locator('.ellipse').click();
    const canvasBox = await canvas.boundingBox();
    const centerX = canvasBox.x + 180;
    const centerY = canvasBox.y + 180;
    
    await page.mouse.move(centerX - 30, centerY - 30);
    await page.mouse.down();
    await page.mouse.move(centerX + 30, centerY + 30);
    await page.mouse.up();
    
    const ellipseElement = canvas.locator('ellipse');
    await expect(ellipseElement).toBeVisible();
    
    // Switch to rotate tool
    await page.locator('.rotate').click();
    
    // Try to rotate from the exact center (zero-length vector)
    const ellipseBox = await ellipseElement.boundingBox();
    const exactCenterX = ellipseBox.x + ellipseBox.width / 2;
    const exactCenterY = ellipseBox.y + ellipseBox.height / 2;
    
    await page.mouse.move(exactCenterX, exactCenterY);
    await page.mouse.down();
    await page.mouse.move(exactCenterX + 1, exactCenterY + 1); // Minimal movement
    await page.mouse.up();
    
    // Should not crash and should handle the edge case gracefully
    const transform = await ellipseElement.evaluate(el => el.style.transform);
    
    // Either no rotation applied or minimal rotation
    if (transform.includes('rotate')) {
      const rotateMatch = transform.match(/rotate\(([\d.-]+)deg\)/);
      if (rotateMatch) {
        const angle = parseFloat(rotateMatch[1]);
        expect(Math.abs(angle)).toBeLessThan(10); // Should be minimal or zero
      }
    }
  });
});
