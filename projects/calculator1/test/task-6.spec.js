const { test, expect } = require('@playwright/test');

test.describe('Task 6: Smooth transition animations', () => {
  test('Test case 1: Calculator container has transition properties', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    
    // Check that calculator has transition property set
    await expect(calculator).toHaveCSS('transition-duration', '0.3s');
    await expect(calculator).toHaveCSS('transition-timing-function', 'ease');
  });

  test('Test case 2: Display has transition properties', async ({ page }) => {
    await page.goto('/index.html');
    
    const display = page.locator('.display');
    
    // Check that display has transition property set
    await expect(display).toHaveCSS('transition-duration', '0.3s');
    await expect(display).toHaveCSS('transition-timing-function', 'ease');
  });

  test('Test case 3: Buttons have transition properties', async ({ page }) => {
    await page.goto('/index.html');
    
    const button = page.locator('.buttons button').first();
    
    // Check that buttons have transition property set
    await expect(button).toHaveCSS('transition-duration', '0.3s');
    await expect(button).toHaveCSS('transition-timing-function', 'ease');
    
    // Test multiple buttons to ensure consistency
    const buttons = page.locator('.buttons button');
    const buttonCount = await buttons.count();
    
    // Check first few buttons to verify transitions are applied
    for (let i = 0; i < Math.min(5, buttonCount); i++) {
      const btn = buttons.nth(i);
      await expect(btn).toHaveCSS('transition-duration', '0.3s');
    }
  });
});
