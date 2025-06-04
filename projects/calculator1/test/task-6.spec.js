const { test, expect } = require('@playwright/test');

test.describe('Task 6: Add transition effects and enhanced styling to calculator buttons', () => {
  test('should have transition effects on all buttons', async ({ page }) => {
    await page.goto('/index.html');
    
    const firstButton = page.locator('button').first();
    const transitionProperty = await firstButton.evaluate((el) => {
      return window.getComputedStyle(el).transition;
    });
    
    expect(transitionProperty).toContain('0.3s');
    expect(transitionProperty).toContain('ease');
  });

  test('should have proper background and color properties', async ({ page }) => {
    await page.goto('/index.html');
    
    const buttons = page.locator('.buttons button');
    const firstButton = buttons.first();
    
    const buttonStyles = await firstButton.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        backgroundColor: style.backgroundColor,
        color: style.color,
        cursor: style.cursor
      };
    });
    
    expect(buttonStyles.backgroundColor).toBe('rgb(255, 255, 255)'); // white
    expect(buttonStyles.color).toBe('rgb(0, 0, 0)'); // black
    expect(buttonStyles.cursor).toBe('pointer');
  });

  test('should have all buttons clickable and responsive', async ({ page }) => {
    await page.goto('/index.html');
    
    const buttons = page.locator('.buttons button');
    const buttonCount = await buttons.count();
    
    expect(buttonCount).toBeGreaterThan(15); // Should have multiple buttons
    
    // Test that buttons are clickable
    for (let i = 0; i < Math.min(5, buttonCount); i++) {
      const button = buttons.nth(i);
      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();
    }
  });
});
