const { test, expect } = require('@playwright/test');

test.describe('Task 14: Click History Tracking', () => {
  test('Test case 1: Click history should track button operations', async ({ page }) => {
    await page.goto('/index.html');
    
    // Ensure scientific mode is active to see history panel
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('scientific');
    });
    
    // Perform some operations
    await page.click('text=5');
    await page.click('text=+');
    await page.click('text=3');
    await page.click('text==');
    
    // Check if history panel has recorded the operations
    const historyItems = await page.evaluate(() => {
      const historyContainer = document.getElementById('clicks');
      const historyElements = historyContainer.querySelectorAll('.history-item');
      return Array.from(historyElements).map(item => item.textContent);
    });
    
    // History should contain the clicked operations (most recent first)
    expect(historyItems.length).toBeGreaterThan(0);
    expect(historyItems).toContain('=');
    expect(historyItems).toContain('3');
    expect(historyItems).toContain('+');
    expect(historyItems).toContain('5');
  });

  test('Test case 2: History should maintain maximum of 5 operations', async ({ page }) => {
    await page.goto('/index.html');
    
    // Ensure scientific mode is active
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('scientific');
    });
    
    // Perform more than 5 operations
    const operations = ['1', '2', '3', '4', '5', '6', '7'];
    for (const op of operations) {
      await page.click(`text=${op}`);
    }
    
    // Check that history contains maximum 5 items
    const historyCount = await page.evaluate(() => {
      const historyContainer = document.getElementById('clicks');
      const historyElements = historyContainer.querySelectorAll('.history-item');
      return historyElements.length;
    });
    
    expect(historyCount).toBeLessThanOrEqual(5);
  });

  test('Test case 3: History items should be displayed in reverse chronological order', async ({ page }) => {
    await page.goto('/index.html');
    
    // Ensure scientific mode is active
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('scientific');
    });
    
    // Clear any existing history by performing a clear operation
    await page.click('text=Clear');
    
    // Perform operations in sequence
    await page.click('text=1');
    await page.click('text=2');
    await page.click('text=3');
    
    // Get history items in order
    const historyItems = await page.evaluate(() => {
      const historyContainer = document.getElementById('clicks');
      const historyElements = historyContainer.querySelectorAll('.history-item');
      return Array.from(historyElements).map(item => item.textContent);
    });
    
    // Most recent operation (3) should be first in the history display
    expect(historyItems[0]).toBe('3');
    expect(historyItems[1]).toBe('2');
    expect(historyItems[2]).toBe('1');
  });
});
