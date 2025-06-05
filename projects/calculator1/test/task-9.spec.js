const { test, expect } = require('@playwright/test');

test.describe('Task 9: Scientific Function Buttons', () => {
  test('Test case 1: Scientific function buttons should be present and positioned correctly', async ({ page }) => {
    await page.goto('/index.html');
    
    // Ensure scientific mode is active
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('scientific');
    });
    
    // Check for scientific function buttons
    const scientificButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('.buttons button'));
      const buttonTexts = buttons.map(btn => btn.textContent.trim());
      
      return {
        hasSquareRoot: buttonTexts.includes('√'),
        hasSquare: buttonTexts.includes('^2'),
        hasReciprocal: buttonTexts.includes('1/x'),
        hasPi: buttonTexts.includes('π'),
        clearButtonSpan: buttons.find(btn => btn.textContent.trim() === 'Clear')?.style.gridColumn
      };
    });
    
    expect(scientificButtons.hasSquareRoot).toBe(true);
    expect(scientificButtons.hasSquare).toBe(true);
    expect(scientificButtons.hasReciprocal).toBe(true);
    expect(scientificButtons.hasPi).toBe(true);
    expect(scientificButtons.clearButtonSpan).toBe('span 3');
  });

  test('Test case 2: Square root function should work correctly', async ({ page }) => {
    await page.goto('/index.html');
    
    // Clear display and enter a number
    await page.click('text=Clear');
    await page.click('text=9');
    
    // Click square root button
    await page.click('text=√');
    
    // Check result
    const displayValue = await page.locator('#display').inputValue();
    expect(parseFloat(displayValue)).toBeCloseTo(3, 5);
  });

  test('Test case 3: Scientific functions should handle mathematical operations correctly', async ({ page }) => {
    await page.goto('/index.html');
    
    // Test square function
    await page.click('text=Clear');
    await page.click('text=4');
    await page.click('text=^2');
    
    let displayValue = await page.locator('#display').inputValue();
    expect(parseFloat(displayValue)).toBe(16);
    
    // Test reciprocal function
    await page.click('text=Clear');
    await page.click('text=4');
    await page.click('text=1/x');
    
    displayValue = await page.locator('#display').inputValue();
    expect(parseFloat(displayValue)).toBeCloseTo(0.25, 5);
    
    // Test pi function
    await page.click('text=Clear');
    await page.click('text=π');
    
    displayValue = await page.locator('#display').inputValue();
    expect(parseFloat(displayValue)).toBeCloseTo(Math.PI, 5);
  });
});
