const { test, expect } = require('@playwright/test');

test.describe('Task 20: Event handling with addEventListener', () => {
  test('Test case 1: Calculator buttons respond to clicks via event delegation', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    
    // Test basic number input
    await page.locator('text=5').click();
    await expect(display).toHaveValue('5');
    
    await page.locator('text=7').click();
    await expect(display).toHaveValue('57');
    
    // Test operator
    await page.locator('text=+').click();
    await expect(display).toHaveValue('57+');
  });

  test('Test case 2: All button functionality works with new event handling', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    
    // Test calculation
    await page.locator('text=3').click();
    await page.locator('text=*').click();
    await page.locator('text=4').click();
    await page.locator('text==').click();
    await expect(display).toHaveValue('12');
    
    // Test clear
    await page.locator('text=Clear').click();
    await expect(display).toHaveValue('');
    
    // Test scientific functions
    await page.locator('text=9').click();
    await page.locator('text=√').click();
    await expect(display).toHaveValue('3');
  });

  test('Test case 3: Event handlers are properly attached on DOMContentLoaded', async ({ page }) => {
    await page.goto('/index.html');
    
    // Wait for page to fully load
    await page.waitForLoadState('domcontentloaded');
    
    const display = page.locator('#display');
    const memoryDisplay = page.locator('#memory');
    
    // Test that all functionality works immediately after load
    await page.locator('text=8').click();
    await expect(display).toHaveValue('8');
    
    // Test memory functionality
    await page.locator('text=M+').click();
    await expect(memoryDisplay).toHaveText('8');
    
    // Test that memory recall works
    await page.locator('text=Clear').click();
    await page.locator('text=MR').click();
    await expect(display).toHaveValue('8');
    
    // Test history functionality
    const clicksDisplay = page.locator('#clicks');
    const historyItems = clicksDisplay.locator('.history-item');
    
    // Should have history items from our clicks
    expect(await historyItems.count()).toBeGreaterThan(0);
  });
});
