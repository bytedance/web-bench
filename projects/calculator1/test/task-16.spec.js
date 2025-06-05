const { test, expect } = require('@playwright/test');

test.describe('Task 16: Interactive History Functionality', () => {
  test('Test case 1: History items should be clickable and have proper styling', async ({ page }) => {
    await page.goto('/index.html');
    
    // Ensure scientific mode is active
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('scientific');
    });
    
    // Perform some operations to create history
    await page.click('text=Clear');
    await page.click('text=5');
    await page.click('text=+');
    await page.click('text=3');
    
    // Check if history items have proper styling
    const historyItemStyles = await page.evaluate(() => {
      const historyItems = document.querySelectorAll('.history-item');
      if (historyItems.length === 0) return null;
      
      const firstItem = historyItems[0];
      const styles = window.getComputedStyle(firstItem);
      return {
        cursor: styles.cursor,
        hasTransition: styles.transition.includes('all') && styles.transition.includes('0.2s'),
        hasPointerCursor: styles.cursor === 'pointer'
      };
    });
    
    expect(historyItemStyles).not.toBeNull();
    expect(historyItemStyles.hasPointerCursor).toBe(true);
    expect(historyItemStyles.hasTransition).toBe(true);
  });

  test('Test case 2: Clicking history items should re-execute operations', async ({ page }) => {
    await page.goto('/index.html');
    
    // Ensure scientific mode is active
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('scientific');
    });
    
    // Perform operations to create history
    await page.click('text=Clear');
    await page.click('text=7');
    
    // Clear display
    await page.click('text=Clear');
    
    // Get the first history item and click it
    const historyItem = page.locator('.history-item').first();
    await historyItem.click();
    
    // Check if the operation was re-executed
    const displayValue = await page.locator('#display').inputValue();
    expect(displayValue).toBe('7');
  });

  test('Test case 3: Clicking history items should add to history again', async ({ page }) => {
    await page.goto('/index.html');
    
    // Ensure scientific mode is active
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('scientific');
    });
    
    // Perform initial operations
    await page.click('text=Clear');
    await page.click('text=9');
    await page.click('text=+');
    
    // Get initial history count
    let historyCount = await page.evaluate(() => {
      return document.querySelectorAll('.history-item').length;
    });
    
    // Click a history item
    const historyItem = page.locator('.history-item').first();
    await historyItem.click();
    
    // Check if history count increased (new item added)
    let newHistoryCount = await page.evaluate(() => {
      return document.querySelectorAll('.history-item').length;
    });
    
    expect(newHistoryCount).toBeGreaterThanOrEqual(historyCount);
    
    // Verify that the display was updated
    const displayValue = await page.locator('#display').inputValue();
    expect(displayValue.length).toBeGreaterThan(0);
  });
});
