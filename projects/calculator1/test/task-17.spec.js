const { test, expect } = require('@playwright/test');

test.describe('Task 17: Consolidated Calculate Function', () => {
  test('Test case 1: Basic arithmetic operations should work through unified calculate function', async ({ page }) => {
    await page.goto('/index.html');
    
    // Test addition
    await page.click('text=Clear');
    await page.click('text=8');
    await page.click('text=+');
    await page.click('text=2');
    await page.click('text==');
    
    let displayValue = await page.locator('#display').inputValue();
    expect(displayValue).toBe('10');
    
    // Test subtraction
    await page.click('text=Clear');
    await page.click('text=9');
    await page.click('text=-');
    await page.click('text=4');
    await page.click('text==');
    
    displayValue = await page.locator('#display').inputValue();
    expect(displayValue).toBe('5');
    
    // Test multiplication
    await page.click('text=Clear');
    await page.click('text=6');
    await page.click('text=*');
    await page.click('text=3');
    await page.click('text==');
    
    displayValue = await page.locator('#display').inputValue();
    expect(displayValue).toBe('18');
  });

  test('Test case 2: Memory operations should work through consolidated function', async ({ page }) => {
    await page.goto('/index.html');
    
    // Ensure scientific mode is active
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('scientific');
    });
    
    // Clear memory and test memory operations
    await page.click('text=MC');
    
    // Test M+ operation
    await page.click('text=Clear');
    await page.click('text=1');
    await page.click('text=5');
    await page.click('text=M+');
    
    let memoryValue = await page.locator('#memory').textContent();
    expect(memoryValue).toBe('15');
    
    // Test MR operation
    await page.click('text=Clear');
    await page.click('text=MR');
    
    let displayValue = await page.locator('#display').inputValue();
    expect(displayValue).toBe('15');
  });

  test('Test case 3: Error handling should work for division by zero and invalid operations', async ({ page }) => {
    await page.goto('/index.html');
    
    // Test division by zero
    await page.click('text=Clear');
    await page.click('text=5');
    await page.click('text=/');
    await page.click('text=0');
    await page.click('text==');
    
    let displayValue = await page.locator('#display').inputValue();
    expect(displayValue).toBe('Infinity'); // JavaScript eval returns Infinity for division by zero
    
    // Test reciprocal of zero (should handle error)
    await page.click('text=Clear');
    await page.click('text=0');
    await page.click('text=1/x');
    
    displayValue = await page.locator('#display').inputValue();
    expect(displayValue).toBe('Error'); // Should show Error for 1/0
    
    // Test invalid mathematical operation
    await page.evaluate(() => {
      document.getElementById('display').value = 'invalid';
    });
    await page.click('text=√');
    
    displayValue = await page.locator('#display').inputValue();
    expect(displayValue).toBe('Error'); // Should handle invalid input gracefully
  });
});
