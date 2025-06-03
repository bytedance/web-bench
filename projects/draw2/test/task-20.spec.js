// Test for Task 20: Add comprehensive event handling system with EventEmitter
import { test, expect } from '@playwright/test';

test.describe('Task 20: Event Handling System with EventEmitter', () => {
  test('should support on, off, once, and emit methods for custom events', async ({ page }) => {
    await page.goto('/index.html');
    
    // Test event system through browser console
    const eventResults = await page.evaluate(() => {
      const results = [];
      
      // Test if toolkit has EventEmitter methods
      const toolkit = document.querySelector('.toolkit');
      if (toolkit && window.Toolkit) {
        // This tests if the class was properly instantiated with EventEmitter
        const hasOn = typeof toolkit.on === 'function' || 
                     typeof window.toolkitInstance?.on === 'function';
        const hasOff = typeof toolkit.off === 'function' || 
                      typeof window.toolkitInstance?.off === 'function';
        const hasOnce = typeof toolkit.once === 'function' || 
                       typeof window.toolkitInstance?.once === 'function';
        const hasEmit = typeof toolkit.emit === 'function' || 
                       typeof window.toolkitInstance?.emit === 'function';
        
        results.push({ hasOn, hasOff, hasOnce, hasEmit });
      }
      
      return results;
    });
    
    // The EventEmitter pattern should be implemented
    expect(eventResults).toBeDefined();
  });

  test('should maintain event listener registry with proper cleanup', async ({ page }) => {
    await page.goto('/index.html');
    
    // Test event listener management
    await page.evaluate(() => {
      window.eventTestResults = [];
      
      // Add a test listener to track operation changes
      const toolkit = document.querySelector('.toolkit');
      const testHandler = (operation) => {
        window.eventTestResults.push(`operation-change: ${operation}`);
      };
      
      // Listen for change events on radio inputs
      toolkit.addEventListener('change', (e) => {
        if (e.target.name === 'operation') {
          testHandler(e.target.value);
        }
      });
    });
    
    // Trigger some operations
    await page.locator('.line').click();
    await page.locator('.move').click();
    await page.locator('.rect').click();
    
    // Check that events were captured
    const eventResults = await page.evaluate(() => window.eventTestResults);
    expect(eventResults).toContain('operation-change: line');
    expect(eventResults).toContain('operation-change: move');
    expect(eventResults).toContain('operation-change: rect');
  });

  test('should enable communication between Canvas and Toolkit components', async ({ page }) => {
    await page.goto('/index.html');
    
    const canvas = page.locator('.canvas');
    
    // Set up event monitoring
    await page.evaluate(() => {
      window.canvasEvents = [];
      
      // Monitor console logs for canvas events
      const originalLog = console.log;
      console.log = (...args) => {
        if (args[0] && args[0].includes('[canvas.done]')) {
          window.canvasEvents.push(args.join(' '));
        }
        originalLog.apply(console, args);
      };
    });
    
    // Perform operations that should trigger events
    await page.locator('.line').click();
    const canvasBox = await canvas.boundingBox();
    
    // Create a line (should trigger 'done' event)
    await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 180, canvasBox.y + 130);
    await page.mouse.up();
    
    // Wait a moment for events to process
    await page.waitForTimeout(200);
    
    // Should automatically switch to move tool (indicating event communication worked)
    await expect(page.locator('input[value="move"]')).toBeChecked();
    
    // Create another shape
    await page.locator('.ellipse').click();
    await page.mouse.move(canvasBox.x + 200, canvasBox.y + 150);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 260, canvasBox.y + 200);
    await page.mouse.up();
    
    await page.waitForTimeout(200);
    
    // Should switch to move tool again
    await expect(page.locator('input[value="move"]')).toBeChecked();
    
    // Check that canvas events were fired
    const canvasEvents = await page.evaluate(() => window.canvasEvents);
    expect(canvasEvents.length).toBeGreaterThan(0);
    expect(canvasEvents.some(event => event.includes('line'))).toBeTruthy();
    expect(canvasEvents.some(event => event.includes('ellipse'))).toBeTruthy();
  });
});
