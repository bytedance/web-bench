const { test, expect } = require('@playwright/test');

test.describe('Task 7: Operator Button Highlighting', () => {
  test('Test case 1: Operator buttons should have gold highlighting in light mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Remove dark mode to test light mode
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.remove('dark-mode');
    });
    
    // Check 4th, 8th, 12th, 16th, and 18th buttons (operators)
    const operatorColors = await page.evaluate(() => {
      const buttons = document.querySelectorAll('.buttons button');
      const operatorIndices = [3, 7, 11, 15, 17]; // 0-based indices for 4th, 8th, etc.
      
      return operatorIndices.map(index => {
        const button = buttons[index];
        const styles = window.getComputedStyle(button);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color
        };
      });
    });
    
    operatorColors.forEach(color => {
      expect(color.backgroundColor).toBe('rgb(255, 215, 0)'); // #ffd700
      expect(color.color).toBe('rgb(0, 0, 0)'); // black
    });
  });

  test('Test case 2: Operator buttons should have orange highlighting in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Ensure dark mode is active
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('dark-mode');
    });
    
    const operatorColors = await page.evaluate(() => {
      const buttons = document.querySelectorAll('.buttons button');
      const operatorIndices = [3, 7, 11, 15, 17]; // 0-based indices
      
      return operatorIndices.map(index => {
        const button = buttons[index];
        const styles = window.getComputedStyle(button);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color
        };
      });
    });
    
    operatorColors.forEach(color => {
      expect(color.backgroundColor).toBe('rgb(255, 140, 0)'); // #ff8c00
      expect(color.color).toBe('rgb(255, 255, 255)'); // white
    });
  });

  test('Test case 3: Operator buttons should have proper hover effects', async ({ page }) => {
    await page.goto('/index.html');
    
    // Test light mode hover
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.remove('dark-mode');
    });
    
    const fourthButton = page.locator('.buttons button').nth(3); // 4th button (/)
    await fourthButton.hover();
    await page.waitForTimeout(100);
    
    let hoverColor = await page.evaluate(() => {
      const button = document.querySelectorAll('.buttons button')[3];
      return window.getComputedStyle(button).backgroundColor;
    });
    
    expect(hoverColor).toBe('rgb(255, 237, 74)'); // #ffed4a
    
    // Test dark mode hover
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('dark-mode');
    });
    
    await fourthButton.hover();
    await page.waitForTimeout(100);
    
    hoverColor = await page.evaluate(() => {
      const button = document.querySelectorAll('.buttons button')[3];
      return window.getComputedStyle(button).backgroundColor;
    });
    
    expect(hoverColor).toBe('rgb(255, 165, 0)'); // #ffa500
  });
});
