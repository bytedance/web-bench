const { test, expect } = require('@playwright/test');

test.describe('Task 13: Memory Operations Implementation', () => {
  test('Test case 1: Memory recall (MR) should display stored memory value', async ({ page }) => {
    await page.goto('/index.html');
    
    // Ensure scientific mode is active
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('scientific');
    });
    
    // First store a value in memory (M+)
    await page.click('text=Clear');
    await page.click('text=5');
    await page.click('text=M+');
    
    // Clear display and use memory recall
    await page.click('text=Clear');
    await page.click('text=MR');
    
    const displayValue = await page.locator('#display').inputValue();
    expect(displayValue).toBe('5');
  });

  test('Test case 2: Memory add (M+) and subtract (M-) should work correctly', async ({ page }) => {
    await page.goto('/index.html');
    
    // Ensure scientific mode is active
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('scientific');
    });
    
    // Clear memory first
    await page.click('text=MC');
    
    // Add 10 to memory
    await page.click('text=Clear');
    await page.click('text=1');
    await page.click('text=0');
    await page.click('text=M+');
    
    // Check memory display shows 10
    let memoryValue = await page.locator('#memory').textContent();
    expect(memoryValue).toBe('10');
    
    // Add 5 more to memory
    await page.click('text=Clear');
    await page.click('text=5');
    await page.click('text=M+');
    
    // Memory should now be 15
    memoryValue = await page.locator('#memory').textContent();
    expect(memoryValue).toBe('15');
    
    // Subtract 3 from memory
    await page.click('text=Clear');
    await page.click('text=3');
    await page.click('text=M-');
    
    // Memory should now be 12
    memoryValue = await page.locator('#memory').textContent();
    expect(memoryValue).toBe('12');
  });

  test('Test case 3: Memory clear (MC) should reset memory to zero', async ({ page }) => {
    await page.goto('/index.html');
    
    // Ensure scientific mode is active
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('scientific');
    });
    
    // Store some value in memory
    await page.click('text=Clear');
    await page.click('text=2');
    await page.click('text=5');
    await page.click('text=M+');
    
    // Verify memory has value
    let memoryValue = await page.locator('#memory').textContent();
    expect(memoryValue).toBe('25');
    
    // Clear memory
    await page.click('text=MC');
    
    // Verify memory is cleared
    memoryValue = await page.locator('#memory').textContent();
    expect(memoryValue).toBe('0');
    
    // Verify that MC doesn't do anything if memory is already 0
    await page.click('text=MC');
    memoryValue = await page.locator('#memory').textContent();
    expect(memoryValue).toBe('0');
  });
});
