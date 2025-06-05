const { test, expect } = require('@playwright/test');

test.describe('Task 2: Calculator Background and Transitions', () => {
  test('Test case 1: Calculator should have white background color', async ({ page }) => {
    await page.goto('/index.html');
    
    // Remove dark-mode class to test light mode
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.remove('dark-mode');
    });
    
    const calculatorStyles = await page.evaluate(() => {
      const calculator = document.querySelector('.calculator');
      const styles = window.getComputedStyle(calculator);
      return {
        backgroundColor: styles.backgroundColor
      };
    });
    
    expect(calculatorStyles.backgroundColor).toBe('rgb(255, 255, 255)'); // white
  });

  test('Test case 2: Calculator should have transition effect for smooth animations', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculatorTransition = await page.evaluate(() => {
      const calculator = document.querySelector('.calculator');
      const styles = window.getComputedStyle(calculator);
      return styles.transition;
    });
    
    expect(calculatorTransition).toContain('all');
    expect(calculatorTransition).toContain('0.3s');
    expect(calculatorTransition).toContain('ease');
  });

  test('Test case 3: Display should have transition effects and proper box-sizing', async ({ page }) => {
    await page.goto('/index.html');
    
    const displayStyles = await page.evaluate(() => {
      const display = document.querySelector('.display');
      const styles = window.getComputedStyle(display);
      return {
        transition: styles.transition,
        boxSizing: styles.boxSizing
      };
    });
    
    expect(displayStyles.transition).toContain('all');
    expect(displayStyles.transition).toContain('0.3s');
    expect(displayStyles.transition).toContain('ease');
    expect(displayStyles.boxSizing).toBe('border-box');
  });
});
