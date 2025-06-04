const { test, expect } = require('@playwright/test');

test.describe('Task 10: Implement dark mode styling for operator buttons with orange coloring', () => {
  test('should have orange background for operator buttons in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Calculator starts in dark mode by default
    const operatorButton = page.locator('.dark-mode .buttons button:nth-child(4)');
    const backgroundColor = await operatorButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    expect(backgroundColor).toBe('rgb(255, 140, 0)'); // #ff8c00
  });

  test('should have white text on orange operator buttons in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const operatorButton = page.locator('.dark-mode .buttons button:nth-child(8)');
    const color = await operatorButton.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    
    expect(color).toBe('rgb(255, 255, 255)'); // white
  });

  test('should apply orange styling to all operator button positions in dark mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const operatorSelectors = [
      '.dark-mode .buttons button:nth-child(4)',
      '.dark-mode .buttons button:nth-child(8)', 
      '.dark-mode .buttons button:nth-child(12)',
      '.dark-mode .buttons button:nth-child(16)',
      '.dark-mode .buttons button:nth-child(18)'
    ];
    
    for (const selector of operatorSelectors) {
      const button = page.locator(selector);
      if (await button.count() > 0) {
        const styles = await button.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return {
            backgroundColor: style.backgroundColor,
            color: style.color
          };
        });
        
        expect(styles.backgroundColor).toBe('rgb(255, 140, 0)'); // #ff8c00
        expect(styles.color).toBe('rgb(255, 255, 255)'); // white
      }
    }
  });
});
