const { test, expect } = require('@playwright/test');

test.describe('Task 6: Mode Button and Toggle Functionality', () => {
  test('Test case 1: Mode button should have fixed positioning at bottom right', async ({ page }) => {
    await page.goto('/index.html');
    
    const modeStyles = await page.evaluate(() => {
      const mode = document.getElementById('mode');
      const styles = window.getComputedStyle(mode);
      return {
        position: styles.position,
        bottom: styles.bottom,
        left: styles.left,
        transform: styles.transform
      };
    });
    
    expect(modeStyles.position).toBe('fixed');
    expect(modeStyles.bottom).toBe('20px');
    expect(modeStyles.left).toBe('65%');
    expect(modeStyles.transform).toContain('translateX(-50%)');
  });

  test('Test case 2: Mode button should have same styling as toggle button', async ({ page }) => {
    await page.goto('/index.html');
    
    const [toggleStyles, modeStyles] = await page.evaluate(() => {
      const toggle = document.getElementById('toggle');
      const mode = document.getElementById('mode');
      const toggleCSS = window.getComputedStyle(toggle);
      const modeCSS = window.getComputedStyle(mode);
      
      return [
        {
          padding: toggleCSS.padding,
          fontSize: toggleCSS.fontSize,
          borderRadius: toggleCSS.borderRadius,
          boxShadow: toggleCSS.boxShadow
        },
        {
          padding: modeCSS.padding,
          fontSize: modeCSS.fontSize,
          borderRadius: modeCSS.borderRadius,
          boxShadow: modeCSS.boxShadow
        }
      ];
    });
    
    expect(modeStyles.padding).toBe(toggleStyles.padding);
    expect(modeStyles.fontSize).toBe(toggleStyles.fontSize);
    expect(modeStyles.borderRadius).toBe(toggleStyles.borderRadius);
    expect(modeStyles.boxShadow).toBe(toggleStyles.boxShadow);
  });

  test('Test case 3: Mode button should toggle between dark and light modes with text change', async ({ page }) => {
    await page.goto('/index.html');
    
    // Get initial state
    let toggleText = await page.locator('#toggle').textContent();
    let calculatorClasses = await page.locator('.calculator').getAttribute('class');
    
    // Click toggle button
    await page.click('#toggle');
    
    // Check if text changed and dark-mode class toggled
    let newToggleText = await page.locator('#toggle').textContent();
    let newCalculatorClasses = await page.locator('.calculator').getAttribute('class');
    
    expect(newToggleText).not.toBe(toggleText);
    expect(newCalculatorClasses).not.toBe(calculatorClasses);
    
    // Click again to toggle back
    await page.click('#toggle');
    
    // Should return to original state
    let finalToggleText = await page.locator('#toggle').textContent();
    let finalCalculatorClasses = await page.locator('.calculator').getAttribute('class');
    
    expect(finalToggleText).toBe(toggleText);
    expect(finalCalculatorClasses).toBe(calculatorClasses);
  });
});
