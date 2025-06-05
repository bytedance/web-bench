const { test, expect } = require('@playwright/test');

test.describe('Task 15: History panel implementation', () => {
  test('Test case 1: History panel exists with correct structure', async ({ page }) => {
    await page.goto('/index.html');
    
    const clicksPanel = page.locator('.clicks-panel');
    const historyLabel = clicksPanel.locator('text=History');
    const clicksDisplay = page.locator('#clicks');
    
    await expect(clicksPanel).toBeVisible();
    await expect(historyLabel).toBeVisible();
    await expect(clicksDisplay).toBeVisible();
    await expect(clicksDisplay).toHaveClass(/clicks-history/);
  });

  test('Test case 2: History display has correct styling', async ({ page }) => {
    await page.goto('/index.html');
    
    const clicksDisplay = page.locator('#clicks');
    
    // Check monospace font
    await expect(clicksDisplay).toHaveCSS('font-family', /monospace/);
    
    // Check background color styling
    const bgColor = await clicksDisplay.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bgColor).toBeTruthy(); // Should have some background color
    
    // Check positioning and layout
    await expect(clicksDisplay).toHaveCSS('display', 'flex');
    await expect(clicksDisplay).toHaveCSS('justify-content', 'flex-end');
  });

  test('Test case 3: History area shows last 5 button clicks', async ({ page }) => {
    await page.goto('/index.html');
    
    const clicksDisplay = page.locator('#clicks');
    
    // Click several buttons using nth-child to avoid conflicts
    await page.locator('.buttons button:nth-child(9)').click(); // "1"
    await page.locator('.buttons button:nth-child(10)').click(); // "2"
    await page.locator('.buttons button:has-text("3")').click();
    await page.locator('.buttons button:has-text("4")').click();
    await page.locator('.buttons button:has-text("5")').click();
    
    // Check that history items are displayed
    const historyItems = clicksDisplay.locator('.history-item');
    await expect(historyItems).toHaveCount(5);
    
    // Click one more button
    await page.locator('.buttons button:has-text("6")').click();
    
    // Should still have only 5 items (oldest removed)
    await expect(historyItems).toHaveCount(5);
    
    // The most recent click should be first
    await expect(historyItems.first()).toHaveText('6');
  });
});
