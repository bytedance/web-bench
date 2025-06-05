const { test, expect } = require('@playwright/test');

test.describe('Task 16: Click history tracking', () => {
  test('Test case 1: History tracks button clicks correctly', async ({ page }) => {
    await page.goto('/index.html');
    
    const clicksDisplay = page.locator('#clicks');
    
    // Click a button and verify it appears in history
    await page.locator('.buttons button:has-text("7")').click();
    
    const historyItems = clicksDisplay.locator('.history-item');
    await expect(historyItems).toHaveCount(1);
    await expect(historyItems.first()).toHaveText('7');
  });

  test('Test case 2: New clicks are added to beginning of history', async ({ page }) => {
    await page.goto('/index.html');
    
    const clicksDisplay = page.locator('#clicks');
    
    // Click multiple buttons in sequence using nth-child to avoid conflicts
    await page.locator('.buttons button:nth-child(9)').click(); // "1"
    await page.locator('.buttons button:nth-child(10)').click(); // "2"
    await page.locator('.buttons button:has-text("3")').click();
    
    const historyItems = clicksDisplay.locator('.history-item');
    
    // Most recent click should be first
    await expect(historyItems.nth(0)).toHaveText('3');
    await expect(historyItems.nth(1)).toHaveText('2');
    await expect(historyItems.nth(2)).toHaveText('1');
  });

  test('Test case 3: History maintains maximum of 5 items', async ({ page }) => {
    await page.goto('/index.html');
    
    const clicksDisplay = page.locator('#clicks');
    
    // Click 7 buttons using nth-child for conflicting numbers
    await page.locator('.buttons button:nth-child(9)').click(); // "1"
    await page.locator('.buttons button:nth-child(10)').click(); // "2"
    await page.locator('.buttons button:has-text("3")').click();
    await page.locator('.buttons button:has-text("4")').click();
    await page.locator('.buttons button:has-text("5")').click();
    await page.locator('.buttons button:has-text("6")').click();
    await page.locator('.buttons button:has-text("7")').click();
    
    const historyItems = clicksDisplay.locator('.history-item');
    
    // Should have exactly 5 items
    await expect(historyItems).toHaveCount(5);
    
    // Should contain the 5 most recent clicks (7, 6, 5, 4, 3)
    await expect(historyItems.nth(0)).toHaveText('7');
    await expect(historyItems.nth(1)).toHaveText('6');
    await expect(historyItems.nth(2)).toHaveText('5');
    await expect(historyItems.nth(3)).toHaveText('4');
    await expect(historyItems.nth(4)).toHaveText('3');
  });
});
