// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 20 Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should be able to move a rectangle using touch events', async ({ page }) => {
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
      
      // Create touchstart event at the center of the rectangle
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
      
      // Create touchmove event to move the rectangle
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: centerX + 50, // Move 50px to the right
          clientY: centerY + 50  // Move 50px down
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
    
    // Wait for the move to complete
    await page.waitForTimeout(500);
    
    // Get new rectangle position
    const newX = parseFloat(await rect.getAttribute('x'));
    const newY = parseFloat(await rect.getAttribute('y'));
    
    // Verify the rectangle has moved
    expect(newX).toBeGreaterThan(originalX);
    expect(newY).toBeGreaterThan(originalY);
  });

  test('should be able to move an ellipse using touch events', async ({ page }) => {
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
    
    // Get original ellipse position
    const originalCx = parseFloat(await ellipse.getAttribute('cx'));
    const originalCy = parseFloat(await ellipse.getAttribute('cy'));
    
    // Click move label
    await page.locator('.operation > .move').click();
    
    // Simulate touch events to move the ellipse
    await page.evaluate(async () => {
      const canvas = document.querySelector('.canvas');
      const ellipse = document.querySelector('.canvas ellipse');
      
      // Get ellipse center
      const cx = parseFloat(ellipse.getAttribute('cx'));
      const cy = parseFloat(ellipse.getAttribute('cy'));
      
      // Create touchstart event at the center of the ellipse
      const touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: cx,
          clientY: cy
        })]
      });
      
      // Create touchmove event to move the ellipse
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: cx + 50, // Move 50px to the right
          clientY: cy + 50  // Move 50px down
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
    
    // Wait for the move to complete
    await page.waitForTimeout(500);
    
    // Get new ellipse position
    const newCx = parseFloat(await ellipse.getAttribute('cx'));
    const newCy = parseFloat(await ellipse.getAttribute('cy'));
    
    // Verify the ellipse has moved
    expect(newCx).toBeGreaterThan(originalCx);
    expect(newCy).toBeGreaterThan(originalCy);
  });

  test('should be able to move a line using touch events', async ({ page }) => {
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
    
    // Click move label
    await page.locator('.operation > .move').click();
    
    // Simulate touch events to move the line
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
      
      // Create touchstart event at the center of the line
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
      
      // Create touchmove event to move the line
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: centerX + 50, // Move 50px to the right
          clientY: centerY + 50  // Move 50px down
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
    
    // Wait for the move to complete
    await page.waitForTimeout(500);
    
    // Get new line coordinates
    const newX1 = parseFloat(await line.getAttribute('x1'));
    const newY1 = parseFloat(await line.getAttribute('y1'));
    const newX2 = parseFloat(await line.getAttribute('x2'));
    const newY2 = parseFloat(await line.getAttribute('y2'));
    
    // Verify the line has moved
    expect(newX1).toBeGreaterThan(originalX1);
    expect(newY1).toBeGreaterThan(originalY1);
    expect(newX2).toBeGreaterThan(originalX2);
    expect(newY2).toBeGreaterThan(originalY2);
  });

  test('should support multiple touch moves in sequence', async ({ page }) => {
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
    
    // Simulate touch events to move the rectangle multiple times
    await page.evaluate(async () => {
      const canvas = document.querySelector('.canvas');
      const rect = document.querySelector('.canvas rect');
      
      // First move
      // Get rectangle center
      let rectX = parseFloat(rect.getAttribute('x'));
      let rectY = parseFloat(rect.getAttribute('y'));
      let rectWidth = parseFloat(rect.getAttribute('width'));
      let rectHeight = parseFloat(rect.getAttribute('height'));
      let centerX = rectX + rectWidth / 2;
      let centerY = rectY + rectHeight / 2;
      
      // Create touchstart event at the center of the rectangle
      let touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: centerX,
          clientY: centerY
        })]
      });
      
      // Create touchmove event to move the rectangle
      let touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: centerX + 30, // Move 30px to the right
          clientY: centerY + 30  // Move 30px down
        })]
      });
      
      // Create touchend event
      let touchEndEvent = new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
        touches: []
      });
      
      // Dispatch events for first move
      canvas.dispatchEvent(touchStartEvent);
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      canvas.dispatchEvent(touchMoveEvent);
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      canvas.dispatchEvent(touchEndEvent);
      
      // Wait before second move
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Second move
      // Get updated rectangle center
      rectX = parseFloat(rect.getAttribute('x'));
      rectY = parseFloat(rect.getAttribute('y'));
      rectWidth = parseFloat(rect.getAttribute('width'));
      rectHeight = parseFloat(rect.getAttribute('height'));
      centerX = rectX + rectWidth / 2;
      centerY = rectY + rectHeight / 2;
      
      // Create touchstart event at the new center of the rectangle
      touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: centerX,
          clientY: centerY
        })]
      });
      
      // Create touchmove event to move the rectangle again
      touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: centerX + 30, // Move another 30px to the right
          clientY: centerY + 30  // Move another 30px down
        })]
      });
      
      // Create touchend event
      touchEndEvent = new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
        touches: []
      });
      
      // Dispatch events for second move
      canvas.dispatchEvent(touchStartEvent);
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      canvas.dispatchEvent(touchMoveEvent);
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      canvas.dispatchEvent(touchEndEvent);
    });
    
    // Wait for the moves to complete
    await page.waitForTimeout(800);
    
    // Get new rectangle position
    const newX = parseFloat(await rect.getAttribute('x'));
    const newY = parseFloat(await rect.getAttribute('y'));
    
    // Verify the rectangle has moved significantly (more than a single move would achieve)
    expect(newX).toBeGreaterThan(originalX + 40); // Should have moved at least 40px to the right
    expect(newY).toBeGreaterThan(originalY + 40); // Should have moved at least 40px down
  });

  test('should only move the selected shape when multiple shapes exist using touch events', async ({ page }) => {
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
    
    // Get original positions
    const originalRectX = parseFloat(await rect.getAttribute('x'));
    const originalRectY = parseFloat(await rect.getAttribute('y'));
    const originalEllipseCx = parseFloat(await ellipse.getAttribute('cx'));
    const originalEllipseCy = parseFloat(await ellipse.getAttribute('cy'));
    
    // Click move label
    await page.locator('.operation > .move').click();
    
    // Simulate touch events to move only the rectangle
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
      
      // Create touchstart event at the center of the rectangle
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
      
      // Create touchmove event to move the rectangle
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: centerX + 50, // Move 50px to the right
          clientY: centerY + 50  // Move 50px down
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
    
    // Wait for the move to complete
    await page.waitForTimeout(500);
    
    // Get new positions
    const newRectX = parseFloat(await rect.getAttribute('x'));
    const newRectY = parseFloat(await rect.getAttribute('y'));
    const newEllipseCx = parseFloat(await ellipse.getAttribute('cx'));
    const newEllipseCy = parseFloat(await ellipse.getAttribute('cy'));
    
    // Verify only the rectangle was moved
    expect(newRectX).toBeGreaterThan(originalRectX);
    expect(newRectY).toBeGreaterThan(originalRectY);
    expect(newEllipseCx).toEqual(originalEllipseCx);
    expect(newEllipseCy).toEqual(originalEllipseCy);
  });
});