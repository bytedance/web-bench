const { test, expect } = require('@playwright/test');

test.describe('Task 3: Scientific mode toggle functionality', () => {
  test('Test case 1: Mode button exists and is positioned correctly', async ({ page }) => {
    await page.goto('/index.html');
    
    // Check that mode button exists with correct id
    const modeButton = page.locator('#mode');
    await expect(modeButton).toBeVisible();
    
    // Check position (bottom-right area)
    const boundingBox = await modeButton.boundingBox();
    const viewportSize = page.viewportSize();
    expect(boundingBox.x).toBeGreaterThan(viewportSize.width / 2); // Right side
    expect(boundingBox.y).toBeGreaterThan(viewportSize.height / 2); // Bottom half
  });

  test('Test case 2: Button displays correct text based on mode', async ({ page }) => {
    await page.goto('/index.html');
    
    const modeButton = page.locator('#mode');
    const calculator = page.locator('.calculator');
    
    // Check initial state (should be in scientific mode showing "Basic")
    await expect(modeButton).toHaveText('Basic');
    await expect(calculator).toHaveClass(/scientific/);
    
    // Click to toggle to basic mode
    await modeButton.click();
    await expect(modeButton).toHaveText('Scientific');
    await expect(calculator).not.toHaveClass(/scientific/);
  });

  test('Test case 3: Button toggles scientific class on calculator', async ({ page }) => {
    await page.goto('/index.html');
    
    const modeButton = page.locator('#mode');
    const calculator = page.locator('.calculator');
    
    // Initial state should be scientific mode
    await expect(calculator).toHaveClass(/scientific/);
    
    // Click to toggle off scientific mode
    await modeButton.click();
    await expect(calculator).not.toHaveClass(/scientific/);
    
    // Click again to toggle back to scientific mode
    await modeButton.click();
    await expect(calculator).toHaveClass(/scientific/);
  });
});
