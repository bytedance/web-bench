const { test, expect } = require('@playwright/test');

test.describe('Task 14: Memory panel implementation', () => {
  test('Test case 1: Memory panel exists with correct structure', async ({ page }) => {
    await page.goto('/index.html');
    
    const memoryPanel = page.locator('.memory-panel');
    const memoryLabel = memoryPanel.locator('text=Memory');
    const memoryValue = page.locator('#memory');
    
    await expect(memoryPanel).toBeVisible();
    await expect(memoryLabel).toBeVisible();
    await expect(memoryValue).toBeVisible();
  });

  test('Test case 2: Memory value displays with correct formatting', async ({ page }) => {
    await page.goto('/index.html');
    
    const memoryDisplay = page.locator('#memory');
    
    // Initial memory should be 0
    await expect(memoryDisplay).toHaveText('0');
    
    // Add a decimal value to memory and check formatting
    await page.locator('text=1').click();
    await page.locator('text=.').click();
    await page.locator('text=2').click();
    await page.locator('text=3').click();
    await page.locator('text=4').click();
    await page.locator('text=5').click();
    await page.locator('text=M+').click();
    
    // Memory should display the formatted number
    const memoryText = await memoryDisplay.textContent();
    expect(memoryText).toContain('1.2345');
  });

  test('Test case 3: Memory value updates correctly with operations', async ({ page }) => {
    await page.goto('/index.html');
    
    const memoryDisplay = page.locator('#memory');
    
    // Add 100 to memory
    await page.locator('text=1').click();
    await page.locator('text=0').click();
    await page.locator('text=0').click();
    await page.locator('text=M+').click();
    await expect(memoryDisplay).toHaveText('100');
    
    // Add 50 more
    await page.locator('text=5').click();
    await page.locator('text=0').click();
    await page.locator('text=M+').click();
    await expect(memoryDisplay).toHaveText('150');
    
    // Subtract 25
    await page.locator('text=2').click();
    await page.locator('text=5').click();
    await page.locator('text=M-').click();
    await expect(memoryDisplay).toHaveText('125');
  });
});
