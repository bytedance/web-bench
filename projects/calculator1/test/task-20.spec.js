const { test, expect } = require('@playwright/test');

test.describe('Task 20: Event handling with addEventListener', () => {
  test('Test case 1: Calculator buttons respond to clicks via event delegation', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    
    // Test basic number input
    await page.locator('.buttons button:has-text("5")').click();
    await expect(display).toHaveValue('5');
    
    await page.locator('.buttons button:has-text("7")').click();
    await expect(display).toHaveValue('57');
    
    // Test operator using nth-child to avoid conflict with M+
    await page.locator('.buttons button:nth-child(16)').click(); // + button
    await expect(display).toHaveValue('57+');
  });

  test('Test case 2: All button functionality works with new event handling', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    
    // Test calculation
    await page.locator('.buttons button:has-text("3")').click();
    await page.locator('.buttons button:nth-child(8)').click(); // * button
    await page.locator('.buttons button:has-text("4")').click();
    await page.locator('.buttons button:nth-child(15)').click(); // = button
    await expect(display).toHaveValue('12');
    
    // Test clear
    await page.locator('button:has-text("Clear")').click();
    await expect(display).toHaveValue('');
    
    // Test scientific functions
    await page.locator('.buttons button:has-text("9")').click();
    await page.locator('button:has-text("√")').click();
    await expect(display).toHaveValue('3');
  });

  test('Test case 3: Event handlers are properly attached on DOMContentLoaded', async ({ page }) => {
    await page.goto('/index.html');
    
    // Wait for page to fully load
    await page.waitForLoadState('domcontentloaded');
    
    const display = page.locator('#display');
    const memoryDisplay = page.locator('#memory');
    
    // Test that all functionality works immediately after load
    await page.locator('.buttons button:has-text("8")').click();
    await expect(display).toHaveValue('8');
    
    // Test memory functionality
    await page.locator('button:has-text("M+")').click();
    await expect(memoryDisplay).toHaveText('8');
    
    // Test that memory recall works
    await page.locator('button:has-text("Clear")').click();
    await page.locator('button:has-text("MR")').click();
    await expect(display).toHaveValue('8');
    
    // Test history functionality
    const clicksDisplay = page.locator('#clicks');
    const historyItems = clicksDisplay.locator('.history-item');
    
    // Should have history items from our clicks
    expect(await historyItems.count()).toBeGreaterThan(0);
  });
});
