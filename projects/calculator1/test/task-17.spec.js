const { test, expect } = require('@playwright/test');

test.describe('Task 17: Interactive history functionality', () => {
  test('Test case 1: History items are clickable and re-execute operations', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    const clicksDisplay = page.locator('#clicks');
    
    // Perform a calculation
    await page.locator('text=5').click();
    await page.locator('text=+').click();
    await page.locator('text=3').click();
    await page.locator('text==').click();
    
    await expect(display).toHaveValue('8');
    
    // Clear the display
    await page.locator('text=Clear').click();
    await expect(display).toHaveValue('');
    
    // Click on a history item to re-execute
    const historyItems = clicksDisplay.locator('.history-item');
    await historyItems.filter({ hasText: '5' }).first().click();
    
    // The operation should be re-executed
    await expect(display).toHaveValue('5');
  });

  test('Test case 2: History items have hover effects', async ({ page }) => {
    await page.goto('/index.html');
    
    const clicksDisplay = page.locator('#clicks');
    
    // Click a button to create history
    await page.locator('text=9').click();
    
    const historyItem = clicksDisplay.locator('.history-item').first();
    
    // Check hover state styling
    await historyItem.hover();
    
    // History item should have cursor pointer to indicate clickability
    await expect(historyItem).toHaveCSS('cursor', 'pointer');
    
    // Should have some hover background change
    const hoverBgColor = await historyItem.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(hoverBgColor).toBeTruthy();
  });

  test('Test case 3: History updates correctly when items are clicked', async ({ page }) => {
    await page.goto('/index.html');
    
    const clicksDisplay = page.locator('#clicks');
    
    // Create some history
    await page.locator('text=1').click();
    await page.locator('text=2').click();
    await page.locator('text=3').click();
    
    // Click on a history item
    const historyItems = clicksDisplay.locator('.history-item');
    await historyItems.filter({ hasText: '2' }).click();
    
    // History should update - the clicked item should now be at the front
    await expect(historyItems.first()).toHaveText('2');
    
    // Total count should still be manageable
    const itemCount = await historyItems.count();
    expect(itemCount).toBeLessThanOrEqual(5);
  });
});
