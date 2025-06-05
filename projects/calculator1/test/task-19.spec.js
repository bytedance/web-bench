const { test, expect } = require('@playwright/test');

test.describe('Task 19: Initial state configuration', () => {
  test('Test case 1: Calculator starts in dark mode by default', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    const toggleButton = page.locator('#toggle');
    
    // Should start in dark mode
    await expect(calculator).toHaveClass(/dark-mode/);
    
    // Toggle button should show "Light" indicating current state is dark
    await expect(toggleButton).toHaveText('Light');
    
    // Dark mode styling should be applied
    await expect(calculator).toHaveCSS('background-color', 'rgb(51, 51, 51)'); // #333
  });

  test('Test case 2: Calculator starts in scientific mode by default', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    const modeButton = page.locator('#mode');
    
    // Should start in scientific mode
    await expect(calculator).toHaveClass(/scientific/);
    
    // Mode button should show "Basic" indicating current state is scientific
    await expect(modeButton).toHaveText('Basic');
    
    // Scientific buttons should be visible
    const sqrtButton = page.locator('text=√');
    await expect(sqrtButton).toBeVisible();
  });

  test('Test case 3: All UI elements reflect initial states correctly', async ({ page }) => {
    await page.goto('/index.html');
    
    const calculator = page.locator('.calculator');
    const infoPanels = page.locator('.info-panels');
    const memoryButton = page.locator('text=MR');
    const display = page.locator('.display');
    
    // Both modes should be active initially
    await expect(calculator).toHaveClass(/dark-mode/);
    await expect(calculator).toHaveClass(/scientific/);
    
    // Info panels should be visible (scientific mode)
    await expect(infoPanels).toBeVisible();
    
    // Memory buttons should be visible (scientific mode)
    await expect(memoryButton).toBeVisible();
    
    // Display should have dark mode styling
    await expect(display).toHaveCSS('background-color', 'rgb(68, 68, 68)'); // #444
    await expect(display).toHaveCSS('color', 'rgb(255, 255, 255)'); // white text
  });
});
