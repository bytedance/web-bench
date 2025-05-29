// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 15 Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should support touch events for drawing a line', async ({ page }) => {
    // Click the line label
    await page.locator('.shape > .line').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Simulate touch events to draw a line
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
      x2: canvasBoundingBox.x + 200,
      y2: canvasBoundingBox.y + 150
    });
    
    // Verify line was created
    const line = page.locator('.canvas line');
    await expect(line).toBeVisible();
    
    // Verify line coordinates
    const x1 = await line.getAttribute('x1');
    const y1 = await line.getAttribute('y1');
    const x2 = await line.getAttribute('x2');
    const y2 = await line.getAttribute('y2');
    
    expect(parseFloat(x1)).toBeCloseTo(100, 0);
    expect(parseFloat(y1)).toBeCloseTo(100, 0);
    expect(parseFloat(x2)).toBeCloseTo(200, 0);
    expect(parseFloat(y2)).toBeCloseTo(150, 0);
  });

  test('should support touch events for drawing a rectangle', async ({ page }) => {
    // Click the rect label
    await page.locator('.shape > .rect').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Simulate touch events to draw a rectangle
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
      x2: canvasBoundingBox.x + 200,
      y2: canvasBoundingBox.y + 150
    });
    
    // Verify rectangle was created
    const rect = page.locator('.canvas rect');
    await expect(rect).toBeVisible();
    
    // Verify rectangle attributes
    const x = await rect.getAttribute('x');
    const y = await rect.getAttribute('y');
    const width = await rect.getAttribute('width');
    const height = await rect.getAttribute('height');
    
    expect(parseFloat(x)).toBeCloseTo(100, 0);
    expect(parseFloat(y)).toBeCloseTo(100, 0);
    expect(parseFloat(width)).toBeCloseTo(100, 0);
    expect(parseFloat(height)).toBeCloseTo(50, 0);
  });

  test('should support touch events for drawing an ellipse', async ({ page }) => {
    // Click the ellipse label
    await page.locator('.shape > .ellipse').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Simulate touch events to draw an ellipse
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
      x2: canvasBoundingBox.x + 200,
      y2: canvasBoundingBox.y + 150
    });
    
    // Verify ellipse was created
    const ellipse = page.locator('.canvas ellipse');
    await expect(ellipse).toBeVisible();
    
    // Verify ellipse attributes
    const cx = await ellipse.getAttribute('cx');
    const cy = await ellipse.getAttribute('cy');
    const rx = await ellipse.getAttribute('rx');
    const ry = await ellipse.getAttribute('ry');
    
    expect(parseFloat(cx)).toBeCloseTo(150, 0);
    expect(parseFloat(cy)).toBeCloseTo(125, 0);
    expect(parseFloat(rx)).toBeCloseTo(50, 0);
    expect(parseFloat(ry)).toBeCloseTo(25, 0);
  });

  test('should support touch events for moving a shape', async ({ page }) => {
    // First draw a rectangle
    await page.locator('.shape > .rect').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Draw a rectangle using mouse events
    await page.mouse.move(canvasBoundingBox.x + 100, canvasBoundingBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 200, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Verify rectangle was created
    const rect = page.locator('.canvas rect');
    await expect(rect).toBeVisible();
    
    // Get original rectangle position
    const originalX = parseFloat(await rect.getAttribute('x'));
    const originalY = parseFloat(await rect.getAttribute('y'));
    
    // Click move label
    await page.locator('.operation > .move').click();
    
    // Simulate touch events to move the rectangle
    await page.evaluate(async ({ x1, y1, x2, y2 }) => {
      const canvas = document.querySelector('.canvas');
      const rect = document.querySelector('.canvas rect');
      
      // Get rectangle center
      const rectX = parseFloat(rect.getAttribute('x'));
      const rectY = parseFloat(rect.getAttribute('y'));
      const rectWidth = parseFloat(rect.getAttribute('width'));
      const rectHeight = parseFloat(rect.getAttribute('height'));
      const centerX = rectX + rectWidth / 2;
      const centerY = rectY + rectHeight / 2;
      
      // Create touchstart event on the rectangle
      const touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: centerX,
          clientY: centerY
        })]
      });
      
      // Create touchmove event
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: centerX + (x2 - x1),
          clientY: centerY + (y2 - y1)
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
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      canvas.dispatchEvent(touchMoveEvent);
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      canvas.dispatchEvent(touchEndEvent);
    }, {
      x1: canvasBoundingBox.x + 150,
      y1: canvasBoundingBox.y + 125,
      x2: canvasBoundingBox.x + 200,
      y2: canvasBoundingBox.y + 175
    });
    
    // Wait for the move to complete
    await page.waitForTimeout(500);
    
    // Get new rectangle position
    const newX = parseFloat(await rect.getAttribute('x'));
    const newY = parseFloat(await rect.getAttribute('y'));
    
    // Verify the rectangle has moved
    expect(newX).toBeGreaterThan(originalX);
    expect(newY).toBeGreaterThan(originalY);
  });

  test('should support touch events for rotating a shape', async ({ page }) => {
    // First draw a rectangle
    await page.locator('.shape > .rect').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Draw a rectangle using mouse events
    await page.mouse.move(canvasBoundingBox.x + 100, canvasBoundingBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 200, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Verify rectangle was created
    const rect = page.locator('.canvas rect');
    await expect(rect).toBeVisible();
    
    // Get original rectangle transform
    const originalTransform = await rect.getAttribute('transform') || '';
    
    // Click rotate label
    await page.locator('.operation > .rotate').click();
    
    // Simulate touch events to rotate the rectangle
    await page.evaluate(async ({ x1, y1, x2, y2 }) => {
      const canvas = document.querySelector('.canvas');
      const rect = document.querySelector('.canvas rect');
      
      // Get rectangle center
      const rectX = parseFloat(rect.getAttribute('x'));
      const rectY = parseFloat(rect.getAttribute('y'));
      const rectWidth = parseFloat(rect.getAttribute('width'));
      const rectHeight = parseFloat(rect.getAttribute('height'));
      const centerX = rectX + rectWidth / 2;
      const centerY = rectY + rectHeight / 2;
      
      // Create touchstart event at a point away from center
      const touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: centerX + 50, // 50px to the right of center
          clientY: centerY
        })]
      });
      
      // Create touchmove event in a circular motion
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: centerX, // Move to the top of center
          clientY: centerY - 50
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
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      canvas.dispatchEvent(touchMoveEvent);
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      canvas.dispatchEvent(touchEndEvent);
    }, {
      x1: canvasBoundingBox.x + 150,
      y1: canvasBoundingBox.y + 125,
      x2: canvasBoundingBox.x + 200,
      y2: canvasBoundingBox.y + 175
    });
    
    // Wait for the rotation to complete
    await page.waitForTimeout(500);
    
    // Get new rectangle transform
    const newTransform = await rect.getAttribute('transform');
    
    // Verify the rectangle has been rotated
    expect(newTransform).toBeTruthy();
    expect(newTransform).not.toEqual(originalTransform);
    expect(newTransform.includes('rotate')).toBe(true);
  });
});