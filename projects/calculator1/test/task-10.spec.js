const { test, expect } = require('@playwright/test');

test.describe('Task 10: Hide scientific calculator buttons by default', () => {
  test('should hide buttons from 19th position onwards in basic mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const modeButton = page.locator('#mode');
    
    // Switch to basic mode
    await modeButton.click();
    await page.waitForTimeout(100);
    
    // Check that buttons from 19th position onwards are hidden
    const buttons = page.locator('.buttons button');
    const buttonCount = await buttons.count();
    
    // Check buttons starting from 19th position (0-indexed, so 18+)
    for (let i = 18; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const isVisible = await button.isVisible();
      expect(isVisible).toBe(false);
    }
  });

  test('should show all buttons when in scientific mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Already in scientific mode by default
    const buttons = page.locator('.buttons button');
    const buttonCount = await buttons.count();
    
    // All buttons should be visible in scientific mode
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      await expect(button).toBeVisible();
    }
  });

  test('should toggle visibility when switching between modes', async ({ page }) => {
    await page.goto('/index.html');
    
    const modeButton = page.locator('#mode');
    const scientificButton = page.locator('button:has-text("√")'); // 19th button
    
    // Initially in scientific mode - button should be visible
    await expect(scientificButton).toBeVisible();
    
    // Switch to basic mode
    await modeButton.click();
    await page.waitForTimeout(100);
    
    // Button should be hidden
    const isHidden = await scientificButton.isHidden();
    expect(isHidden).toBe(true);
    
    // Switch back to scientific mode
    await modeButton.click();
    await page.waitForTimeout(100);
    
    // Button should be visible again
    await expect(scientificButton).toBeVisible();
  });
});
