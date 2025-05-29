// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 18 Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should be able to zoom a rectangle using touch events', async ({ page }) => {
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
    
    // Get original rectangle dimensions
    const originalWidth = parseFloat(await rect.getAttribute('width'));
    const originalHeight = parseFloat(await rect.getAttribute('height'));
    
    // Click zoom label
    await page.locator('.operation > .zoom').click();
    
    // Simulate touch events to zoom the rectangle
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
      
      // Create touchmove event to zoom in (move outward)
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: centerX + 100, // 100px to the right of center
          clientY: centerY
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
      y2: canvasBoundingBox.y + 125
    });
    
    // Wait for the zoom to complete
    await page.waitForTimeout(500);
    
    // Get new rectangle dimensions
    const newWidth = parseFloat(await rect.getAttribute('width'));
    const newHeight = parseFloat(await rect.getAttribute('height'));
    
    // Verify the rectangle has been zoomed in (dimensions increased)
    expect(newWidth).toBeGreaterThan(originalWidth);
    expect(newHeight).toBeGreaterThan(originalHeight);
  });

  test('should be able to zoom an ellipse using touch events', async ({ page }) => {
    // First draw an ellipse
    await page.locator('.shape > .ellipse').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Draw an ellipse using mouse events
    await page.mouse.move(canvasBoundingBox.x + 100, canvasBoundingBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 200, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Verify ellipse was created
    const ellipse = page.locator('.canvas ellipse');
    await expect(ellipse).toBeVisible();
    
    // Get original ellipse dimensions
    const originalRx = parseFloat(await ellipse.getAttribute('rx'));
    const originalRy = parseFloat(await ellipse.getAttribute('ry'));
    
    // Click zoom label
    await page.locator('.operation > .zoom').click();
    
    // Simulate touch events to zoom the ellipse
    await page.evaluate(async ({ x1, y1, x2, y2 }) => {
      const canvas = document.querySelector('.canvas');
      const ellipse = document.querySelector('.canvas ellipse');
      
      // Get ellipse center
      const cx = parseFloat(ellipse.getAttribute('cx'));
      const cy = parseFloat(ellipse.getAttribute('cy'));
      
      // Create touchstart event at a point away from center
      const touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: cx + 50, // 50px to the right of center
          clientY: cy
        })]
      });
      
      // Create touchmove event to zoom in (move outward)
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: cx + 100, // 100px to the right of center
          clientY: cy
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
      y2: canvasBoundingBox.y + 125
    });
    
    // Wait for the zoom to complete
    await page.waitForTimeout(500);
    
    // Get new ellipse dimensions
    const newRx = parseFloat(await ellipse.getAttribute('rx'));
    const newRy = parseFloat(await ellipse.getAttribute('ry'));
    
    // Verify the ellipse has been zoomed in (dimensions increased)
    expect(newRx).toBeGreaterThan(originalRx);
    expect(newRy).toBeGreaterThan(originalRy);
  });

  test('should be able to zoom a line using touch events', async ({ page }) => {
    // First draw a line
    await page.locator('.shape > .line').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Draw a line using mouse events
    await page.mouse.move(canvasBoundingBox.x + 100, canvasBoundingBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 200, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Verify line was created
    const line = page.locator('.canvas line');
    await expect(line).toBeVisible();
    
    // Get original line coordinates
    const originalX1 = parseFloat(await line.getAttribute('x1'));
    const originalY1 = parseFloat(await line.getAttribute('y1'));
    const originalX2 = parseFloat(await line.getAttribute('x2'));
    const originalY2 = parseFloat(await line.getAttribute('y2'));
    
    // Calculate original line length
    const originalLength = Math.sqrt(
      Math.pow(originalX2 - originalX1, 2) + 
      Math.pow(originalY2 - originalY1, 2)
    );
    
    // Click zoom label
    await page.locator('.operation > .zoom').click();
    
    // Simulate touch events to zoom the line
    await page.evaluate(async () => {
      const canvas = document.querySelector('.canvas');
      const line = document.querySelector('.canvas line');
      
      // Get line center
      const x1 = parseFloat(line.getAttribute('x1'));
      const y1 = parseFloat(line.getAttribute('y1'));
      const x2 = parseFloat(line.getAttribute('x2'));
      const y2 = parseFloat(line.getAttribute('y2'));
      const centerX = (x1 + x2) / 2;
      const centerY = (y1 + y2) / 2;
      
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
      
      // Create touchmove event to zoom in (move outward)
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: centerX + 100, // 100px to the right of center
          clientY: centerY
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
    });
    
    // Wait for the zoom to complete
    await page.waitForTimeout(500);
    
    // Get new line coordinates
    const newX1 = parseFloat(await line.getAttribute('x1'));
    const newY1 = parseFloat(await line.getAttribute('y1'));
    const newX2 = parseFloat(await line.getAttribute('x2'));
    const newY2 = parseFloat(await line.getAttribute('y2'));
    
    // Calculate new line length
    const newLength = Math.sqrt(
      Math.pow(newX2 - newX1, 2) + 
      Math.pow(newY2 - newY1, 2)
    );
    
    // Verify the line has been zoomed in (length increased)
    expect(newLength).toBeGreaterThan(originalLength);
  });

  test('should be able to zoom out (shrink) a shape using touch events', async ({ page }) => {
    // First draw a rectangle
    await page.locator('.shape > .rect').click();
    
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    // Draw a large rectangle using mouse events
    await page.mouse.move(canvasBoundingBox.x + 100, canvasBoundingBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 300, canvasBoundingBox.y + 300);
    await page.mouse.up();
    
    // Verify rectangle was created
    const rect = page.locator('.canvas rect');
    await expect(rect).toBeVisible();
    
    // Get original rectangle dimensions
    const originalWidth = parseFloat(await rect.getAttribute('width'));
    const originalHeight = parseFloat(await rect.getAttribute('height'));
    
    // Click zoom label
    await page.locator('.operation > .zoom').click();
    
    // Simulate touch events to zoom out the rectangle
    await page.evaluate(async () => {
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
          clientX: centerX + 100, // 100px to the right of center
          clientY: centerY
        })]
      });
      
      // Create touchmove event to zoom out (move inward)
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: centerX + 50, // 50px to the right of center
          clientY: centerY
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
    });
    
    // Wait for the zoom to complete
    await page.waitForTimeout(500);
    
    // Get new rectangle dimensions
    const newWidth = parseFloat(await rect.getAttribute('width'));
    const newHeight = parseFloat(await rect.getAttribute('height'));
    
    // Verify the rectangle has been zoomed out (dimensions decreased)
    expect(newWidth).toBeLessThan(originalWidth);
    expect(newHeight).toBeLessThan(originalHeight);
  });

  test('should only zoom the selected shape when multiple shapes exist using touch events', async ({ page }) => {
    // Draw a rectangle
    await page.locator('.shape > .rect').click();
    const canvas = page.locator('.canvas');
    const canvasBoundingBox = await canvas.boundingBox();
    
    await page.mouse.move(canvasBoundingBox.x + 50, canvasBoundingBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 150, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Draw an ellipse
    await page.locator('.shape > .ellipse').click();
    await page.mouse.move(canvasBoundingBox.x + 200, canvasBoundingBox.y + 50);
    await page.mouse.down();
    await page.mouse.move(canvasBoundingBox.x + 300, canvasBoundingBox.y + 150);
    await page.mouse.up();
    
    // Verify both shapes exist
    const rect = page.locator('.canvas rect');
    const ellipse = page.locator('.canvas ellipse');
    await expect(rect).toBeVisible();
    await expect(ellipse).toBeVisible();
    
    // Get original dimensions
    const originalRectWidth = parseFloat(await rect.getAttribute('width'));
    const originalRectHeight = parseFloat(await rect.getAttribute('height'));
    const originalEllipseRx = parseFloat(await ellipse.getAttribute('rx'));
    const originalEllipseRy = parseFloat(await ellipse.getAttribute('ry'));
    
    // Click zoom label
    await page.locator('.operation > .zoom').click();
    
    // Simulate touch events to zoom only the rectangle
    await page.evaluate(async () => {
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
      
      // Create touchmove event to zoom in (move outward)
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: centerX + 100, // 100px to the right of center
          clientY: centerY
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
    });
    
    // Wait for the zoom to complete
    await page.waitForTimeout(500);
    
    // Get new dimensions
    const newRectWidth = parseFloat(await rect.getAttribute('width'));
    const newRectHeight = parseFloat(await rect.getAttribute('height'));
    const newEllipseRx = parseFloat(await ellipse.getAttribute('rx'));
    const newEllipseRy = parseFloat(await ellipse.getAttribute('ry'));
    
    // Verify only the rectangle was zoomed
    expect(newRectWidth).toBeGreaterThan(originalRectWidth);
    expect(newRectHeight).toBeGreaterThan(originalRectHeight);
    expect(newEllipseRx).toEqual(originalEllipseRx);
    expect(newEllipseRy).toEqual(originalEllipseRy);
  });
});