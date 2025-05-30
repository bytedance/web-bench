// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { test, expect } from '@playwright/test';

test.describe('Task 19: Enhanced Event Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // Helper function to create a rectangle
  async function createRect(page) {
    // Select rectangle tool
    await page.click('.rect');
    
    // Draw a rectangle
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await page.mouse.up();
    
    // Return the created rectangle element
    return page.locator('rect');
  }

  test('should handle mouse events for drawing a rectangle', async ({ page }) => {
    // Select rectangle tool
    await page.click('.rect');
    
    // Create a rectangle and verify it exists
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await page.mouse.up();
    
    const rect = page.locator('rect');
    await expect(rect).toBeVisible();
    
    // Verify rectangle dimensions
    const x = await rect.getAttribute('x');
    const y = await rect.getAttribute('y');
    const width = await rect.getAttribute('width');
    const height = await rect.getAttribute('height');
    
    expect(parseFloat(x)).toBeCloseTo(100);
    expect(parseFloat(y)).toBeCloseTo(100);
    expect(parseFloat(width)).toBeCloseTo(100);
    expect(parseFloat(height)).toBeCloseTo(100);
  });

  test('should handle touch events for drawing a rectangle', async ({ page }) => {
    // Select rectangle tool
    await page.click('.rect');
    
    // Simulate touch events to create a rectangle
    await page.evaluate(() => {
      const canvas = document.querySelector('.canvas');
      const rect = canvas.getBoundingClientRect();
      
      // Create touch start event
      const touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: 100,
          clientY: 100,
          pageX: 100,
          pageY: 100
        })]
      });
      
      // Create touch move event
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: 200,
          clientY: 200,
          pageX: 200,
          pageY: 200
        })]
      });
      
      // Create touch end event
      const touchEndEvent = new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
        touches: [],
        changedTouches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: 200,
          clientY: 200,
          pageX: 200,
          pageY: 200
        })]
      });
      
      // Dispatch events
      canvas.dispatchEvent(touchStartEvent);
      canvas.dispatchEvent(touchMoveEvent);
      canvas.dispatchEvent(touchEndEvent);
    });
    
    // Wait for the rectangle to be created
    await page.waitForTimeout(100);
    
    // Verify rectangle exists and has correct dimensions
    const rect = page.locator('rect');
    await expect(rect).toBeVisible();
    
    // Verify rectangle dimensions
    const x = await rect.getAttribute('x');
    const y = await rect.getAttribute('y');
    const width = await rect.getAttribute('width');
    const height = await rect.getAttribute('height');
    
    expect(parseFloat(x)).toBeCloseTo(100);
    expect(parseFloat(y)).toBeCloseTo(100);
    expect(parseFloat(width)).toBeCloseTo(100);
    expect(parseFloat(height)).toBeCloseTo(100);
  });

  test('should handle mouse events for moving a shape', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    await expect(rect).toBeVisible();
    
    // Get initial transform
    const initialTransform = await rect.getAttribute('style');
    
    // Select move tool
    await page.click('.move');
    
    // Move the rectangle
    await page.mouse.move(150, 150); // Center of rectangle
    await page.mouse.down();
    await page.mouse.move(250, 250); // Move 100px right and down
    await page.mouse.up();
    
    // Get new transform
    const newTransform = await rect.getAttribute('style');
    
    // Verify transform has changed
    expect(newTransform).not.toEqual(initialTransform);
    
    // Verify transform contains translate
    expect(newTransform).toContain('translate(100px, 100px)');
  });

  test('should handle touch events for moving a shape', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    await expect(rect).toBeVisible();
    
    // Get initial transform
    const initialTransform = await rect.getAttribute('style');
    
    // Select move tool
    await page.click('.move');
    
    // Simulate touch events to move the rectangle
    await page.evaluate(() => {
      const canvas = document.querySelector('.canvas');
      const rect = document.querySelector('rect');
      
      // Create touch start event
      const touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: 150,
          clientY: 150,
          pageX: 150,
          pageY: 150
        })]
      });
      
      // Create touch move event
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: 250,
          clientY: 250,
          pageX: 250,
          pageY: 250
        })]
      });
      
      // Create touch end event
      const touchEndEvent = new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
        touches: [],
        changedTouches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: 250,
          clientY: 250,
          pageX: 250,
          pageY: 250
        })]
      });
      
      // Dispatch events
      canvas.dispatchEvent(touchStartEvent);
      canvas.dispatchEvent(touchMoveEvent);
      canvas.dispatchEvent(touchEndEvent);
    });
    
    // Wait for the move to complete
    await page.waitForTimeout(100);
    
    // Get new transform
    const newTransform = await rect.getAttribute('style');
    
    // Verify transform has changed
    expect(newTransform).not.toEqual(initialTransform);
    
    // Verify transform contains translate
    expect(newTransform).toContain('translate(100px, 100px)');
  });

  test('should handle multi-touch events for zooming a shape', async ({ page }) => {
    // Create a rectangle
    const rect = await createRect(page);
    await expect(rect).toBeVisible();
    
    // Select zoom tool
    await page.click('.zoom');
    
    // Simulate multi-touch events to zoom the rectangle
    await page.evaluate(() => {
      const canvas = document.querySelector('.canvas');
      const rect = document.querySelector('rect');
      
      // Create touch start event with two touches
      const touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [
          new Touch({
            identifier: 0,
            target: canvas,
            clientX: 130,
            clientY: 130,
            pageX: 130,
            pageY: 130
          }),
          new Touch({
            identifier: 1,
            target: canvas,
            clientX: 170,
            clientY: 170,
            pageX: 170,
            pageY: 170
          })
        ]
      });
      
      // Create touch move event with two touches moved further apart
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [
          new Touch({
            identifier: 0,
            target: canvas,
            clientX: 110,
            clientY: 110,
            pageX: 110,
            pageY: 110
          }),
          new Touch({
            identifier: 1,
            target: canvas,
            clientX: 190,
            clientY: 190,
            pageX: 190,
            pageY: 190
          })
        ]
      });
      
      // Create touch end event
      const touchEndEvent = new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
        touches: [],
        changedTouches: [
          new Touch({
            identifier: 0,
            target: canvas,
            clientX: 110,
            clientY: 110,
            pageX: 110,
            pageY: 110
          }),
          new Touch({
            identifier: 1,
            target: canvas,
            clientX: 190,
            clientY: 190,
            pageX: 190,
            pageY: 190
          })
        ]
      });
      
      // Dispatch events
      canvas.dispatchEvent(touchStartEvent);
      canvas.dispatchEvent(touchMoveEvent);
      canvas.dispatchEvent(touchEndEvent);
    });
    
    // Wait for the zoom to complete
    await page.waitForTimeout(100);
    
    // Get transform
    const transform = await rect.getAttribute('style');
    
    // Verify transform contains scale
    expect(transform).toContain('scale');
  });

  test('should handle keyboard events for tool switching', async ({ page }) => {
    // Initially select line tool
    await page.click('.line');
    
    // Verify line tool is selected
    const lineInput = page.locator('input[value="line"]');
    await expect(lineInput).toBeChecked();
    
    // Press spacebar to temporarily switch to move tool
    await page.keyboard.down(' ');
    
    // Verify canvas cursor is now move
    const canvas = page.locator('.canvas');
    const cursorStyle = await canvas.evaluate(el => {
      return window.getComputedStyle(el).cursor;
    });
    expect(cursorStyle).toBe('move');
    
    // Release spacebar to switch back to line tool
    await page.keyboard.up(' ');
    
    // Verify line tool is selected again
    await expect(lineInput).toBeChecked();
    
    // Verify canvas cursor is back to crosshair
    const cursorStyleAfter = await canvas.evaluate(el => {
      return window.getComputedStyle(el).cursor;
    });
    expect(cursorStyleAfter).toBe('crosshair');
  });

  test('should prevent default browser behavior for certain events', async ({ page }) => {
    // Create a flag to check if preventDefault was called
    await page.evaluate(() => {
      window.preventDefaultCalled = false;
      
      // Override preventDefault to set our flag
      const originalAddEventListener = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'touchmove' || type === 'touchstart') {
          const wrappedListener = function(event) {
            const originalPreventDefault = event.preventDefault;
            event.preventDefault = function() {
              window.preventDefaultCalled = true;
              return originalPreventDefault.apply(this, arguments);
            };
            return listener.apply(this, arguments);
          };
          return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
      };
    });
    
    // Select rectangle tool
    await page.click('.rect');
    
    // Simulate a touch event
    await page.evaluate(() => {
      const canvas = document.querySelector('.canvas');
      
      // Create and dispatch touch start event
      const touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [new Touch({
          identifier: 0,
          target: canvas,
          clientX: 100,
          clientY: 100,
          pageX: 100,
          pageY: 100
        })]
      });
      
      canvas.dispatchEvent(touchStartEvent);
    });
    
    // Check if preventDefault was called
    const preventDefaultCalled = await page.evaluate(() => window.preventDefaultCalled);
    expect(preventDefaultCalled).toBe(true);
  });

  test('should handle window resize events', async ({ page }) => {
    // Get initial canvas size
    const initialSize = await page.evaluate(() => {
      const canvas = document.querySelector('.canvas');
      return {
        width: canvas.clientWidth,
        height: canvas.clientHeight
      };
    });
    
    // Resize the viewport
    await page.setViewportSize({ width: 800, height: 600 });
    
    // Wait for resize event to be processed
    await page.waitForTimeout(100);
    
    // Get new canvas size
    const newSize = await page.evaluate(() => {
      const canvas = document.querySelector('.canvas');
      return {
        width: canvas.clientWidth,
        height: canvas.clientHeight
      };
    });
    
    // Verify canvas size has changed
    expect(newSize).not.toEqual(initialSize);
  });
});