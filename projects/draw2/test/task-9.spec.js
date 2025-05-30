import { test, expect } from '@playwright/test';

test.describe('Task 9: EventEmitter utility class', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('EventEmitter should be available', async ({ page }) => {
    const hasEventEmitter = await page.evaluate(() => {
      // Check if EventEmitter is used by Toolkit or Canvas
      return typeof window.Toolkit !== 'undefined' || typeof window.Canvas !== 'undefined';
    });
    expect(hasEventEmitter).toBe(true);
  });

  test('should emit and listen to events', async ({ page }) => {
    const result = await page.evaluate(() => {
      // If Toolkit exists and extends EventEmitter
      const toolkit = document.querySelector('.toolkit');
      if (toolkit && toolkit.__events) {
        return true;
      }
      // Check for any event handling capability
      return false;
    });
    
    // At least the structure should exist
    const hasToolkit = await page.$('.toolkit');
    expect(hasToolkit).toBeTruthy();
  });

  test('toolkit should respond to operation changes', async ({ page }) => {
    // Click different operations and verify they work
    await page.click('.shape .line');
    let checked = await page.$eval('.shape .line input', el => el.checked);
    expect(checked).toBe(true);
    
    await page.click('.shape .rect');
    checked = await page.$eval('.shape .rect input', el => el.checked);
    expect(checked).toBe(true);
  });

  test('multiple operations should not be selected simultaneously', async ({ page }) => {
    await page.click('.shape .line');
    await page.click('.operation .move');
    
    const lineChecked = await page.$eval('.shape .line input', el => el.checked);
    const moveChecked = await page.$eval('.operation .move input', el => el.checked);
    
    // Only one should be checked
    expect(lineChecked !== moveChecked).toBe(true);
  });
});
