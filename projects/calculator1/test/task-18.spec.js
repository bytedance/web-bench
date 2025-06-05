const { test, expect } = require('@playwright/test');

test.describe('Task 18: Initialization in Dark and Scientific Mode', () => {
  test('Test case 1: Calculator should initialize in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check if calculator has dark-mode class on initialization
    const hasDarkMode = await page.evaluate(() => {
      const calculator = document.querySelector('.calculator');
      return calculator.classList.contains('dark-mode');
    });
    
    expect(hasDarkMode).toBe(true);
    
    // Verify dark mode styling is applied
    const darkModeStyles = await page.evaluate(() => {
      const calculator = document.querySelector('.calculator');
      const display = document.querySelector('.display');
      const calculatorStyles = window.getComputedStyle(calculator);
      const displayStyles = window.getComputedStyle(display);
      
      return {
        calculatorBg: calculatorStyles.backgroundColor,
        displayBg: displayStyles.backgroundColor,
        displayColor: displayStyles.color
      };
    });
    
    expect(darkModeStyles.calculatorBg).toBe('rgb(51, 51, 51)'); // #333
    expect(darkModeStyles.displayBg).toBe('rgb(68, 68, 68)'); // #444
    expect(darkModeStyles.displayColor).toBe('rgb(255, 255, 255)'); // white
  });

  test('Test case 2: Calculator should initialize in scientific mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check if calculator has scientific class on initialization
    const hasScientificMode = await page.evaluate(() => {
      const calculator = document.querySelector('.calculator');
      return calculator.classList.contains('scientific');
    });
    
    expect(hasScientificMode).toBe(true);
    
    // Verify scientific buttons are visible
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

  test('Test case 3: Initial button text values should be correct', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check initial button text values
    const buttonTexts = await page.evaluate(() => {
      const toggleButton = document.getElementById('toggle');
      const modeButton = document.getElementById('mode');
      
      return {
        toggleText: toggleButton.textContent,
        modeText: modeButton.textContent
      };
    });
    
    // Based on initialization in dark mode and scientific mode
    expect(buttonTexts.toggleText).toBe('Light'); // Should show "Light" when in dark mode
    expect(buttonTexts.modeText).toBe('Basic'); // Should show "Basic" when in scientific mode
    
    // Verify info panels are visible due to scientific mode
    const infoPanelsVisible = await page.evaluate(() => {
      const infoPanels = document.querySelector('.info-panels');
      const styles = window.getComputedStyle(infoPanels);
      return styles.display !== 'none';
    });
    
    expect(infoPanelsVisible).toBe(true);
    
    // Verify memory display is initialized
    const memoryValue = await page.locator('#memory').textContent();
    expect(memoryValue).toBe('0');
  });
});
