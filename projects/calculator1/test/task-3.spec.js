const { test, expect } = require('@playwright/test');

test.describe('Task 3: Dark Mode Implementation', () => {
  test('Test case 1: Dark mode calculator should have dark background and border', async ({ page }) => {
    await page.goto('/index.html');
    
    // Ensure dark-mode class is present
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('dark-mode');
    });
    
    const calculatorDarkStyles = await page.evaluate(() => {
      const calculator = document.querySelector('.calculator');
      const styles = window.getComputedStyle(calculator);
      return {
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor
      };
    });
    
    expect(calculatorDarkStyles.backgroundColor).toBe('rgb(51, 51, 51)'); // #333
    expect(calculatorDarkStyles.borderColor).toBe('rgb(102, 102, 102)'); // #666
  });

  test('Test case 2: Dark mode display should have dark background and white text', async ({ page }) => {
    await page.goto('/index.html');
    
    // Ensure dark-mode class is present
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('dark-mode');
    });
    
    const displayDarkStyles = await page.evaluate(() => {
      const display = document.querySelector('.display');
      const styles = window.getComputedStyle(display);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color
      };
    });
    
    expect(displayDarkStyles.backgroundColor).toBe('rgb(68, 68, 68)'); // #444
    expect(displayDarkStyles.color).toBe('rgb(255, 255, 255)'); // white
  });

  test('Test case 3: Dark mode should toggle properly with class changes', async ({ page }) => {
    await page.goto('/index.html');
    
    // Start without dark mode
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.remove('dark-mode');
    });
    
    // Check light mode first
    let calculatorBg = await page.evaluate(() => {
      const calculator = document.querySelector('.calculator');
      return window.getComputedStyle(calculator).backgroundColor;
    });
    expect(calculatorBg).toBe('rgb(255, 255, 255)'); // white
    
    // Toggle to dark mode
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('dark-mode');
    });
    
    // Check dark mode
    calculatorBg = await page.evaluate(() => {
      const calculator = document.querySelector('.calculator');
      return window.getComputedStyle(calculator).backgroundColor;
    });
    expect(calculatorBg).toBe('rgb(51, 51, 51)'); // #333
  });
});
