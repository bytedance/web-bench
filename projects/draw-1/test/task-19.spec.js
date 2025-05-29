// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 19 Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should be able to rotate a rectangle using touch events', async ({ page }) => {
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
    
    // Get original rectangle transform (might be none or empty)
    const originalTransform = await rect.getAttribute('transform') || '';
    
    // Click rotate label
    await page.locator('.operation > .rotate').click();
    
    // Simulate touch events to rotate the rectangle
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

  test('should be able to rotate an ellipse using touch events', async ({ page }) => {
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
    
    // Get original ellipse transform (might be none or empty)
    const originalTransform = await ellipse.getAttribute('transform') || '';
    
    // Click rotate label
    await page.locator('.operation > .rotate').click();
    
    // Simulate touch events to rotate the ellipse
    await page.evaluate(async () => {
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
      
      // Create touchmove event in a circular motion
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: cx, // Move to the top of center
          clientY: cy - 50
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
    
    // Wait for the rotation to complete
    await page.waitForTimeout(500);
    
    // Get new ellipse transform
    const newTransform = await ellipse.getAttribute('transform');
    
    // Verify the ellipse has been rotated
    expect(newTransform).toBeTruthy();
    expect(newTransform).not.toEqual(originalTransform);
    expect(newTransform.includes('rotate')).toBe(true);
  });

  test('should be able to rotate a line using touch events', async ({ page }) => {
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
    
    // Get original line transform (might be none or empty)
    const originalTransform = await line.getAttribute('transform') || '';
    
    // Click rotate label
    await page.locator('.operation > .rotate').click();
    
    // Simulate touch events to rotate the line
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
    });
    
    // Wait for the rotation to complete
    await page.waitForTimeout(500);
    
    // Get new line transform
    const newTransform = await line.getAttribute('transform');
    
    // Verify the line has been rotated
    expect(newTransform).toBeTruthy();
    expect(newTransform).not.toEqual(originalTransform);
    expect(newTransform.includes('rotate')).toBe(true);
  });

  test('should rotate shape around its center when using touch events', async ({ page }) => {
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
    
    // Get original rectangle position and dimensions
    const originalX = parseFloat(await rect.getAttribute('x'));
    const originalY = parseFloat(await rect.getAttribute('y'));
    const width = parseFloat(await rect.getAttribute('width'));
    const height = parseFloat(await rect.getAttribute('height'));
    
    // Calculate center of rectangle
    const centerX = originalX + width / 2;
    const centerY = originalY + height / 2;
    
    // Click rotate label
    await page.locator('.operation > .rotate').click();
    
    // Simulate touch events to rotate the rectangle
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
    });
    
    // Wait for the rotation to complete
    await page.waitForTimeout(500);
    
    // Get new transform
    const transform = await rect.getAttribute('transform');
    
    // The transform should include the center coordinates
    // Format is typically: rotate(angle, centerX, centerY)
    expect(transform).toContain(`${centerX.toFixed(0)}`);
    expect(transform).toContain(`${centerY.toFixed(0)}`);
  });

  test('should only rotate the selected shape when multiple shapes exist using touch events', async ({ page }) => {
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
    
    // Get original transforms
    const originalRectTransform = await rect.getAttribute('transform') || '';
    const originalEllipseTransform = await ellipse.getAttribute('transform') || '';
    
    // Click rotate label
    await page.locator('.operation > .rotate').click();
    
    // Simulate touch events to rotate only the rectangle
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
    });
    
    // Wait for the rotation to complete
    await page.waitForTimeout(500);
    
    // Get new transforms
    const newRectTransform = await rect.getAttribute('transform');
    const newEllipseTransform = await ellipse.getAttribute('transform') || '';
    
    // Verify only the rectangle was rotated
    expect(newRectTransform).toBeTruthy();
    expect(newRectTransform).not.toEqual(originalRectTransform);
    expect(newEllipseTransform).toEqual(originalEllipseTransform);
  });
});