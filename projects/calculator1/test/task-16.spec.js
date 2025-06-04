const { test, expect } = require('@playwright/test');

test.describe('Task 16: Initialize calculator with dark mode and scientific mode', () => {
  test('should have dark-mode class enabled by default', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    
    const hasDarkMode = await calculator.evaluate(el => {
      return el.classList.contains('dark-mode');
    });
    
    expect(hasDarkMode).toBe(true);
  });

  test('should have scientific class enabled by default', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    
    const hasScientificMode = await calculator.evaluate(el => {
      return el.classList.contains('scientific');
    });
    
    expect(hasScientificMode).toBe(true);
  });

  test('should show all default state features on page load', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    const infoPanels = page.locator('.info-panels');
    const scientificButton = page.locator('button:has-text("√")');
    const toggleButton = page.locator('#toggle');
    const modeButton = page.locator('#mode');
    
    // Check calculator has both classes
    const classes = await calculator.evaluate(el => {
      return Array.from(el.classList);
    });
    
    expect(classes).toContain('dark-mode');
    expect(classes).toContain('scientific');
    
    // Check features are visible
    await expect(infoPanels).toBeVisible();
    await expect(scientificButton).toBeVisible();
    
    // Check button texts reflect current state
    const toggleText = await toggleButton.textContent();
    const modeText = await modeButton.textContent();
    
    expect(toggleText).toBe('Light'); // In dark mode, shows Light
    expect(modeText).toBe('Basic'); // In scientific mode, shows Basic
  });
});
