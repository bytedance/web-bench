const { test, expect } = require('@playwright/test');

test.describe('Task 13: Interactive click history panel', () => {
  test('should have clicks panel with proper structure', async ({ page }) => {
    await page.goto('/index.html');
    
    const clicksPanel = page.locator('.clicks-panel');
    await expect(clicksPanel).toBeVisible();
    
    const clicksLabel = clicksPanel.locator('span').first();
    const clicksHistory = page.locator('.clicks-history');
    
    // Check history label
    const labelText = await clicksLabel.textContent();
    expect(labelText).toBe('History');
    
    // Check history container exists
    await expect(clicksHistory).toBeVisible();
    
    const historyStyles = await clicksHistory.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        fontFamily: computed.fontFamily,
        display: computed.display,
        gap: computed.gap,
        justifyContent: computed.justifyContent
      };
    });
    
    expect(historyStyles.fontFamily).toContain('monospace');
    expect(historyStyles.display).toBe('flex');
    expect(historyStyles.gap).toBe('8px');
    expect(historyStyles.justifyContent).toBe('flex-end');
  });

  test('should display recent button clicks in history', async ({ page }) => {
    await page.goto('/index.html');
    
    const clicksHistory = page.locator('.clicks-history');
    const numberButton = page.locator('button:has-text("7")');
    const operatorButton = page.locator('button:has-text("+")');
    
    // Click some buttons
    await numberButton.click();
    await operatorButton.click();
    
    // Check that history items appear
    const historyItems = clicksHistory.locator('.history-item');
    const historyCount = await historyItems.count();
    
    expect(historyCount).toBeGreaterThan(0);
    
    // Check that recent clicks are displayed
    const firstItem = historyItems.first();
    const firstItemText = await firstItem.textContent();
    expect(firstItemText).toBe('+'); // Most recent should be first
  });

  test('should make history items clickable for re-execution', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    const clicksHistory = page.locator('.clicks-history');
    const numberButton = page.locator('button:has-text("3")');
    const clearButton = page.locator('button:has-text("Clear")');
    
    // Click a number button
    await numberButton.click();
    
    // Clear the display
    await clearButton.click();
    
    // Click on the history item to re-execute
    const historyItems = clicksHistory.locator('.history-item');
    const numberHistoryItem = historyItems.locator('text="3"').first();
    await numberHistoryItem.click();
    
    // Check that the number appeared in display again
    const displayValue = await display.inputValue();
    expect(displayValue).toContain('3');
  });
});
