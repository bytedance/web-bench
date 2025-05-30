import { test, expect } from '@playwright/test';

test.describe('Task 15: Canvas operations - copy, delete, fill', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('copy operation should duplicate shape with offset', async ({ page }) => {
    // Create a shape
    await page.click('.shape .rect');
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(150, 150);
    await page.mouse.up();
    
    // Switch to copy mode and click the shape
    await page.click('.operation .copy');
    await page.click('.canvas rect');
    
    // Should have 2 rectangles now
    const rects = await page.$$('.canvas rect');
    expect(rects.length).toBe(2);
    
    // Check that they have different positions
    const positions = await page.$$eval('.canvas rect', elements => 
      elements.map(el => ({
        x: el.getAttribute('x'),
        y: el.getAttribute('y')
      }))
    );
    
    expect(positions[0].x).not.toBe(positions[1].x);
    expect(positions[0].y).not.toBe(positions[1].y);
  });

  test('delete operation should remove clicked shape', async ({ page }) => {
    // Create multiple shapes
    await page.click('.shape .ellipse');
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(150, 150);
    await page.mouse.up();
    
    await page.mouse.move(200, 200);
    await page.mouse.down();
    await page.mouse.move(250, 250);
    await page.mouse.up();
    
    const initialCount = (await page.$$('.canvas ellipse')).length;
    
    // Delete one shape
    await page.click('.operation .delete');
    await page.click('.canvas ellipse');
    
    const finalCount = (await page.$$('.canvas ellipse')).length;
    expect(finalCount).toBe(initialCount - 1);
  });

  test('fill operation should change shape fill color', async ({ page }) => {
    // Create a shape
    await page.click('.shape .rect');
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await page.mouse.up();
    
    // Change color to red
    const colorInput = await page.$('.prop .color');
    await colorInput.fill('#ff0000');
    
    // Get initial fill
    const rect = await page.$('.canvas rect');
    const initialFill = await rect.getAttribute('fill');
    
    // Apply fill operation
    await page.click('.operation .fill');
    await rect.click();
    
    // Check fill changed
    const newFill = await rect.getAttribute('fill');
    expect(newFill).toBe('#ff0000');
    expect(newFill).not.toBe(initialFill);
  });

  test('operations should not affect canvas clicks', async ({ page }) => {
    // Create a shape
    await page.click('.shape .line');
    await page.mouse.move(50, 50);
    await page.mouse.down();
    await page.mouse.move(150, 50);
    await page.mouse.up();
    
    const initialCount = (await page.$$('.canvas > *')).length;
    
    // Try operations on empty canvas area
    await page.click('.operation .copy');
    await page.click('.canvas', { position: { x: 300, y: 300 } });
    
    await page.click('.operation .delete');
    await page.click('.canvas', { position: { x: 300, y: 300 } });
    
    await page.click('.operation .fill');
    await page.click('.canvas', { position: { x: 300, y: 300 } });
    
    // Shape count should remain the same
    const finalCount = (await page.$$('.canvas > *')).length;
    expect(finalCount).toBe(initialCount);
  });

  test('multiple operations in sequence', async ({ page }) => {
    // Create a shape
    await page.click('.shape .ellipse');
    await page.mouse.move(150, 150);
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await page.mouse.up();
    
    // Copy it
    await page.click('.operation .copy');
    await page.click('.canvas ellipse');
    
    // Fill the first one
    await page.$eval('.prop .color', el => el.value = '#00ff00');
    await page.click('.operation .fill');
    const firstEllipse = await page.$('.canvas ellipse');
    await firstEllipse.click();
    
    // Delete the second one
    await page.click('.operation .delete');
    const ellipses = await page.$$('.canvas ellipse');
    await ellipses[1].click();
    
    // Should have one green ellipse
    const remainingEllipses = await page.$$('.canvas ellipse');
    expect(remainingEllipses.length).toBe(1);
    
    const fill = await remainingEllipses[0].getAttribute('fill');
    expect(fill).toBe('#00ff00');
  });
});
