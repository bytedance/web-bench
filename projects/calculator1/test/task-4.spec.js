const { test, expect } = require('@playwright/test');

test.describe('Task 4: Button Styling and Hover Effects', () => {
  test('Test case 1: Dark mode buttons should have proper styling', async ({ page }) => {
    await page.goto('/index.html');
    
    // Ensure dark-mode class is present
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('dark-mode');
    });
    
    const buttonStyles = await page.evaluate(() => {
      const button = document.querySelector('.buttons button');
      const styles = window.getComputedStyle(button);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        borderColor: styles.borderColor
      };
    });
    
    expect(buttonStyles.backgroundColor).toBe('rgb(68, 68, 68)'); // #444
    expect(buttonStyles.color).toBe('rgb(255, 255, 255)'); // white
    expect(buttonStyles.borderColor).toBe('rgb(102, 102, 102)'); // #666
  });

  test('Test case 2: Buttons should have transition effects', async ({ page }) => {
    await page.goto('/index.html');
    
    const buttonTransition = await page.evaluate(() => {
      const button = document.querySelector('.buttons button');
      const styles = window.getComputedStyle(button);
      return styles.transition;
    });
    
    expect(buttonTransition).toContain('all');
    expect(buttonTransition).toContain('0.3s');
    expect(buttonTransition).toContain('ease');
  });

  test('Test case 3: Button hover effects should work in both light and dark modes', async ({ page }) => {
    await page.goto('/index.html');
    
    // Test light mode hover
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.remove('dark-mode');
    });
    
    const firstButton = page.locator('.buttons button').first();
    await firstButton.hover();
    
    // Wait for transition and check hover color
    await page.waitForTimeout(100);
    
    let hoverColor = await page.evaluate(() => {
      const button = document.querySelector('.buttons button');
      return window.getComputedStyle(button).backgroundColor;
    });
    
    // In light mode, hover should be #eee
    expect(hoverColor).toBe('rgb(238, 238, 238)'); // #eee
    
    // Test dark mode hover
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('dark-mode');
    });
    
    await firstButton.hover();
    await page.waitForTimeout(100);
    
    hoverColor = await page.evaluate(() => {
      const button = document.querySelector('.buttons button');
      return window.getComputedStyle(button).backgroundColor;
    });
    
    // In dark mode, hover should be #555
    expect(hoverColor).toBe('rgb(85, 85, 85)'); // #555
  });
});
