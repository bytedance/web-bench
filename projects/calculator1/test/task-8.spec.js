const { test, expect } = require('@playwright/test');

test.describe('Task 8: Scientific Mode Functionality', () => {
  test('Test case 1: Scientific buttons should be hidden by default', async ({ page }) => {
    await page.goto('/index.html');
    
    // Remove scientific class to test default state
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.remove('scientific');
    });
    
    // Check if buttons from 19th position onwards are hidden
    const scientificButtonsVisible = await page.evaluate(() => {
      const buttons = document.querySelectorAll('.buttons button');
      const scientificButtons = Array.from(buttons).slice(18); // buttons from 19th onwards
      
      return scientificButtons.map(button => {
        const styles = window.getComputedStyle(button);
        return styles.display !== 'none';
      });
    });
    
    // All scientific buttons should be hidden
    scientificButtonsVisible.forEach(visible => {
      expect(visible).toBe(false);
    });
  });

  test('Test case 2: Scientific buttons should be visible when scientific class is active', async ({ page }) => {
    await page.goto('/index.html');
    
    // Add scientific class
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('scientific');
    });
    
    // Check if scientific buttons are now visible
    const scientificButtonsVisible = await page.evaluate(() => {
      const buttons = document.querySelectorAll('.buttons button');
      const scientificButtons = Array.from(buttons).slice(18); // buttons from 19th onwards
      
      return scientificButtons.map(button => {
        const styles = window.getComputedStyle(button);
        return styles.display !== 'none';
      });
    });
    
    // All scientific buttons should be visible
    scientificButtonsVisible.forEach(visible => {
      expect(visible).toBe(true);
    });
  });

  test('Test case 3: Mode button should toggle scientific mode and update text', async ({ page }) => {
    await page.goto('/index.html');
    
    // Get initial mode button text and calculator classes
    let modeText = await page.locator('#mode').textContent();
    let calculatorClasses = await page.locator('.calculator').getAttribute('class');
    let isScientificInitially = calculatorClasses.includes('scientific');
    
    // Click mode button to toggle
    await page.click('#mode');
    
    // Check if scientific mode toggled and text changed
    let newModeText = await page.locator('#mode').textContent();
    let newCalculatorClasses = await page.locator('.calculator').getAttribute('class');
    let isScientificAfterClick = newCalculatorClasses.includes('scientific');
    
    expect(newModeText).not.toBe(modeText);
    expect(isScientificAfterClick).toBe(!isScientificInitially);
    
    // Verify text changes appropriately
    if (isScientificInitially) {
      expect(newModeText).toBe('Scientific');
    } else {
      expect(newModeText).toBe('Basic');
    }
  });
});
