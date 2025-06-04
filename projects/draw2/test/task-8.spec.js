const { test, expect } = require('@playwright/test');
const coverage = require('../../../libraries/test-util/src/coverage');test.afterEach(coverage);;
test.describe('Task 8: EventEmitter Utility Class', () => {
  test('should have EventEmitter class available and functional', async ({ page }) => {
    await page.goto('/index.html');
    
    // Test EventEmitter functionality through the browser
    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        import('./common/util.js').then(({ EventEmitter }) => {
          const emitter = new EventEmitter();
          let callCount = 0;
          let receivedData = null;
          
          // Test on() method
          emitter.on('test', (data) => {
            callCount++;
            receivedData = data;
          });
          
          // Test emit() method
          emitter.emit('test', 'hello');
          
          resolve({
            callCount,
            receivedData,
            hasOnMethod: typeof emitter.on === 'function',
            hasEmitMethod: typeof emitter.emit === 'function',
            hasOnceMethod: typeof emitter.once === 'function',
            hasOffMethod: typeof emitter.off === 'function'
          });
        });
      });
    });
    
    expect(result.hasOnMethod).toBe(true);
    expect(result.hasEmitMethod).toBe(true);
    expect(result.hasOnceMethod).toBe(true);
    expect(result.hasOffMethod).toBe(true);
    expect(result.callCount).toBe(1);
    expect(result.receivedData).toBe('hello');
  });

  test('should support once() method for single-time listeners', async ({ page }) => {
    await page.goto('/index.html');
    
    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        import('./common/util.js').then(({ EventEmitter }) => {
          const emitter = new EventEmitter();
          let callCount = 0;
          
          // Test once() method
          emitter.once('test', () => {
            callCount++;
          });
          
          // Emit multiple times
          emitter.emit('test');
          emitter.emit('test');
          emitter.emit('test');
          
          resolve({ callCount });
        });
      });
    });
    
    expect(result.callCount).toBe(1);
  });

  test('should support off() method for removing listeners', async ({ page }) => {
    await page.goto('/index.html');
    
    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        import('./common/util.js').then(({ EventEmitter }) => {
          const emitter = new EventEmitter();
          let callCount = 0;
          
          const listener = () => {
            callCount++;
          };
          
          // Add listener
          emitter.on('test', listener);
          emitter.emit('test'); // Should increment
          
          // Remove listener
          emitter.off('test', listener);
          emitter.emit('test'); // Should not increment
          
          resolve({ callCount });
        });
      });
    });
    
    expect(result.callCount).toBe(1);
  });
});
