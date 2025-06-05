const { test, expect } = require('@playwright/test');

test.describe('Task 12: Memory functionality implementation', () => {
  test('Test case 1: Memory Recall (MR) works correctly', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    const memoryDisplay = page.locator('#memory');
    
    // Add value to memory first (M+)
    await page.locator('text=5').click();
    await page.locator('text=M+').click();
    
    // Check memory display updates
    await expect(memoryDisplay).toHaveText('5');
    
    // Clear display and use Memory Recall
    await page.locator('text=Clear').click();
    await expect(display).toHaveValue('');
    
    await page.locator('text=MR').click();
    await expect(display).toHaveValue('5');
  });

  test('Test case 2: Memory Add (M+) and Subtract (M-) work correctly', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    const memoryDisplay = page.locator('#memory');
    
    // Add 10 to memory
    await page.locator('text=1').click();
    await page.locator('text=0').click();
    await page.locator('text=M+').click();
    await expect(memoryDisplay).toHaveText('10');
    await expect(display).toHaveValue(''); // Display should be cleared
    
    // Add 5 more to memory
    await page.locator('text=5').click();
    await page.locator('text=M+').click();
    await expect(memoryDisplay).toHaveText('15');
    
    // Subtract 3 from memory
    await page.locator('text=3').click();
    await page.locator('text=M-').click();
    await expect(memoryDisplay).toHaveText('12');
  });

  test('Test case 3: Memory Clear (MC) resets memory to zero', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    const memoryDisplay = page.locator('#memory');
    
    // Add some value to memory
    await page.locator('text=7').click();
    await page.locator('text=M+').click();
    await expect(memoryDisplay).toHaveText('7');
    
    // Clear memory
    await page.locator('text=MC').click();
    await expect(memoryDisplay).toHaveText('0');
    
    // Verify MR returns 0
    await page.locator('text=MR').click();
    await expect(display).toHaveValue('0');
  });
});
