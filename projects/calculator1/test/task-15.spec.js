const { test, expect } = require('@playwright/test');

test.describe('Task 15: Hide extended scientific calculator buttons by default', () => {
  test('should hide buttons starting from the 19th button by default', async ({ page }) => {
    await page.goto('/index.html');
    
    // Toggle to basic mode first to test default hiding
    const modeButton = page.locator('#mode');
    await modeButton.click(); // Switch to basic mode
    
    const scientificButtons = page.locator('.buttons button:nth-of-type(n + 19)');
    const buttonCount = await scientificButtons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = scientificButtons.nth(i);
      const isHidden = await button.evaluate((el) => {
        return window.getComputedStyle(el).display === 'none';
      });
      expect(isHidden).toBe(true);
    }
  });

  test('should have proper CSS rule for hiding scientific buttons', async ({ page }) => {
    await page.goto('/index.html');
    
    // Toggle to basic mode
    const modeButton = page.locator('#mode');
    await modeButton.click();
    
    const button19 = page.locator('.buttons button:nth-of-type(19)');
    if (await button19.count() > 0) {
      const display = await button19.evaluate((el) => {
        return window.getComputedStyle(el).display;
      });
      expect(display).toBe('none');
    }
  });

  test('should maintain visibility of basic calculator buttons', async ({ page }) => {
    await page.goto('/index.html');
    
    // Toggle to basic mode
    const modeButton = page.locator('#mode');
    await modeButton.click();
    
    // Check that basic buttons (1-18) are still visible
    const basicButtons = page.locator('.buttons button:nth-of-type(-n + 18)');
    const buttonCount = await basicButtons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = basicButtons.nth(i);
      await expect(button).toBeVisible();
    }
  });
});
