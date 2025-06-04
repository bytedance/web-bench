const { test, expect } = require('@playwright/test');

test.describe('Task 20: Interactive click history system', () => {
  test('should maintain array of recent button clicks with maximum 5 items', async ({ page }) => {
    await page.goto('/index.html');
    
    const clicksHistory = page.locator('.clicks-history');
    
    // Click 7 different buttons
    const buttons = ['1', '2', '3', '4', '5', '6', '7'];
    
    for (const buttonText of buttons) {
      await page.locator(`button:has-text("${buttonText}")`).click();
    }
    
    // Check that only 5 items are displayed (maximum)
    const historyItems = clicksHistory.locator('.history-item');
    const itemCount = await historyItems.count();
    
    expect(itemCount).toBeLessThanOrEqual(5);
  });

  test('should display history items in reverse chronological order', async ({ page }) => {
    await page.goto('/index.html');
    
    const clicksHistory = page.locator('.clicks-history');
    const clearButton = page.locator('button:has-text("Clear")');
    
    // Clear any existing history
    await clearButton.click();
    
    // Click buttons in sequence: 1, 2, 3
    await page.locator('button:has-text("1")').click();
    await page.locator('button:has-text("2")').click();
    await page.locator('button:has-text("3")').click();
    
    // Check that most recent click (3) appears first
    const historyItems = clicksHistory.locator('.history-item');
    const firstItem = historyItems.first();
    const firstItemText = await firstItem.textContent();
    
    expect(firstItemText).toBe('3');
  });

  test('should enable click-to-repeat functionality for history items', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    const clicksHistory = page.locator('.clicks-history');
    const clearButton = page.locator('button:has-text("Clear")');
    
    // Click a number button
    await page.locator('button:has-text("8")').click();
    
    // Clear the display
    await clearButton.click();
    
    // Find and click the "8" in history
    const historyItems = clicksHistory.locator('.history-item');
    const eightInHistory = historyItems.locator('text="8"').first();
    
    await eightInHistory.click();
    
    // Check that "8" appears in display again
    const displayValue = await display.inputValue();
    expect(displayValue).toContain('8');
  });

  test('should have proper styling with hover effects for history items', async ({ page }) => {
    await page.goto('/index.html');
    
    const clicksHistory = page.locator('.clicks-history');
    
    // Click a button to create history
    await page.locator('button:has-text("5")').click();
    
    // Check history item styling
    const historyItem = clicksHistory.locator('.history-item').first();
    
    const styles = await historyItem.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        cursor: computed.cursor,
        padding: computed.padding,
        borderRadius: computed.borderRadius,
        transition: computed.transition
      };
    });
    
    expect(styles.cursor).toBe('pointer');
    expect(styles.transition).toContain('all');
    
    // Test hover effect
    await historyItem.hover();
    await page.waitForTimeout(100);
    
    const hoverBg = await historyItem.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Should have some background color on hover
    expect(hoverBg).not.toBe('rgba(0, 0, 0, 0)');
  });
});
