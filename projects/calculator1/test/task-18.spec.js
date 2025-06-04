const { test, expect } = require('@playwright/test');

test.describe('Task 18: Comprehensive memory functions', () => {
  test('should implement memory recall (MR) functionality', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('#display');
    const memoryAddButton = page.locator('button:has-text("M+")');
    const memoryRecallButton = page.locator('button:has-text("MR")');
    const clearButton = page.locator('button:has-text("Clear")');
    
    // Add a value to memory
    await page.locator('button:has-text("7")').click();
    await memoryAddButton.click();
    
    // Clear display
    await clearButton.click();
    
    // Recall memory
    await memoryRecallButton.click();
    
    const displayValue = await display.inputValue();
    expect(displayValue).toContain('7');
  });

  test('should implement memory addition (M+) and subtraction (M-)', async ({ page }) => {
    await page.goto('/index.html');
    
    const memoryValue = page.locator('#memory');
    const memoryAddButton = page.locator('button:has-text("M+")');
    const memorySubButton = page.locator('button:has-text("M-")');
    
    // Add 5 to memory
    await page.locator('button:has-text("5")').click();
    await memoryAddButton.click();
    
    let memValue = await memoryValue.textContent();
    expect(memValue).toBe('5');
    
    // Add 3 more to memory
    await page.locator('button:has-text("3")').click();
    await memoryAddButton.click();
    
    memValue = await memoryValue.textContent();
    expect(memValue).toBe('8');
    
    // Subtract 2 from memory
    await page.locator('button:has-text("2")').click();
    await memorySubButton.click();
    
    memValue = await memoryValue.textContent();
    expect(memValue).toBe('6');
  });

  test('should implement memory clear (MC) functionality', async ({ page }) => {
    await page.goto('/index.html');
    
    const memoryValue = page.locator('#memory');
    const memoryAddButton = page.locator('button:has-text("M+")');
    const memoryClearButton = page.locator('button:has-text("MC")');
    
    // Add a value to memory
    await page.locator('button:has-text("9")').click();
    await memoryAddButton.click();
    
    // Verify memory has value
    let memValue = await memoryValue.textContent();
    expect(memValue).toBe('9');
    
    // Clear memory
    await memoryClearButton.click();
    
    // Verify memory is cleared
    memValue = await memoryValue.textContent();
    expect(memValue).toBe('0');
  });
});
