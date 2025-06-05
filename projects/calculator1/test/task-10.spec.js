const { test, expect } = require('@playwright/test');

test.describe('Task 10: Trigonometric Functions', () => {
  test('Test case 1: Trigonometric function buttons should be present', async ({ page }) => {
    await page.goto('/index.html');
    
    // Ensure scientific mode is active
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('scientific');
    });
    
    // Check for trigonometric function buttons
    const trigButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('.buttons button'));
      const buttonTexts = buttons.map(btn => btn.textContent.trim());
      
      return {
        hasSin: buttonTexts.includes('sin'),
        hasCos: buttonTexts.includes('cos'),
        hasTan: buttonTexts.includes('tan'),
        hasSinh: buttonTexts.includes('sinh'),
        hasCosh: buttonTexts.includes('cosh')
      };
    });
    
    expect(trigButtons.hasSin).toBe(true);
    expect(trigButtons.hasCos).toBe(true);
    expect(trigButtons.hasTan).toBe(true);
    expect(trigButtons.hasSinh).toBe(true);
    expect(trigButtons.hasCosh).toBe(true);
  });

  test('Test case 2: Basic trigonometric functions should work correctly', async ({ page }) => {
    await page.goto('/index.html');
    
    // Test sin(0) = 0
    await page.click('text=Clear');
    await page.click('text=0');
    await page.click('text=sin');
    
    let displayValue = await page.locator('#display').inputValue();
    expect(parseFloat(displayValue)).toBeCloseTo(0, 5);
    
    // Test cos(0) = 1
    await page.click('text=Clear');
    await page.click('text=0');
    await page.click('text=cos');
    
    displayValue = await page.locator('#display').inputValue();
    expect(parseFloat(displayValue)).toBeCloseTo(1, 5);
    
    // Test tan(0) = 0
    await page.click('text=Clear');
    await page.click('text=0');
    await page.click('text=tan');
    
    displayValue = await page.locator('#display').inputValue();
    expect(parseFloat(displayValue)).toBeCloseTo(0, 5);
  });

  test('Test case 3: Hyperbolic functions should work correctly with error handling', async ({ page }) => {
    await page.goto('/index.html');
    
    // Test sinh(0) = 0
    await page.click('text=Clear');
    await page.click('text=0');
    await page.click('text=sinh');
    
    let displayValue = await page.locator('#display').inputValue();
    expect(parseFloat(displayValue)).toBeCloseTo(0, 5);
    
    // Test cosh(0) = 1
    await page.click('text=Clear');
    await page.click('text=0');
    await page.click('text=cosh');
    
    displayValue = await page.locator('#display').inputValue();
    expect(parseFloat(displayValue)).toBeCloseTo(1, 5);
    
    // Test error handling with invalid input
    await page.click('text=Clear');
    await page.evaluate(() => {
      document.getElementById('display').value = 'invalid';
    });
    await page.click('text=sin');
    
    displayValue = await page.locator('#display').inputValue();
    // Should handle error gracefully (either show Error or handle NaN)
    expect(displayValue === 'Error' || displayValue === 'NaN').toBe(true);
  });
});
