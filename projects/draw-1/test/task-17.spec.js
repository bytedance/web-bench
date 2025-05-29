// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 17 Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should enforce minimum line length based on line width when using touch events', async ({ page }) => {
    // Set a large line width
    await page.locator('.prop input[type="range"]').fill('20');
    
    // Click the line label
    await page.locator('.shape > .line').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Try to draw a very short line using touch events
    await page.evaluate(({ x1, y1, x2, y2 }) => {
      const canvas = document.querySelector('.canvas');
      
      // Create touchstart event
      const touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: x1,
          clientY: y1
        })]
      });
      
      // Create touchmove event
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: x2,
          clientY: y2
        })]
      });
      
      // Create touchend event
      const touchEndEvent = new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
        touches: []
      });
      
      // Dispatch events
      canvas.dispatchEvent(touchStartEvent);
      canvas.dispatchEvent(touchMoveEvent);
      canvas.dispatchEvent(touchEndEvent);
    }, {
      x1: canvasBoundingBox.x + 100,
      y1: canvasBoundingBox.y + 100,
      x2: canvasBoundingBox.x + 105,
      y2: canvasBoundingBox.y + 105 // Only 7.07px diagonal length
    });
    
    // Verify line was created
    const line = page.locator('.canvas line');
    await expect(line).toBeVisible();
    
    // Get line coordinates
    const x1 = parseFloat(await line.getAttribute('x1'));
    const y1 = parseFloat(await line.getAttribute('y1'));
    const x2 = parseFloat(await line.getAttribute('x2'));
    const y2 = parseFloat(await line.getAttribute('y2'));
    
    // Calculate actual line length
    const actualLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    
    // Verify the line length is at least the line width
    expect(actualLength).toBeGreaterThanOrEqual(20);
    
    // Verify the line direction is maintained
    const originalDx = 5; // 105 - 100
    const originalDy = 5; // 105 - 100
    const actualDx = x2 - x1;
    const actualDy = y2 - y1;
    
    // Check if the direction is maintained (same ratio)
    const originalRatio = originalDy / originalDx;
    const actualRatio = actualDy / actualDx;
    expect(actualRatio).toBeCloseTo(originalRatio, 1);
  });

  test('should enforce minimum rectangle dimensions based on line width when using touch events', async ({ page }) => {
    // Set a large line width
    await page.locator('.prop input[type="range"]').fill('20');
    
    // Click the rect label
    await page.locator('.shape > .rect').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Try to draw a very small rectangle using touch events
    await page.evaluate(({ x1, y1, x2, y2 }) => {
      const canvas = document.querySelector('.canvas');
      
      // Create touchstart event
      const touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: x1,
          clientY: y1
        })]
      });
      
      // Create touchmove event
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: x2,
          clientY: y2
        })]
      });
      
      // Create touchend event
      const touchEndEvent = new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
        touches: []
      });
      
      // Dispatch events
      canvas.dispatchEvent(touchStartEvent);
      canvas.dispatchEvent(touchMoveEvent);
      canvas.dispatchEvent(touchEndEvent);
    }, {
      x1: canvasBoundingBox.x + 100,
      y1: canvasBoundingBox.y + 100,
      x2: canvasBoundingBox.x + 105,
      y2: canvasBoundingBox.y + 105 // Only 5x5 rectangle
    });
    
    // Verify rectangle was created
    const rect = page.locator('.canvas rect');
    await expect(rect).toBeVisible();
    
    // Get rectangle dimensions
    const width = parseFloat(await rect.getAttribute('width'));
    const height = parseFloat(await rect.getAttribute('height'));
    
    // Verify both width and height are at least the line width
    expect(width).toBeGreaterThanOrEqual(20);
    expect(height).toBeGreaterThanOrEqual(20);
  });

  test('should enforce minimum ellipse radii based on half the line width when using touch events', async ({ page }) => {
    // Set a large line width
    await page.locator('.prop input[type="range"]').fill('20');
    
    // Click the ellipse label
    await page.locator('.shape > .ellipse').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Try to draw a very small ellipse using touch events
    await page.evaluate(({ x1, y1, x2, y2 }) => {
      const canvas = document.querySelector('.canvas');
      
      // Create touchstart event
      const touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: x1,
          clientY: y1
        })]
      });
      
      // Create touchmove event
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: x2,
          clientY: y2
        })]
      });
      
      // Create touchend event
      const touchEndEvent = new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
        touches: []
      });
      
      // Dispatch events
      canvas.dispatchEvent(touchStartEvent);
      canvas.dispatchEvent(touchMoveEvent);
      canvas.dispatchEvent(touchEndEvent);
    }, {
      x1: canvasBoundingBox.x + 100,
      y1: canvasBoundingBox.y + 100,
      x2: canvasBoundingBox.x + 105,
      y2: canvasBoundingBox.y + 105 // Only 5x5 ellipse (rx=2.5, ry=2.5)
    });
    
    // Verify ellipse was created
    const ellipse = page.locator('.canvas ellipse');
    await expect(ellipse).toBeVisible();
    
    // Get ellipse radii
    const rx = parseFloat(await ellipse.getAttribute('rx'));
    const ry = parseFloat(await ellipse.getAttribute('ry'));
    
    // Verify both radii are at least half the line width
    expect(rx).toBeGreaterThanOrEqual(10); // Half of 20
    expect(ry).toBeGreaterThanOrEqual(10); // Half of 20
  });

  test('should adjust only one dimension if the other is already sufficient when using touch events', async ({ page }) => {
    // Set a line width
    await page.locator('.prop input[type="range"]').fill('15');
    
    // Click the rect label
    await page.locator('.shape > .rect').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Try to draw a rectangle with width smaller than line width but height larger using touch events
    await page.evaluate(({ x1, y1, x2, y2 }) => {
      const canvas = document.querySelector('.canvas');
      
      // Create touchstart event
      const touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: x1,
          clientY: y1
        })]
      });
      
      // Create touchmove event
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: x2,
          clientY: y2
        })]
      });
      
      // Create touchend event
      const touchEndEvent = new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
        touches: []
      });
      
      // Dispatch events
      canvas.dispatchEvent(touchStartEvent);
      canvas.dispatchEvent(touchMoveEvent);
      canvas.dispatchEvent(touchEndEvent);
    }, {
      x1: canvasBoundingBox.x + 100,
      y1: canvasBoundingBox.y + 100,
      x2: canvasBoundingBox.x + 105,
      y2: canvasBoundingBox.y + 130 // 5x30 rectangle
    });
    
    // Verify rectangle was created
    const rect = page.locator('.canvas rect');
    await expect(rect).toBeVisible();
    
    // Get rectangle dimensions
    const width = parseFloat(await rect.getAttribute('width'));
    const height = parseFloat(await rect.getAttribute('height'));
    
    // Verify width is adjusted but height is unchanged
    expect(width).toBeGreaterThanOrEqual(15);
    expect(height).toBeCloseTo(30, 0);
  });

  test('should work with different line width values when using touch events', async ({ page }) => {
    // Test with different line width values
    const lineWidths = [5, 10, 20];
    
    for (const lineWidth of lineWidths) {
      // Set the line width
      await page.locator('.prop input[type="range"]').fill(lineWidth.toString());
      
      // Click the line label
      await page.locator('.shape > .line').click();
      
      const canvas = page.locator('.canvas');
      const canvasBoundingBox = await canvas.boundingBox();
      
      // Try to draw a very short line using touch events
      await page.evaluate(({ x1, y1, x2, y2 }) => {
        const canvas = document.querySelector('.canvas');
        
        // Create touchstart event
        const touchStartEvent = new TouchEvent('touchstart', {
          bubbles: true,
          cancelable: true,
          touches: [new Touch({
            identifier: 0,
            target: canvas,
            clientX: x1,
            clientY: y1
          })]
        });
        
        // Create touchmove event
        const touchMoveEvent = new TouchEvent('touchmove', {
          bubbles: true,
          cancelable: true,
          touches: [new Touch({
            identifier: 0,
            target: canvas,
            clientX: x2,
            clientY: y2
          })]
        });
        
        // Create touchend event
        const touchEndEvent = new TouchEvent('touchend', {
          bubbles: true,
          cancelable: true,
          touches: []
        });
        
        // Dispatch events
        canvas.dispatchEvent(touchStartEvent);
        canvas.dispatchEvent(touchMoveEvent);
        canvas.dispatchEvent(touchEndEvent);
      }, {
        x1: canvasBoundingBox.x + 100 + lineWidth * 10,
        y1: canvasBoundingBox.y + 100,
        x2: canvasBoundingBox.x + 102 + lineWidth * 10,
        y2: canvasBoundingBox.y + 102 // Very short line
      });
      
      // Verify line was created
      const lines = await page.locator('.canvas line').all();
      const line = lines[lines.length - 1]; // Get the last line
      
      // Get line coordinates
      const x1 = parseFloat(await line.getAttribute('x1'));
      const y1 = parseFloat(await line.getAttribute('y1'));
      const x2 = parseFloat(await line.getAttribute('x2'));
      const y2 = parseFloat(await line.getAttribute('y2'));
      
      // Calculate actual line length
      const actualLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      
      // Verify the line length is at least the line width
      expect(actualLength).toBeGreaterThanOrEqual(lineWidth);
    }
  });
});