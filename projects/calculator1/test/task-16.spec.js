const { test, expect } = require('@playwright/test');

test.describe('Task 16: Show scientific buttons when calculator is in scientific mode', () => {
  test('should show scientific buttons in scientific mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Calculator starts in scientific mode by default
    const scientificButtons = page.locator('.scientific .buttons button:nth-of-type(n + 19)');
    const buttonCount = await scientificButtons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = scientificButtons.nth(i);
      const isVisible = await button.evaluate((el) => {
        return window.getComputedStyle(el).display !== 'none';
      });
      expect(isVisible).toBe(true);
    }
  });

  test('should toggle scientific button visibility when mode changes', async ({ page }) => {
    await page.goto('/index.html');
    
    // Start in scientific mode (default)
    const modeButton = page.locator('#mode');
    const scientificButton = page.locator('.buttons button:nth-of-type(19)');
    
    if (await scientificButton.count() > 0) {
      // Should be visible in scientific mode
      await expect(scientificButton).toBeVisible();
      
      // Switch to basic mode
      await modeButton.click();
      
      // Should be hidden in basic mode
      const isHidden = await scientificButton.evaluate((el) => {
        return window.getComputedStyle(el).display === 'none';
      });
      expect(isHidden).toBe(true);
    }
  });

  test('should have proper CSS rule for showing scientific buttons', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    const hasScientificClass = await calculator.evaluate((el) => {
      return el.classList.contains('scientific');
    });
    
    expect(hasScientificClass).toBe(true);
    
    const scientificButton = page.locator('.scientific .buttons button:nth-of-type(20)');
    if (await scientificButton.count() > 0) {
      const display = await scientificButton.evaluate((el) => {
        return window.getComputedStyle(el).display;
      });
      expect(display).not.toBe('none');
    }
  });
});
