const { test, expect } = require('@playwright/test');

test.describe('Task 8: Scientific calculator buttons', () => {
  test('should have all scientific function buttons present', async ({ page }) => {
    await page.goto('/index.html');
    
    const scientificButtons = ['√', '^2', '1/x', 'π', 'sin', 'cos', 'tan', 'sinh', 'cosh'];
    
    for (const buttonText of scientificButtons) {
      const button = page.locator(`button:has-text("${buttonText}")`);
      await expect(button).toBeVisible();
    }
  });

  test('should hide scientific buttons by default when not in scientific mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const modeButton = page.locator('#mode');
    
    // Switch to basic mode
    await modeButton.click();
    await page.waitForTimeout(100);
    
    // Check if scientific buttons are hidden
    const scientificButtons = ['√', '^2', '1/x', 'π', 'sin'];
    
    for (const buttonText of scientificButtons) {
      const button = page.locator(`button:has-text("${buttonText}")`);
      const isVisible = await button.isVisible();
      expect(isVisible).toBe(false);
    }
  });

  test('should show scientific buttons when in scientific mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Already in scientific mode by default
    const scientificButtons = ['√', '^2', '1/x', 'π', 'sin'];
    
    for (const buttonText of scientificButtons) {
      const button = page.locator(`button:has-text("${buttonText}")`);
      await expect(button).toBeVisible();
    }
  });
});
