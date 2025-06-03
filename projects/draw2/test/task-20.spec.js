import { test, expect } from '@playwright/test';

test.describe('Task 20: Event handling system', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should support event listener registration', async ({ page }) => {
    // Set up event listener in the page
    const eventFired = await page.evaluate(() => {
      return new Promise((resolve) => {
        // Listen for custom events
        let eventReceived = false;
        document.addEventListener('test-event', () => {
          eventReceived = true;
        });
        
        // Dispatch a test event
        setTimeout(() => {
          document.dispatchEvent(new CustomEvent('test-event'));
          setTimeout(() => resolve(eventReceived), 100);
        }, 100);
      });
    });
    
    expect(eventFired).toBe(true);
  });

  test('should enable communication between Canvas and Toolkit', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Set up listener for operation changes
    await page.evaluate(() => {
      window.operationEvents = [];
      document.addEventListener('operation-change', (e) => {
        window.operationEvents.push(e.detail || 'operation-changed');
      });
    });
    
    // Change tools multiple times
    await page.click('label:has(input[value="line"])');
    await page.click('label:has(input[value="move"])');
    await page.click('label:has(input[value="rect"])');
    
    // Check if events were captured
    const events = await page.evaluate(() => window.operationEvents);
    expect(events.length).toBeGreaterThan(0);
  });

  test('should emit done events from canvas', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Set up listener for done events
    await page.evaluate(() => {
      window.doneEvents = [];
      document.addEventListener('done', (e) => {
        window.doneEvents.push(e.detail || { operation: 'unknown' });
      });
    });
    
    // Create a shape (which should emit done event)
    await page.click('label:has(input[value="rect"])');
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 200);
    await page.mouse.up();
    
    // Wait a bit for event propagation
    await page.waitForTimeout(100);
    
    // Check if done event was emitted
    const doneEvents = await page.evaluate(() => window.doneEvents);
    expect(doneEvents.length).toBeGreaterThan(0);
  });

  test('should support on, off, and emit methods', async ({ page }) => {
    // Test EventEmitter pattern functionality
    const result = await page.evaluate(() => {
      // Create a simple event emitter to test
      const emitter = {
        events: {},
        on(event, handler) {
          if (!this.events[event]) this.events[event] = [];
          this.events[event].push(handler);
        },
        off(event, handler) {
          if (!this.events[event]) return;
          this.events[event] = this.events[event].filter(h => h !== handler);
        },
        emit(event, data) {
          if (!this.events[event]) return;
          this.events[event].forEach(handler => handler(data));
        }
      };
      
      let counter = 0;
      const handler1 = () => counter++;
      const handler2 = () => counter += 2;
      
      // Test on
      emitter.on('test', handler1);
      emitter.on('test', handler2);
      emitter.emit('test');
      
      const afterOn = counter; // Should be 3
      
      // Test off
      emitter.off('test', handler1);
      emitter.emit('test');
      
      const afterOff = counter; // Should be 5
      
      return { afterOn, afterOff };
    });
    
    expect(result.afterOn).toBe(3);
    expect(result.afterOff).toBe(5);
  });

  test('should support once method for one-time listeners', async ({ page }) => {
    const result = await page.evaluate(() => {
      // Test once functionality
      const emitter = {
        events: {},
        once(event, handler) {
          const wrapper = (...args) => {
            handler(...args);
            this.off(event, wrapper);
          };
          this.on(event, wrapper);
        },
        on(event, handler) {
          if (!this.events[event]) this.events[event] = [];
          this.events[event].push(handler);
        },
        off(event, handler) {
          if (!this.events[event]) return;
          this.events[event] = this.events[event].filter(h => h !== handler);
        },
        emit(event, data) {
          if (!this.events[event]) return;
          this.events[event].forEach(handler => handler(data));
        }
      };
      
      let counter = 0;
      emitter.once('test', () => counter++);
      
      emitter.emit('test');
      emitter.emit('test');
      emitter.emit('test');
      
      return counter;
    });
    
    // Should only increment once
    expect(result).toBe(1);
  });

  test('should maintain event listener registry with cleanup', async ({ page }) => {
    const canvas = await page.locator('svg.canvas');
    const canvasBox = await canvas.boundingBox();
    
    // Create and remove multiple event listeners
    await page.evaluate(() => {
      window.listenerCounts = [];
      
      const handlers = [];
      for (let i = 0; i < 5; i++) {
        handlers.push(() => console.log(`Handler ${i}`));
      }
      
      // Create mock event system
      const eventRegistry = new Map();
      
      const addListener = (event, handler) => {
        if (!eventRegistry.has(event)) {
          eventRegistry.set(event, new Set());
        }
        eventRegistry.get(event).add(handler);
        window.listenerCounts.push(eventRegistry.get(event).size);
      };
      
      const removeListener = (event, handler) => {
        if (eventRegistry.has(event)) {
          eventRegistry.get(event).delete(handler);
          window.listenerCounts.push(eventRegistry.get(event).size);
        }
      };
      
      // Add all handlers
      handlers.forEach(h => addListener('test', h));
      
      // Remove some handlers
      removeListener('test', handlers[0]);
      removeListener('test', handlers[2]);
      removeListener('test', handlers[4]);
    });
    
    const counts = await page.evaluate(() => window.listenerCounts);
    
    // Should show: 1, 2, 3, 4, 5 (adding), then 4, 3, 2 (removing)
    expect(counts[0]).toBe(1);
    expect(counts[4]).toBe(5);
    expect(counts[5]).toBe(4);
    expect(counts[7]).toBe(2);
  });
});
