const { test, expect } = require('@playwright/test');

test.describe('Task 1: Dark mode toggle button functionality', () => {
  test('Test case 1: Toggle button exists and is positioned correctly', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check that toggle button exists with correct id
    const toggleButton = page.locator('#toggle');
    await expect(toggleButton).toBeVisible();
    
    // Check position (bottom-left area)
    const boundingBox = await toggleButton.boundingBox();
    const viewportSize = page.viewportSize();
    expect(boundingBox.x).toBeLessThan(viewportSize.width / 2); // Left side
    expect(boundingBox.y).toBeGreaterThan(viewportSize.height / 2); // Bottom half
  });

  test('Test case 2: Button displays correct text based on mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const toggleButton = page.locator('#toggle');
    const calculator = page.locator('.calculator');
    
    // Check initial state (should be in dark mode showing "Light")
    await expect(toggleButton).toHaveText('Light');
    await expect(calculator).toHaveClass(/dark-mode/);
    
    // Click to toggle to light mode
    await toggleButton.click();
    await expect(toggleButton).toHaveText('Dark');
    await expect(calculator).not.toHaveClass(/dark-mode/);
  });

  test('Test case 3: Button toggles dark-mode class on calculator', async ({ page }) => {
    await page.goto('/index.html');
    
    const toggleButton = page.locator('#toggle');
    const calculator = page.locator('.calculator');
    
    // Initial state should be dark mode
    await expect(calculator).toHaveClass(/dark-mode/);
    
    // Click to toggle off dark mode
    await toggleButton.click();
    await expect(calculator).not.toHaveClass(/dark-mode/);
    
    // Click again to toggle back to dark mode
    await toggleButton.click();
    await expect(calculator).toHaveClass(/dark-mode/);
  });
});
